import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentService } from './department.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let departmentModel: any;
  let accountModel: any;

  const mockDepartmentModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
    populate: jest.fn(),
    save: jest.fn(),
  };
  const mockAccountModel = {
    find: jest.fn(),
    select: jest.fn(),
    populate: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        {
          provide: getModelToken('Departments'),
          useValue: {
            ...mockDepartmentModel,
            find: jest.fn().mockReturnThis(),
            findById: jest.fn().mockReturnThis(),
            findByIdAndUpdate: jest.fn().mockReturnThis(),
            findByIdAndDelete: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getModelToken('Account'),
          useValue: {
            ...mockAccountModel,
            find: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<DepartmentService>(DepartmentService);
    departmentModel = module.get(getModelToken('Departments'));
    accountModel = module.get(getModelToken('Account'));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllManagers', () => {
    it('should return all managers with code manager', async () => {
      const mockManagers = [
        { role: { code: 'manager' } },
        { role: { code: 'employee' } },
      ];
      accountModel.find.mockReturnThis();
      accountModel.select.mockReturnThis();
      accountModel.populate.mockReturnThis();
      accountModel.exec.mockResolvedValue(mockManagers);
      const result = await service.findAllManagers();
      expect(result).toEqual([{ role: { code: 'manager' } }]);
    });
  });

  describe('create', () => {
    it('should create and save department', async () => {
      const saveMock = jest.fn().mockResolvedValue('created');
      service['departmentModel'] = function (data: any) { return { save: saveMock }; } as any;
      const result = await service.create({ name: 'test' });
      expect(result).toEqual('created');
    });
  });

  describe('findAll', () => {
    it('should return all departments', async () => {
      departmentModel.find.mockReturnThis();
      departmentModel.populate.mockReturnThis();
      departmentModel.exec.mockResolvedValue(['dep1']);
      const result = await service.findAll();
      expect(result).toEqual(['dep1']);
    });
  });

  describe('findOne', () => {
    it('should throw if id invalid', async () => {
      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
    it('should throw if not found', async () => {
      departmentModel.findById.mockReturnThis();
      departmentModel.populate.mockReturnThis();
      departmentModel.exec.mockResolvedValue(null);
      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
    it('should return department if found', async () => {
      departmentModel.findById.mockReturnThis();
      departmentModel.populate.mockReturnThis();
      departmentModel.exec.mockResolvedValue('dep1');
      const result = await service.findOne('507f1f77bcf86cd799439011');
      expect(result).toEqual('dep1');
    });
  });

  describe('update', () => {
    it('should throw if id invalid', async () => {
      await expect(service.update('invalid', {})).rejects.toThrow(NotFoundException);
    });
    it('should throw if not found', async () => {
      departmentModel.findByIdAndUpdate.mockReturnThis();
      departmentModel.populate.mockReturnThis();
      departmentModel.exec.mockResolvedValue(null);
      await expect(service.update('507f1f77bcf86cd799439011', {})).rejects.toThrow(NotFoundException);
    });
    it('should return updated department', async () => {
      departmentModel.findByIdAndUpdate.mockReturnThis();
      departmentModel.populate.mockReturnThis();
      departmentModel.exec.mockResolvedValue('updated');
      const result = await service.update('507f1f77bcf86cd799439011', {});
      expect(result).toEqual('updated');
    });
  });

  describe('remove', () => {
    it('should throw if id invalid', async () => {
      await expect(service.remove('invalid')).rejects.toThrow(NotFoundException);
    });
    it('should throw if not found', async () => {
      departmentModel.findByIdAndDelete.mockReturnThis();
      departmentModel.exec.mockResolvedValue(null);
      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
    it('should return deleted department', async () => {
      departmentModel.findByIdAndDelete.mockReturnThis();
      departmentModel.exec.mockResolvedValue('deleted');
      const result = await service.remove('507f1f77bcf86cd799439011');
      expect(result).toEqual('deleted');
    });
  });

  describe('findAllEmployeesWithFullName', () => {
    it('should return all employees with full name', async () => {
      accountModel.find.mockReturnThis();
      accountModel.select.mockReturnThis();
      accountModel.populate.mockReturnThis();
      accountModel.exec.mockResolvedValue(['emp1']);
      const result = await service.findAllEmployeesWithFullName();
      expect(result).toEqual(['emp1']);
    });
  });
}); 