export class MaintenanceNotFoundError extends Error {
    public static readonly httpStatusCode: number = 404;
    
    constructor(message: string = "Maintenance not found") {
        super(message);
        this.name = "MaintenanceNotFoundError";
        Object.setPrototypeOf(this, MaintenanceNotFoundError.prototype);
    }
}
