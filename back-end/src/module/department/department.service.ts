import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Departments, DepartmentsDocument } from '../../schemas/departments.schema';
import { Account, AccountDocument } from '../../schemas/account.schema';

@Injectable()
export class DepartmentService {
    constructor(
        @InjectModel(Departments.name) private departmentModel: Model<DepartmentsDocument>,
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    ) { }

    async findAllManagers() {
        return this.accountModel.find({ role: 'manager' })
            .select('username employeeId')
            .populate('employeeId', 'fullName')
            .exec();
    }

    async create(data: Partial<Departments>) {
        const created = new this.departmentModel(data);
        return created.save();
    }

    async findAll() {
        return this.departmentModel.find()
            .populate({
                path: 'managerId',
                model: 'Account',
                select: 'username role employeeId',
                populate: {
                    path: 'employeeId',
                    select: 'fullName email'
                }
            })
            .exec();
    }

    async findOne(id: string) {
        if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid department id');
        const found = await this.departmentModel.findById(id)
            .populate({
                path: 'managerId',
                model: 'Account',
                select: 'username role employeeId',
                populate: {
                    path: 'employeeId',
                    select: 'fullName email'
                }
            })
            .exec();
        if (!found) throw new NotFoundException('Department not found');
        return found;
    }

    async update(id: string, data: Partial<Departments>) {
        if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid department id');
        const updated = await this.departmentModel.findByIdAndUpdate(id, data, { new: true })
            .populate({
                path: 'managerId',
                model: 'Account',
                select: 'username role employeeId',
                populate: {
                    path: 'employeeId',
                    select: 'fullName email'
                }
            })
            .exec();
        if (!updated) throw new NotFoundException('Department not found');
        return updated;
    }

    async remove(id: string) {
        if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid department id');
        const deleted = await this.departmentModel.findByIdAndDelete(id).exec();
        if (!deleted) throw new NotFoundException('Department not found');
        return deleted;
    }
} 