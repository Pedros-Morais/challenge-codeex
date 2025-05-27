import { Body, Controller, Get, Path, Post, Put, Delete, Route, Tags } from "tsoa";
import { Maintenance, MaintenanceStatus } from "../models/Maintenance";
import { MaintenanceService } from "../services/MaintenanceService";
import { MaintenanceNotFoundError } from "../errors/MaintenanceNotFoundError";
import { PartNotFoundError } from "../errors/PartNotFoundError";
import { InvalidDataError } from "../errors/InvalidDataError";
import { ErrorHandler } from "../errors/ErrorHandler";

@Route("maintenance")
@Tags("Maintenance")
export class MaintenanceController extends Controller {
    private maintenanceService: MaintenanceService;

    constructor() {
        super();
        this.maintenanceService = new MaintenanceService();
    }

    @Get()
    public async getMaintenances(): Promise<Maintenance[]> {
        return this.maintenanceService.findAll();
    }

    @Get("future")
    public async getFutureMaintenances(): Promise<Maintenance[]> {
        return this.maintenanceService.findFuture();
    }

    @Get("{maintenanceId}")
    public async getMaintenance(@Path() maintenanceId: string): Promise<Maintenance> {
        try {
            return await this.maintenanceService.findById(maintenanceId);
        } catch (error) {
            return ErrorHandler.handleCommonErrors(this, error);
        }
    }

    @Post()
    public async createMaintenance(@Body() requestBody: Omit<Maintenance, "id" | "createdAt" | "updatedAt">): Promise<Maintenance> {
        try {
            return await this.maintenanceService.create(requestBody);
        } catch (error) {
            if (error instanceof PartNotFoundError) {
                this.setStatus(PartNotFoundError.httpStatusCode);
                throw error;
            }
            if (error instanceof InvalidDataError) {
                this.setStatus(InvalidDataError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Put("{maintenanceId}")
    public async updateMaintenance(
        @Path() maintenanceId: string,
        @Body() requestBody: Partial<Omit<Maintenance, "id" | "createdAt" | "updatedAt">>
    ): Promise<Maintenance> {
        try {
            return await this.maintenanceService.update(maintenanceId, requestBody);
        } catch (error) {
            if (error instanceof MaintenanceNotFoundError) {
                this.setStatus(MaintenanceNotFoundError.httpStatusCode);
                throw error;
            }
            if (error instanceof PartNotFoundError) {
                this.setStatus(PartNotFoundError.httpStatusCode);
                throw error;
            }
            if (error instanceof InvalidDataError) {
                this.setStatus(InvalidDataError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Delete("{maintenanceId}")
    public async deleteMaintenance(@Path() maintenanceId: string): Promise<void> {
        try {
            await this.maintenanceService.delete(maintenanceId);
            this.setStatus(204);
        } catch (error) {
            if (error instanceof MaintenanceNotFoundError) {
                this.setStatus(MaintenanceNotFoundError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Get("part/{partId}")
    public async getMaintenancesByPart(@Path() partId: string): Promise<Maintenance[]> {
        try {
            return await this.maintenanceService.getByPart(partId);
        } catch (error) {
            if (error instanceof PartNotFoundError) {
                this.setStatus(PartNotFoundError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }

    @Put("{maintenanceId}/status")
    public async updateMaintenanceStatus(
        @Path() maintenanceId: string,
        @Body() requestBody: { status: MaintenanceStatus }
    ): Promise<Maintenance> {
        try {
            return await this.maintenanceService.updateStatus(maintenanceId, requestBody.status);
        } catch (error) {
            if (error instanceof MaintenanceNotFoundError) {
                this.setStatus(MaintenanceNotFoundError.httpStatusCode);
                throw error;
            }
            throw error;
        }
    }
}
