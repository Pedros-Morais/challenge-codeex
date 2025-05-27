import { getConnection } from "typeorm";

/**
 * Creates the necessary tables for the application features:
 * - Neighboring areas and multiple areas for equipment
 * - Maintenance schedules for parts
 */
export async function runMigration(): Promise<void> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    
    await queryRunner.startTransaction();
    
    try {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS area_neighbors (
                areaId VARCHAR(36) NOT NULL,
                neighborId VARCHAR(36) NOT NULL,
                PRIMARY KEY (areaId, neighborId),
                FOREIGN KEY (areaId) REFERENCES area (id) ON DELETE CASCADE,
                FOREIGN KEY (neighborId) REFERENCES area (id) ON DELETE CASCADE
            )
        `);
        
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS equipment_areas (
                equipmentId VARCHAR(36) NOT NULL,
                areaId VARCHAR(36) NOT NULL,
                PRIMARY KEY (equipmentId, areaId),
                FOREIGN KEY (equipmentId) REFERENCES equipment (id) ON DELETE CASCADE,
                FOREIGN KEY (areaId) REFERENCES area (id) ON DELETE CASCADE
            )
        `);
        
        await queryRunner.query(`
            INSERT INTO equipment_areas (equipmentId, areaId)
            SELECT id, areaId FROM equipment
            WHERE areaId IS NOT NULL
        `);
        
        await queryRunner.query(`
            PRAGMA foreign_keys = OFF;
            
            CREATE TABLE equipment_temp (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                manufacturer VARCHAR(255) NOT NULL,
                serialNumber VARCHAR(255) NOT NULL,
                initialOperationsDate DATE NOT NULL,
                areaId VARCHAR(36),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (areaId) REFERENCES area (id)
            );
            
            INSERT INTO equipment_temp
            SELECT * FROM equipment;
            
            DROP TABLE equipment;
            
            ALTER TABLE equipment_temp RENAME TO equipment;
            
            PRAGMA foreign_keys = ON;
        `);
        
        const maintenanceTableExists = await queryRunner.hasTable("maintenance");
        if (!maintenanceTableExists) {
            await queryRunner.query(`
                CREATE TABLE "maintenance" (
                    "id" varchar PRIMARY KEY NOT NULL,
                    "title" varchar NOT NULL,
                    "description" text,
                    "dueDate" datetime NOT NULL,
                    "status" varchar NOT NULL DEFAULT 'scheduled',
                    "frequency" varchar NOT NULL DEFAULT 'monthly',
                    "customDays" integer,
                    "referenceType" varchar NOT NULL DEFAULT 'part-installation',
                    "partId" varchar NOT NULL,
                    "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                    "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                    CONSTRAINT "FK_maintenance_part" FOREIGN KEY ("partId") REFERENCES "part" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
                )
            `);
            console.log("Created maintenance table");
        }
        
        await queryRunner.commitTransaction();
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}
