import { Test, TestingModule } from '@nestjs/testing';
import { CourriersController } from './courriers.controller';

describe('CourriersController', () => {
  let controller: CourriersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourriersController],
    }).compile();

    controller = module.get<CourriersController>(CourriersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
