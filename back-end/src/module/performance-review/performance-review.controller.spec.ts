import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceReviewController } from './performance-review.controller';
import { PerformanceReviewService } from './performance-review.service';

describe('PerformanceReviewController', () => {
  let controller: PerformanceReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerformanceReviewController],
      providers: [PerformanceReviewService],
    }).compile();

    controller = module.get<PerformanceReviewController>(PerformanceReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
