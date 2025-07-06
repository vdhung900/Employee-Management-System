import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceRecordService } from "./attendance.service";

describe("AttendanceService", () => {
  let service: AttendanceRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceRecordService],
    }).compile();

    service = module.get<AttendanceRecordService>(AttendanceRecordService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
