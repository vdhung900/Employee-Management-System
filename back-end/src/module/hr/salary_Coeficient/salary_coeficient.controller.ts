import {Controller, Post, Get, Put, Param, Body, UseGuards, HttpStatus, HttpException} from '@nestjs/common';
import { SalaryCoeficientService } from './salary_coeficient.service';
import { CreateSalaryCoefficientDto, UpdateSalaryCoefficientDto } from './salary_coeficient.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { USER_ROLE } from 'src/enum/role.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SalaryRank, SalaryRankDocument } from 'src/schemas/salaryRank.schema';
import {BaseResponse} from "../../../interfaces/response/base.response";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(USER_ROLE.HR)
@Controller('hr/salary-coefficient')
export class SalaryCoeficientController {
  constructor(
    private readonly salaryCoeficientService: SalaryCoeficientService,
    @InjectModel(SalaryRank.name)
    private readonly salaryRankModel: Model<SalaryRankDocument>,
  ) {}
  
  @Get('/salary-rank')
  async getSalaryRanks() {
    const data = await this.salaryRankModel.find({}, { name: 1 }).exec();
    return { status: 200, message: 'Lấy danh sách bậc lương thành công', data };
  }

  @Post()
  async create(@Body() dto: CreateSalaryCoefficientDto) {
    const data = await this.salaryCoeficientService.create(dto);
    return { status: HttpStatus.OK, message: 'Thêm hệ số lương thành công', data };
  }

  @Get()
  async findAll() {
    const data = await this.salaryCoeficientService.findAll();
    return { status: HttpStatus.OK, message: 'Lấy danh sách hệ số lương thành công', data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.salaryCoeficientService.findOne(id);
    return { status: HttpStatus.OK, message: 'Lấy chi tiết hệ số lương thành công', data };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSalaryCoefficientDto) {
    const data = await this.salaryCoeficientService.update(id, dto);
    return { status: HttpStatus.OK, message: 'Cập nhật hệ số lương thành công', data };
  }
}