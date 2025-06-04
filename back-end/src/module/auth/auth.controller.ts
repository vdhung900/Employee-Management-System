import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginReq } from 'src/interfaces/loginReq.interface';
import { BaseResponse } from 'src/interfaces/response/base.response';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){

    }

    @Post('/login')
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
