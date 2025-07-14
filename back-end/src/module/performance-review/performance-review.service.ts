import { Injectable, Req } from "@nestjs/common";
import { CreatePerformanceReviewDto } from "./dto/create-performance-review.dto";
import { UpdatePerformanceReviewDto } from "./dto/update-performance-review.dto";
import { MonthlyReview } from "src/schemas/performanceReview.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MonthlyGoal } from "src/schemas/monthGoals.schema";
import { BaseResponse } from "src/interfaces/response/base.response";

@Injectable()
export class PerformanceReviewService {
  constructor(
    @InjectModel(MonthlyReview.name)
    private monthlyReviewModel: Model<MonthlyReview>,

    @InjectModel(MonthlyGoal.name)
    private monthlyGoalModel: Model<MonthlyGoal>
  ) {}

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
      goal_ref: dtoToCreate.goal_ref,
      reviewer_id: dtoToCreate.reviewer_id,
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
