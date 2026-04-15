import { Body, Controller, Get, Post } from '@nestjs/common';
import { CourriersService } from './courriers.service';

@Controller('courriers')
export class CourriersController {
  constructor(private readonly courriersService: CourriersService) {}

  @Get()
  async findAll() {
    return this.courriersService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.courriersService.create(body);
  }
}