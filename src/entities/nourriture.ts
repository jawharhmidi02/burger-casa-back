import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Ingredient } from "./ingredient";

@Entity()
export class Nourriture{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    nom: string;

    @Column({ type: 'float' })
    prix: number;

    @Column()
    photo: string;

    @Column()
    categorie: string;

    @Column()
    description: string;

    @Column()
    disponible: boolean;

    @ManyToMany(() => Ingredient )
    @JoinTable()
    ingredients: Ingredient[];
}