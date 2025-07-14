import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthModule } from "./module/auth/auth.module";
import { DatabaseModule } from "./config/database.module";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { RequestLog, RequestLogSchema } from "./schemas/request-log.schema";
import { RequestLoggerMiddleware } from "./middleware/request-logger.middleware";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { SystemModule } from "./module/system/system.module";
import { RequestModule } from "./module/request/request.module";
import { CategoryModule } from "./module/category/category.module";
import { AdminAccountModule } from "./module/admin/admin_account.module";
import { BadRequestException } from "@nestjs/common";
import { DepartmentModule } from "./module/department/department.module";
import { RolesGuard } from "./common/guards/roles.guard";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { AttendanceModule } from "./module/attendance/attendance.module";
import { RolePermissionModule } from "./module/auth/role_permission/role_permission.module";
import { BenefitsModule } from "./module/benefits/benefits.module";
import { UpdateEmployeeModule } from "./module/hr/update_Employees/update_Employee.module";
import { SalaryCoeficientModule } from "./module/hr/salary_Coeficient/salary_coeficient.module";
import { ProfileModule } from "./module/employee/profile/profile.module";
import { UploadModule } from "./module/minio/minio.module";
import {DocumentManageModule} from "./module/hr/documentManage/documentManage.module";
import { EmployeeModule } from "./module/employee/employee.module";
import { PerformanceReviewModule } from "./module/performance-review/performance-review.module";
import { MonthlyGoalModule } from "./module/monthly-goal/monthly-goal.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    DatabaseModule,
    MongooseModule.forFeature([{ name: RequestLog.name, schema: RequestLogSchema }]),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 15,
      },
    ]),
    SystemModule,
    RequestModule,
    CategoryModule,
    AdminAccountModule,
    DepartmentModule,
    AttendanceModule,
    RolePermissionModule,
    BenefitsModule,
    UploadModule,
    UpdateEmployeeModule,
    SalaryCoeficientModule,
    ProfileModule,
    DocumentManageModule,
    PerformanceReviewModule,
    MonthlyGoalModule,
    EmployeeModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes("*");

    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: "auth/login", method: RequestMethod.POST },
        { path: "auth/register", method: RequestMethod.POST },
        { path: "api", method: RequestMethod.GET }
        // { path: 'hr-request/create', method: RequestMethod.POST },
        // { path: 'request-manage/all-logs', method: RequestMethod.POST },
        // { path: 'admin-accounts', method: RequestMethod.POST },
        // { path: 'admin-accounts', method: RequestMethod.GET },
        // { path: 'admin-accounts/:id', method: RequestMethod.PATCH },
        // { path: 'admin-accounts/:id/reset-password', method: RequestMethod.PATCH },
        // { path: 'admin-accounts/:id', method: RequestMethod.GET },
        // { path: 'admin-accounts/:id', method: RequestMethod.DELETE },
        // { path: 'admin-accounts/departments', method: RequestMethod.GET },
        // { path: 'admin-accounts/positions', method: RequestMethod.GET },
      )
      .forRoutes("*");
  }
}
