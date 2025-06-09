import { Test, TestingModule } from '@nestjs/testing';
import { RequestManageController } from './request-manage.controller';

describe('RequestManageController', () => {
  let controller: RequestManageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestManageController],
    }).compile();

    controller = module.get<RequestManageController>(RequestManageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
