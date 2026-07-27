import { apiClient } from './api-client';
import { unwrap } from './service-helpers';
import { CreateListingRequest, Deal, Listing, ListingDetail } from '../types/domain.types';

export const listingService = {
  getAll: async (): Promise<Listing[]> => unwrap(await apiClient.get<Listing[]>('/api/listings')),
  getById: async (id: string): Promise<ListingDetail> => unwrap(await apiClient.get<ListingDetail>(`/api/listings/${id}`)),
  getForShipper: async (organizationId: string): Promise<Listing[]> =>
    unwrap(await apiClient.get<Listing[]>(`/api/listings/shipper/${organizationId}`)),
  create: async (data: CreateListingRequest): Promise<Listing> =>
    unwrap(await apiClient.post<Listing>('/api/listings', data)),
  update: async (id: string, data: Partial<Listing>): Promise<Listing> =>
    unwrap(await apiClient.put<Listing>(`/api/listings/${id}`, data)),
  remove: async (id: string): Promise<void> => { await apiClient.delete(`/api/listings/${id}`); },
  award: async (listingId: string, bidId: string): Promise<Deal> =>
    unwrap(await apiClient.post<Deal>(`/api/listings/${listingId}/award`, { bidId }))
};