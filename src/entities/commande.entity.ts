import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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
    email_client: string;

    @Column()
    adresse: string;

    @Column()
    order_type: string;

    @Column()
    content: string;

    @Column({nullable: true})
    special_request: string;
}