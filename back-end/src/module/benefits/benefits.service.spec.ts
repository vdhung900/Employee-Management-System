import { Test, TestingModule } from '@nestjs/testing';
import { BenefitsService } from './benefits.service';
import { getModelToken } from '@nestjs/mongoose';

describe('BenefitsService', () => {
  let service: BenefitsService;
  let model: any;

  const mockModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    db: {
      collection: jest.fn(),
    },
    exec: jest.fn(),
    populate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BenefitsService,
        {
          provide: getModelToken('Benefits'),
          useValue: {
            ...mockModel,
            find: jest.fn().mockReturnThis(),
            findById: jest.fn().mockReturnThis(),
            findByIdAndUpdate: jest.fn().mockReturnThis(),
            findByIdAndDelete: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn(),
            create: jest.fn(),
            db: { collection: jest.fn() },
          },
        },
      ],
    }).compile();
    service = module.get<BenefitsService>(BenefitsService);
    model = module.get(getModelToken('Benefits'));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all benefits', async () => {
      model.find.mockReturnThis();
      model.populate.mockReturnThis();
      model.exec.mockResolvedValue(['benefit1']);
      const result = await service.findAll();
      expect(result).toEqual(['benefit1']);
    });
  });

  describe('findOne', () => {
    it('should return one benefit', async () => {
      model.findById.mockReturnThis();
      model.populate.mockReturnThis();
      model.exec.mockResolvedValue('benefit1');
      const result = await service.findOne('1');
      expect(result).toEqual('benefit1');
    });
  });

  describe('create', () => {
    it('should create a benefit', async () => {
      model.create.mockResolvedValue('created');
      const result = await service.create({ name: 'test' }, { id: 'user1' });
      expect(result).toEqual('created');
    });
    it('should handle applyAll', async () => {
      const departments = [{ _id: 1 }, { _id: 2 }];
      model.db.collection.mockReturnValue({ find: () => ({ toArray: () => departments }) });
      model.create.mockResolvedValue('created');
      const result = await service.create({ name: 'test', applyAll: true }, { id: 'user1' });
      expect(result).toEqual('created');
    });
  });

  describe('update', () => {
    it('should update a benefit', async () => {
      model.findByIdAndUpdate.mockReturnThis();
      model.populate.mockReturnThis();
      model.exec.mockResolvedValue('updated');
      const result = await service.update('1', { name: 'test' }, { id: 'user1' });
      expect(result).toEqual('updated');
    });
    it('should handle applyAll', async () => {
      const departments = [{ _id: 1 }, { _id: 2 }];
      model.db.collection.mockReturnValue({ find: () => ({ toArray: () => departments }) });
      model.findByIdAndUpdate.mockReturnThis();
      model.populate.mockReturnThis();
      model.exec.mockResolvedValue('updated');
      const result = await service.update('1', { name: 'test', applyAll: true }, { id: 'user1' });
      expect(result).toEqual('updated');
    });
  });

  describe('delete', () => {
    it('should delete a benefit', async () => {
      model.findByIdAndDelete.mockReturnThis();
      model.exec.mockResolvedValue('deleted');
      const result = await service.delete('1', { id: 'user1' });
      expect(result).toEqual('deleted');
    });
  });
}); 