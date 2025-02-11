import { Test, TestingModule } from '@nestjs/testing';
import { RemittancesController } from './remittances.controller';
import { RemittancesService } from './remittances.service';

describe('RemittancesController', () => {
  let controller: RemittancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemittancesController],
      providers: [RemittancesService],
    }).compile();

    controller = module.get<RemittancesController>(RemittancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
