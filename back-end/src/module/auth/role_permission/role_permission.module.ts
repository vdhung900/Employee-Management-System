import { Module } from "@nestjs/common";
import {RolePermissionController} from "./role_permission.controller";
import {RolePermissionService} from "./role_permission.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Roles, RoleSchema} from "../../../schemas/roles.schema";
import {RolePermission, RolePermissionSchema} from "../../../schemas/role_permission.schema";
import {Permission, PermissionSchema} from "../../../schemas/permission.schema";
@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Roles.name, schema: RoleSchema},
            {name: RolePermission.name, schema: RolePermissionSchema},
            {name: Permission.name, schema: PermissionSchema},
        ])
    ],
    controllers: [RolePermissionController],
    providers: [RolePermissionService],
    exports: [RolePermissionService],
})
export class RolePermissionModule {}
