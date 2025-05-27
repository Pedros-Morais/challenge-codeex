export class InvalidNeighboringAreaError extends Error {
    public static readonly httpStatusCode: number = 422; // Unprocessable Entity
    public areaIds?: string[];
    public details?: string;

    constructor(message: string = "Areas must be neighbors to perform this operation", areaIds?: string[], details?: string) {
        super(message);
        this.name = "InvalidNeighboringAreaError";
        this.areaIds = areaIds;
        this.details = details;
        Object.setPrototypeOf(this, InvalidNeighboringAreaError.prototype);
    }

    public toResponse() {
        return {
            error: this.name,
            message: this.message,
            areaIds: this.areaIds,
            details: this.details
        };
    }
}
