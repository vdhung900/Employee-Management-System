import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceRecordService } from './attendance.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';

describe('AttendanceRecordService', () => {
  let service: AttendanceRecordService;
  let model: any;

  const mockModel = {
    save: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    countDocuments: jest.fn(),
    exec: jest.fn(),
    populate: jest.fn(),
    sort: jest.fn(),
    skip: jest.fn(),
    limit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceRecordService,
        {
          provide: getModelToken('AttendanceRecords'),
          useValue: {
            ...mockModel,
            find: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            exec: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<AttendanceRecordService>(AttendanceRecordService);
    model = module.get(getModelToken('AttendanceRecords'));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should save attendance record', async () => {
      const saveMock = jest.fn().mockResolvedValue({ id: 1 });
      jest.spyOn(model, 'constructor').mockImplementation(() => ({ save: saveMock }));
      const dto = { employeeId: 'emp1' };
      service['attendanceRecordModel'] = function () { return { save: saveMock }; } as any;
      const result = await service.create(dto as any);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('findAll', () => {
    it('should return attendance records', async () => {
      model.find.mockReturnThis();
      model.populate.mockReturnThis();
      model.exec.mockResolvedValue([{ id: 1 }]);
      const result = await service.findAll();
      expect(result).toEqual([{ id: 1 }]);
    });
    it('should throw if not found', async () => {
      model.find.mockReturnThis();
      model.populate.mockReturnThis();
      model.exec.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return attendance by id', async () => {
      model.findById.mockResolvedValue({ id: 1 });
      const result = await service.findById(1);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('findByEmployeeIdToday', () => {
    it('should return today attendance', async () => {
      model.findOne.mockResolvedValue({ id: 1 });
      const result = await service.findByEmployeeIdToday('emp1');
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('findOne', () => {
    it('should return attendance by filter', async () => {
      model.findOne.mockResolvedValue({ id: 1 });
      const result = await service.findOne({});
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update attendance', async () => {
      model.findByIdAndUpdate.mockResolvedValue({ id: 1 });
      const result = await service.update(1, {});
      expect(result).toEqual({ id: 1 });
    });
    it('should throw if not found', async () => {
      model.findByIdAndUpdate.mockResolvedValue(null);
      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchAttendance', () => {
    it('should search attendance with pagination', async () => {
      model.find.mockReturnThis();
      model.populate.mockReturnThis();
      model.sort.mockReturnThis();
      model.skip.mockReturnThis();
      model.limit.mockReturnThis();
      model.exec.mockResolvedValue([{ employeeId: 1 }]);
      model.countDocuments.mockResolvedValue(1);
      const result = await service.searchAttendance({});
      expect(result.data).toBeDefined();
      expect(result.pagination).toBeDefined();
    });
  });

  describe('getAttendanceByEmployee', () => {
    it('should get attendance by employee', async () => {
      model.find.mockReturnThis();
      model.populate.mockReturnThis();
      model.sort.mockReturnThis();
      model.exec.mockResolvedValue([{ id: 1 }]);
      const result = await service.getAttendanceByEmployee('emp1');
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('getWeeklyAttendance', () => {
    it('should get weekly attendance', async () => {
      model.find.mockReturnThis();
      model.sort.mockReturnThis();
      model.exec.mockResolvedValue([{ id: 1 }]);
      const result = await service.getWeeklyAttendance('emp1');
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('getMonthlyAttendance', () => {
    it('should get monthly attendance', async () => {
      model.find.mockReturnThis();
      model.sort.mockReturnThis();
      model.exec.mockResolvedValue([{ id: 1 }]);
      const result = await service.getMonthlyAttendance('emp1', 2024, 6);
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('remove', () => {
    it('should remove attendance', () => {
      const result = service.remove(1);
      expect(result).toBe('This action removes a #1 attendance');
    });
  });
});
