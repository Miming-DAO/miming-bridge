import { Test, TestingModule } from '@nestjs/testing';
import { RemittancesService } from './remittances.service';

describe('RemittancesService', () => {
  let service: RemittancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemittancesService],
    }).compile();

    service = module.get<RemittancesService>(RemittancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
