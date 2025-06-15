import { Body, Controller, Post, Get, Param, Patch, Delete, Req, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Departments } from '../../schemas/departments.schema';
import { BaseResponse } from '../../interfaces/response/base.response';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from '../../schemas/account.schema';
import { Model } from 'mongoose';

@ApiTags('Department')
@ApiBearerAuth()
@Controller('departments')
export class DepartmentController {
    constructor(
        private readonly departmentService: DepartmentService,
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    ) { }

    private checkAdmin(req: any) {
        if (!req.user || req.user.role !== 'admin') {
            throw new HttpException('Forbidden: Admins only', HttpStatus.FORBIDDEN);
        }
    }

    @Post()
    @ApiOperation({ summary: 'Create department' })
    @ApiBody({ type: Departments })
    @ApiResponse({ status: 201, description: 'Department created', type: BaseResponse })
    async create(@Body() body: Partial<Departments>, @Req() req: any) {
        this.checkAdmin(req);
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

    @Get('managers')
    async getManagers() {
        const managers = await this.accountModel.find({ role: 'manager' }, { username: 1, email: 1 }).exec();
        return managers;
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
        this.checkAdmin(req);
        const updated = await this.departmentService.update(id, body);
        return BaseResponse.success(updated, 'Updated', 200);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete department' })
    @ApiResponse({ status: 200, description: 'Department deleted', type: BaseResponse })
    async remove(@Param('id') id: string, @Req() req: any) {
        this.checkAdmin(req);
        const deleted = await this.departmentService.remove(id);
        return BaseResponse.success(deleted, 'Deleted', 200);
    }
} 