import { Body, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import { LoginReq } from "src/interfaces/loginReq.interface";
import { Employees, EmployeesDocument } from "src/schemas/employees.schema";
import { Account, AccountDocument } from "src/schemas/account.schema";
import { JwtService } from "@nestjs/jwt";
import { RolePermissionService } from "./role_permission/role_permission.service";
import * as bcrypt from 'bcryptjs';
import {NotificationService} from "../notification/notification.service";
import {STATUS} from "../../enum/status.enum";
import {USER_ROLE} from "../../enum/role.enum";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @InjectModel(Employees.name) private employeesModel: Model<EmployeesDocument>,
    private jwtService: JwtService,
    private readonly rolePermissionService: RolePermissionService,
    private readonly notificationService: NotificationService,
  ) {}

  async findUserByUsername(username: string): Promise<Account | null> {
    try {
      const user = await this.accountModel.findOne({ username }).populate("employeeId").exec();
      return user;
    } catch (error) {
      console.error("Error finding user by username:", error);
      throw new Error("Error finding user by username");
    }
  }

  async findUserById(userId: string): Promise<Account | null> {
    try {
      const user = await this.accountModel.findById(userId).populate("employeeId").exec();
      return user;
    } catch (error) {
      console.error("Error finding user by username:", error);
      throw new Error("Error finding user by username");
    }
  }

  async login(req: LoginReq) {
    try {
      const account = await this.findUserByUsername(req.username);

      const isPasswordValid = account && account.password === req.password;
      // const isPasswordValid = account && await bcrypt.compare(req.password, account.password);

      if (!account || !isPasswordValid) {
        throw new Error("Invalid username or password");
      }

      const rolePermission = await this.rolePermissionService.getRolePermissionByRole(account.role);
      if (!rolePermission) {
        throw new Error("Role permission not found for this user");
      }
      const payload = {
        userId: account._id,
        role: rolePermission?.role,
        permissions: rolePermission?.permissions,
        employeeId: account.employeeId ? account.employeeId._id : null,
      };
      const jwtSecret = process.env.JWT_SECRET;
      return {
        user: {
          username: account.username,
          employeeId: account.employeeId ? account.employeeId._id : null,
        },
        accessToken: this.jwtService.sign(payload, { secret: jwtSecret, expiresIn: "1h" }),
        refreshToken: this.jwtService.sign(payload, { secret: jwtSecret, expiresIn: "7d" }),
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
