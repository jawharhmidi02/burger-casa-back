import { IngredientService } from "src/services/ingredient";
import { Ingredient } from "src/entities/ingredient";
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

@Controller('ingredients')
export class IngredientController{
    constructor(private readonly ingredientService: IngredientService) {}

    @Post()
    create(@Body() ingredient: Ingredient): Promise<Ingredient> {
        return this.ingredientService.create(ingredient);
    }
    
    @Get()
    findAll(): Promise<Ingredient[]> {
        return this.ingredientService.findAll();
    }

    @Get('/byid/:id')
    findById(@Param('id') id: string): Promise<Ingredient> {
        return this.ingredientService.findById(id);
    }

    @Get('/byname/:nom')
    findByNom(@Param('nom') nom: string): Promise<Ingredient[]> {
        return this.ingredientService.findByNom(nom);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() ingredient: Ingredient): Promise<Ingredient> {
        return this.ingredientService.update(id, ingredient);
    }

    @Delete(':id')
    delete(@Param('id') id: string): Promise<Ingredient> {
        return this.ingredientService.delete(id);
    }

}