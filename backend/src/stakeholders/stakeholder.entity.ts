import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("stakeholders")
export class Stakeholder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 200 })
  nom: string;

  @Column({ type: "varchar", length: 250 })
  direction: string;

  @Column({ type: "varchar", length: 250 })
  service: string;

  @Column({ type: "varchar", length: 100, default: "Service" })
  type: string;

  @Column({ type: "varchar", length: 150, nullable: true })
  email: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  telephone: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  adresse: string | null;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}