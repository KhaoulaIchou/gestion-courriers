import { Test, TestingModule } from '@nestjs/testing';
import { CourriersService } from './courriers.service';

describe('CourriersService', () => {
  let service: CourriersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourriersService],
    }).compile();

    service = module.get<CourriersService>(CourriersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
