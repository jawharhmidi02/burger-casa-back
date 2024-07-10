import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { NourritureService } from '../services/nourriture.service';
import { CreateNourritureDto } from '../dto/create-nourriture.dto';
import { UpdateNourritureDto } from '../dto/update-nourriture.dto';
import { Nourriture } from '../entities/nourriture.entity';

@Controller('nourritures')
export class NourritureController {
  constructor(private readonly nourritureService: NourritureService) {}

  @Post()
    create(@Body() nourriture: CreateNourritureDto): Promise<Nourriture>{
        return this.nourritureService.create(nourriture);
    }

    @Get()
    findAll(): Promise<Nourriture[]>{
        return this.nourritureService.findAll();
    }

    @Get('/byid/:id')
    findById(@Param('id') id: string): Promise<Nourriture>{
        return this.nourritureService.findById(id);
    }

    @Get('/byname/:nom')
    findByNom(@Param('nom') nom: string): Promise<Nourriture[]>{
        return this.nourritureService.findByNom(nom);
    }

    @Get('/bycategorie/:categorie')
    findByCategorie(@Param('categorie') categorie: string): Promise<Nourriture[]>{
        return this.nourritureService.findByCategorie(categorie);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() nourriture: UpdateNourritureDto): Promise<Nourriture>{
        return this.nourritureService.update(id, nourriture);
    }

    @Delete(':id')
    delete(@Param('id') id: string): Promise<Nourriture>{
        return this.nourritureService.delete(id);
    }
}
