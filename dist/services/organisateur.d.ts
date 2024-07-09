import { Repository } from 'typeorm';
import { Organisateur } from '../entities/organisateur';
export declare class OrganisateurService {
    private organisateurRepository;
    constructor(organisateurRepository: Repository<Organisateur>);
    create(organisateur: Organisateur): Promise<Organisateur>;
    findAll(): Promise<Organisateur[]>;
    findOne(id: string): Promise<Organisateur>;
    update(id: string, organisateur: Organisateur): Promise<Organisateur>;
    remove(id: string): Promise<Organisateur>;
}
