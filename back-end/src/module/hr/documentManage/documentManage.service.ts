import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {Employees, EmployeesDocument} from "../../../schemas/employees.schema";
import {Account, AccountDocument} from "../../../schemas/account.schema";
import {USER_ROLE} from "../../../enum/role.enum";
import {DocumentManageDto} from "./documentManage.dto";
import {Documents, DocumentsDocument} from "../../../schemas/documents.schema";
import {UploadService} from "../../minio/minio.service";

@Injectable()
export class DocumentManageService {
    constructor(
        @InjectModel(Employees.name) private readonly employeeModel: Model<EmployeesDocument>,
        @InjectModel(Account.name) private readonly accountModel: Model<AccountDocument>,
        @InjectModel(Documents.name) private readonly documentModel: Model<DocumentsDocument>,
        private readonly uploadService: UploadService,
    ) {}

    async getAllEmployeesAndDocuments(){
        try{
            const employees = await this.employeeModel.find({})
                .populate("departmentId", "name")
                .populate("positionId", "name")
                .populate("contractId", "contract_type")
                .populate("attachments")
                .exec();
            if (!employees || employees.length === 0) {
                throw new NotFoundException('No employees found');
            }

            const accounts = await this.accountModel.find({})
                .populate({ path: 'role', select: 'code' })
                .exec();

            const accountMap = new Map();
            accounts.forEach(acc => {
                if (acc.employeeId) {
                    accountMap.set(String(acc.employeeId), acc);
                }
            });

            const filteredEmployees = employees.filter(emp => {
                const acc = accountMap.get(String(emp._id));
                if (!acc || !acc.role || acc.role.code !== USER_ROLE.ADMIN) {
                    return true;
                }
                return false;
            });

            return filteredEmployees;
        }catch (e) {
            throw new Error(e);
        }
    }

    async addDocumentForEmployee(req: DocumentManageDto){
        try{
            if(!req.employeeId){
                throw new Error("Id của nhân viên không được để trống!")
            }
            const employee = await this.employeeModel.findById(new Types.ObjectId(req.employeeId)).exec();
            if(!employee) {
                throw new NotFoundException('Không tìm thấy nhân viên!');
            }
            if(req.attachments.length === 0){
                throw new Error("Tài liệu đính kèm không được để trống!");
            }
            const newDocument = new this.documentModel(req.attachments[0]);
            await newDocument.save();
            employee.attachments.push(newDocument._id as Types.ObjectId);
            return await employee.save();
        }catch (e) {
            throw e;
        }
    }

    async deleteDocumentForEmployee(req: DocumentManageDto) {
        try{
            if(!req.employeeId){
                throw new Error("Id của nhân viên không được để trống!")
            }
            const employee = await this.employeeModel.findById(new Types.ObjectId(req.employeeId)).exec();
            if(!employee) {
                throw new NotFoundException('Không tìm thấy nhân viên!');
            }
            if(!req.attachments[0]._id){
                throw new Error("Id của tài liệu không được để trống!");
            }
            let filterAttachments = employee.attachments.filter(doc => doc.toString() !== req.attachments[0]._id);
            employee.attachments = filterAttachments;
            await employee.save();
            await this.documentModel.findByIdAndDelete(new Types.ObjectId(req.attachments[0]._id)).exec();
            await this.uploadService.deleteFile(req.attachments[0].key);
            return employee;
        }catch (e) {
            throw e;
        }
    }
}