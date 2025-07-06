import { IsNotEmpty, IsNumber, IsOptional, IsMongoId } from 'class-validator';

export class CreateSalaryCoefficientDto {
  @IsMongoId()
  @IsNotEmpty()
  salary_rankId: string;

  @IsNumber()
  @IsNotEmpty()
  salary_coefficient: number;
}

export class UpdateSalaryCoefficientDto {
  @IsMongoId()
  @IsOptional()
  salary_rankId?: string;

  @IsNumber()
  @IsOptional()
  salary_coefficient?: number;
}

export class SalaryCoefficientResponseDto {
  _id: string;
  salary_rankId: string;
  salary_coefficient: number;
} 