import { Test, TestingModule } from '@nestjs/testing';
import { AdminAccountController } from './admin_account.controller';
import { AdminAccountService } from './admin_account.service';

describe('AdminAccountController', () => {
  let controller: AdminAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminAccountController],
      providers: [
        {
          provide: AdminAccountService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AdminAccountController>(AdminAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
