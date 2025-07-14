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
}