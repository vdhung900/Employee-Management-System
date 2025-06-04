import { ApiProperty } from '@nestjs/swagger';

export class LoginReq {
    @ApiProperty({
        description: 'Username for login',
        example: 'john.doe@example.com'
    })
    username: string;

    @ApiProperty({
        description: 'Password for login',
        example: 'password123'
    })
    password: string;
}