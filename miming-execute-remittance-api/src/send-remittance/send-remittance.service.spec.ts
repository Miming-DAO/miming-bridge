import { Test, TestingModule } from '@nestjs/testing';
import { SendRemittanceService } from './send-remittance.service';

describe('SendRemittanceService', () => {
  let service: SendRemittanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendRemittanceService],
    }).compile();

    service = module.get<SendRemittanceService>(SendRemittanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
