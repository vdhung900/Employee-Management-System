import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from "@nestjs/common";
import { PerformanceReviewService } from "./performance-review.service";
import { CreatePerformanceReviewDto } from "./dto/create-performance-review.dto";
import { UpdatePerformanceReviewDto } from "./dto/update-performance-review.dto";
import { SearchMonthlyReviewDto } from "./dto/search-monthly-review.dto";

@Controller("performance-review")
export class PerformanceReviewController {
  constructor(private readonly performanceReviewService: PerformanceReviewService) {}

  @Get("search")
  async searchMonthlyReviews(@Query() searchDto: SearchMonthlyReviewDto) {
    return this.performanceReviewService.findMonthlyReviews(searchDto);
  }

  @Post()
  create(@Req() req: any, @Body() createPerformanceReviewDto: CreatePerformanceReviewDto) {
    createPerformanceReviewDto.reviewer_id = req?.user?.employeeId;
    return this.performanceReviewService.create(createPerformanceReviewDto);
  }

  @Get()
  findAll() {
    return this.performanceReviewService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.performanceReviewService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePerformanceReviewDto: UpdatePerformanceReviewDto) {
    return this.performanceReviewService.update(+id, updatePerformanceReviewDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.performanceReviewService.remove(+id);
  }
}
