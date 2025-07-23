import { PartialType } from '@nestjs/swagger';
import { CreatePerformanceReviewDto } from './create-performance-review.dto';

export class UpdatePerformanceReviewDto extends PartialType(CreatePerformanceReviewDto) {}
