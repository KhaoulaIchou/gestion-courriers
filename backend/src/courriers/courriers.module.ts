import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courrier } from './courrier.entity';
import { CourriersController } from './courriers.controller';
import { CourriersService } from './courriers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Courrier])],
  controllers: [CourriersController],
  providers: [CourriersService],
})
export class CourriersModule {}