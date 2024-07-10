import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { IngredientService } from '../services/ingredient.service';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';
import { Ingredient } from '../entities/ingredient.entity';

@Controller('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  create(@Body() createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    return this.ingredientService.create(createIngredientDto);
  }

  @Get()
  findAll() {
    return this.ingredientService.findAll();
  }

  @Get('/byid/:id')
  findById(@Param('id') id: string) {
    return this.ingredientService.findById(id);
  }

  @Get('/byname/:name')
  findByName(@Param('name') name: string) {
    return this.ingredientService.findByNom(name);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredientService.delete(id);
  }
}
