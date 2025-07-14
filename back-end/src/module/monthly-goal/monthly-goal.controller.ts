import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { MonthlyGoalService } from "./monthly-goal.service";

@Controller("monthly-goal")
export class MonthlyGoalController {
  constructor(private readonly monthlyGoalService: MonthlyGoalService) {}

  @Get("/department/:departmentId")
  async findMonthlyGoalByDepartment(@Param("departmentId") departmentId: string) {
    return await this.monthlyGoalService.findByDepartmentId(departmentId);
  }
  // findAll() {
  //   return this.monthlyGoalService.findAll();
  // }
}
