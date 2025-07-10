import { Injectable, Req } from "@nestjs/common";
import { CreatePerformanceReviewDto } from "./dto/create-performance-review.dto";
import { UpdatePerformanceReviewDto } from "./dto/update-performance-review.dto";
import { MonthlyReview } from "src/schemas/performanceReview.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MonthlyGoal } from "src/schemas/monthGoals.schema";
import { BaseResponse } from "src/interfaces/response/base.response";
import { Employees } from "src/schemas/employees.schema";
import { Departments } from "src/schemas/departments.schema";

import { SearchMonthlyReviewDto } from "./dto/search-monthly-review.dto";

interface QueryFilters {
  employee_id?: string;
  department?: string;
  month?: number;
  year?: number;
  sortOrder?: "asc" | "desc";
}

@Injectable()
export class PerformanceReviewService {
  constructor(
    @InjectModel(MonthlyReview.name)
    private monthlyReviewModel: Model<MonthlyReview>,

    @InjectModel(MonthlyGoal.name)
    private monthlyGoalModel: Model<MonthlyGoal>,

    @InjectModel(Employees.name)
    private employeesModel: Model<Employees>,

    @InjectModel(Departments.name)
    private departmentsModel: Model<Departments>
  ) {}

  async findMonthlyReviews(filters: SearchMonthlyReviewDto) {
    try {
      const { employee_id, department, month, year, sortOrder = "desc" } = filters;

      // Build initial match conditions
      const initialMatchConditions: any = {};

      if (employee_id) {
        initialMatchConditions.employee_id = new Types.ObjectId(employee_id);
      }

      if (month) {
        initialMatchConditions.month = month;
      }

      if (year) {
        initialMatchConditions.year = year;
      }

      // Build aggregation pipeline
      const pipeline: any[] = [];

      // Add initial match if we have basic filters
      if (Object.keys(initialMatchConditions).length > 0) {
        pipeline.push({
          $match: initialMatchConditions,
        });
      }

      // Add lookups
      pipeline.push(
        {
          $lookup: {
            from: "employees",
            localField: "employee_id",
            foreignField: "_id",
            as: "employee",
          },
        },
        {
          $unwind: "$employee",
        },
        {
          $lookup: {
            from: "departments",
            localField: "employee.departmentId",
            foreignField: "_id",
            as: "department",
          },
        },
        {
          $unwind: "$department",
        },
        {
          $lookup: {
            from: "employees",
            localField: "reviewer_id",
            foreignField: "_id",
            as: "reviewer",
          },
        },
        {
          $unwind: "$reviewer",
        }
      );

      // Add department filter after lookup if specified
      if (department) {
        pipeline.push({
          $match: {
            "department._id": new Types.ObjectId(department),
          },
        });
      }

      // Add sorting
      const sortDirection = sortOrder === "asc" ? 1 : -1;
      pipeline.push({
        $sort: {
          year: sortDirection,
          month: sortDirection,
          created_at: sortDirection,
        },
      });

      // Add projection to format the response
      pipeline.push({
        $project: {
          _id: 1,
          employee_id: 1,
          goal_ref: 1,
          reviewer_id: 1,
          month: 1,
          year: 1,
          results: 1,
          overallScore: 1,
          comment: 1,
          bonus: 1,
          created_at: 1,
          employee: {
            _id: "$employee._id",
            fullName: "$employee.fullName",
            code: "$employee.code",
            email: "$employee.email",
            phone: "$employee.phone",
          },
          department: {
            _id: "$department._id",
            name: "$department.name",
            code: "$department.code",
          },
          reviewer: {
            _id: "$reviewer._id",
            fullName: "$reviewer.fullName",
            code: "$reviewer.code",
          },
        },
      });

      const reviews = await this.monthlyReviewModel.aggregate(pipeline);

      return new BaseResponse({
        status: "Get monthly reviews successfully",
        success: true,
        data: reviews,
        message: `Found ${reviews.length} monthly reviews`,
      });
    } catch (error) {
      return new BaseResponse({
        status: "Get monthly reviews failed",
        success: false,
        message: error.message,
      });
    }
  }

  async create(dtoToCreate: CreatePerformanceReviewDto) {
    // console.log(monthlyGoal);

    //Manual Validate
    const monthlyGoal = await this.monthlyGoalModel.findById(dtoToCreate.goal_ref);

    const existingReview = await this.monthlyReviewModel.findOne({
      goal_ref: dtoToCreate.goal_ref,
    });

    if (existingReview) {
      return new BaseResponse({
        status: "Create review failed",
        success: false,
        message: "Review for this goals already existed",
      });
    }

    // console.log(monthlyGoal?.goals.length, dtoToCreate.results.length);
    if (monthlyGoal?.goals.length !== dtoToCreate.results.length) {
      return new BaseResponse({
        status: "Create review failed",
        success: false,
        message: "Invalid results length",
      });
    }

    if (
      JSON.stringify(monthlyGoal.goals.map((goal) => goal.code).sort()) !==
      JSON.stringify(dtoToCreate.results.map((rs) => rs.code).sort())
    ) {
      return new BaseResponse({
        status: "Create review failed",
        success: false,
        message: "Invalid results, check the goal codes ",
      });
    } else {
      // console.log("Passed");
    }

    const newResults = dtoToCreate.results.map((rs) => {
      const existingGoal = monthlyGoal.goals.find((goal) => goal.code === rs.code);
      return {
        code: rs.code,
        goalTitle: existingGoal?.title,
        targetValue: existingGoal?.targetValue,
        actualValue: rs.actualValue,
        score: rs.score,
      };
    });

    const newReview = new this.monthlyReviewModel({
      employee_id: monthlyGoal?.employee_id,
      goal_ref: new Types.ObjectId(dtoToCreate.goal_ref),
      reviewer_id: new Types.ObjectId(dtoToCreate.reviewer_id),
      month: monthlyGoal?.month,
      year: monthlyGoal?.year,
      results: newResults,
      comment: dtoToCreate.comment,
      overallScore: dtoToCreate.overallScore,
    });
    const savedReview = newReview.save();
    monthlyGoal.isReviewed = true;
    monthlyGoal.save();

    return savedReview;
  }

  findAll() {
    return `This action returns all performanceReview`;
  }

  findOne(id: number) {
    return `This action returns a #${id} performanceReview`;
  }

  update(id: number, updatePerformanceReviewDto: UpdatePerformanceReviewDto) {
    return `This action updates a #${id} performanceReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} performanceReview`;
  }
}
