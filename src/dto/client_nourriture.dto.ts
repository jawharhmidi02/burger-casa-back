import { ClientNourriture } from "src/entities/client_nourriture.entity";
import { IngredClientChoix } from "src/entities/ingred_client_choix.entity";
import { Nourriture } from "src/entities/nourriture.entity";

export class ClientNourritureToEntity{
    id_nourriture: Nourriture;

    ingred_client_choix: IngredClientChoix[];

    demande_special: string;
}

export class ClientNourritureFromEntity{
    id: string;

    id_nourriture: Nourriture;

    ingred_client_choix: IngredClientChoix[];

    demande_special: string;

    constructor(clientNourriture: ClientNourriture){
        this.demande_special = clientNourriture.demande_special;
        this.id = clientNourriture.id;
        this.id_nourriture = clientNourriture.id_nourriture;
        this.ingred_client_choix = clientNourriture.ingred_client_choix;
    }
}