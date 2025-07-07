import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from "@nestjs/common";
import { PerformanceReviewService } from "./performance-review.service";
import { CreatePerformanceReviewDto } from "./dto/create-performance-review.dto";
import { UpdatePerformanceReviewDto } from "./dto/update-performance-review.dto";

@Controller("performance-review")
export class PerformanceReviewController {
  constructor(private readonly performanceReviewService: PerformanceReviewService) {}

  @Post()
  create(@Req() req: any, @Body() createPerformanceReviewDto: CreatePerformanceReviewDto) {
    createPerformanceReviewDto.reviewer_id = req?.user?.userId;
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
