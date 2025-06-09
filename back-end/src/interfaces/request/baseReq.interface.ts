import {IsNumber, IsOptional, Min} from "class-validator";
import {Type} from "class-transformer";

export class BaseReq {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 10;
}