/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PlantController } from './../controllers/PlantController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PartController } from './../controllers/PartController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MaintenanceController } from './../controllers/MaintenanceController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EquipmentController } from './../controllers/EquipmentController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AreaController } from './../controllers/AreaController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Plant": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "address": {"dataType":"string","required":true},
            "areas": {"dataType":"array","array":{"dataType":"refObject","ref":"Area"}},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Area": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "locationDescription": {"dataType":"string","required":true},
            "plant": {"ref":"Plant"},
            "plantId": {"dataType":"string","required":true},
            "equipment": {"dataType":"array","array":{"dataType":"refObject","ref":"Equipment"}},
            "neighbors": {"dataType":"array","array":{"dataType":"refObject","ref":"Area"}},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PartType": {
        "dataType": "refEnum",
        "enums": ["electric","electronic","mechanical","hydraulical"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Equipment": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "manufacturer": {"dataType":"string","required":true},
            "serialNumber": {"dataType":"string","required":true},
            "initialOperationsDate": {"dataType":"datetime","required":true},
            "area": {"ref":"Area"},
            "areaId": {"dataType":"string"},
            "areas": {"dataType":"array","array":{"dataType":"refObject","ref":"Area"}},
            "parts": {"dataType":"array","array":{"dataType":"refObject","ref":"Part"}},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Part": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"ref":"PartType","required":true},
            "manufacturer": {"dataType":"string","required":true},
            "serialNumber": {"dataType":"string","required":true},
            "installationDate": {"dataType":"datetime","required":true},
            "equipment": {"ref":"Equipment"},
            "equipmentId": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Plant.name-or-address_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"address":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Pick_Plant.name-or-address__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string"},"address":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Part.Exclude_keyofPart.id-or-createdAt-or-updatedAt__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"type":{"ref":"PartType","required":true},"manufacturer":{"dataType":"string","required":true},"serialNumber":{"dataType":"string","required":true},"installationDate":{"dataType":"datetime","required":true},"equipment":{"ref":"Equipment"},"equipmentId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Part.id-or-createdAt-or-updatedAt_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Part.Exclude_keyofPart.id-or-createdAt-or-updatedAt__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Omit_Part.id-or-createdAt-or-updatedAt__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string"},"type":{"ref":"PartType"},"manufacturer":{"dataType":"string"},"serialNumber":{"dataType":"string"},"installationDate":{"dataType":"datetime"},"equipment":{"ref":"Equipment"},"equipmentId":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MaintenanceStatus": {
        "dataType": "refEnum",
        "enums": ["scheduled","completed","overdue","canceled"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MaintenanceFrequency": {
        "dataType": "refEnum",
        "enums": ["daily","weekly","monthly","quarterly","semi-annual","annual","custom"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MaintenanceReferenceType": {
        "dataType": "refEnum",
        "enums": ["part-installation","equipment-operation","fixed-date"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Maintenance": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "dueDate": {"dataType":"datetime","required":true},
            "status": {"ref":"MaintenanceStatus","required":true},
            "frequency": {"ref":"MaintenanceFrequency","required":true},
            "customDays": {"dataType":"double"},
            "referenceType": {"ref":"MaintenanceReferenceType","required":true},
            "part": {"ref":"Part"},
            "partId": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Maintenance.Exclude_keyofMaintenance.id-or-createdAt-or-updatedAt__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"title":{"dataType":"string","required":true},"description":{"dataType":"string"},"dueDate":{"dataType":"datetime","required":true},"status":{"ref":"MaintenanceStatus","required":true},"frequency":{"ref":"MaintenanceFrequency","required":true},"customDays":{"dataType":"double"},"referenceType":{"ref":"MaintenanceReferenceType","required":true},"part":{"ref":"Part"},"partId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Maintenance.id-or-createdAt-or-updatedAt_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Maintenance.Exclude_keyofMaintenance.id-or-createdAt-or-updatedAt__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Omit_Maintenance.id-or-createdAt-or-updatedAt__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"title":{"dataType":"string"},"description":{"dataType":"string"},"dueDate":{"dataType":"datetime"},"status":{"ref":"MaintenanceStatus"},"frequency":{"ref":"MaintenanceFrequency"},"customDays":{"dataType":"double"},"referenceType":{"ref":"MaintenanceReferenceType"},"part":{"ref":"Part"},"partId":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Equipment.Exclude_keyofEquipment.id-or-createdAt-or-updatedAt__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"manufacturer":{"dataType":"string","required":true},"serialNumber":{"dataType":"string","required":true},"initialOperationsDate":{"dataType":"datetime","required":true},"area":{"ref":"Area"},"areaId":{"dataType":"string"},"areas":{"dataType":"array","array":{"dataType":"refObject","ref":"Area"}},"parts":{"dataType":"array","array":{"dataType":"refObject","ref":"Part"}}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Equipment.id-or-createdAt-or-updatedAt_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Equipment.Exclude_keyofEquipment.id-or-createdAt-or-updatedAt__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Omit_Equipment.id-or-createdAt-or-updatedAt__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string"},"manufacturer":{"dataType":"string"},"serialNumber":{"dataType":"string"},"initialOperationsDate":{"dataType":"datetime"},"area":{"ref":"Area"},"areaId":{"dataType":"string"},"areas":{"dataType":"array","array":{"dataType":"refObject","ref":"Area"}},"parts":{"dataType":"array","array":{"dataType":"refObject","ref":"Part"}}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Area.name-or-locationDescription-or-plantId_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"locationDescription":{"dataType":"string","required":true},"plantId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Pick_Area.name-or-locationDescription__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string"},"locationDescription":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsPlantController_getPlants: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/plants',
            ...(fetchMiddlewares<RequestHandler>(PlantController)),
            ...(fetchMiddlewares<RequestHandler>(PlantController.prototype.getPlants)),

            async function PlantController_getPlants(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlantController_getPlants, request, response });

                const controller = new PlantController();

              await templateService.apiHandler({
                methodName: 'getPlants',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlantController_getPlant: Record<string, TsoaRoute.ParameterSchema> = {
                plantId: {"in":"path","name":"plantId","required":true,"dataType":"string"},
        };
        app.get('/plants/:plantId',
            ...(fetchMiddlewares<RequestHandler>(PlantController)),
            ...(fetchMiddlewares<RequestHandler>(PlantController.prototype.getPlant)),

            async function PlantController_getPlant(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlantController_getPlant, request, response });

                const controller = new PlantController();

              await templateService.apiHandler({
                methodName: 'getPlant',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlantController_createPlant: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Pick_Plant.name-or-address_"},
        };
        app.post('/plants',
            ...(fetchMiddlewares<RequestHandler>(PlantController)),
            ...(fetchMiddlewares<RequestHandler>(PlantController.prototype.createPlant)),

            async function PlantController_createPlant(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlantController_createPlant, request, response });

                const controller = new PlantController();

              await templateService.apiHandler({
                methodName: 'createPlant',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlantController_updatePlant: Record<string, TsoaRoute.ParameterSchema> = {
                plantId: {"in":"path","name":"plantId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_Pick_Plant.name-or-address__"},
        };
        app.put('/plants/:plantId',
            ...(fetchMiddlewares<RequestHandler>(PlantController)),
            ...(fetchMiddlewares<RequestHandler>(PlantController.prototype.updatePlant)),

            async function PlantController_updatePlant(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlantController_updatePlant, request, response });

                const controller = new PlantController();

              await templateService.apiHandler({
                methodName: 'updatePlant',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlantController_deletePlant: Record<string, TsoaRoute.ParameterSchema> = {
                plantId: {"in":"path","name":"plantId","required":true,"dataType":"string"},
        };
        app.delete('/plants/:plantId',
            ...(fetchMiddlewares<RequestHandler>(PlantController)),
            ...(fetchMiddlewares<RequestHandler>(PlantController.prototype.deletePlant)),

            async function PlantController_deletePlant(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlantController_deletePlant, request, response });

                const controller = new PlantController();

              await templateService.apiHandler({
                methodName: 'deletePlant',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPartController_getParts: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/parts',
            ...(fetchMiddlewares<RequestHandler>(PartController)),
            ...(fetchMiddlewares<RequestHandler>(PartController.prototype.getParts)),

            async function PartController_getParts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPartController_getParts, request, response });

                const controller = new PartController();

              await templateService.apiHandler({
                methodName: 'getParts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPartController_getPartById: Record<string, TsoaRoute.ParameterSchema> = {
                partId: {"in":"path","name":"partId","required":true,"dataType":"string"},
        };
        app.get('/parts/:partId',
            ...(fetchMiddlewares<RequestHandler>(PartController)),
            ...(fetchMiddlewares<RequestHandler>(PartController.prototype.getPartById)),

            async function PartController_getPartById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPartController_getPartById, request, response });

                const controller = new PartController();

              await templateService.apiHandler({
                methodName: 'getPartById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPartController_createPart: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Omit_Part.id-or-createdAt-or-updatedAt_"},
        };
        app.post('/parts',
            ...(fetchMiddlewares<RequestHandler>(PartController)),
            ...(fetchMiddlewares<RequestHandler>(PartController.prototype.createPart)),

            async function PartController_createPart(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPartController_createPart, request, response });

                const controller = new PartController();

              await templateService.apiHandler({
                methodName: 'createPart',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPartController_updatePart: Record<string, TsoaRoute.ParameterSchema> = {
                partId: {"in":"path","name":"partId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_Omit_Part.id-or-createdAt-or-updatedAt__"},
        };
        app.put('/parts/:partId',
            ...(fetchMiddlewares<RequestHandler>(PartController)),
            ...(fetchMiddlewares<RequestHandler>(PartController.prototype.updatePart)),

            async function PartController_updatePart(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPartController_updatePart, request, response });

                const controller = new PartController();

              await templateService.apiHandler({
                methodName: 'updatePart',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPartController_deletePart: Record<string, TsoaRoute.ParameterSchema> = {
                partId: {"in":"path","name":"partId","required":true,"dataType":"string"},
        };
        app.delete('/parts/:partId',
            ...(fetchMiddlewares<RequestHandler>(PartController)),
            ...(fetchMiddlewares<RequestHandler>(PartController.prototype.deletePart)),

            async function PartController_deletePart(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPartController_deletePart, request, response });

                const controller = new PartController();

              await templateService.apiHandler({
                methodName: 'deletePart',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_getMaintenances: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/maintenance',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.getMaintenances)),

            async function MaintenanceController_getMaintenances(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_getMaintenances, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'getMaintenances',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_getFutureMaintenances: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/maintenance/future',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.getFutureMaintenances)),

            async function MaintenanceController_getFutureMaintenances(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_getFutureMaintenances, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'getFutureMaintenances',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_getMaintenance: Record<string, TsoaRoute.ParameterSchema> = {
                maintenanceId: {"in":"path","name":"maintenanceId","required":true,"dataType":"string"},
        };
        app.get('/maintenance/:maintenanceId',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.getMaintenance)),

            async function MaintenanceController_getMaintenance(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_getMaintenance, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'getMaintenance',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_createMaintenance: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Omit_Maintenance.id-or-createdAt-or-updatedAt_"},
        };
        app.post('/maintenance',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.createMaintenance)),

            async function MaintenanceController_createMaintenance(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_createMaintenance, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'createMaintenance',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_updateMaintenance: Record<string, TsoaRoute.ParameterSchema> = {
                maintenanceId: {"in":"path","name":"maintenanceId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_Omit_Maintenance.id-or-createdAt-or-updatedAt__"},
        };
        app.put('/maintenance/:maintenanceId',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.updateMaintenance)),

            async function MaintenanceController_updateMaintenance(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_updateMaintenance, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'updateMaintenance',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_deleteMaintenance: Record<string, TsoaRoute.ParameterSchema> = {
                maintenanceId: {"in":"path","name":"maintenanceId","required":true,"dataType":"string"},
        };
        app.delete('/maintenance/:maintenanceId',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.deleteMaintenance)),

            async function MaintenanceController_deleteMaintenance(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_deleteMaintenance, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'deleteMaintenance',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_getMaintenancesByPart: Record<string, TsoaRoute.ParameterSchema> = {
                partId: {"in":"path","name":"partId","required":true,"dataType":"string"},
        };
        app.get('/maintenance/part/:partId',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.getMaintenancesByPart)),

            async function MaintenanceController_getMaintenancesByPart(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_getMaintenancesByPart, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'getMaintenancesByPart',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMaintenanceController_updateMaintenanceStatus: Record<string, TsoaRoute.ParameterSchema> = {
                maintenanceId: {"in":"path","name":"maintenanceId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"status":{"ref":"MaintenanceStatus","required":true}}},
        };
        app.put('/maintenance/:maintenanceId/status',
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController)),
            ...(fetchMiddlewares<RequestHandler>(MaintenanceController.prototype.updateMaintenanceStatus)),

            async function MaintenanceController_updateMaintenanceStatus(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMaintenanceController_updateMaintenanceStatus, request, response });

                const controller = new MaintenanceController();

              await templateService.apiHandler({
                methodName: 'updateMaintenanceStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_getEquipment: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/equipment',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.getEquipment)),

            async function EquipmentController_getEquipment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_getEquipment, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'getEquipment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_getEquipmentById: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentId: {"in":"path","name":"equipmentId","required":true,"dataType":"string"},
        };
        app.get('/equipment/:equipmentId',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.getEquipmentById)),

            async function EquipmentController_getEquipmentById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_getEquipmentById, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'getEquipmentById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_createEquipment: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Omit_Equipment.id-or-createdAt-or-updatedAt_"},
        };
        app.post('/equipment',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.createEquipment)),

            async function EquipmentController_createEquipment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_createEquipment, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'createEquipment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_updateEquipment: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentId: {"in":"path","name":"equipmentId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_Omit_Equipment.id-or-createdAt-or-updatedAt__"},
        };
        app.put('/equipment/:equipmentId',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.updateEquipment)),

            async function EquipmentController_updateEquipment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_updateEquipment, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'updateEquipment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_deleteEquipment: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentId: {"in":"path","name":"equipmentId","required":true,"dataType":"string"},
        };
        app.delete('/equipment/:equipmentId',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.deleteEquipment)),

            async function EquipmentController_deleteEquipment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_deleteEquipment, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'deleteEquipment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_getEquipmentAreas: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentId: {"in":"path","name":"equipmentId","required":true,"dataType":"string"},
        };
        app.get('/equipment/:equipmentId/areas',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.getEquipmentAreas)),

            async function EquipmentController_getEquipmentAreas(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_getEquipmentAreas, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'getEquipmentAreas',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_addEquipmentToArea: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentId: {"in":"path","name":"equipmentId","required":true,"dataType":"string"},
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
        };
        app.post('/equipment/:equipmentId/areas/:areaId',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.addEquipmentToArea)),

            async function EquipmentController_addEquipmentToArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_addEquipmentToArea, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'addEquipmentToArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_removeEquipmentFromArea: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentId: {"in":"path","name":"equipmentId","required":true,"dataType":"string"},
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
        };
        app.delete('/equipment/:equipmentId/areas/:areaId',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.removeEquipmentFromArea)),

            async function EquipmentController_removeEquipmentFromArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_removeEquipmentFromArea, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'removeEquipmentFromArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_getAreas: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/areas',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.getAreas)),

            async function AreaController_getAreas(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_getAreas, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'getAreas',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_getArea: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
        };
        app.get('/areas/:areaId',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.getArea)),

            async function AreaController_getArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_getArea, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'getArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_createArea: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Pick_Area.name-or-locationDescription-or-plantId_"},
        };
        app.post('/areas',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.createArea)),

            async function AreaController_createArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_createArea, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'createArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_updateArea: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_Pick_Area.name-or-locationDescription__"},
        };
        app.put('/areas/:areaId',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.updateArea)),

            async function AreaController_updateArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_updateArea, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'updateArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_deleteArea: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
        };
        app.delete('/areas/:areaId',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.deleteArea)),

            async function AreaController_deleteArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_deleteArea, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'deleteArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_getNeighbors: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
        };
        app.get('/areas/:areaId/neighbors',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.getNeighbors)),

            async function AreaController_getNeighbors(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_getNeighbors, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'getNeighbors',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_addNeighbor: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
                neighborId: {"in":"path","name":"neighborId","required":true,"dataType":"string"},
        };
        app.post('/areas/:areaId/neighbors/:neighborId',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.addNeighbor)),

            async function AreaController_addNeighbor(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_addNeighbor, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'addNeighbor',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_removeNeighbor: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
                neighborId: {"in":"path","name":"neighborId","required":true,"dataType":"string"},
        };
        app.delete('/areas/:areaId/neighbors/:neighborId',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.removeNeighbor)),

            async function AreaController_removeNeighbor(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_removeNeighbor, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'removeNeighbor',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_areNeighbors: Record<string, TsoaRoute.ParameterSchema> = {
                areaId1: {"in":"path","name":"areaId1","required":true,"dataType":"string"},
                areaId2: {"in":"path","name":"areaId2","required":true,"dataType":"string"},
        };
        app.get('/areas/:areaId1/is-neighbor-of/:areaId2',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.areNeighbors)),

            async function AreaController_areNeighbors(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_areNeighbors, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'areNeighbors',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
