import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClientNourriture } from "./client_nourriture.entity";

@Entity()
export class Commande{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    status: string;

    @Column({type: 'float'})
    total: number;

    @Column({default: new Date()})
    data_creation: Date;

    @Column()
    nom_client: string;

    @Column()
    tel_client: string;

    @Column()
    adresse: string;

    @ManyToMany(() => ClientNourriture, clientNourriture => clientNourriture.id, {onDelete: 'CASCADE'} )
    @JoinTable()
    client_nourriture: ClientNourriture[];
}