import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("courriers")
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
  type: string;

  @Column({ default: "En cours" })
  statut: string;

  @Column({ type: "date", nullable: true })
  dateLimiteReponse: string | null;

  @CreateDateColumn()
  createdAt: Date;
}