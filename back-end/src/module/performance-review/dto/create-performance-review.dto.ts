import { Type } from "class-transformer";
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEmpty,
  ArrayMinSize,
} from "class-validator";

class ResultDto {
  // @IsString()
  // @IsNotEmpty()
  // goalTitle: string;

  // @IsNumber()
  // targetValue: number;

  @IsString()
  @IsMongoId()
  singleGoalId: string;

  @IsNumber()
  actualValue: number;

  @IsNumber()
  score: number;
}

export class CreatePerformanceReviewDto {
  @IsNotEmpty()
  @IsMongoId()
  goal_ref: String;

  //Thêm vào trong Controller
  @IsEmpty()
  reviewer_id: String;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResultDto)
  results: ResultDto[];

  @IsNumber()
  overallScore: number;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsOptional()
  @IsNumber()
  bonus?: number;
}
