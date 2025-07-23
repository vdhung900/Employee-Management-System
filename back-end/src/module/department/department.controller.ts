import { Body, Controller, Post, Get, Param, Patch, Delete, Req, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Departments } from '../../schemas/departments.schema';
import { BaseResponse } from '../../interfaces/response/base.response';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Department')
@ApiBearerAuth()
@Controller('departments')
export class DepartmentController {
    constructor(private readonly departmentService: DepartmentService) { }

    // private checkAdmin(req: any) {
    //     if (!req.user || req.user.role !== 'admin') {
    //         throw new HttpException('Forbidden: Admins only', HttpStatus.FORBIDDEN);
    //     }
    // }

    @Get('managers')
    @ApiOperation({ summary: 'Get all managers' })
    @ApiResponse({ status: 200, description: 'List of managers', type: BaseResponse })
    async getManagers() {
        const managers = await this.departmentService.findAllManagers();
        return BaseResponse.success(managers, 'OK', 200);
    }

    @Post()
    @ApiOperation({ summary: 'Create department' })
    @ApiBody({ type: Departments })
    @ApiResponse({ status: 201, description: 'Department created', type: BaseResponse })
    async create(@Body() body: Partial<Departments>, @Req() req: any) {
        // this.checkAdmin(req);
        const created = await this.departmentService.create(body);
        return BaseResponse.success(created, 'Created', 201);
    }

    @Get()
    @ApiOperation({ summary: 'Get all departments' })
    @ApiResponse({ status: 200, description: 'List departments', type: BaseResponse })
    async findAll() {
        const data = await this.departmentService.findAll();
        return BaseResponse.success(data, 'OK', 200);
    }

    @Get('employees')
    @ApiOperation({ summary: 'Get all employees (accounts) with fullName' })
    async getAllEmployees() {
        const employees = await this.departmentService.findAllEmployeesWithFullName();
        return BaseResponse.success(employees, 'OK', 200);
    }

    @Get('employees-with-department')
    @ApiOperation({ summary: 'Get all employees with fullName and departmentId' })
    async getAllEmployeesWithDepartment() {
        // Lấy model Employees từ mongoose
        const EmployeesModel = this.departmentService['accountModel'].db.model('Employees');
        const employees = await EmployeesModel.find({}).select('_id fullName departmentId').exec();
        return { data: employees };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get department by id' })
    @ApiResponse({ status: 200, description: 'Department detail', type: BaseResponse })
    async findOne(@Param('id') id: string) {
        const data = await this.departmentService.findOne(id);
        return BaseResponse.success(data, 'OK', 200);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update department' })
    @ApiBody({ type: Departments })
    @ApiResponse({ status: 200, description: 'Department updated', type: BaseResponse })
    async update(@Param('id') id: string, @Body() body: Partial<Departments>, @Req() req: any) {
        // this.checkAdmin(req);
        const updated = await this.departmentService.update(id, body);
        return BaseResponse.success(updated, 'Updated', 200);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete department' })
    @ApiResponse({ status: 200, description: 'Department deleted', type: BaseResponse })
    async remove(@Param('id') id: string, @Req() req: any) {
        // this.checkAdmin(req);
        const deleted = await this.departmentService.remove(id);
        return BaseResponse.success(deleted, 'Deleted', 200);
    }
} 