import { Test, TestingModule } from '@nestjs/testing';
import { LiquidateXon20Service } from './liquidate-xon20.service';

describe('LiquidateXon20Service', () => {
  let service: LiquidateXon20Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiquidateXon20Service],
    }).compile();

    service = module.get<LiquidateXon20Service>(LiquidateXon20Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
