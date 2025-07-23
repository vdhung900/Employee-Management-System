import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MonthlyGoal } from "src/schemas/monthGoals.schema";

@Injectable()
export class MonthlyGoalService {
  constructor(
    @InjectModel(MonthlyGoal.name)
    private monthlyGoalModel: Model<MonthlyGoal>
  ) {}

  async findAll() {
    return await this.monthlyGoalModel.find();
  }

  async findByDepartmentId(departmentId: string) {
    return await this.monthlyGoalModel.aggregate([
      {
        $lookup: {
          from: "employees", // Tên collection của employees
          localField: "employee_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
      },
      {
        $match: {
          "employee.departmentId": new Types.ObjectId(departmentId),
          //Tạm thời lấy các bản ghi chưa được Review
          // isReviewed: false,
        },
      },
    ]);
  }
}
