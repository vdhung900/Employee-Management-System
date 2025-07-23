import { Test, TestingModule } from '@nestjs/testing';
import { BenefitsController } from './benefits.controller';
import { BenefitsService } from './benefits.service';

describe('BenefitsController', () => {
  let controller: BenefitsController;
  let service: BenefitsService;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BenefitsController],
      providers: [
        { provide: BenefitsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<BenefitsController>(BenefitsController);
    service = module.get<BenefitsService>(BenefitsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all benefits', async () => {
      mockService.findAll.mockResolvedValueOnce(['benefit1']);
      const res = await controller.findAll();
      expect(res).toEqual({ success: true, data: ['benefit1'] });
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one benefit', async () => {
      mockService.findOne.mockResolvedValueOnce('benefit1');
      const res = await controller.findOne('1');
      expect(res).toEqual({ success: true, data: 'benefit1' });
      expect(mockService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a benefit', async () => {
      mockService.create.mockResolvedValueOnce('created');
      const req = { user: { id: 'user1' } };
      const res = await controller.create({ name: 'test' }, req as any);
      expect(res).toEqual({ success: true, data: 'created' });
      expect(mockService.create).toHaveBeenCalledWith({ name: 'test' }, req.user);
    });
  });

  describe('update', () => {
    it('should update a benefit', async () => {
      mockService.update.mockResolvedValueOnce('updated');
      const req = { user: { id: 'user1' } };
      const res = await controller.update('1', { name: 'test' }, req as any);
      expect(res).toEqual({ success: true, data: 'updated' });
      expect(mockService.update).toHaveBeenCalledWith('1', { name: 'test' }, req.user);
    });
  });

  describe('delete', () => {
    it('should delete a benefit', async () => {
      mockService.delete.mockResolvedValueOnce('deleted');
      const req = { user: { id: 'user1' } };
      const res = await controller.delete('1', req as any);
      expect(res).toEqual({ success: true, data: 'deleted' });
      expect(mockService.delete).toHaveBeenCalledWith('1', req.user);
    });
  });
}); 