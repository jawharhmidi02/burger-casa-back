import { Nourriture } from "src/entities/nourriture";
import { NourritureService } from "src/services/nourriture";
import { Body, Controller, Post, Get, Param, Put, Delete } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Controller('nourritures')
export class NourritureController{
    
    constructor(
        private readonly nourritureService: NourritureService
    ){}

    @Post()
    create(@Body() nourriture: Nourriture): Promise<Nourriture>{
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
    update(@Param('id') id: string, @Body() nourriture: Nourriture): Promise<Nourriture>{
        return this.nourritureService.update(id, nourriture);
    }

    @Delete(':id')
    delete(@Param('id') id: string): Promise<Nourriture>{
        return this.nourritureService.delete(id);
    }

}

