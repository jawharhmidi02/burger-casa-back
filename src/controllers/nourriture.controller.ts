import { Controller, Get, Post, Body, Put, Param, Delete, Headers } from '@nestjs/common';
import { NourritureService } from '../services/nourriture.service';
import { Nourriture } from '../entities/nourriture.entity';
import { NourritureToEntity } from 'src/dto/nourriture.dto';
import { NourritureFromEntity } from 'src/dto/nourriture.dto';

@Controller('nourritures')
export class NourritureController {
  constructor(private readonly nourritureService: NourritureService) {}

  @Post()
    create(@Body() nourriture: NourritureToEntity, @Headers('access_token') access_token: string): Promise<NourritureFromEntity>{
        return this.nourritureService.create(nourriture, access_token);
    }

    @Get()
    findAll(): Promise<NourritureFromEntity[]>{
        return this.nourritureService.findAll();
    }

    @Get('/byid/:id')
    findById(@Param('id') id: string): Promise<NourritureFromEntity>{
        return this.nourritureService.findById(id);
    }

    @Get('/byname/:nom')
    findByNom(@Param('nom') nom: string): Promise<NourritureFromEntity[]>{
        return this.nourritureService.findByNom(nom);
    }

    @Get('/bycategorie/:categorie')
    findByCategorie(@Param('categorie') categorie: string): Promise<NourritureFromEntity[]>{
        return this.nourritureService.findByCategorie(categorie);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() nourriture: NourritureToEntity, @Headers('access_token') access_token: string): Promise<NourritureFromEntity>{
        return this.nourritureService.update(id, nourriture, access_token);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Headers('access_token') access_token: string): Promise<NourritureFromEntity>{
        return this.nourritureService.delete(id, access_token);
    }
}
