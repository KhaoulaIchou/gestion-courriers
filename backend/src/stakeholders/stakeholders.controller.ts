import { Body, Controller, Get, Post } from "@nestjs/common";
import { StakeholdersService } from "./stakeholders.service";

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