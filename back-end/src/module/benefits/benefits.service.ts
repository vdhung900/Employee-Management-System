import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Benefits, BenefitDocument } from '../../schemas/benefits.schema';
import { Account, AccountDocument } from '../../schemas/account.schema';

const ALL_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

@Injectable()
export class BenefitsService {
    constructor(
        @InjectModel(Benefits.name) private benefitModel: Model<BenefitDocument>,
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    ) { }

    async findAll() {
        return this.benefitModel.find().populate('employees').populate('departments').exec();
    }

    async findOne(id: string) {
        return this.benefitModel.findById(id).populate('employees').populate('departments').exec();
    }

    async create(data: any, user: any) {
        if (data.status === 'auto') {
            data.effective = ALL_MONTHS;
        }
        if (data.applyAll) {
            const allDepartments = await this.benefitModel.db.collection('departments').find({}).toArray();
            data.departments = allDepartments.map((d: any) => d._id);
        }
        // Nếu employees là id Account thì map sang id Employees
        if (data.employees && data.employees.length > 0) {
            // Kiểm tra nếu phần tử là ObjectId của Account (không phải Employees)
            const accounts = await this.accountModel.find({ _id: { $in: data.employees } });
            if (accounts.length > 0) {
                // Nếu tìm thấy account, map sang employeeId
                const employeeIds = accounts.map(acc => acc.employeeId).filter(Boolean);
                // Nếu số lượng account tìm được bằng số lượng employees truyền lên, coi như toàn bộ là id Account
                if (employeeIds.length === data.employees.length) {
                    data.employees = employeeIds;
                }
                // Nếu chỉ một phần, thì merge cả hai loại id (giữ lại id Employees gốc nếu có)
                else if (employeeIds.length > 0) {
                    const accountIdSet = new Set(accounts.map(acc => String(acc._id)));
                    data.employees = data.employees.map(id => {
                        const found = accounts.find(acc => String(acc._id) === String(id));
                        return found ? found.employeeId : id;
                    });
                }
            }
        }
        return this.benefitModel.create(data);
    }

    async update(id: string, data: any, user: any) {
        if (data.status === 'auto') {
            data.effective = ALL_MONTHS;
        }
        if (data.applyAll) {
            const allDepartments = await this.benefitModel.db.collection('departments').find({}).toArray();
            data.departments = allDepartments.map((d: any) => d._id);
        }
        // Nếu employees là id Account thì map sang id Employees (giống create)
        if (data.employees && data.employees.length > 0) {
            const accounts = await this.accountModel.find({ _id: { $in: data.employees } });
            if (accounts.length > 0) {
                const employeeIds = accounts.map(acc => acc.employeeId).filter(Boolean);
                if (employeeIds.length === data.employees.length) {
                    data.employees = employeeIds;
                } else if (employeeIds.length > 0) {
                    const accountIdSet = new Set(accounts.map(acc => String(acc._id)));
                    data.employees = data.employees.map(id => {
                        const found = accounts.find(acc => String(acc._id) === String(id));
                        return found ? found.employeeId : id;
                    });
                }
            }
        }
        return this.benefitModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string, user: any) {
        return this.benefitModel.findByIdAndDelete(id).exec();
    }
} 