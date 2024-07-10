import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { OrganisateurService } from '../services/organisateur.service';
import { CreateOrganisateurDto } from '../dto/create-organisateur.dto';
import { UpdateOrganisateurDto } from '../dto/update-organisateur.dto';
import { Organisateur } from '../entities/organisateur.entity';

@Controller('organisateurs')
export class OrganisateurController {
  constructor(private readonly organisateurService: OrganisateurService) {}

  @Post()
  create(@Body() organisateur: UpdateOrganisateurDto): Promise<Organisateur> {
    return this.organisateurService.create(organisateur);
  }

  @Get()
  findAll(): Promise<CreateOrganisateurDto[]> {
    return this.organisateurService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CreateOrganisateurDto> {
    return this.organisateurService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() organisateur: UpdateOrganisateurDto): Promise<Organisateur> {
    return this.organisateurService.update(id, organisateur);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Organisateur> {
    return this.organisateurService.remove(id);
  }
}
