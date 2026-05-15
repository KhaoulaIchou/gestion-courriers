import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { StakeholdersService } from "./stakeholders.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("stakeholders")
export class StakeholdersController {
  constructor(private readonly stakeholdersService: StakeholdersService) {}

  @Get()
  async findAll() {
    return this.stakeholdersService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.stakeholdersService.create(body);
  }
}