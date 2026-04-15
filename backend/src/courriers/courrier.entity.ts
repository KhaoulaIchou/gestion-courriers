import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('courriers')
export class Courrier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  reference: string;

  @Column()
  objet: string;

  @Column()
  expediteur: string;

  @Column({ nullable: true })
  destinataire: string;

  @Column()
  type: string; // Entrant | Sortant

  @Column({ default: 'En cours' })
  statut: string;

  @CreateDateColumn()
  createdAt: Date;
}