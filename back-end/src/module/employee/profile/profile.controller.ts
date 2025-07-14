import {Controller, Get, Put, Param, Body, HttpStatus, HttpException} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { EditProfileDto } from './profile.dto';
import { BaseResponse } from 'src/interfaces/response/base.response';

@Controller('employee')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Put('profile/:id')
    async editProfile(@Param('id') id: string, @Body() dto: EditProfileDto) {
        const employee = await this.profileService.editProfile(id, dto);
        return BaseResponse.success(employee, 'Profile updated successfully', HttpStatus.OK);
    }

    @Get('profile/:id')
    async getProfile(@Param('id') id: string): Promise<BaseResponse> {
        try {
            const resData = await this.profileService.getProfile(id);
            return BaseResponse.success(resData, 'Request retrieved successfully', HttpStatus.OK);
        } catch (e) {
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}