import { apiClient } from './api-client';
import { unwrap } from './service-helpers';
import { Driver, Vehicle } from '../types/domain.types';

export const vehicleService = {
  getForOrganization: async (organizationId: string): Promise<Vehicle[]> =>
    unwrap(await apiClient.get<Vehicle[]>('/api/vehicles', { params: { organizationId } })),
  create: async (data: Partial<Vehicle>): Promise<Vehicle> =>
    unwrap(await apiClient.post<Vehicle>('/api/vehicles', data))
};
export const driverService = {
  getForOrganization: async (organizationId: string): Promise<Driver[]> =>
    unwrap(await apiClient.get<Driver[]>('/api/drivers', { params: { organizationId } })),
  create: async (data: Partial<Driver>): Promise<Driver> =>
    unwrap(await apiClient.post<Driver>('/api/drivers', data))
};