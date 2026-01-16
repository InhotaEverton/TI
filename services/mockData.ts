import { MOCK_ASSETS, MOCK_HISTORY, MOCK_MAINTENANCE, MOCK_SECTORS, MOCK_USERS } from '../constants';

export const getAssets = () => Promise.resolve(MOCK_ASSETS);
export const getSectors = () => Promise.resolve(MOCK_SECTORS);
export const getUsers = () => Promise.resolve(MOCK_USERS);
export const getHistory = () => Promise.resolve(MOCK_HISTORY);
export const getMaintenance = () => Promise.resolve(MOCK_MAINTENANCE);