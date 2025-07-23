import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceRecordService } from './attendance.service';
import { BaseResponse } from 'src/interfaces/response/base.response';
import { BadRequestException } from '@nestjs/common';

describe('AttendanceController', () => {
  let controller: AttendanceController;
  let service: AttendanceRecordService;

  const mockService = {
    findByEmployeeIdToday: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    searchAttendance: jest.fn(),
    getWeeklyAttendance: jest.fn(),
    getMonthlyAttendance: jest.fn(),
    getAttendanceByEmployee: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        { provide: AttendanceRecordService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<AttendanceController>(AttendanceController);
    service = module.get<AttendanceRecordService>(AttendanceRecordService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkIn', () => {
    it('should create attendance if not exists', async () => {
      mockService.findByEmployeeIdToday.mockResolvedValueOnce(null);
      mockService.create.mockResolvedValueOnce({ id: 1 });
      const req = { user: { employeeId: 'emp1' } };
      const res = await controller.checkIn(req);
      expect(mockService.findByEmployeeIdToday).toHaveBeenCalledWith('emp1');
      expect(mockService.create).toHaveBeenCalled();
      expect(res).toBeInstanceOf(BaseResponse);
    });
    it('should throw if attendance exists', async () => {
      mockService.findByEmployeeIdToday.mockResolvedValueOnce({ id: 1 });
      const req = { user: { employeeId: 'emp1' } };
      await expect(controller.checkIn(req)).rejects.toThrow(BadRequestException);
    });
  });

  describe('checkOut', () => {
    it('should update attendance if exists', async () => {
      mockService.findByEmployeeIdToday.mockResolvedValueOnce({ id: 1, firstCheckIn: new Date() });
      mockService.update.mockResolvedValueOnce({ id: 1 });
      const req = { user: { employeeId: 'emp1' } };
      const res = await controller.checkOut(req);
      expect(mockService.findByEmployeeIdToday).toHaveBeenCalledWith('emp1');
      expect(mockService.update).toHaveBeenCalled();
      expect(res).toBeInstanceOf(BaseResponse);
    });
    it('should throw if no attendance found', async () => {
      mockService.findByEmployeeIdToday.mockResolvedValueOnce(null);
      const req = { user: { employeeId: 'emp1' } };
      await expect(controller.checkOut(req)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getTodayAttendance', () => {
    it('should return today attendance if exists', async () => {
      mockService.findByEmployeeIdToday.mockResolvedValueOnce({ id: 1 });
      const req = { user: { employeeId: 'emp1' } };
      const res = await controller.getTodayAttendance(req);
      expect(res).toBeInstanceOf(BaseResponse);
    });
    it('should return null if not found', async () => {
      mockService.findByEmployeeIdToday.mockResolvedValueOnce(null);
      const req = { user: { employeeId: 'emp1' } };
      const res = await controller.getTodayAttendance(req);
      expect(res.data).toBeNull();
    });
  });

  describe('searchAttendance', () => {
    it('should search attendance', async () => {
      mockService.searchAttendance.mockResolvedValueOnce([]);
      const res = await controller.searchAttendance({});
      expect(res).toBeInstanceOf(BaseResponse);
    });
  });

  describe('getWeeklyAttendance', () => {
    it('should get weekly attendance', async () => {
      mockService.getWeeklyAttendance.mockResolvedValueOnce([]);
      const req = { user: { employeeId: 'emp1' } };
      const res = await controller.getWeeklyAttendance(req, '2024-01-01');
      expect(res).toBeInstanceOf(BaseResponse);
    });
  });

  describe('getMonthlyAttendance', () => {
    it('should get monthly attendance', async () => {
      mockService.getMonthlyAttendance.mockResolvedValueOnce([]);
      const req = { user: { employeeId: 'emp1' } };
      const res = await controller.getMonthlyAttendance(req, '2024', '6');
      expect(res).toBeInstanceOf(BaseResponse);
    });
  });

  describe('getAttendanceByEmployee', () => {
    it('should get attendance by employee', async () => {
      mockService.getAttendanceByEmployee.mockResolvedValueOnce([]);
      const res = await controller.getAttendanceByEmployee('emp1', '2024-01-01', '2024-01-31');
      expect(res).toBeInstanceOf(BaseResponse);
    });
  });

  describe('findAll', () => {
    it('should return all attendance records', async () => {
      mockService.findAll.mockResolvedValueOnce([]);
      const res = await controller.findAll();
      expect(res).toBeInstanceOf(BaseResponse);
    });
  });

  describe('findOne', () => {
    it('should return one attendance record', async () => {
      mockService.findOne.mockResolvedValueOnce({ id: 1 });
      const res = await controller.findOne('1');
      expect(mockService.findOne).toHaveBeenCalledWith(1);
      expect(res).toEqual({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update attendance record', async () => {
      mockService.update.mockResolvedValueOnce({ id: 1 });
      const res = await controller.update('1', {});
      expect(mockService.update).toHaveBeenCalledWith(1, {});
      expect(res).toEqual({ id: 1 });
    });
  });

  describe('remove', () => {
    it('should remove attendance record', async () => {
      mockService.remove.mockResolvedValueOnce({ id: 1 });
      const res = await controller.remove('1');
      expect(mockService.remove).toHaveBeenCalledWith(1);
      expect(res).toEqual({ id: 1 });
    });
  });
});
