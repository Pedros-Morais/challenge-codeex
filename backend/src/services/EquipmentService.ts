import { Equipment } from "../models/Equipment";
import { Area } from "../models/Area";
import { DatabaseContext } from "../config/database-context";
import { Repository, QueryFailedError, In } from "typeorm";
import { EquipmentNotFoundError } from "../errors/EquipmentNotFoundError";
import { InvalidForeignKeyError } from "../errors/InvalidForeignKeyError";
import { InvalidDataError } from "../errors/InvalidDataError";
import { DependencyExistsError } from "../errors/DependencyExistsError";
import { AreaNotFoundError } from "../errors/AreaNotFoundError";
import { InvalidNeighboringAreaError } from "../errors/InvalidNeighboringAreaError";
import { AreaService } from "./AreaService";

export class EquipmentService {
    private equipmentRepository: Repository<Equipment>;
    private areaRepository: Repository<Area>;
    private areaService: AreaService;

    constructor() {
        this.equipmentRepository = DatabaseContext.getInstance().getRepository(Equipment);
        this.areaRepository = DatabaseContext.getInstance().getRepository(Area);
        this.areaService = new AreaService();
    }

    public async findAll(): Promise<Equipment[]> {
        return this.equipmentRepository.find({
            relations: ["area", "parts", "areas"]
        });
    }

    public async findById(id: string): Promise<Equipment> {
        const equipment = await this.equipmentRepository.findOne({
            where: { id },
            relations: ["area", "parts", "areas"]
        });
        if (!equipment) {
            throw new EquipmentNotFoundError();
        }
        return equipment;
    }

    public async create(data: Omit<Equipment, "id" | "createdAt" | "updatedAt">): Promise<Equipment> {
        try {
            const equipment = this.equipmentRepository.create(data);
            
            if (data.areas && data.areas.length > 0) {
                equipment.areas = [];
                
                const areas = await this.validateAndGetAreas(data.areas.map(a => a.id));
                equipment.areas = areas;
            }
            
            if (data.areaId) {

                const area = await this.areaRepository.findOne({ where: { id: data.areaId } });
                if (!area) {
                    throw new InvalidForeignKeyError("Invalid area ID");
                }
                equipment.area = area;
            } else if (equipment.areas && equipment.areas.length > 0) {
                equipment.area = equipment.areas[0];
                equipment.areaId = equipment.areas[0].id;
            }
            
            const savedEquipment = await this.equipmentRepository.save(equipment);
            return this.equipmentRepository.findOne({
                where: { id: savedEquipment.id },
                relations: ["area", "areas"]
            }) as Promise<Equipment>;
        } catch (error) {
            if (error instanceof QueryFailedError && error.message.includes('FOREIGN KEY')) {
                throw new InvalidForeignKeyError("Invalid area ID");
            }
            if (error instanceof QueryFailedError) {
                throw new InvalidDataError("Invalid equipment data");
            }
            throw error;
        }
    }

    public async update(id: string, data: Partial<Omit<Equipment, "id" | "createdAt" | "updatedAt">>): Promise<Equipment> {
        try {
            const equipment = await this.equipmentRepository.findOne({ 
                where: { id },
                relations: ["area", "areas"]
            });
            if (!equipment) {
                throw new EquipmentNotFoundError();
            }

            if (data.areas) {
                const areas = await this.validateAndGetAreas(data.areas.map(a => a.id));
                equipment.areas = areas;
                
                if (areas.length > 0 && (!data.areaId || !areas.some(a => a.id === data.areaId))) {
                    equipment.area = areas[0];
                    equipment.areaId = areas[0].id;
                }
            }
            
            if (data.areaId && data.areaId !== equipment.areaId) {
                const area = await this.areaRepository.findOne({ where: { id: data.areaId } });
                if (!area) {
                    throw new InvalidForeignKeyError("Invalid area ID");
                }
                
                if (equipment.areas && equipment.areas.length > 0 && !equipment.areas.some(a => a.id === data.areaId)) {
                    throw new InvalidNeighboringAreaError(
                        "Primary area must be one of the associated areas",
                        [data.areaId as string, ...equipment.areas.map(a => a.id)],
                        `The primary area ${data.areaId} must be one of the equipment's associated areas: ${equipment.areas.map(a => a.id).join(', ')}`
                    );
                }
                
                equipment.area = area;
                equipment.areaId = area.id;
            }
            
            // Copy other properties
            if (data.name) equipment.name = data.name;
            if (data.manufacturer) equipment.manufacturer = data.manufacturer;
            if (data.serialNumber) equipment.serialNumber = data.serialNumber;
            if (data.initialOperationsDate) equipment.initialOperationsDate = data.initialOperationsDate;
            
            await this.equipmentRepository.save(equipment);
            return this.equipmentRepository.findOne({
                where: { id: equipment.id },
                relations: ["area", "areas"]
            }) as Promise<Equipment>;
        } catch (error) {
            if (error instanceof QueryFailedError && error.message.includes('FOREIGN KEY')) {
                throw new InvalidForeignKeyError("Invalid area ID");
            }
            if (error instanceof QueryFailedError) {
                throw new InvalidDataError("Invalid equipment data");
            }
            throw error;
        }
    }

    public async delete(id: string): Promise<void> {
        const equipment = await this.equipmentRepository.findOne({ 
            where: { id },
            relations: ["parts", "areas"]
        });
        if (!equipment) {
            throw new EquipmentNotFoundError();
        }

        try {
            if (equipment.areas && equipment.areas.length > 0) {
                equipment.areas = [];
                await this.equipmentRepository.save(equipment);
            }
            
            await this.equipmentRepository.remove(equipment);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new DependencyExistsError("Cannot delete equipment with associated parts");
            }
            throw error;
        }
    }
    
    /**
     * Adds an equipment to a specific area, validating neighboring requirements
     * @param equipmentId The ID of the equipment to add to an area
     * @param areaId The ID of the area to add the equipment to
     */
    public async addToArea(equipmentId: string, areaId: string): Promise<Equipment> {
        const equipment = await this.equipmentRepository.findOne({
            where: { id: equipmentId },
            relations: ["areas"]
        });
        
        if (!equipment) {
            throw new EquipmentNotFoundError();
        }
        
        const area = await this.areaRepository.findOne({
            where: { id: areaId }
        });
        
        if (!area) {
            throw new AreaNotFoundError();
        }
        
        if (!equipment.areas) {
            equipment.areas = [];
        }
        
        if (equipment.areas.some(a => a.id === areaId)) {
            return equipment; 
        }
        
        if (equipment.areas.length === 0) {
            equipment.areas.push(area);
            
            if (!equipment.areaId) {
                equipment.area = area;
                equipment.areaId = area.id;
            }
        } else {
            let isNeighborOfExisting = false;
            
            for (const existingArea of equipment.areas) {
                if (await this.areaService.areNeighbors(existingArea.id, areaId)) {
                    isNeighborOfExisting = true;
                    break;
                }
            }
            
            if (!isNeighborOfExisting) {
                const existingAreaIds = equipment.areas.map(a => a.id);
                throw new InvalidNeighboringAreaError(
                    "Equipment can only be added to neighboring areas",
                    [...existingAreaIds, areaId],
                    `The area ${areaId} is not a neighbor of any of the equipment's current areas: ${existingAreaIds.join(', ')}`
                );
            }
            
            equipment.areas.push(area);
        }
        
        await this.equipmentRepository.save(equipment);
        return this.findById(equipmentId);
    }
    
    /**
     * Removes an equipment from a specific area
     * @param equipmentId The ID of the equipment to remove from an area
     * @param areaId The ID of the area to remove the equipment from
     */
    public async removeFromArea(equipmentId: string, areaId: string): Promise<Equipment> {
        const equipment = await this.equipmentRepository.findOne({
            where: { id: equipmentId },
            relations: ["areas", "area"]
        });
        
        if (!equipment) {
            throw new EquipmentNotFoundError();
        }
        
        if (!equipment.areas || !equipment.areas.some(a => a.id === areaId)) {
            return equipment;
        }
        
        const remainingAreas = equipment.areas.filter(a => a.id !== areaId);
        
        if (remainingAreas.length <= 1) {
            equipment.areas = remainingAreas;
        } else {
            let allNeighboring = true;
            
            for (let i = 0; i < remainingAreas.length; i++) {
                for (let j = i + 1; j < remainingAreas.length; j++) {
                    const areNeighbors = await this.areaService.areNeighbors(remainingAreas[i].id, remainingAreas[j].id);
                    if (!areNeighbors) {
                        allNeighboring = false;
                        break;
                    }
                }
                if (!allNeighboring) break;
            }
            
            if (!allNeighboring) {
                throw new InvalidNeighboringAreaError(
                    "Removing this area would disconnect the equipment's areas",
                    [areaId, ...remainingAreas.map(a => a.id)],
                    `Removing area ${areaId} would break the connectivity between the remaining areas: ${remainingAreas.map(a => a.id).join(', ')}`
                );
            }
            
            equipment.areas = remainingAreas;
        }
        
        if (equipment.areaId === areaId && equipment.areas.length > 0) {
            equipment.area = equipment.areas[0];
            equipment.areaId = equipment.areas[0].id;
        } else if (equipment.areas.length === 0) {
            equipment.area = undefined;
            equipment.areaId = undefined;
        }
        
        await this.equipmentRepository.save(equipment);
        return this.findById(equipmentId);
    }
    
    /**
     * Get all areas associated with an equipment
     * @param equipmentId The ID of the equipment to get areas for
     */
    public async getAreas(equipmentId: string): Promise<Area[]> {
        const equipment = await this.equipmentRepository.findOne({
            where: { id: equipmentId },
            relations: ["areas"]
        });
        
        if (!equipment) {
            throw new EquipmentNotFoundError();
        }
        
        return equipment.areas || [];
    }
    
    /**
     * Validates that all provided area IDs exist and that they form a connected graph of neighboring areas
     * @param areaIds Array of area IDs to validate
     * @returns Array of Area objects if valid, throws error otherwise
     */
    private async validateAndGetAreas(areaIds: string[]): Promise<Area[]> {
        if (!areaIds || areaIds.length === 0) {
            return [];
        }
        
        const areas = await this.areaRepository.find({
            where: { id: In(areaIds) }
        });
        
        if (areas.length !== areaIds.length) {
            throw new AreaNotFoundError("One or more areas not found");
        }
        
        if (areas.length === 1) {
            return areas;
        }

        for (let i = 0; i < areas.length; i++) {
            let hasNeighbor = false;
            
            for (let j = 0; j < areas.length; j++) {
                if (i !== j && await this.areaService.areNeighbors(areas[i].id, areas[j].id)) {
                    hasNeighbor = true;
                    break;
                }
            }
            
            if (!hasNeighbor) {
                throw new InvalidNeighboringAreaError(
                    "Areas must form a connected neighborhood",
                    areas.map(a => a.id),
                    `Area ${areas[i].id} is not connected to any other area in the set: ${areas.map(a => a.id).join(', ')}`
                );
            }
        }
        
        return areas;
    }
} 