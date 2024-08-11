import { Suppliment } from 'src/entities/suppliment.entity';

export class SupplimentToEntity {
  nom: string;

  disponible: boolean;

  prix: number;
}

export class SupplimentFromEntity {
  id: string;

  nom: string;

  disponible: boolean;

  prix: number;

  constructor(Suppliment: Suppliment) {
    this.disponible = Suppliment.disponible;
    this.id = Suppliment.id;
    this.nom = Suppliment.nom;
    this.prix = Suppliment.prix;
  }
}
