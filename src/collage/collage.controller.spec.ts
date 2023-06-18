import { Test, TestingModule } from '@nestjs/testing';
import { CollageController } from './collage.controller';
import { CollageService } from './collage.service';

describe('CollageController', () => {
  let controller: CollageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollageController],
      providers: [CollageService],
    }).compile();

    controller = module.get<CollageController>(CollageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
