import { Test, TestingModule } from '@nestjs/testing';
import { ReconcileService } from './reconcile.service';

describe('ReconcileService', () => {
  let service: ReconcileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReconcileService],
    }).compile();

    service = module.get<ReconcileService>(ReconcileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
