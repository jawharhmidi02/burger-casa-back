import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Ingredient } from "./ingredient.entity";

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

    @ManyToMany(() => Ingredient, ingredient => ingredient.id ,{onDelete: 'CASCADE'})
    @JoinTable()
    ingredients: Ingredient[];
}