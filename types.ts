export enum UserRole {
  ADMIN = 'ADMIN',
  TECH = 'TECH',
  MANAGER = 'MANAGER',
  AUDITOR = 'AUDITOR'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export enum AssetStatus {
  IN_USE = 'Em Uso',
  STORAGE = 'Em Estoque',
  MAINTENANCE = 'Em Manutenção',
  DISPOSED = 'Desativado',
  LOST = 'Perdido/Extraviado'
}

export enum AssetType {
  DESKTOP = 'Desktop',
  NOTEBOOK = 'Notebook',
  SERVER = 'Servidor',
  MONITOR = 'Monitor',
  PRINTER = 'Impressora',
  NETWORK = 'Rede (Switch/Router)',
  MEDICAL_IT = 'TI Médica',
  MOBILE = 'Tablet/Celular',
  PERIPHERAL = 'Periférico',
  OTHER = 'Outro'
}

export interface Sector {
  id: string;
  name: string;
  floor?: string;
}

export enum MaintenanceType {
  PREVENTIVE = 'Preventiva',
  CORRECTIVE = 'Corretiva',
  PREDICTIVE = 'Preditiva',
  INSTALLATION = 'Instalação/Configuração'
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  type: MaintenanceType;
  startDate: string; // Data Inicial
  endDate?: string; // Data Conclusão
  nextMaintenanceDate?: string; // Próxima manutenção
  technicianName: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  cost?: number;
}

export interface MovementHistory {
  id: string;
  assetId: string;
  timestamp: string;
  userId: string; // Who performed the action
  userName: string;
  fromSector?: string;
  toSector: string;
  fromResponsible?: string;
  toResponsible?: string;
  reason: string;
}

export interface Asset {
  id: string;
  patrimonyCode: string; // Unique identifier
  serialNumber: string;
  type: AssetType;
  brand: string;
  model: string;
  acquisitionDate: string;
  supplier: string;
  status: AssetStatus;
  sectorId: string;
  responsiblePerson: string;
  notes?: string;
  imageUrl?: string;
  // Computed/Related
  lastMaintenanceDate?: string;
}