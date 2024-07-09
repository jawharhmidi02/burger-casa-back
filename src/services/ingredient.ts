import { InjectRepository } from "@nestjs/typeorm";
import { Ingredient } from "src/entities/ingredient";
import { Like, Repository } from "typeorm";

export class IngredientService {

    constructor(
        @InjectRepository(Ingredient)
        private ingredientRepository: Repository<Ingredient>
    ){}

    async create(ingredient: Ingredient): Promise<Ingredient> {
        try{
            const response = await this.ingredientRepository.save(ingredient);
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

    async update(id: string, ingredient: Ingredient): Promise<Ingredient> {
        try{
            await this.ingredientRepository.update(id, ingredient);
            return this.ingredientRepository.findOne({ where: { id } });
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