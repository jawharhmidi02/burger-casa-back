import { Ingredient } from "./ingredient";
export declare class Nourriture {
    id: string;
    nom: string;
    prix: number;
    photo: string;
    categorie: string;
    description: string;
    disponible: boolean;
    ingredients: Ingredient[];
}
