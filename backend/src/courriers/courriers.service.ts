import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Courrier } from './courrier.entity';

@Injectable()
export class CourriersService {
  constructor(
    @InjectRepository(Courrier)
    private readonly courrierRepository: Repository<Courrier>,
  ) {}

  async findAll(): Promise<Courrier[]> {
    return this.courrierRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: Partial<Courrier>): Promise<Courrier> {
    const courrier = this.courrierRepository.create(data);
    return this.courrierRepository.save(courrier);
  }
}