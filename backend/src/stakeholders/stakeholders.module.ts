import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Stakeholder } from "./stakeholder.entity";
import { StakeholdersController } from "./stakeholders.controller";
import { StakeholdersService } from "./stakeholders.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([Stakeholder]), AuthModule],
  controllers: [StakeholdersController],
  providers: [StakeholdersService],
  exports: [StakeholdersService],
})
export class StakeholdersModule {}