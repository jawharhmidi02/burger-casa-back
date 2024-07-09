import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ingredient } from "./ingredient";

@Entity()
export class Ingred_client_choix{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Ingredient, ingredient => ingredient.id)
    @JoinColumn({ name: 'id_ingredient'})
    id_ingredient: Ingredient;

    @Column()
    quantite: string;
}