import { Body, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoginReq } from "src/interfaces/loginReq.interface";
import { Employees, EmployeesDocument } from "src/schemas/employees.schema";
import { Account, AccountDocument } from "src/schemas/account.schema";
import { log } from "node:console";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @InjectModel(Employees.name) private employeesModel: Model<EmployeesDocument>
  ) {}

  async login(req: LoginReq) {
    // console.log("Login request received:", req);
    // console.log("all user", await this.accountModel.find().exec());

    try {
      const account = await this.accountModel
        .findOne({ username: req.username, password: req.password })
        .populate("employeeId")
        .exec();
      if (!account) {
        throw new Error("Invalid username or password");
      }
      return account;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
