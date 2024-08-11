import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  NourritureCategorieFromEntity,
  NourritureCategorieToEntity,
} from 'src/dto/nourriture_categories.dto';
import { NourritureCategorieService } from 'src/services/nourriture_categories.service';

@Controller('categorie')
export class NourritureCategorieController {
  constructor(
    private readonly nourritureCategorieService: NourritureCategorieService,
  ) {}

  @Post()
  create(
    @Headers('access_token') token: string,
    @Body() nourritureCategorie: NourritureCategorieToEntity,
  ): Promise<NourritureCategorieFromEntity> {
    return this.nourritureCategorieService.create(token, nourritureCategorie);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<any> {
    return this.nourritureCategorieService.findAll(page, limit);
  }

  @Get('/byid/:id')
  findById(@Param('id') id: string): Promise<NourritureCategorieFromEntity> {
    return this.nourritureCategorieService.findById(id);
  }

  @Get('/byname/:name')
  findByName(
    @Param('name') name: string,
  ): Promise<NourritureCategorieFromEntity[]> {
    return this.nourritureCategorieService.findByName(name);
  }

  @Put()
  update(
    @Headers('access_token') access_token: string,
    @Param('id') id: string,
    @Body() nourritureCategorie: NourritureCategorieToEntity,
  ): Promise<NourritureCategorieFromEntity> {
    return this.nourritureCategorieService.update(
      access_token,
      id,
      nourritureCategorie,
    );
  }

  @Delete()
  delete(
    @Headers('access_token') access_token: string,
    @Param('id') id: string,
  ): Promise<NourritureCategorieFromEntity> {
    return this.nourritureCategorieService.delete(access_token, id);
  }
}
