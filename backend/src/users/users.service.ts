import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { hash } from "bcryptjs";
import { User } from "./user.entity";

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.ensureDefaultAdmin();
  }

  async ensureDefaultAdmin() {
    const username =
      this.configService.get<string>("ADMIN_USERNAME") || "admin";
    const password =
      this.configService.get<string>("ADMIN_PASSWORD") || "admin123";

    const existing = await this.usersRepository.findOne({
      where: { username },
    });

    if (existing) return;

    const passwordHash = await hash(password, 10);

    const admin = this.usersRepository.create({
      username,
      passwordHash,
      role: "admin",
      isActive: true,
    });

    await this.usersRepository.save(admin);
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOne({
      where: { username, isActive: true },
    });
  }

  async findById(id: number) {
    return this.usersRepository.findOne({
      where: { id, isActive: true },
    });
  }
}