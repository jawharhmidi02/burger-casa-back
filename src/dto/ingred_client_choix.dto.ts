import { IngredClientChoix } from "src/entities/ingred_client_choix.entity";
import { Ingredient } from "src/entities/ingredient.entity";

export class IngredClientChoixToEntity{
    id_ingredient: Ingredient;

    quantite: string;
}

export class IngredClientChoixFromEntity{
    id: string;

    id_ingredient: Ingredient;

    quantite: string;

    constructor(ingredClientChoix: IngredClientChoix){
        this.id = ingredClientChoix.id;
        this.id_ingredient = ingredClientChoix.id_ingredient;
        this.quantite = ingredClientChoix.quantite;
    }
}