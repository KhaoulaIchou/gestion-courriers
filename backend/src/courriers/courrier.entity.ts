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

  @Column({ type: "int", nullable: true })
  stakeholderId: number | null;

  @Column({ type: "date", nullable: true })
  dateLimiteReponse: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  pdfUrl: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  pdfFilename: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  pdfStorageKey: string | null;

  @Column({ type: "bigint", nullable: true })
  pdfSize: number | null;

  @CreateDateColumn()
  createdAt: Date;
}