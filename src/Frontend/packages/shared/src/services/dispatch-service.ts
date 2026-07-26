import { apiClient } from './api-client';
import { unwrap } from './service-helpers';
import { Dispatch } from '../types/domain.types';

export const dispatchService = {
  getForCarrier: async (organizationId: string): Promise<Dispatch[]> =>
    unwrap(await apiClient.get<Dispatch[]>(`/api/dispatches/carrier/${organizationId}`)),
  create: async (data: Partial<Dispatch>): Promise<Dispatch> =>
    unwrap(await apiClient.post<Dispatch>('/api/dispatches', data)),
  assign: async (id: string, vehicleId: string, driverId: string): Promise<Dispatch> =>
    unwrap(await apiClient.post<Dispatch>(`/api/dispatches/${id}/assign`, { vehicleId, driverId })),
  updateStatus: async (id: string, status: string, notes?: string): Promise<Dispatch> =>
    unwrap(await apiClient.patch<Dispatch>(`/api/dispatches/${id}/status`, { status, notes }))
};