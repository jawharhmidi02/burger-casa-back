import { Commande } from 'src/entities/commande.entity';

export class CommandeToEntity {
  status?: string;

  total?: number;

  nom_client?: string;

  tel_client?: string;

  adresse?: string;

  content?: string;

  email_client?: string;

  order_type?: string;

  special_request?: string;

  prefered_time?: Date;
}

export class CommandeFromEntity {
  id: string;

  status: string;

  total: number;

  data_creation: Date;

  nom_client: string;

  tel_client: string;

  adresse: string;

  content: string;

  email_client: string;

  order_type: string;

  special_request: string;

  prefered_time: Date;

  constructor(commande: Commande) {
    this.adresse = commande.adresse;
    this.data_creation = commande.data_creation;
    this.id = commande.id;
    this.nom_client = commande.nom_client;
    this.status = commande.status;
    this.tel_client = commande.tel_client;
    this.total = commande.total;
    this.content = commande.content;
    this.email_client = commande.email_client;
    this.order_type = commande.order_type;
    this.special_request = commande.special_request;
    this.prefered_time = commande.prefered_time;
  }
}
