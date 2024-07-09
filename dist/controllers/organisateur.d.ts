import { OrganisateurService } from '../services/organisateur';
import { Organisateur } from '../entities/organisateur';
export declare class OrganisateurController {
    private readonly organisateurService;
    constructor(organisateurService: OrganisateurService);
    create(organisateur: Organisateur): Promise<Organisateur>;
    findAll(): Promise<Organisateur[]>;
    findOne(id: string): Promise<Organisateur>;
    update(id: string, organisateur: Organisateur): Promise<Organisateur>;
    remove(id: string): Promise<Organisateur>;
}
