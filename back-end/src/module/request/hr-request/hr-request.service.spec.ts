import { Test, TestingModule } from '@nestjs/testing';
import { HrRequestService } from './hr-request.service';

describe('HrRequestService', () => {
  let service: HrRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HrRequestService],
    }).compile();

    service = module.get<HrRequestService>(HrRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
