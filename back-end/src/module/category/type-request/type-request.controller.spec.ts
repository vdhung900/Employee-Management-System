import { Test, TestingModule } from '@nestjs/testing';
import { TypeRequestController } from './type-request.controller';

describe('TypeRequestController', () => {
  let controller: TypeRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeRequestController],
    }).compile();

    controller = module.get<TypeRequestController>(TypeRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
