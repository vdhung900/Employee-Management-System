import {Injectable} from '@nestjs/common';
import {Model, Types} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {LeaveSettingDocument, LeaveSettings} from "../../schemas/leaveSettings.schema";
import {LeaveBalance, LeaveBalanceDocument} from "../../schemas/leaveBalance.schema";
import {AdminAccountService} from "../admin/admin_account.service";


@Injectable()
export class LeaveBalanceService {
    constructor(
        @InjectModel(LeaveSettings.name) private leaveSettingModel: Model<LeaveSettingDocument>,
        @InjectModel(LeaveBalance.name) private leaveBalanceModel: Model<LeaveBalanceDocument>,
        private readonly adminAccountService: AdminAccountService,
    ) {
    }

    async getLeaveBalanceByEmpId(empId: string) {
        try {
            const leaveSettings = await this.leaveSettingModel.find().exec();
            let empData = await this.leaveBalanceModel.find({ employeeId: new Types.ObjectId(empId) }).exec();
            if (!empData || empData.length === 0) {
                await this.adminAccountService.initLeaveBalance(empId);
                empData = await this.leaveBalanceModel.find({ employeeId: new Types.ObjectId(empId) }).exec();
            }
            const enrichedEmpData = empData.map(item => {
                const setting = leaveSettings.find(setting => setting.code === item.leaveTypeCode);
                return {
                    ...item.toObject(),
                    name: setting?.name || null,
                    description: setting?.description || null
                };
            });
            return enrichedEmpData;
        } catch (error) {
            throw error;
        }
    }

}
