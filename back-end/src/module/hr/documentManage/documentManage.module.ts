import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Employees, EmployeesSchema } from "../../../schemas/employees.schema";
import { Departments, DepartmentsSchema } from "src/schemas/departments.schema";
import { Position, PositionSchema } from "src/schemas/position.schema";
import { SalaryCoefficient, SalaryCoefficientSchema } from "src/schemas/salaryCoefficents.schema";
import { Contract, ContractSchema } from "src/schemas/contracts.schema";
import {DocumentManageController} from "./documentManage.controller";
import {DocumentManageService} from "./documentManage.service";
import {Account, AccountSchema} from "../../../schemas/account.schema";
import {Documents, DocumentsSchema} from "../../../schemas/documents.schema";
import {UploadModule} from "../../minio/minio.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Employees.name, schema: EmployeesSchema }, { name: Departments.name, schema: DepartmentsSchema },
        { name: Position.name, schema: PositionSchema }, { name: SalaryCoefficient.name, schema: SalaryCoefficientSchema },
        { name: Contract.name, schema: ContractSchema },
        { name: Account.name, schema: AccountSchema },
        { name: Documents.name, schema: DocumentsSchema },
        ]),
        UploadModule
    ],
    controllers: [DocumentManageController],
    providers: [DocumentManageService],
    exports: [],
})
export class DocumentManageModule {}