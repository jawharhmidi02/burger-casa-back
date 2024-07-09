import { IngredientService } from "src/services/ingredient";
import { Ingredient } from "src/entities/ingredient";
export declare class IngredientController {
    private readonly ingredientService;
    constructor(ingredientService: IngredientService);
    create(ingredient: Ingredient): Promise<Ingredient>;
    findAll(): Promise<Ingredient[]>;
    findById(id: string): Promise<Ingredient>;
    findByNom(nom: string): Promise<Ingredient[]>;
    update(id: string, ingredient: Ingredient): Promise<Ingredient>;
    delete(id: string): Promise<Ingredient>;
}
