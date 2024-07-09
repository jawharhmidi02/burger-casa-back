import { Nourriture } from "src/entities/nourriture";
import { NourritureService } from "src/services/nourriture";
export declare class NourritureController {
    private readonly nourritureService;
    constructor(nourritureService: NourritureService);
    create(nourriture: Nourriture): Promise<Nourriture>;
    findAll(): Promise<Nourriture[]>;
    findById(id: string): Promise<Nourriture>;
    findByNom(nom: string): Promise<Nourriture[]>;
    findByCategorie(categorie: string): Promise<Nourriture[]>;
    update(id: string, nourriture: Nourriture): Promise<Nourriture>;
    delete(id: string): Promise<Nourriture>;
}
