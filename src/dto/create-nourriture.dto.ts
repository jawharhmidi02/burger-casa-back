import { Ingredient } from "src/entities/ingredient.entity";

export class CreateNourritureDto {
    readonly nom: string;
    readonly prix: number;
    readonly photo: string;
    readonly categorie: string;
    readonly description: string;
    readonly disponible: boolean;
    readonly ingredients: Ingredient[];
}
