import {Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put, HttpException, HttpStatus} from '@nestjs/common';
import { AdminAccountService } from './admin_account.service';
import { CreateAccount, ResetPassword, UpdateAccount, UpdateStatus } from './dto/admin_account.dto';
import { BaseReq } from '../../interfaces/request/baseReq.interface';
import {Roles} from "../../common/decorators/roles.decorator";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../common/guards/roles.guard";
import {USER_ROLE} from "../../enum/role.enum";
import { BaseResponse } from 'src/interfaces/response/base.response';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin-accounts')
export class AdminAccountController {
  constructor(private readonly adminAccountService: AdminAccountService) {}

  @Post()
  async create(@Body() CreateAccount: CreateAccount) : Promise<BaseResponse> {
    try {
      const data = await this.adminAccountService.create(CreateAccount);
      return BaseResponse.success(data, "Thành công", HttpStatus.OK);
    } catch (e) {
      throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() : Promise<BaseResponse> {
    try {
      const data = await this.adminAccountService.findAll();
      return BaseResponse.success(data, "Thành công", HttpStatus.OK);
    } catch (e) {
      throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('departments')
  // @Roles(USER_ROLE.ADMIN, USER_ROLE.HR)
  async getAllDepartments() : Promise<BaseResponse> {
    try {
      const data = await this.adminAccountService.getDepartments();
      return BaseResponse.success(data, "Thành công", HttpStatus.OK);
    } catch (e) {
      throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/positions')
  // @Roles(USER_ROLE.ADMIN, USER_ROLE.HR)
  async getAllPositions() : Promise<BaseResponse> {
    try {
      const data = await this.adminAccountService.getPositions();
      return BaseResponse.success(data, "Thành công", HttpStatus.OK);
    } catch (e) {
      throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<BaseResponse> {
    try {
      const data = await this.adminAccountService.findOne(id);
      return BaseResponse.success(data, "Thành công", HttpStatus.OK);
    } catch (e) {
      throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() UpdateAccount: UpdateAccount) : Promise<BaseResponse> {
    try {
      const data = await this.adminAccountService.update(id, UpdateAccount);
      return BaseResponse.success(data, "Thành công", HttpStatus.OK);
    } catch (e) {
      throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Put(':id/reset-password')
  async resetPassword(@Param('id') id: string, @Body() ResetPassword: ResetPassword) : Promise<BaseResponse> {
    try {
      const data = await this.adminAccountService.resetPassword(id, ResetPassword);
      return BaseResponse.success(data, "Thành công", HttpStatus.OK);
    } catch (e) {
      throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() UpdateStatus: UpdateStatus) : Promise<BaseResponse> {
    try {
      const data = await this.adminAccountService.updateStatus(id, UpdateStatus);
      return BaseResponse.success(data, "Thành công", HttpStatus.OK);
    } catch (e) {
      throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) : Promise<BaseResponse> {
    try {
      const data = await this.adminAccountService.remove(id);
      return BaseResponse.success(data, "Thành công", HttpStatus.OK);
    } catch (e) {
      throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
