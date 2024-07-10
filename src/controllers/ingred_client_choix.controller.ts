import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IngredClientChoixService } from '../services/ingred_client_choix.service';
import { CreateIngredClientChoixDto } from '../dto/create-ingred_client_choix.dto';
import { UpdateIngredClientChoixDto } from '../dto/update-ingred_client_choix.dto';

@Controller('ingred-client-choix')
export class IngredClientChoixController {
  constructor(private readonly ingredClientChoixService: IngredClientChoixService) {}

  @Post()
  create(@Body() createIngredClientChoixDto: CreateIngredClientChoixDto) {
    return this.ingredClientChoixService.create(createIngredClientChoixDto);
  }

  @Get()
  findAll() {
    return this.ingredClientChoixService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredClientChoixService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIngredClientChoixDto: CreateIngredClientChoixDto) {
    return this.ingredClientChoixService.update(id, updateIngredClientChoixDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredClientChoixService.delete(id);
  }
}
