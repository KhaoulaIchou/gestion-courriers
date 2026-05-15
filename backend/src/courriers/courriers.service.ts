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

  async create(data: Partial<Courrier>, file?: Express.Multer.File): Promise<Courrier> {
    const courrier = this.courrierRepository.create({
      reference: data.reference,
      objet: data.objet,
      expediteur: data.expediteur,
      destinataire: data.destinataire || "",
      type: data.type,
      statut: data.statut || "En cours",
      stakeholderId: data.stakeholderId ? Number(data.stakeholderId) : null,
      dateLimiteReponse: data.dateLimiteReponse || null,
      pdfUrl: file ? `http://localhost:3001/uploads/courriers/${file.filename}` : null,
      pdfFilename: file ? file.originalname : null,
      pdfStorageKey: file ? file.filename : null,
      pdfSize: file ? file.size : null,
    });

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