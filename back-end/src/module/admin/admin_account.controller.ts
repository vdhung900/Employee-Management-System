import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AdminAccountService } from './admin_account.service';
import { CreateAccount, ResetPassword, UpdateAccount } from './dto/admin_account.dto';
import { BaseReq } from '../../interfaces/request/baseReq.interface';

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
  getAllDepartments() {
    return this.adminAccountService.getDepartments();
  }

  @Get('positions')
  getAllPositions() {
    return this.adminAccountService.getPositions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminAccountService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateAccount: UpdateAccount) {
    return this.adminAccountService.update(id, UpdateAccount);
  }
  @Patch(':id/reset-password')
  resetPassword(@Param('id') id: string, @Body() ResetPassword: ResetPassword) {
    return this.adminAccountService.resetPassword(id, ResetPassword);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminAccountService.remove(id);
  }
}
