import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 150 })
  title: string;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "boolean", default: false })
  isRead: boolean;

  @Column({ type: "varchar", length: 50, default: "info" })
  type: string;

  @Column({ type: "varchar", length: 255, nullable: true, unique: true })
  notificationKey: string | null;

  @Column({ type: "int", nullable: true })
  courrierId: number | null;

  @CreateDateColumn()
  createdAt: Date;
}