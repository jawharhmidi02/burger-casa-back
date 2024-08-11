import { NourritureCategorie } from "src/entities/nourriture_categories.entity";

export class NourritureCategorieToEntity{
    nom: string;
}

export class NourritureCategorieFromEntity{
    id: string;

    nom: string;

    constructor(nourritureCategorie: NourritureCategorie) {
        this.id = nourritureCategorie.id;
        this.nom = nourritureCategorie.nom;
    }
}

