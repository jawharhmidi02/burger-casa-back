import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ingredient } from "./ingredient.entity";

@Entity()
export class IngredClientChoix{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Ingredient, ingredient => ingredient.id, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'id_ingredient'})
    id_ingredient: Ingredient;

    @Column()
    quantite: string;
}