import { Module } from "@nestjs/common";
import { MonthlyGoalService } from "./monthly-goal.service";
import { MonthlyGoalController } from "./monthly-goal.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { MonthlyGoal, MonthlyGoalSchema } from "src/schemas/monthGoals.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: MonthlyGoal.name, schema: MonthlyGoalSchema }])],
  controllers: [MonthlyGoalController],
  providers: [MonthlyGoalService],
})
export class MonthlyGoalModule {}
