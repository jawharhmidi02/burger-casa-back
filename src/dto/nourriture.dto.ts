import { Ingredient } from "src/entities/ingredient.entity";
import { Nourriture } from "src/entities/nourriture.entity";

export class NourritureToEntity{
    nom: string;

    prix: number;

    photo: string;

    categorie: string;

    description: string;

    disponible: boolean;

    ingredients: Ingredient[];
}

export class NourritureFromEntity{
    nom: string;

    prix: number;

    photo: string;

    categorie: string;

    description: string;

    disponible: boolean;

    ingredients: Ingredient[];

    id: string;

    constructor(nourriture: Nourriture){
        this.categorie = nourriture.categorie;
        this.description = nourriture.description;
        this.disponible = nourriture.disponible;
        this.id = nourriture.id;
        this.ingredients = nourriture.ingredients;
        this.nom = nourriture.nom;
        this.photo = nourriture.photo;
        this.prix = nourriture.prix
    }
}