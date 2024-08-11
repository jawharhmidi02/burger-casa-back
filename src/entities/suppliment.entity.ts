import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Suppliment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    nom: string;

    @Column()
    disponible: boolean;

    @Column({type: 'float'})
    prix: number;
}
