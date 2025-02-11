import { Test, TestingModule } from '@nestjs/testing';
import { SendRemittanceController } from './send-remittance.controller';

describe('SendRemittanceController', () => {
  let controller: SendRemittanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendRemittanceController],
    }).compile();

    controller = module.get<SendRemittanceController>(SendRemittanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
