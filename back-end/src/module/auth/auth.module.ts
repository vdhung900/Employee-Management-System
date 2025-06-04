import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Employees, EmployeesSchema } from 'src/schemas/employees.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
        {name: User.name, schema: UserSchema},
        {name: Employees.name, schema: EmployeesSchema},
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
