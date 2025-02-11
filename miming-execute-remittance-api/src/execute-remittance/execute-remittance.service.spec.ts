import { Test, TestingModule } from '@nestjs/testing';
import { ExecuteRemittanceService } from './execute-remittance.service';

describe('ExecuteRemittanceService', () => {
  let service: ExecuteRemittanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExecuteRemittanceService],
    }).compile();

    service = module.get<ExecuteRemittanceService>(ExecuteRemittanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
