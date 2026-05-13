import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Stakeholder } from "./stakeholder.entity";

@Injectable()
export class StakeholdersService {
  constructor(
    @InjectRepository(Stakeholder)
    private readonly stakeholderRepository: Repository<Stakeholder>,
  ) {}

  async findAll(): Promise<Stakeholder[]> {
    return this.stakeholderRepository.find({
      where: { isActive: true },
      order: {
        direction: "ASC",
        service: "ASC",
        nom: "ASC",
      },
    });
  }

  async create(data: Partial<Stakeholder>): Promise<Stakeholder> {
    const stakeholder = this.stakeholderRepository.create(data);
    return this.stakeholderRepository.save(stakeholder);
  }
}