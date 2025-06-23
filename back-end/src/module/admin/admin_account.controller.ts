import {Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put} from '@nestjs/common';
import { AdminAccountService } from './admin_account.service';
import { CreateAccount, ResetPassword, UpdateAccount, UpdateStatus } from './dto/admin_account.dto';
import { BaseReq } from '../../interfaces/request/baseReq.interface';
import {Roles} from "../../common/decorators/roles.decorator";
import {JwtAuthGuard} from "../../common/guards/jwt-auth.guard";
import {RolesGuard} from "../../common/guards/roles.guard";
import {USER_ROLE} from "../../enum/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin-accounts')
export class AdminAccountController {
  constructor(private readonly adminAccountService: AdminAccountService) {}

  @Post()
  create(@Body() CreateAccount: CreateAccount) {
    return this.adminAccountService.create(CreateAccount);
  }

  @Get()
  findAll() {
    return this.adminAccountService.findAll();
  }

  @Get('departments')
  // @Roles(USER_ROLE.ADMIN, USER_ROLE.HR)
  getAllDepartments() {
    return this.adminAccountService.getDepartments();
  }

  @Get('positions')
  // @Roles(USER_ROLE.ADMIN, USER_ROLE.HR)
  getAllPositions() {
    return this.adminAccountService.getPositions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminAccountService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() UpdateAccount: UpdateAccount) {
    return this.adminAccountService.update(id, UpdateAccount);
  }
  @Put(':id/reset-password')
  resetPassword(@Param('id') id: string, @Body() ResetPassword: ResetPassword) {
    return this.adminAccountService.resetPassword(id, ResetPassword);
  }
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() UpdateStatus: UpdateStatus) {
    return this.adminAccountService.updateStatus(id, UpdateStatus);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminAccountService.remove(id);
  }
}
