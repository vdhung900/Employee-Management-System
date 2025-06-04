import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginReq } from 'src/interfaces/loginReq.interface';
import { BaseResponse } from 'src/interfaces/response/base.response';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {

    }

    @Post('/login')
    @ApiOperation({ summary: 'User login' })
    @ApiBody({ type: LoginReq })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: BaseResponse
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error'
    })
    async login(@Body() loginReq: LoginReq): Promise<BaseResponse> {
        try {
            const resData = await this.authService.login(loginReq);
            return BaseResponse.success(resData, 'Dang nhap thanh cong', HttpStatus.OK);
        } catch (e) {
            // throw e;
            throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
