import { Ingredient } from "src/entities/ingredient.entity";

export class IngredientToEntity{
    nom: string;

    disponible: boolean;

    // photo: string;
}

export class IngredientFromEntity{
    id: string;

    nom: string;

    disponible: boolean;

    // photo: string;

    constructor(ingredient: Ingredient){
        this.disponible = ingredient.disponible;
        this.id = ingredient.id;
        this.nom = ingredient.nom;
        // this.photo = ingredient.photo;
    }
}