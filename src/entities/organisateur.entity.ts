import { AutoMap } from '@automapper/classes';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Organisateur {
  @AutoMap()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @AutoMap()
  @Column()
  nom_prenom: string;

  @AutoMap()
  @Column()
  email: string;

  @AutoMap()
  @Column()
  password: string;

  @AutoMap()
  @Column()
  telephone: string;

  @AutoMap()
  @Column('text', { array: true })
  dialogues: string[];
}