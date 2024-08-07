import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClientSuggestion {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    nom_client: string;
    
    @Column()
    tel_client: string;

    @Column()
    email_client: string;

    @Column()
    suggestion: string;
}
