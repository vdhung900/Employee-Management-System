import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { BaseResponse } from '../../interfaces/response/base.response';

describe('DepartmentController', () => {
  let controller: DepartmentController;
  let service: DepartmentService;

  const mockService = {
    findAllManagers: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findAllEmployeesWithFullName: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentController],
      providers: [
        { provide: DepartmentService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<DepartmentController>(DepartmentController);
    service = module.get<DepartmentService>(DepartmentService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getManagers', () => {
    it('should return all managers', async () => {
      mockService.findAllManagers.mockResolvedValueOnce(['manager1']);
      const res = await controller.getManagers();
      expect(res).toBeInstanceOf(BaseResponse);
      expect(mockService.findAllManagers).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a department', async () => {
      mockService.create.mockResolvedValueOnce('created');
      const res = await controller.create({ name: 'test' }, { user: { id: 'admin' } });
      expect(res).toBeInstanceOf(BaseResponse);
      expect(mockService.create).toHaveBeenCalledWith({ name: 'test' });
    });
  });

  describe('findAll', () => {
    it('should return all departments', async () => {
      mockService.findAll.mockResolvedValueOnce(['dep1']);
      const res = await controller.findAll();
      expect(res).toBeInstanceOf(BaseResponse);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('getAllEmployees', () => {
    it('should return all employees', async () => {
      mockService.findAllEmployeesWithFullName.mockResolvedValueOnce(['emp1']);
      const res = await controller.getAllEmployees();
      expect(res).toBeInstanceOf(BaseResponse);
      expect(mockService.findAllEmployeesWithFullName).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one department', async () => {
      mockService.findOne.mockResolvedValueOnce('dep1');
      const res = await controller.findOne('1');
      expect(res).toBeInstanceOf(BaseResponse);
      expect(mockService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a department', async () => {
      mockService.update.mockResolvedValueOnce('updated');
      const res = await controller.update('1', { name: 'test' }, { user: { id: 'admin' } });
      expect(res).toBeInstanceOf(BaseResponse);
      expect(mockService.update).toHaveBeenCalledWith('1', { name: 'test' });
    });
  });

  describe('remove', () => {
    it('should remove a department', async () => {
      mockService.remove.mockResolvedValueOnce('deleted');
      const res = await controller.remove('1', { user: { id: 'admin' } });
      expect(res).toBeInstanceOf(BaseResponse);
      expect(mockService.remove).toHaveBeenCalledWith('1');
    });
  });
}); 