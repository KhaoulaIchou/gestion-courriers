import { Test, TestingModule } from '@nestjs/testing';
import { StakeholdersController } from './stakeholders.controller';

describe('StakeholdersController', () => {
  let controller: StakeholdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StakeholdersController],
    }).compile();

    controller = module.get<StakeholdersController>(StakeholdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
