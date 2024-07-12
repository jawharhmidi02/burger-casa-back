import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { IngredClientChoixService } from '../services/ingred_client_choix.service';
import { IngredClientChoixToEntity } from 'src/dto/ingred_client_choix.dto';
import { IngredClientChoixFromEntity } from 'src/dto/ingred_client_choix.dto';

@Controller('ingred-client-choix')
export class IngredClientChoixController {
  constructor(private readonly ingredClientChoixService: IngredClientChoixService) {}

  @Post()
  create(@Body() ingredChoixClient: IngredClientChoixToEntity): Promise<IngredClientChoixFromEntity> {
    return this.ingredClientChoixService.create(ingredChoixClient);
  }

  @Get()
  findAll(): Promise<IngredClientChoixFromEntity[]> {
    return this.ingredClientChoixService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IngredClientChoixFromEntity> {
    return this.ingredClientChoixService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() ingredChoixClient: IngredClientChoixToEntity): Promise<IngredClientChoixFromEntity> {
    return this.ingredClientChoixService.update(id, ingredChoixClient);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IngredClientChoixFromEntity> {
    return this.ingredClientChoixService.delete(id);
  }
}
