import { Body, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoginReq } from "src/interfaces/loginReq.interface";
import { Employees, EmployeesDocument } from "src/schemas/employees.schema";
import { Account, AccountDocument } from "src/schemas/account.schema";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    private jwtService: JwtService
  ) {}

  async findUserByUsername(username: string): Promise<Account | null> {
    try {
      const user = await this.accountModel.findOne({ username }).populate("employeeId").exec();
      console.log("User found:", user);
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
    // console.log("Login request received:", req);
    // console.log("all user", await this.accountModel.find().exec());

    try {
      const user = await this.findUserByUsername(req.username);
      console.log("user found:", user);

      //Edit later when password is hashed
      const isPasswordValid = user && user.password === req.password;

      if (!user || !isPasswordValid) {
        throw new Error("Invalid username or password");
      }

      const payload = {
        userId: user._id,
        role: user.role,
        employeeId: user.employeeId ? user.employeeId._id : null,
      };

      const jwtSecret = process.env.JWT_SECRET;

      return {
        user: {
          username: user.username,
          role: user.role,
          employee: user.employeeId,
        },
        accessToken: this.jwtService.sign(payload, { secret: jwtSecret, expiresIn: "1h" }),
        refreshToken: this.jwtService.sign(payload, { secret: jwtSecret, expiresIn: "7d" }),
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
