import { Repository } from "typeorm";
import { Nourriture } from "src/entities/nourriture";
export declare class NourritureService {
    private nourritureRepository;
    constructor(nourritureRepository: Repository<Nourriture>);
    create(nourriture: Nourriture): Promise<Nourriture>;
    findAll(): Promise<Nourriture[]>;
    findById(id: string): Promise<Nourriture>;
    findByNom(nom: string): Promise<Nourriture[]>;
    findByCategorie(categorie: string): Promise<Nourriture[]>;
    update(id: string, nourriture: Nourriture): Promise<Nourriture>;
    delete(id: string): Promise<Nourriture>;
}
