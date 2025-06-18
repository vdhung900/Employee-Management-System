import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Benefits, BenefitDocument } from '../../schemas/benefits.schema';

const ALL_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

@Injectable()
export class BenefitsService {
    constructor(
        @InjectModel(Benefits.name) private benefitModel: Model<BenefitDocument>,
    ) { }

    async findAll() {
        return this.benefitModel.find().populate('employees').populate('departments').exec();
    }

    async findOne(id: string) {
        return this.benefitModel.findById(id).populate('employees').populate('departments').exec();
    }

    async create(data: any, user: any) {
        if (user.role !== 'hr') throw new ForbiddenException('Only HR can create benefits');
        if (data.status === 'auto') {
            data.effective = ALL_MONTHS;
        }
        if (data.applyAll) {
            const allDepartments = await this.benefitModel.db.collection('departments').find({}).toArray();
            data.departments = allDepartments.map((d: any) => d._id);
        }
        return this.benefitModel.create(data);
    }

    async update(id: string, data: any, user: any) {
        if (user.role !== 'hr') throw new ForbiddenException('Only HR can update benefits');
        if (data.status === 'auto') {
            data.effective = ALL_MONTHS;
        }
        if (data.applyAll) {
            const allDepartments = await this.benefitModel.db.collection('departments').find({}).toArray();
            data.departments = allDepartments.map((d: any) => d._id);
        }
        return this.benefitModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    async delete(id: string, user: any) {
        if (user.role !== 'hr') throw new ForbiddenException('Only HR can delete benefits');
        return this.benefitModel.findByIdAndDelete(id).exec();
    }
} 