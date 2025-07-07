import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceReviewService } from './performance-review.service';

describe('PerformanceReviewService', () => {
  let service: PerformanceReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerformanceReviewService],
    }).compile();

    service = module.get<PerformanceReviewService>(PerformanceReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
