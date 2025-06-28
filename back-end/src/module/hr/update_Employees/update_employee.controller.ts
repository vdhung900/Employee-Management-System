import { Controller, Get, Put, Param, Body, HttpStatus, HttpException } from '@nestjs/common';
import { UpdateEmployeeService } from './update_employee.service';
import { UpdateEmployeeDto } from './update_employee.dto';
import { BaseResponse } from '../../../interfaces/response/base.response';

@Controller('hr')
export class UpdateEmployeeController {
  constructor(private readonly updateEmployeeService: UpdateEmployeeService) {}

  @Get("/employees")
    async getEmployees() {
        try {
            const data = await this.updateEmployeeService.getEmployees();
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get("/employees/:id")
    async getEmployeeById(@Param("id") id: string) {
        try {
            const data = await this.updateEmployeeService.getEmployeeById(id);
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put("/employees/:id")
    async updateEmployee(@Param("id") id: string, @Body() dto: UpdateEmployeeDto) {
        try {
            const data = await this.updateEmployeeService.updateEmployee(id, dto);
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get("/coefficient")
    async getAllCoefficient() {
        try {
            const data = await this.updateEmployeeService.getAllCoefficient();
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get("/contracts")
    async getAllContract() {
        try {
            const data = await this.updateEmployeeService.getAllContractType();
            return BaseResponse.success(data, "Thành công", HttpStatus.OK)
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}