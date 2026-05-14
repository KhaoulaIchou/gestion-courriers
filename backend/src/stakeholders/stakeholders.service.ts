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
        categorie: "ASC",
        entiteParent: "ASC",
        nom: "ASC",
      },
    });
  }

  async create(data: Partial<Stakeholder>): Promise<Stakeholder> {
    const stakeholder = this.stakeholderRepository.create({
      nom: data.nom?.trim(),
      categorie: data.categorie?.trim(),
      entiteParent: data.entiteParent?.trim() || null,
      ville: data.ville?.trim() || null,
      email: data.email?.trim() || null,
      telephone: data.telephone?.trim() || null,
      adresse: data.adresse?.trim() || null,
      isActive: data.isActive ?? true,
    });

    return this.stakeholderRepository.save(stakeholder);
  }
}