import {BaseReq} from "../../../interfaces/request/baseReq.interface";
import {IsNumber, IsOptional, IsString} from "class-validator";
import {SalarySlip} from "../../../schemas/salarySlip.schema";

export class SalaryPreviewDto extends BaseReq {
    @IsString()
    unitName: string;
    @IsString()
    department: string;
    @IsNumber()
    month: number;
    @IsNumber()
    year: number;
    @IsNumber()
    signDay: number;
    @IsNumber()
    signMonth: number;
    @IsNumber()
    signYear: number;
    @IsOptional()
    salarys: SalarySlip[]
    @IsString()
    @IsOptional()
    totalInWords: string;
    @IsOptional()
    totalBasicSalaryAll: string;
    @IsOptional()
    totalPositionSalary: string;
    @IsOptional()
    totalFamilyDeduction: string;
    @IsOptional()
    totalAllowance: string;
    @IsOptional()
    totalOTDaily: string;
    @IsOptional()
    totalOTWeekend: string;
    @IsOptional()
    totalOTHoliday: string;
    @IsOptional()
    totalBhxh: string;
    @IsOptional()
    totalBhyt: string;
    @IsOptional()
    totalBhtn: string;
    @IsOptional()
    totalTax: string;
    @IsOptional()
    totalSalary: string;
}