import { Module } from "@nestjs/common";
import { PerformanceReviewService } from "./performance-review.service";
import { PerformanceReviewController } from "./performance-review.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { MonthlyGoal, MonthlyGoalSchema } from "src/schemas/monthGoals.schema";
import { MonthlyReview, MonthlyReviewSchema } from "src/schemas/performanceReview.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MonthlyGoal.name, schema: MonthlyGoalSchema },
      { name: MonthlyReview.name, schema: MonthlyReviewSchema },
    ]),
  ],
  controllers: [PerformanceReviewController],
  providers: [PerformanceReviewService],
})
export class PerformanceReviewModule {}
