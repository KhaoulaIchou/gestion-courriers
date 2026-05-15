import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Courrier } from "./courrier.entity";
import { CourriersService } from "./courriers.service";
import { CourriersController } from "./courriers.controller";
import { NotificationsModule } from "../notifications/notifications.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Courrier]),
    NotificationsModule,
    AuthModule,
  ],
  providers: [CourriersService],
  controllers: [CourriersController],
  exports: [CourriersService],
})
export class CourriersModule {}