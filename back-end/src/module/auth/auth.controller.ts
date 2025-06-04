import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginReq } from 'src/interfaces/loginReq.interface';
import { BaseResponse } from 'src/interfaces/response/base.response';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';

@ApiTags('departments') // Nhóm các API này trong Swagger UI
// @ApiBearerAuth() // Nếu dùng JWT
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){

    }

    @Post('/login')
    @ApiOperation({ summary: 'Dang nhap' })
    @ApiResponse({ status: 200, description: 'Phòng ban đã tạo', type: User })
    async login(@Body() loginReq: LoginReq): Promise<BaseResponse>{
        try{
            const resData = await this.authService.login(loginReq);
            return BaseResponse.success(resData, 'Dang nhap thanh cong', HttpStatus.OK);
        }catch(e){
            // throw e;
            throw new HttpException({message: e.message}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
