import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Courrier } from "./courrier.entity";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class CourriersService {
  constructor(
    @InjectRepository(Courrier)
    private readonly courrierRepository: Repository<Courrier>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(): Promise<Courrier[]> {
    return this.courrierRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async create(data: Partial<Courrier>): Promise<Courrier> {
    const courrier = this.courrierRepository.create(data);
    const savedCourrier = await this.courrierRepository.save(courrier);

    await this.notificationsService.create({
      title: "Nouveau courrier",
      message: `Le courrier ${savedCourrier.reference} a été ajouté.`,
      type: "success",
      notificationKey: null,
      courrierId: savedCourrier.id,
      isRead: false,
    });

    return savedCourrier;
  }
}