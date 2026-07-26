import { apiClient } from './api-client';
import { unwrap } from './service-helpers';
import { Deal } from '../types/domain.types';

export const dealService = {
  getAll: async (): Promise<Deal[]> => unwrap(await apiClient.get<Deal[]>('/api/deals')),
  getForShipper: async (organizationId: string): Promise<Deal[]> =>
    unwrap(await apiClient.get<Deal[]>(`/api/deals/shipper/${organizationId}`)),
  getForCarrier: async (organizationId: string): Promise<Deal[]> =>
    unwrap(await apiClient.get<Deal[]>(`/api/deals/carrier/${organizationId}`)),
  getById: async (id: string): Promise<Deal> => unwrap(await apiClient.get<Deal>(`/api/deals/${id}`)),
  cancel: async (id: string): Promise<void> => { await apiClient.post(`/api/deals/${id}/cancel`); }
};