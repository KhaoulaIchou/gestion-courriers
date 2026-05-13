import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Stakeholder } from "./stakeholder.entity";
import { StakeholdersService } from "./stakeholders.service";
import { StakeholdersController } from "./stakeholders.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Stakeholder])],
  controllers: [StakeholdersController],
  providers: [StakeholdersService],
  exports: [StakeholdersService],
})
export class StakeholdersModule {}
