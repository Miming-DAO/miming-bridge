import { Test, TestingModule } from '@nestjs/testing';
import { USDTService } from './usdt.service';

describe('UsdtService', () => {
  let service: USDTService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [USDTService],
    }).compile();

    service = module.get<USDTService>(USDTService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
