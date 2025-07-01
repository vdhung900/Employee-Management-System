import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SalaryCoefficient, SalaryCoefficientDocument } from 'src/schemas/salaryCoefficents.schema';
import { CreateSalaryCoefficientDto, UpdateSalaryCoefficientDto } from './salary_coeficient.dto';

@Injectable()
export class SalaryCoeficientService {
  constructor(
    @InjectModel(SalaryCoefficient.name)
    private readonly salaryCoeficientModel: Model<SalaryCoefficientDocument>,
  ) {}

  async create(dto: CreateSalaryCoefficientDto) {
    const created = await this.salaryCoeficientModel.create(dto);
    return created;
  }

  async findAll() {
    return this.salaryCoeficientModel.find()
      .populate({
        path: 'salary_rankId',
        select: 'name salary_base',
      })
      .exec();
  }

  async findOne(id: string) {
    const coef = await this.salaryCoeficientModel.findById(id)
      .populate({
        path: 'salary_rankId',
        select: 'name salary_base',
      })
      .exec();
    if (!coef) throw new NotFoundException('Không tìm thấy hệ số lương');
    return coef;
  }

  async update(id: string, dto: UpdateSalaryCoefficientDto) {
    const updated = await this.salaryCoeficientModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Không tìm thấy hệ số lương');
    return updated;
  }
} 