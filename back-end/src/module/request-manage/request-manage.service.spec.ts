import { Test, TestingModule } from '@nestjs/testing';
import { RequestManageService } from './request-manage.service';

describe('RequestManageService', () => {
  let service: RequestManageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestManageService],
    }).compile();

    service = module.get<RequestManageService>(RequestManageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
