import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Account, AccountDocument } from '../../schemas/account.schema';
import { CreateAccount, ResetPassword, UpdateAccount } from './dto/admin_account.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminAccountService {
  constructor(
    @InjectModel(Account.name) private userModel: Model<AccountDocument>,
  ) { }



  async create(createAccount: CreateAccount) {
    const { username, password, role, status, employeeId } = createAccount;

    const employee = await this.userModel.findOne({ employeeId }).exec();
    if (employee) throw new NotFoundException('Nhân viên đã có tài khoản.');

    // Kiểm tra username đã tồn tại chưa    
    const existed = await this.userModel.findOne({ username }).exec();
    if (existed) throw new BadRequestException(`Username: ${username} đã tồn tại`);

    // Kiểm tra password hợp lệ
    if (!password || typeof password !== 'string' || password.length < 8) {
      throw new BadRequestException('Mật khẩu phải có ít nhất 8 ký tự');
    }

    const hash = await bcrypt.hash(password, 10);
    const account = await this.userModel.create({
      username, password: hash, role, status, employeeId: new Types.ObjectId(employeeId)
    });
    return { account };
  }

  async findAll(query?: any) {
    return this.userModel.find().populate('employeeId').exec();
  }

  async findOne(id: string) {
    const admin = await this.userModel.findOne({ _id: id }).exec();
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async update(id: string, updateAdminDto: UpdateAccount) {
    // if (updateAdminDto.password) {
    //   updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
    // }
    const existed = await this.userModel.findOne({ username: updateAdminDto.username }).exec();
    if (existed) throw new BadRequestException(`Username: ${updateAdminDto.username} đã tồn tại`);
    const admin = await this.userModel.findOneAndUpdate(
      { _id: id },
      updateAdminDto,
      { new: true },
    ).exec();
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }
  async resetPassword(id: string, updateAdminDto: ResetPassword) {
    if (updateAdminDto.password) {
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    const admin = await this.userModel.findOneAndUpdate(
      { _id: id },
      updateAdminDto,
      { new: true },
    ).exec();
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      const admin = await this.userModel.findOneAndDelete({ _id: id }).exec();
      if (!admin) throw new NotFoundException('Admin not found');
      return admin;
    }
    throw new BadRequestException('ID không hợp lệ');


  }


}
