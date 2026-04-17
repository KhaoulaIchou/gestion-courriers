import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courrier } from './courrier.entity';
import { CourriersController } from './courriers.controller';
import { CourriersService } from './courriers.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Courrier]),
    NotificationsModule,
  ],
  controllers: [CourriersController],
  providers: [CourriersService],
})
export class CourriersModule {}