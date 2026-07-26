import { apiClient } from './api-client';
import { unwrap } from './service-helpers';
import { Bid } from '../types/domain.types';

export const bidService = {
  getByListing: async (listingId: string): Promise<Bid[]> =>
    unwrap(await apiClient.get<Bid[]>(`/api/bids/listing/${listingId}`)),
  getForCarrier: async (organizationId: string): Promise<Bid[]> =>
    unwrap(await apiClient.get<Bid[]>(`/api/bids/carrier/${organizationId}`)),
  create: async (data: Partial<Bid>): Promise<Bid> => unwrap(await apiClient.post<Bid>('/api/bids', data)),
  withdraw: async (id: string): Promise<void> => { await apiClient.delete(`/api/bids/${id}`); }
};