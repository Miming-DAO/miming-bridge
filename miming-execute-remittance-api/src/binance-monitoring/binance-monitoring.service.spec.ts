import { Test, TestingModule } from '@nestjs/testing';
import { BinanceMonitoringService } from './binance-monitoring.service';

describe('BinanceMonitoringService', () => {
  let service: BinanceMonitoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BinanceMonitoringService],
    }).compile();

    service = module.get<BinanceMonitoringService>(BinanceMonitoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
