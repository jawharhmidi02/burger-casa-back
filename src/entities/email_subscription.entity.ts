import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EmailSubscription{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false, unique: true})
    email: string;
}