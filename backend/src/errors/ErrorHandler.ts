import { Controller } from "tsoa";
import { InvalidNeighboringAreaError } from "./InvalidNeighboringAreaError";
import { EquipmentNotFoundError } from "./EquipmentNotFoundError";
import { AreaNotFoundError } from "./AreaNotFoundError";
import { InvalidForeignKeyError } from "./InvalidForeignKeyError";
import { InvalidDataError } from "./InvalidDataError";
import { DependencyExistsError } from "./DependencyExistsError";

/**
 * Utility class to handle common errors across controllers
 */
export class ErrorHandler {

  public static handleCommonErrors(controller: Controller, error: Error): any {
    if (error instanceof InvalidNeighboringAreaError) {
      controller.setStatus(InvalidNeighboringAreaError.httpStatusCode);
      return error.toResponse();
    }
    
    if (error instanceof EquipmentNotFoundError) {
      controller.setStatus(EquipmentNotFoundError.httpStatusCode);
      throw error;
    }
    
    if (error instanceof AreaNotFoundError) {
      controller.setStatus(AreaNotFoundError.httpStatusCode);
      throw error;
    }
    
    if (error instanceof InvalidForeignKeyError) {
      controller.setStatus(InvalidForeignKeyError.httpStatusCode);
      throw error;
    }
    
    if (error instanceof InvalidDataError) {
      controller.setStatus(InvalidDataError.httpStatusCode);
      throw error;
    }
    
    if (error instanceof DependencyExistsError) {
      controller.setStatus(DependencyExistsError.httpStatusCode);
      throw error;
    }
    
    throw error;
  }
}
