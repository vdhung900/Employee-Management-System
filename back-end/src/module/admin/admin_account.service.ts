import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Account, AccountDocument } from '../../schemas/account.schema';
import { Employees, EmployeesDocument } from '../../schemas/employees.schema';
import { CreateAccount, ResetPassword, UpdateAccount, UpdateStatus } from './dto/admin_account.dto';
import * as bcrypt from 'bcryptjs';
import { Departments, DepartmentsDocument } from '../../schemas/departments.schema';
import { Position, PositionDocument } from '../../schemas/position.schema';
import { AccountInfoDto } from "./dto/accountInfo.dto";
import { USER_ROLE } from "../../enum/role.enum";
import { STATUS } from "../../enum/status.enum";
import { RolePermissionService } from "../auth/role_permission/role_permission.service";

@Injectable()
export class AdminAccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @InjectModel(Employees.name) private employeeModel: Model<EmployeesDocument>,
    @InjectModel(Departments.name) private departmentModel: Model<DepartmentsDocument>,
    @InjectModel(Position.name) private positionModel: Model<PositionDocument>,
    private readonly rolePermissionService: RolePermissionService,
  ) { }

  async create(createAccount: CreateAccount) {
    try {
      const check = await this.employeeModel.findOne({ email: createAccount.email }).exec();

      if (check) throw new BadRequestException(`Email: ${createAccount.email} đã tồn tại`);




      const roleId = createAccount.role ? new Types.ObjectId(createAccount.role) : null;
      const code = await this.generateUserName(createAccount.fullName);
      // Tạo thông tin nhân viên mới
      const newEmployee = await this.employeeModel.create({
        fullName: createAccount.fullName,
        email: createAccount.email,
        dob: createAccount.dob || null,
        gender: createAccount.gender || null,
        phone: createAccount.phone || null,
        departmentId: null,
        positionId: null,
        joinDate: new Date(),
        resignDate: null,
        bankAccount: null,
        bankName: null,
        document: null,
        contractId: null,
        salaryCoefficientId: null
      });

      if (!newEmployee) {
        throw new BadRequestException('Không thể tạo thông tin nhân viên');
      }


      // Tạo tài khoản với thông tin nhân viên vừa tạo
      const hash = await this.generateRandomPassword(8);
      const name = await this.generateUserName(createAccount.fullName);
      const account = await this.accountModel.create({
        username: name,
        password: hash,
        role: roleId,
        status: createAccount.status,
        employeeId: newEmployee._id
      });

      if (!account) {
        // Nếu tạo account thất bại, xóa employee đã tạo
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
    return this.accountModel.find()

      .populate({
        path: 'employeeId',
        select: 'fullName email phone dob gender departmentId positionId joinDate bankAccount bankName'
      })
      .populate({
        path: 'role',
        select: 'name'
      })

      .exec();
  }

  async findOne(id: string) {
    const admin = await this.accountModel.findById(id)
      .populate({
        path: 'employeeId',
        select: 'fullName email phone dob gender departmentId positionId joinDate bankAccount bankName',
        populate: [
          {
            path: 'departmentId',
            select: 'name'
          },
          {
            path: 'positionId',
            select: 'name'
          }
        ]
      })
      .populate({
        path: 'role',
        select: 'name'

      })
      .exec();
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async update(id: string, updateAdminDto: UpdateAccount) {
    try {

      // Lấy thông tin tài khoản hiện tại
      const currentAccount = await this.accountModel.findById(id).populate({
        path: 'employeeId',
        select: 'fullName email phone dob gender departmentId positionId joinDate bankAccount bankName'
      }).exec();
      if (!currentAccount) throw new NotFoundException('Không tìm thấy tài khoản');

      // Cập nhật thông tin nhân viên
      if (currentAccount.employeeId) {

        const updateEmployee: any = {};
        if (updateAdminDto.fullName) {
          updateEmployee.fullName = updateAdminDto.fullName;
        }
        if (updateAdminDto.email) {
          updateEmployee.email = updateAdminDto.email;
        }
        if (updateAdminDto.dob) {
          updateEmployee.dob = updateAdminDto.dob;
        }
        if (updateAdminDto.gender) {
          updateEmployee.gender = updateAdminDto.gender;
        }
        if (updateAdminDto.phone) {
          updateEmployee.phone = updateAdminDto.phone;
        }
        if (updateAdminDto.document) {
          updateEmployee.document = updateAdminDto.document;
        }
// Them ho t cai logic attachments vao nha, cu them vao update gi gi day la dc
          // attachments: employeeData.document || null,
        // Cập nhật thông tin nhân viên
        const updatedEmployee = await this.employeeModel.findByIdAndUpdate(
          currentAccount.employeeId,
          updateEmployee,
          { new: true }
        ).exec();

        if (!updatedEmployee) {
          throw new BadRequestException('Không thể cập nhật thông tin nhân viên');
        }
      }
      const roleId = updateAdminDto.role ? new Types.ObjectId(updateAdminDto.role) : null;
      let name = currentAccount.username;
      // if (updateAdminDto.fullName) {
      //   name = await this.generateUserName(updateAdminDto.fullName);
      // }
      // Cập nhật thông tin tài khoản
      const updateAccount: any = {};
      if (name) {
        updateAccount.username = name;
      }
      if (roleId) {
        updateAccount.role = roleId;
      }
      if (updateAdminDto.status) {
        updateAccount.status = updateAdminDto.status;
      }
      const updatedAccount = await this.accountModel.findByIdAndUpdate(
        id,
        updateAccount,
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
    // if (updateAdminDto.password) {
    //   updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
    // }


    const admin = await this.accountModel.findOneAndUpdate(
      { _id: id },
      updateAdminDto,
      { new: true },
    ).exec();
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async updateStatus(id: string, updateAdminDto: UpdateStatus) {
    const admin = await this.accountModel.findOneAndUpdate(
      { _id: id },
      updateAdminDto,
      { new: true },
    ).exec();
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }
  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      const admin = await this.accountModel.findOneAndDelete({ _id: id }).exec();
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

  async createByInfo(info: any, files: any){
    try{
      if(!info.fullName || !info.email || !info.department || !info.position) {
        throw new Error('Thông tin không đầy đủ');
      }
      const username = await this.generateUserName(info.fullName);
      const password = this.generateRandomPassword(8);
      const hashPassword = await bcrypt.hash(password, 10);
      const isValidEmail = await this.employeeModel.findOne({ email: info.email }).exec();
      if(isValidEmail) {
        throw new Error('Email đã tồn tại');
      }
      const role = await this.rolePermissionService.getRoleByCode(USER_ROLE.EMPLOYEE);
        if(!role) {
            throw new Error('Role không tồn tại');
        }
      const newEmployee = await this.employeeModel.create({
        fullName: info.fullName,
        email: info.email,
        phone: info.phone || null,
        departmentId: new Types.ObjectId(info.department),
        positionId: new Types.ObjectId(info.position),
        joinDate: new Date(info.startDate) || new Date(),
        dob: null,
        gender: null,
        resignDate: null,
        bankAccount: null,
        bankName: null,
        contractId:  null,
        attachments: files
      });
      if (!newEmployee) {
        throw new Error('Không thể tạo thông tin nhân viên');
      }
      const newAccount = await this.accountModel.create({
        username: username,
        password: hashPassword,
        role: role._id,
        employeeId: newEmployee._id,
        status: STATUS.ACTIVE,
      })
      return {newAccount, newEmployee};
    }catch (e) {
      throw e;
    }
  }

  async generateUserName(fullName: string): Promise<string> {
    const parts = fullName.trim().toLowerCase().split(/\s+/);
    if (parts.length < 2) throw new Error("Tên không hợp lệ. Cần ít nhất họ và tên.");
    const lastName = parts[parts.length - 1];
    const middleAndFirst = parts.slice(0, parts.length - 1);
    const initials = middleAndFirst.map(word => word[0]).join("");
    const baseUserName = lastName + initials;
    const existingUsers: { username: string }[] = await this.accountModel
        .find({ username: new RegExp(`^${baseUserName}\\d*$`, 'i') })
        .select('username')
        .lean();
    const suffixes = existingUsers.map(user => {
      const match = user.username.match(new RegExp(`^${baseUserName}(\\d*)$`, 'i'));
      return match ? parseInt(match[1] || '0', 10) : 0;
    });
    const isBaseTaken = existingUsers.some(user => user.username.toLowerCase() === baseUserName.toLowerCase());
    const maxSuffix = suffixes.length > 0 ? Math.max(...suffixes) : 0;
    const newUserName = isBaseTaken ? `${baseUserName}${maxSuffix + 1}` : baseUserName;
    return newUserName;
  }

   generateRandomPassword(length: number = 8): string {
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const allChars = upperChars + lowerChars + numberChars;
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars[randomIndex];
    }
    return password;
  }

}
