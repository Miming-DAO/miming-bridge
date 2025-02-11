import { Test, TestingModule } from '@nestjs/testing';
import { ExecuteRemittanceController } from './execute-remittance.controller';
import { ExecuteRemittanceService } from './execute-remittance.service';

describe('ExecuteRemittanceController', () => {
  let controller: ExecuteRemittanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExecuteRemittanceController],
      providers: [ExecuteRemittanceService],
    }).compile();

    controller = module.get<ExecuteRemittanceController>(ExecuteRemittanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
