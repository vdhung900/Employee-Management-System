import { Test, TestingModule } from '@nestjs/testing';
import { TypeRequestService } from './type-request.service';

describe('TypeRequestService', () => {
  let service: TypeRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeRequestService],
    }).compile();

    service = module.get<TypeRequestService>(TypeRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
