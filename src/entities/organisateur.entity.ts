import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Organisateur {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  nom_prenom: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  telephone: string;

  @Column('text', { array: true })
  dialogues: string[];

  @Column()
  role: string;

  @Column({nullable: true})
  nonce: string;
}