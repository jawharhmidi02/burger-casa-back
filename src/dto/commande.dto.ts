import { ClientNourriture } from "src/entities/client_nourriture.entity";
import { Commande } from "src/entities/commande.entity";

export class CommandeToEntity{
    status: string;

    total: number;

    nom_client: string;

    tel_client: string;

    adresse: string;

    client_nourriture: ClientNourriture[];
}

export class CommandeFromEntity{
    id: string;

    status: string;

    total: number;

    data_creation: Date;

    nom_client: string;

    tel_client: string;

    adresse: string;

    client_nourriture: ClientNourriture[];

    constructor(commande: Commande){
        this.adresse = commande.adresse;
        this.client_nourriture = commande.client_nourriture;
        this.data_creation = commande.data_creation;
        this.id = commande.id;
        this.nom_client = commande.nom_client;
        this.status = commande.status;
        this.tel_client = commande.tel_client;
        this.total = commande.total
    }
}