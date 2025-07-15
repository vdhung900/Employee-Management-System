import { InjectModel } from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import { Notification, NotificationDocument } from '../../schemas/notification.schema';
import { NotificationGateway } from './notification.gateway';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async notifyEmployee(employeeId: string, message: string) {
    if (!employeeId || !message) {
      throw new Error('Employee ID and message are required');
    }
    const employeeToObjectId = new Types.ObjectId(employeeId);
    const notification = await this.notificationModel.create({ employeeId: employeeToObjectId, message });
    this.notificationGateway.sendToEmployee(employeeId, notification);
  }
  
  async getEmployeeNotifications(employeeId: string) {
    return this.notificationModel.find({ employeeId: new Types.ObjectId(employeeId) }).sort({ createdAt: -1 }).exec();
  }

  async markReadOne(notificationId: string, empId: string){
    try{
        const notification = await this.notificationModel.findOne({ _id: new Types.ObjectId(notificationId), employeeId: new Types.ObjectId(empId) }).exec();
        if (!notification) {
            throw new Error('Notification not found');
        }
        notification.read = true;
        await notification.save();
      return this.getEmployeeNotifications(empId);
    }catch (e) {
      throw e;
    }
  }

    async markReadAll(employeeId: string) {
        try {
          await this.notificationModel.updateMany(
              { employeeId: new Types.ObjectId(employeeId), read: false },
              { $set: { read: true } }
          );
          return this.getEmployeeNotifications(employeeId);
        } catch (e) {
        throw e;
        }
    }

    async deleteAllNotifications(employeeId: string) {
        try {
            await this.notificationModel.deleteMany({ employeeId: new Types.ObjectId(employeeId) });
            return employeeId;
        } catch (error) {
            throw new Error('Error deleting notifications: ' + error.message);
        }
    }
}