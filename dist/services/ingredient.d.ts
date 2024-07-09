import { Ingredient } from "src/entities/ingredient";
import { Repository } from "typeorm";
export declare class IngredientService {
    private ingredientRepository;
    constructor(ingredientRepository: Repository<Ingredient>);
    create(ingredient: Ingredient): Promise<Ingredient>;
    findAll(): Promise<Ingredient[]>;
    findById(id: string): Promise<Ingredient>;
    findByNom(nom: string): Promise<Ingredient[]>;
    update(id: string, ingredient: Ingredient): Promise<Ingredient>;
    delete(id: string): Promise<Ingredient>;
}
