import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Nourriture } from "./nourriture.entity";
import { IngredClientChoix } from "./ingred_client_choix.entity";

@Entity()
export class ClientNourriture{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Nourriture, nourriture => nourriture.id, {onDelete: 'CASCADE'})
    @JoinColumn()
    id_nourriture: Nourriture;

    @ManyToMany(() => IngredClientChoix, ingredClientChoix => ingredClientChoix.id, {onDelete: 'CASCADE'})
    @JoinTable()
    ingred_client_choix: IngredClientChoix[];

    @Column()
    demande_special: string;
}