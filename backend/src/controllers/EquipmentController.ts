import { Body, Controller, Get, Path, Post, Put, Delete, Route, Tags } from "tsoa";
import { Equipment } from "../models/Equipment";
import { Area } from "../models/Area";
import { EquipmentService } from "../services/EquipmentService";
import { EquipmentNotFoundError } from "../errors/EquipmentNotFoundError";
import { InvalidForeignKeyError } from "../errors/InvalidForeignKeyError";
import { InvalidDataError } from "../errors/InvalidDataError";
import { DependencyExistsError } from "../errors/DependencyExistsError";
import { InvalidNeighboringAreaError } from "../errors/InvalidNeighboringAreaError";
import { ErrorHandler } from "../errors/ErrorHandler";

@Route("equipment")
@Tags("Equipment")
export class EquipmentController extends Controller {
    private equipmentService: EquipmentService;

    constructor() {
        super();
        this.equipmentService = new EquipmentService();
    }

    @Get()
    public async getEquipment(): Promise<Equipment[]> {
        return this.equipmentService.findAll();
    }

    @Get("{equipmentId}")
    public async getEquipmentById(@Path() equipmentId: string): Promise<Equipment> {
        try {
            return await this.equipmentService.findById(equipmentId);
        } catch (error) {
            if (error instanceof EquipmentNotFoundError) {
                this.setStatus(EquipmentNotFoundError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Post()
    public async createEquipment(@Body() requestBody: Omit<Equipment, "id" | "createdAt" | "updatedAt">): Promise<Equipment> {
        try {
            return await this.equipmentService.create(requestBody);
        } catch (error) {
            if (error instanceof InvalidForeignKeyError) {
                this.setStatus(InvalidForeignKeyError.httpStatusCode);
                throw error;
            }
            if (error instanceof InvalidDataError) {
                this.setStatus(InvalidDataError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Put("{equipmentId}")
    public async updateEquipment(
        @Path() equipmentId: string,
        @Body() requestBody: Partial<Omit<Equipment, "id" | "createdAt" | "updatedAt">>
    ): Promise<Equipment> {
        try {
            return await this.equipmentService.update(equipmentId, requestBody);
        } catch (error) {
            if (error instanceof EquipmentNotFoundError) {
                this.setStatus(EquipmentNotFoundError.httpStatusCode);
                throw error;
            }
            if (error instanceof InvalidForeignKeyError) {
                this.setStatus(InvalidForeignKeyError.httpStatusCode);
                throw error;
            }
            if (error instanceof InvalidDataError) {
                this.setStatus(InvalidDataError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Delete("{equipmentId}")
    public async deleteEquipment(@Path() equipmentId: string): Promise<void> {
        try {
            await this.equipmentService.delete(equipmentId);
            this.setStatus(204);
        } catch (error) {
            if (error instanceof EquipmentNotFoundError) {
                this.setStatus(EquipmentNotFoundError.httpStatusCode);
                throw error;
            }
            if (error instanceof DependencyExistsError) {
                this.setStatus(DependencyExistsError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }
    
    /**
     * Get all areas associated with an equipment
     */
    @Get("{equipmentId}/areas")
    public async getEquipmentAreas(@Path() equipmentId: string): Promise<Area[]> {
        try {
            return await this.equipmentService.getAreas(equipmentId);
        } catch (error) {
            if (error instanceof EquipmentNotFoundError) {
                this.setStatus(EquipmentNotFoundError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }
    
    /**
     * Add an equipment to a specific area
     */
    @Post("{equipmentId}/areas/{areaId}")
    public async addEquipmentToArea(
        @Path() equipmentId: string,
        @Path() areaId: string
    ): Promise<Equipment> {
        try {
            return await this.equipmentService.addToArea(equipmentId, areaId);
        } catch (error) {
            return ErrorHandler.handleCommonErrors(this, error);
        }
    }
    
    /**
     * Remove an equipment from a specific area
     */
    @Delete("{equipmentId}/areas/{areaId}")
    public async removeEquipmentFromArea(
        @Path() equipmentId: string,
        @Path() areaId: string
    ): Promise<Equipment> {
        try {
            return await this.equipmentService.removeFromArea(equipmentId, areaId);
        } catch (error) {
            if (error instanceof EquipmentNotFoundError) {
                this.setStatus(EquipmentNotFoundError.httpStatusCode);
                throw error;
            }
            if (error instanceof InvalidNeighboringAreaError) {
                this.setStatus(400); // Bad Request
                throw error;
            }
            throw error;
        }
    }
} 