import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';
import { Ingredient } from '../entities/ingredient.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";

@Injectable()
export class IngredientService {

  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>
  ){}

  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    try{
      const data = new Ingredient();        
      Object.assign(data, createIngredientDto)

      const response = await this.ingredientRepository.save(data);
      return response;
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

  async findAll(): Promise<Ingredient[]>{
    try{
        const response = await this.ingredientRepository.find();
        return response;
    }
    catch(error){
        console.log(error);
        return null;
    }
  }

  async findById(id: string): Promise<Ingredient> {
    try{
      const response = await this.ingredientRepository.findOne({ where: { id } });
      return response;
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

  async findByNom(nom: string): Promise<Ingredient[]> {
    try{
      const response = await this.ingredientRepository.find({ where: { nom: Like(`%${nom}%`) } });
      return response;
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto): Promise<Ingredient> {
    try{
      const data = new Ingredient();
      Object.assign(data, updateIngredientDto)

      await this.ingredientRepository.update(id, data);
      const response = await this.ingredientRepository.findOne({ where: { id } });
      return response;
    }
    catch(error){
      console.log(error);
      return null;
    }
  }

  async delete(id: string): Promise<Ingredient> {
    try{
      const response = await this.ingredientRepository.findOne({ where: { id } });
      await this.ingredientRepository.delete(id);
      return response;
    }
    catch(error){
      console.log(error);
      return null;
    }
  }
}
