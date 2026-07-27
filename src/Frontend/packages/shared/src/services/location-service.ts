import { VietnamProvince } from '../types/domain.types';
import { apiClient } from './api-client';
import { unwrap } from './service-helpers';

export const locationService = {
  getVietnamProvinces: async (): Promise<VietnamProvince[]> =>
    unwrap(await apiClient.get<VietnamProvince[]>('/api/locations/vietnam-provinces'))
};
