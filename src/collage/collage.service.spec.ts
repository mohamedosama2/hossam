import { Test, TestingModule } from '@nestjs/testing';
import { CollageService } from './collage.service';

describe('CollageService', () => {
  let service: CollageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollageService],
    }).compile();

    service = module.get<CollageService>(CollageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
