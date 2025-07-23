import {IsOptional} from "class-validator";

export class NotificationDto {
    @IsOptional()
    employeeId: string;

    @IsOptional()
    notificationId: string;
}