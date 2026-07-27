export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';
export { Card, CardHeader, CardBody, CardFooter } from './components/Card';
export type { CardProps } from './components/Card';
export { Input } from './components/Input';
export type { InputProps } from './components/Input';
export { Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';
export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';
export { Table } from './components/Table';
export type { TableProps, Column } from './components/Table';
export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant } from './components/Badge';
export { Alert } from './components/Alert';
export type { AlertProps, AlertVariant } from './components/Alert';

export { apiClient } from './services/api-client';
export { authService } from './services/auth-service';
export { useAuthUser } from './hooks/useAuthUser';
export { listingService } from './services/listing-service';
export { locationService } from './services/location-service';
export { bidService } from './services/bid-service';
export { dealService } from './services/deal-service';
export { dispatchService } from './services/dispatch-service';
export { vehicleService, driverService } from './services/fleet-service';

export type { ApiResponse, ApiError } from './types/api.types';
export type { User, LoginRequest, LoginResponse, RegisterRequest, AuthState } from './types/auth.types';
export type { Listing, ListingDetail, CreateListingRequest, ListingLocationInput, VietnamProvince, Bid, Deal, Dispatch, Vehicle, Driver } from './types/domain.types';
export {
  UserRole,
  ListingStatus,
  BidStatus,
  DealStatus,
  DispatchStatus,
  VehicleStatus,
  DriverStatus
} from './types/enums';

export { formatCurrency, formatDate, formatDateTime, formatNumber, formatWeight } from './utils/format';
export { storage, sessionStorage, STORAGE_KEYS } from './utils/storage';