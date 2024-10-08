import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Headers,
  Query,
} from '@nestjs/common';
import { NourritureService } from '../services/nourriture.service';
import { NourritureToEntity } from 'src/dto/nourriture.dto';
import { NourritureFromEntity } from 'src/dto/nourriture.dto';

@Controller('nourritures')
export class NourritureController {
  constructor(private readonly nourritureService: NourritureService) {}

  @Post()
  create(
    @Body() nourriture: NourritureToEntity,
    @Headers('access_token') access_token: string,
  ): Promise<NourritureFromEntity> {
    return this.nourritureService.create(nourriture, access_token);
  }

  @Get()
  findAll(): Promise<NourritureFromEntity[]> {
    return this.nourritureService.findAll();
  }

  @Get('/byid/:id')
  findById(@Param('id') id: string): Promise<NourritureFromEntity> {
    return this.nourritureService.findById(id);
  }

  @Get('/byname/:name')
  findByNom(@Param('name') name: string): Promise<NourritureFromEntity[]> {
    return this.nourritureService.findByNom(name);
  }

  @Get('/bycategorie/:categorie')
  findByCategorie(
    @Param('categorie') categorie: string,
  ): Promise<NourritureFromEntity[]> {
    return this.nourritureService.findByCategorie(categorie);
  }

  @Get('/search')
  async searchNourriture(
    @Query('nom') nom?: string,
    @Query('categorie') categorie?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sortBy') sortBy?: 'alphabetic' | 'price',
    @Query('sortDirection') sortDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<NourritureFromEntity[]> {
    return this.nourritureService.searchNourriture(
      nom,
      categorie,
      minPrice,
      maxPrice,
      sortBy,
      sortDirection,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() nourriture: NourritureToEntity,
    @Headers('access_token') access_token: string,
  ): Promise<NourritureFromEntity> {
    return this.nourritureService.update(id, nourriture, access_token);
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Headers('access_token') access_token: string,
  ): Promise<NourritureFromEntity> {
    return this.nourritureService.delete(id, access_token);
  }
}
