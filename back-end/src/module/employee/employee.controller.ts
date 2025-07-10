import { Controller, Get, Param, HttpStatus } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { BaseResponse } from 'src/interfaces/response/base.response';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Get('by-department/:departmentId')
    async getEmployeeByDepartment(@Param('departmentId') departmentId: string) {
        const employees = await this.employeeService.getEmployeeByDepartment(departmentId);
        return BaseResponse.success(employees, 'Lấy danh sách nhân viên theo phòng ban thành công', HttpStatus.OK);
    }
} 