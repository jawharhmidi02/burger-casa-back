import { Organisateur } from "src/entities/organisateur.entity";

export class OrganisateurToEntity{
    nom_prenom: string;

    email: string;

    password: string;

    telephone: string;

    dialogues: string[];
}

export class OrganisateurFromEntity{
    id: string;

    nom_prenom: string;

    email: string;

    telephone: string;

    dialogues: string[];

    constructor(organisateur: Organisateur){
        this.dialogues = organisateur.dialogues;
        this.email = organisateur.email;
        this.id = organisateur.id;
        this.nom_prenom = organisateur.nom_prenom;
        this.telephone = organisateur.telephone;
    }
}
