import { Asset, MaintenanceRecord, MovementHistory, Sector, User, UserRole } from './types';

// Users - Creating a default admin for internal logic mapping, though auth is handled in App.tsx
export const MOCK_USERS: User[] = [
  { id: '1', name: 'Administrador', email: 'admin@santacasa.com.br', role: UserRole.ADMIN },
];

// Empty Data Sets
export const MOCK_SECTORS: Sector[] = [];
export const MOCK_ASSETS: Asset[] = [];
export const MOCK_HISTORY: MovementHistory[] = [];
export const MOCK_MAINTENANCE: MaintenanceRecord[] = [];