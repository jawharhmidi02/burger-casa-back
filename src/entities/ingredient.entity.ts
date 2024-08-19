import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    nom: string;

    @Column()
    disponible: boolean;

    // @Column({nullable: true})
    // photo: string;
}
