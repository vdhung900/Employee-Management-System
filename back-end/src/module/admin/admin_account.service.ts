import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Account, AccountDocument } from '../../schemas/account.schema';
import { Employees, EmployeesDocument } from '../../schemas/employees.schema';
import { CreateAccount, ResetPassword, UpdateAccount } from './dto/admin_account.dto';
import * as bcrypt from 'bcryptjs';
import { Departments, DepartmentsDocument } from '../../schemas/departments.schema';
import { Position, PositionDocument } from '../../schemas/position.schema';

@Injectable()
export class AdminAccountService {
  constructor(
    @InjectModel(Account.name) private userModel: Model<AccountDocument>,
    @InjectModel(Employees.name) private employeeModel: Model<EmployeesDocument>,
    @InjectModel(Departments.name) private departmentModel: Model<DepartmentsDocument>,
    @InjectModel(Position.name) private positionModel: Model<PositionDocument>,
  ) { }

  async create(createAccount: CreateAccount) {
    try {
      const { username, password, role, status, ...employeeData } = createAccount;

      // Kiểm tra username đã tồn tại chưa    
      const existed = await this.userModel.findOne({ username }).exec();
      if (existed) throw new BadRequestException(`Username: ${username} đã tồn tại`);

      // Kiểm tra password hợp lệ
      if (!password || typeof password !== 'string' || password.length < 8) {
        throw new BadRequestException('Mật khẩu phải có ít nhất 8 ký tự');
      }

      // Kiểm tra email đã tồn tại chưa
      const existedEmail = await this.employeeModel.findOne({ email: employeeData.email }).exec();
      if (existedEmail) throw new BadRequestException(`Email: ${employeeData.email} đã tồn tại`);

      // Chuyển đổi departmentId và positionId thành ObjectId nếu có
      const departmentId = employeeData.departmentId ? new Types.ObjectId(employeeData.departmentId) : null;
      const positionId = employeeData.positionId ? new Types.ObjectId(employeeData.positionId) : null;

      // Tạo thông tin nhân viên mới
      const newEmployee = await this.employeeModel.create({
        fullName: employeeData.fullName,
        email: employeeData.email,
        dob: employeeData.dob || null,
        gender: employeeData.gender || null,
        phone: employeeData.phone || null,
        departmentId: departmentId,
        positionId: positionId,
        joinDate: employeeData.joinDate || new Date(),
        resignDate: employeeData.resignDate || null,
        status: 'active',
        bankAccount: employeeData.bankAccount || null,
        bankName: employeeData.bankName || null,
        document: employeeData.document || null,
        contractId: employeeData.contractId ? new Types.ObjectId(employeeData.contractId) : null
      });

      if (!newEmployee) {
        throw new BadRequestException('Không thể tạo thông tin nhân viên');
      }

      // Tạo tài khoản với thông tin nhân viên vừa tạo
      const hash = await bcrypt.hash(password, 10);
      const account = await this.userModel.create({
        username,
        password: hash,
        role,
        status,
        employeeId: newEmployee._id
      });

      if (!account) {
        // Nếu tạo account thất bại, xóa employee đã tạo
        await this.employeeModel.findByIdAndDelete(newEmployee._id);
        throw new BadRequestException('Không thể tạo tài khoản');
      }

      return { 
        account,
        employee: newEmployee,
        message: 'Tạo tài khoản và thông tin nhân viên thành công'
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Có lỗi xảy ra khi tạo tài khoản');
    }
  }

  async findAll(query?: any) {
    return this.userModel.find()
      .populate({
        path: 'employeeId',
        select: 'fullName email phone dob gender departmentId positionId joinDate bankAccount bankName'
      })
      .exec();
  }

  async findOne(id: string) {
    const admin = await this.userModel.findById(id)
      .populate({
        path: 'employeeId',
        select: 'fullName email phone dob gender departmentId positionId joinDate bankAccount bankName'
      })
      .exec();
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async update(id: string, updateAdminDto: UpdateAccount) {
    try {
      const { username, role, status, ...employeeData } = updateAdminDto;

      // Kiểm tra username đã tồn tại chưa (nếu có thay đổi username)
      if (username) {
        const existed = await this.userModel.findOne({ 
          username, 
          _id: { $ne: id } 
        }).exec();
        if (existed) throw new BadRequestException(`Username: ${username} đã tồn tại`);
      }

      // Lấy thông tin tài khoản hiện tại
      const currentAccount = await this.userModel.findById(id).exec();
      if (!currentAccount) throw new NotFoundException('Không tìm thấy tài khoản');

      // Cập nhật thông tin nhân viên
      if (currentAccount.employeeId) {
        // Chuyển đổi departmentId và positionId thành ObjectId nếu có
        const departmentId = employeeData.departmentId ? new Types.ObjectId(employeeData.departmentId) : null;
        const positionId = employeeData.positionId ? new Types.ObjectId(employeeData.positionId) : null;

        // Cập nhật thông tin nhân viên
        const updatedEmployee = await this.employeeModel.findByIdAndUpdate(
          currentAccount.employeeId,
          {
            fullName: employeeData.fullName,
            email: employeeData.email,
            dob: employeeData.dob || null,
            gender: employeeData.gender || null,
            phone: employeeData.phone || null,
            departmentId: departmentId,
            positionId: positionId,
            joinDate: employeeData.joinDate || null,
            bankAccount: employeeData.bankAccount || null,
            bankName: employeeData.bankName || null,
          },
          { new: true }
        ).exec();

        if (!updatedEmployee) {
          throw new BadRequestException('Không thể cập nhật thông tin nhân viên');
        }
      }

      // Cập nhật thông tin tài khoản
      const updatedAccount = await this.userModel.findByIdAndUpdate(
        id,
        {
          username: username || currentAccount.username,
          role: role || currentAccount.role,
          status: status || currentAccount.status,
        },
        { new: true }
      ).populate('employeeId').exec();

      if (!updatedAccount) {
        throw new BadRequestException('Không thể cập nhật tài khoản');
      }

      return updatedAccount;
    } catch (error) {
      throw new BadRequestException(error.message || 'Có lỗi xảy ra khi cập nhật tài khoản');
    }
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

  async getDepartments() {
    try {
      return await this.departmentModel.find().exec();
    } catch (error) {
      throw new BadRequestException('Lỗi khi lấy danh sách phòng ban');
    }
  }

  async getPositions() {
    try {
      return await this.positionModel.find().exec();
    } catch (error) {
      throw new BadRequestException('Lỗi khi lấy danh sách chức vụ');
    }
  }
}
