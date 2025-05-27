import { Body, Controller, Get, Path, Post, Put, Delete, Route, Tags } from "tsoa";
import { Area } from "../models/Area";
import { AreaService } from "../services/AreaService";
import { AreaNotFoundError } from "../errors/AreaNotFoundError";
import { InvalidForeignKeyError } from "../errors/InvalidForeignKeyError";
import { InvalidDataError } from "../errors/InvalidDataError";
import { DependencyExistsError } from "../errors/DependencyExistsError";

@Route("areas")
@Tags("Area")
export class AreaController extends Controller {
    private areaService: AreaService;

    constructor() {
        super();
        this.areaService = new AreaService();
    }

    @Get()
    public async getAreas(): Promise<Area[]> {
        return this.areaService.findAll();
    }

    @Get("{areaId}")
    public async getArea(@Path() areaId: string): Promise<Area> {
        try {
            return await this.areaService.findById(areaId);
        } catch (error) {
            if (error instanceof AreaNotFoundError) {
                this.setStatus(AreaNotFoundError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Post()
    public async createArea(@Body() requestBody: Pick<Area, "name" | "locationDescription" | "plantId">): Promise<Area> {
        try {
            return await this.areaService.create(requestBody);
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

    @Put("{areaId}")
    public async updateArea(
        @Path() areaId: string,
        @Body() requestBody: Partial<Pick<Area, "name" | "locationDescription">>
    ): Promise<Area> {
        try {
            return await this.areaService.update(areaId, requestBody);
        } catch (error) {
            if (error instanceof AreaNotFoundError) {
                this.setStatus(AreaNotFoundError.httpStatusCode);
                throw error;
            }
            if (error instanceof InvalidDataError) {
                this.setStatus(InvalidDataError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Delete("{areaId}")
    public async deleteArea(@Path() areaId: string): Promise<void> {
        try {
            await this.areaService.delete(areaId);
            this.setStatus(204);
        } catch (error) {
            if (error instanceof AreaNotFoundError) {
                this.setStatus(AreaNotFoundError.httpStatusCode);
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
     * Get all neighboring areas for a specific area
     */
    @Get("{areaId}/neighbors")
    public async getNeighbors(@Path() areaId: string): Promise<Area[]> {
        try {
            return await this.areaService.getNeighbors(areaId);
        } catch (error) {
            if (error instanceof AreaNotFoundError) {
                this.setStatus(AreaNotFoundError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }
    
    /**
     * Add a neighboring relationship between two areas
     */
    @Post("{areaId}/neighbors/{neighborId}")
    public async addNeighbor(
        @Path() areaId: string,
        @Path() neighborId: string
    ): Promise<Area> {
        try {
            return await this.areaService.addNeighbor(areaId, neighborId);
        } catch (error) {
            if (error instanceof AreaNotFoundError) {
                this.setStatus(AreaNotFoundError.httpStatusCode);
                throw error;
            }
            if (error instanceof InvalidDataError) {
                this.setStatus(InvalidDataError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }
    
    /**
     * Remove a neighboring relationship between two areas
     */
    @Delete("{areaId}/neighbors/{neighborId}")
    public async removeNeighbor(
        @Path() areaId: string,
        @Path() neighborId: string
    ): Promise<Area> {
        try {
            return await this.areaService.removeNeighbor(areaId, neighborId);
        } catch (error) {
            if (error instanceof AreaNotFoundError) {
                this.setStatus(AreaNotFoundError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }
    
    /**
     * Check if two areas are neighbors
     */
    @Get("{areaId1}/is-neighbor-of/{areaId2}")
    public async areNeighbors(
        @Path() areaId1: string,
        @Path() areaId2: string
    ): Promise<{ areNeighbors: boolean }> {
        try {
            const result = await this.areaService.areNeighbors(areaId1, areaId2);
            return { areNeighbors: result };
        } catch (error) {
            throw error;
        }
    }
} 