import { Test, TestingModule } from '@nestjs/testing';
import { StakeholdersService } from './stakeholders.service';

describe('StakeholdersService', () => {
  let service: StakeholdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StakeholdersService],
    }).compile();

    service = module.get<StakeholdersService>(StakeholdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
