import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Plant {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Area {
  id: string;
  name: string;
  locationDescription: string;
  plantId: string;
  plant?: Plant;
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  serialNumber: string;
  initialOperationsDate: string;
  areaId: string;
  area?: Area;
  createdAt: string;
  updatedAt: string;
}

export enum PartType {
  ELECTRIC = "electric",
  ELECTRONIC = "electronic",
  MECHANICAL = "mechanical",
  HYDRAULICAL = "hydraulical"
}

export interface Part {
  id: string;
  name: string;
  type: PartType;
  manufacturer: string;
  serialNumber: string;
  installationDate: string;
  equipmentId: string;
  equipment?: Equipment;
  createdAt: string;
  updatedAt: string;
}

export const plantApi = {
  getAll: () => api.get<Plant[]>('/plants'),
  getById: (id: string) => api.get<Plant>(`/plants/${id}`),
  create: (data: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>) => api.post<Plant>('/plants', data),
  update: (id: string, data: Partial<Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Plant>(`/plants/${id}`, data),
  delete: (id: string) => api.delete(`/plants/${id}`),
};

export const areaApi = {
  getAll: () => api.get<Area[]>('/areas'),
  getById: (id: string) => api.get<Area>(`/areas/${id}`),
  create: (data: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>) => api.post<Area>('/areas', data),
  update: (id: string, data: Partial<Omit<Area, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Area>(`/areas/${id}`, data),
  delete: (id: string) => api.delete(`/areas/${id}`),
};

export const equipmentApi = {
  getAll: () => api.get<Equipment[]>('/equipment'),
  getById: (id: string) => api.get<Equipment>(`/equipment/${id}`),
  create: (data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Equipment>('/equipment', data),
  update: (id: string, data: Partial<Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Equipment>(`/equipment/${id}`, data),
  delete: (id: string) => api.delete(`/equipment/${id}`),
};

export const partApi = {
  getAll: () => api.get<Part[]>('/parts'),
  getById: (id: string) => api.get<Part>(`/parts/${id}`),
  create: (data: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>) => api.post<Part>('/parts', data),
  update: (id: string, data: Partial<Omit<Part, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Part>(`/parts/${id}`, data),
  delete: (id: string) => api.delete(`/parts/${id}`),
};

export enum MaintenanceStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  OVERDUE = "overdue",
  CANCELED = "canceled"
}

export enum MaintenanceFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  SEMI_ANNUAL = "semi-annual",
  ANNUAL = "annual",
  CUSTOM = "custom"
}

export enum MaintenanceReferenceType {
  PART_INSTALLATION = "part-installation",
  EQUIPMENT_OPERATION = "equipment-operation",
  FIXED_DATE = "fixed-date"
}

export interface Maintenance {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: MaintenanceStatus;
  frequency: MaintenanceFrequency;
  customDays?: number;
  referenceType: MaintenanceReferenceType;
  partId: string;
  part?: Part;
  createdAt: string;
  updatedAt: string;
}

export const maintenanceApi = {
  getAll: () => api.get<Maintenance[]>('/maintenance'),
  getFuture: () => api.get<Maintenance[]>('/maintenance/future'),
  getById: (id: string) => api.get<Maintenance>(`/maintenance/${id}`),
  create: (data: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<Maintenance>('/maintenance', data),
  update: (id: string, data: Partial<Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Maintenance>(`/maintenance/${id}`, data),
  delete: (id: string) => api.delete(`/maintenance/${id}`),
  updateStatus: (id: string, status: MaintenanceStatus) =>
    api.put<Maintenance>(`/maintenance/${id}/status`, { status }),
  getByPart: (partId: string) => api.get<Maintenance[]>(`/maintenance/part/${partId}`),
}; 