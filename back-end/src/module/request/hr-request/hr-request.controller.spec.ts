import { Test, TestingModule } from '@nestjs/testing';
import { HrRequestController } from './hr-request.controller';

describe('HrRequestController', () => {
  let controller: HrRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HrRequestController],
    }).compile();

    controller = module.get<HrRequestController>(HrRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
