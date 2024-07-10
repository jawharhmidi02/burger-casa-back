import { Ingredient } from "src/entities/ingredient.entity";

export class CreateIngredClientChoixDto {
    readonly id_ingredient: Ingredient;
    readonly quantite: string;
}
