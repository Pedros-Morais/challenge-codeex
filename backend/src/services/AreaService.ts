import { Area } from "../models/Area";
import { DatabaseContext } from "../config/database-context";
import { Repository, QueryFailedError } from "typeorm";
import { AreaNotFoundError } from "../errors/AreaNotFoundError";
import { InvalidForeignKeyError } from "../errors/InvalidForeignKeyError";
import { InvalidDataError } from "../errors/InvalidDataError";
import { DependencyExistsError } from "../errors/DependencyExistsError";

export class AreaService {
    private areaRepository: Repository<Area>;

    constructor() {
        this.areaRepository = DatabaseContext.getInstance().getRepository(Area);
    }

    public async findAll(): Promise<Area[]> {
        return this.areaRepository.find({
            relations: ["plant", "equipment", "equipment.parts", "neighbors"]
        });
    }

    public async findById(id: string): Promise<Area> {
        const area = await this.areaRepository.findOne({
            where: { id },
            relations: ["plant", "equipment", "equipment.parts", "neighbors"]
        });
        if (!area) {
            throw new AreaNotFoundError();
        }
        return area;
    }

    public async create(data: Pick<Area, "name" | "locationDescription" | "plantId">): Promise<Area> {
        try {
            const area = this.areaRepository.create(data);
            const savedArea = await this.areaRepository.save(area);
            return this.areaRepository.findOne({
                where: { id: savedArea.id },
                relations: ["plant"]
            }) as Promise<Area>;
        } catch (error) {
            if (error instanceof QueryFailedError && error.message.includes('FOREIGN KEY')) {
                throw new InvalidForeignKeyError("Invalid plant ID");
            }
            if (error instanceof QueryFailedError) {
                throw new InvalidDataError("Invalid area data");
            }
            throw error;
        }
    }

    public async update(id: string, data: Partial<Pick<Area, "name" | "locationDescription">>): Promise<Area> {
        try {
            const area = await this.areaRepository.findOne({ 
                where: { id },
                relations: ["plant"]
            });
            if (!area) {
                throw new AreaNotFoundError();
            }

            Object.assign(area, data);
            await this.areaRepository.save(area);
            return this.areaRepository.findOne({
                where: { id: area.id },
                relations: ["plant"]
            }) as Promise<Area>;
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new InvalidDataError("Invalid area data");
            }
            throw error;
        }
    }

    public async delete(id: string): Promise<void> {
        const area = await this.areaRepository.findOne({ 
            where: { id },
            relations: ["equipment", "neighbors"]
        });
        if (!area) {
            throw new AreaNotFoundError();
        }

        try {
            if (area.neighbors && area.neighbors.length > 0) {
                area.neighbors = [];
                await this.areaRepository.save(area);
            }
            
            await this.areaRepository.remove(area);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                throw new DependencyExistsError("Cannot delete area with associated equipment");
            }
            throw error;
        }
    }
    
    /**
     * Add a neighboring relationship between two areas
     * @param areaId The ID of the first area
     * @param neighborId The ID of the second area to be set as neighbor
     */
    public async addNeighbor(areaId: string, neighborId: string): Promise<Area> {
        if (areaId === neighborId) {
            throw new InvalidDataError("An area cannot be a neighbor to itself");
        }
        
        const area = await this.areaRepository.findOne({
            where: { id: areaId },
            relations: ["neighbors"]
        });
        
        if (!area) {
            throw new AreaNotFoundError("Source area not found");
        }
        
        const neighbor = await this.areaRepository.findOne({
            where: { id: neighborId },
            relations: ["neighbors"]
        });
        
        if (!neighbor) {
            throw new AreaNotFoundError("Neighbor area not found");
        }
        
        if (area.neighbors && area.neighbors.some(n => n.id === neighborId)) {
            return area; 
        }
        
        if (!area.neighbors) {
            area.neighbors = [];
        }
        
        if (!neighbor.neighbors) {
            neighbor.neighbors = [];
        }
        
        area.neighbors.push(neighbor);
        neighbor.neighbors.push(area);
        
        await this.areaRepository.save(area);
        await this.areaRepository.save(neighbor);
        
        return this.findById(areaId);
    }
    
    /**
     * Remove a neighboring relationship between two areas
     * @param areaId The ID of the first area
     * @param neighborId The ID of the second area to remove from neighbors
     */
    public async removeNeighbor(areaId: string, neighborId: string): Promise<Area> {
        const area = await this.areaRepository.findOne({
            where: { id: areaId },
            relations: ["neighbors"]
        });
        
        if (!area) {
            throw new AreaNotFoundError("Source area not found");
        }
        
        const neighbor = await this.areaRepository.findOne({
            where: { id: neighborId },
            relations: ["neighbors"]
        });
        
        if (!neighbor) {
            throw new AreaNotFoundError("Neighbor area not found");
        }
        
        if (!area.neighbors || !area.neighbors.some(n => n.id === neighborId)) {
            return area; 
        }
        
        area.neighbors = area.neighbors.filter(n => n.id !== neighborId);
        if (neighbor.neighbors) {
            neighbor.neighbors = neighbor.neighbors.filter(n => n.id !== areaId);
        }
        
        await this.areaRepository.save(area);
        await this.areaRepository.save(neighbor);
        
        return this.findById(areaId);
    }
    
    /**
     * Check if two areas are neighboring each other
     * @param areaId1 The ID of the first area
     * @param areaId2 The ID of the second area
     * @returns boolean indicating if the areas are neighbors
     */
    public async areNeighbors(areaId1: string, areaId2: string): Promise<boolean> {
        // Same area check
        if (areaId1 === areaId2) {
            return false; // An area cannot be a neighbor to itself
        }
        
        const area = await this.areaRepository.findOne({
            where: { id: areaId1 },
            relations: ["neighbors"]
        });
        
        if (!area || !area.neighbors) {
            return false;
        }
        
        return area.neighbors.some(neighbor => neighbor.id === areaId2);
    }
    
    /**
     * Get all neighbors for a specific area
     * @param areaId The ID of the area to get neighbors for
     */
    public async getNeighbors(areaId: string): Promise<Area[]> {
        const area = await this.areaRepository.findOne({
            where: { id: areaId },
            relations: ["neighbors"]
        });
        
        if (!area) {
            throw new AreaNotFoundError();
        }
        
        return area.neighbors || [];
    }
} 