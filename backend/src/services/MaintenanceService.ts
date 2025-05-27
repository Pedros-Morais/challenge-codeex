import { Repository, MoreThan } from "typeorm";
import { AppDataSource } from "../config/database";
import { Maintenance, MaintenanceFrequency, MaintenanceReferenceType, MaintenanceStatus } from "../models/Maintenance";
import { Part } from "../models/Part";
import { PartNotFoundError } from "../errors/PartNotFoundError";
import { InvalidDataError } from "../errors/InvalidDataError";
import { MaintenanceNotFoundError } from "../errors/MaintenanceNotFoundError";

export class MaintenanceService {
    private maintenanceRepository: Repository<Maintenance>;
    private partRepository: Repository<Part>;
    constructor() {
        this.maintenanceRepository = AppDataSource.getRepository(Maintenance);
        this.partRepository = AppDataSource.getRepository(Part);
    }

    /**
     * Find all maintenances
     */
    public async findAll(): Promise<Maintenance[]> {
        return this.maintenanceRepository.find({
            relations: ["part", "part.equipment", "part.equipment.area", "part.equipment.area.plant"]
        });
    }

    /**
     * Find all future maintenances ordered by due date
     */
    public async findFuture(): Promise<Maintenance[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.maintenanceRepository.find({
            where: {
                dueDate: MoreThan(today),
                status: MaintenanceStatus.SCHEDULED
            },
            order: {
                dueDate: "ASC"
            },
            relations: ["part", "part.equipment", "part.equipment.area", "part.equipment.area.plant"]
        });
    }

    /**
     * Find maintenance by id
     * @param id Maintenance id
     */
    public async findById(id: string): Promise<Maintenance> {
        const maintenance = await this.maintenanceRepository.findOne({
            where: { id },
            relations: ["part", "part.equipment", "part.equipment.area", "part.equipment.area.plant"]
        });

        if (!maintenance) {
            throw new MaintenanceNotFoundError();
        }

        return maintenance;
    }

    /**
     * Create a new maintenance
     * @param data Maintenance data
     */
    public async create(data: Omit<Maintenance, "id" | "createdAt" | "updatedAt">): Promise<Maintenance> {
        const part = await this.partRepository.findOne({
            where: { id: data.partId },
            relations: ["equipment"]
        });

        if (!part) {
            throw new PartNotFoundError();
        }

        if (!data.dueDate) {
            data.dueDate = await this.calculateDueDate(
                data.frequency,
                data.customDays,
                data.referenceType,
                part
            );
        }

        const maintenance = this.maintenanceRepository.create(data);
        const savedMaintenance = await this.maintenanceRepository.save(maintenance);

        return this.findById(savedMaintenance.id);
    }

    /**
     * Update a maintenance
     * @param id Maintenance id
     * @param data Maintenance data
     */
    public async update(id: string, data: Partial<Omit<Maintenance, "id" | "createdAt" | "updatedAt">>): Promise<Maintenance> {
        const maintenance = await this.findById(id);

        // If partId is changed, validate the new part exists
        if (data.partId && data.partId !== maintenance.partId) {
            const part = await this.partRepository.findOne({
                where: { id: data.partId },
                relations: ["equipment"]
            });

            if (!part) {
                throw new PartNotFoundError();
            }

            // Recalculate due date if reference type or frequency is changing
            if (
                data.referenceType && data.referenceType !== maintenance.referenceType ||
                data.frequency && data.frequency !== maintenance.frequency
            ) {
                data.dueDate = await this.calculateDueDate(
                    data.frequency || maintenance.frequency,
                    data.customDays || maintenance.customDays,
                    data.referenceType || maintenance.referenceType,
                    part
                );
            }
        }

        // Update maintenance properties
        Object.assign(maintenance, data);

        // Save changes
        await this.maintenanceRepository.save(maintenance);
        return this.findById(id);
    }

    /**
     * Delete a maintenance
     * @param id Maintenance id
     */
    public async delete(id: string): Promise<void> {
        const maintenance = await this.findById(id);
        await this.maintenanceRepository.remove(maintenance);
    }

    /**
     * Get maintenances for a specific part
     * @param partId Part id
     */
    public async getByPart(partId: string): Promise<Maintenance[]> {
        const part = await this.partRepository.findOne({
            where: { id: partId }
        });

        if (!part) {
            throw new PartNotFoundError();
        }

        return this.maintenanceRepository.find({
            where: { partId },
            relations: ["part", "part.equipment", "part.equipment.area", "part.equipment.area.plant"]
        });
    }

    /**
     * Update maintenance status
     * @param id Maintenance id
     * @param status New status
     */
    public async updateStatus(id: string, status: MaintenanceStatus): Promise<Maintenance> {
        const maintenance = await this.findById(id);
        maintenance.status = status;

        // If completing a maintenance with recurring frequency, create the next one
        if (status === MaintenanceStatus.COMPLETED && 
            maintenance.frequency !== MaintenanceFrequency.CUSTOM) {
            await this.createNextMaintenance(maintenance);
        }

        await this.maintenanceRepository.save(maintenance);
        return this.findById(id);
    }

    /**
     * Calculate due date based on frequency and reference type
     */
    private async calculateDueDate(
        frequency: MaintenanceFrequency,
        customDays: number | undefined,
        referenceType: MaintenanceReferenceType,
        part: Part
    ): Promise<Date> {
        // Get reference date based on type
        let referenceDate: Date;
        
        if (referenceType === MaintenanceReferenceType.PART_INSTALLATION) {
            referenceDate = part.installationDate;
        } else if (referenceType === MaintenanceReferenceType.EQUIPMENT_OPERATION) {
            if (!part.equipment) {
                throw new InvalidDataError("Part must be associated with equipment to use equipment operation date as reference");
            }
            referenceDate = part.equipment.initialOperationsDate;
        } else {
            // For fixed date, use current date
            referenceDate = new Date();
        }

        // Calculate due date based on frequency
        const dueDate = new Date(referenceDate);
        
        switch (frequency) {
            case MaintenanceFrequency.DAILY:
                dueDate.setDate(dueDate.getDate() + 1);
                break;
            case MaintenanceFrequency.WEEKLY:
                dueDate.setDate(dueDate.getDate() + 7);
                break;
            case MaintenanceFrequency.MONTHLY:
                dueDate.setMonth(dueDate.getMonth() + 1);
                break;
            case MaintenanceFrequency.QUARTERLY:
                dueDate.setMonth(dueDate.getMonth() + 3);
                break;
            case MaintenanceFrequency.SEMI_ANNUAL:
                dueDate.setMonth(dueDate.getMonth() + 6);
                break;
            case MaintenanceFrequency.ANNUAL:
                dueDate.setFullYear(dueDate.getFullYear() + 1);
                break;
            case MaintenanceFrequency.CUSTOM:
                if (!customDays) {
                    throw new InvalidDataError("Custom frequency requires customDays to be specified");
                }
                dueDate.setDate(dueDate.getDate() + customDays);
                break;
        }

        return dueDate;
    }

    /**
     * Create the next maintenance based on the completed one
     */
    private async createNextMaintenance(completedMaintenance: Maintenance): Promise<Maintenance> {
        const part = await this.partRepository.findOne({
            where: { id: completedMaintenance.partId },
            relations: ["equipment"]
        });

        if (!part) {
            throw new PartNotFoundError();
        }

        // Calculate next due date based on the completed maintenance's due date
        const nextDueDate = new Date(completedMaintenance.dueDate);
        
        switch (completedMaintenance.frequency) {
            case MaintenanceFrequency.DAILY:
                nextDueDate.setDate(nextDueDate.getDate() + 1);
                break;
            case MaintenanceFrequency.WEEKLY:
                nextDueDate.setDate(nextDueDate.getDate() + 7);
                break;
            case MaintenanceFrequency.MONTHLY:
                nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                break;
            case MaintenanceFrequency.QUARTERLY:
                nextDueDate.setMonth(nextDueDate.getMonth() + 3);
                break;
            case MaintenanceFrequency.SEMI_ANNUAL:
                nextDueDate.setMonth(nextDueDate.getMonth() + 6);
                break;
            case MaintenanceFrequency.ANNUAL:
                nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
                break;
        }

        // Create new maintenance with the same details but updated due date
        const newMaintenance = this.maintenanceRepository.create({
            title: completedMaintenance.title,
            description: completedMaintenance.description,
            frequency: completedMaintenance.frequency,
            customDays: completedMaintenance.customDays,
            referenceType: completedMaintenance.referenceType,
            partId: completedMaintenance.partId,
            status: MaintenanceStatus.SCHEDULED,
            dueDate: nextDueDate
        });

        return this.maintenanceRepository.save(newMaintenance);
    }
}
