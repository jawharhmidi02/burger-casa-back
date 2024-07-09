import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { OrganisateurService } from '../services/organisateur';
import { Organisateur } from '../entities/organisateur';

@Controller('organisateurs')
export class OrganisateurController {
  constructor(private readonly organisateurService: OrganisateurService) {}

  @Post()
  create(@Body() organisateur: Organisateur): Promise<Organisateur> {
    return this.organisateurService.create(organisateur);
  }

  @Get()
  findAll(): Promise<Organisateur[]> {
    return this.organisateurService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Organisateur> {
    return this.organisateurService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() organisateur: Organisateur): Promise<Organisateur> {
    return this.organisateurService.update(id, organisateur);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Organisateur> {
    return this.organisateurService.remove(id);
  }
}
