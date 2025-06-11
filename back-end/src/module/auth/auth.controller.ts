import { Body, Controller, Get, HttpException, HttpStatus, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginReq } from "src/interfaces/loginReq.interface";
import { BaseResponse } from "src/interfaces/response/base.response";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("/me")
  async getRequestMakerInfo(@Req() req): Promise<BaseResponse> {
    try {
      console.log("awffaw", req.user);

      const user = await this.authService.findUserById(req.user.userId);

      console.log("awffaw", user);

      return BaseResponse.success(user, "", HttpStatus.OK);
    } catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("/login")
  @ApiOperation({ summary: "User login" })
  @ApiBody({ type: LoginReq })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    type: BaseResponse,
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
  })
  async login(@Body() loginReq: LoginReq): Promise<BaseResponse> {
    try {
      const jwtSecret = process.env.JWT_SECRET;
      console.log("JWT Secret:", jwtSecret);

      const loginResult = await this.authService.login(loginReq);
      return BaseResponse.success(loginResult, "Dang nhap thanh cong", HttpStatus.OK);
    } catch (e) {
      // throw e;
      throw new HttpException({ message: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
