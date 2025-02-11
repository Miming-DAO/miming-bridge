import { Test, TestingModule } from '@nestjs/testing';
import { LiquidateXon20Controller } from './liquidate-xon20.controller';
import { LiquidateXon20Service } from './liquidate-xon20.service';

describe('LiquidateXon20Controller', () => {
  let controller: LiquidateXon20Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiquidateXon20Controller],
      providers: [LiquidateXon20Service],
    }).compile();

    controller = module.get<LiquidateXon20Controller>(LiquidateXon20Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
