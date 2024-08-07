import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WhatsappMessage {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({unique: true})
    message_id: string;
    
    @Column()
    commande_id: string;
}
