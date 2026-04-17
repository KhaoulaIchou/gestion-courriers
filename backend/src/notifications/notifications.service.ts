import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "./notification.entity";
import { Courrier } from "../courriers/courrier.entity";

@Injectable()
export class NotificationsService {
  private readonly reminderDays = 3;

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Courrier)
    private readonly courrierRepository: Repository<Courrier>,
  ) {}

  async create(data: Partial<Notification>): Promise<Notification> {
    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }

  async createIfNotExists(data: Partial<Notification>): Promise<Notification | null> {
    if (data.notificationKey) {
      const existing = await this.notificationRepository.findOne({
        where: { notificationKey: data.notificationKey },
      });

      if (existing) {
        return existing;
      }
    }

    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }

  private normalizeDate(dateValue: string | Date): Date {
    const date = new Date(dateValue);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  async generateDeadlineNotifications() {
    const courriers = await this.courrierRepository.find();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const courrier of courriers) {
      if (!courrier.dateLimiteReponse) continue;
      if (courrier.statut === "Traité") continue;

      const deadline = this.normalizeDate(courrier.dateLimiteReponse);
      const diffInMs = deadline.getTime() - today.getTime();
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays < 0) {
        await this.createIfNotExists({
          title: "Délai expiré",
          message: `Le délai de réponse du courrier ${courrier.reference} est déjà expiré.`,
          type: "danger",
          notificationKey: `courrier-${courrier.id}-expired`,
          courrierId: courrier.id,
          isRead: false,
        });
      } else if (diffInDays <= this.reminderDays) {
        const suffix =
          diffInDays === 0
            ? "aujourd’hui"
            : diffInDays === 1
              ? "dans 1 jour"
              : `dans ${diffInDays} jours`;

        await this.createIfNotExists({
          title: "Rappel de délai",
          message: `Le délai de réponse du courrier ${courrier.reference} expire ${suffix}.`,
          type: "warning",
          notificationKey: `courrier-${courrier.id}-warning`,
          courrierId: courrier.id,
          isRead: false,
        });
      }
    }
  }

  async findAll(): Promise<Notification[]> {
    await this.generateDeadlineNotifications();

    return this.notificationRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async markAsRead(id: number) {
    await this.notificationRepository.update(id, { isRead: true });
    return { message: "Notification marquée comme lue" };
  }
}