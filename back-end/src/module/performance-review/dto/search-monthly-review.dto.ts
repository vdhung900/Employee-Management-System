import { IsOptional, IsString, IsNumber, IsIn, IsMongoId } from "class-validator";
import { Transform } from "class-transformer";

export class SearchMonthlyReviewDto {
  @IsOptional()
  @IsMongoId()
  employee_id?: string;

  @IsOptional()
  @IsMongoId()
  department?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  month?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';
} 