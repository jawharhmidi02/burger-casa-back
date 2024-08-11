import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NourritureCategorie{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nom: string;
}