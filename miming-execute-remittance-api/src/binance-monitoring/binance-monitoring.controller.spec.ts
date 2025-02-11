import { Test, TestingModule } from '@nestjs/testing';
import { BinanceMonitoringController } from './binance-monitoring.controller';

describe('BinanceMonitoringController', () => {
  let controller: BinanceMonitoringController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BinanceMonitoringController],
    }).compile();

    controller = module.get<BinanceMonitoringController>(BinanceMonitoringController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
