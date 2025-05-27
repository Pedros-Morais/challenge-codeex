import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Part } from "./Part";

export enum MaintenanceFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    SEMI_ANNUAL = "semi-annual",
    ANNUAL = "annual",
    CUSTOM = "custom"
}

export enum MaintenanceStatus {
    SCHEDULED = "scheduled",
    COMPLETED = "completed",
    OVERDUE = "overdue",
    CANCELED = "canceled"
}

export enum MaintenanceReferenceType {
    PART_INSTALLATION = "part-installation",
    EQUIPMENT_OPERATION = "equipment-operation",
    FIXED_DATE = "fixed-date"
}

@Entity()
export class Maintenance {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    title!: string;

    @Column({ nullable: true, type: "text" })
    description?: string;

    @Column({ type: "datetime" })
    dueDate!: Date;

    @Column({
        type: "varchar",
        default: MaintenanceStatus.SCHEDULED
    })
    status!: MaintenanceStatus;

    @Column({
        type: "varchar",
        default: MaintenanceFrequency.MONTHLY
    })
    frequency!: MaintenanceFrequency;

    @Column({ nullable: true, type: "integer" })
    customDays?: number;

    @Column({
        type: "varchar",
        default: MaintenanceReferenceType.PART_INSTALLATION
    })
    referenceType!: MaintenanceReferenceType;

    @ManyToOne(() => Part)
    @JoinColumn({ name: "partId" })
    part?: Part;

    @Column()
    partId!: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    updatedAt!: Date;
}
