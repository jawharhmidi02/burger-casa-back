import { Controller, Get, Post, Body, Headers, Param, Delete, Put } from '@nestjs/common';
import { IngredientService } from '../services/ingredient.service';
import { Ingredient } from '../entities/ingredient.entity';
import { IngredientFromEntity } from 'src/dto/ingredient.dto';
import { IngredientToEntity } from 'src/dto/ingredient.dto';

@Controller('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  create(@Body() ingredient: IngredientToEntity, @Headers('access_token') access_token: string): Promise<IngredientFromEntity> {
    return this.ingredientService.create(ingredient, access_token);
  }

  @Get()
  findAll(): Promise<IngredientFromEntity[]> {
    return this.ingredientService.findAll();
  }

  @Get('/byid/:id')
  findById(@Param('id') id: string): Promise<IngredientFromEntity> {
    return this.ingredientService.findById(id);
  }

  @Get('/byname/:name')
  findByName(@Param('name') name: string): Promise<IngredientFromEntity[]> {
    return this.ingredientService.findByNom(name);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() ingredient: IngredientFromEntity, @Headers('access_token') access_token: string): Promise<IngredientFromEntity> {
    return this.ingredientService.update(id, ingredient, access_token);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('access_token') access_token: string): Promise<IngredientFromEntity> {
    return this.ingredientService.delete(id, access_token);
  }
}
