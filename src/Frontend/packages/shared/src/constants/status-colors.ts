import { BidStatus, DealStatus, DispatchStatus, DriverStatus, ListingStatus, VehicleStatus } from '../types/enums';

export const LISTING_STATUS_COLORS: Record<ListingStatus, string> = {
  [ListingStatus.Draft]: '#6c757d',
  [ListingStatus.Open]: '#28a745',
  [ListingStatus.Awarded]: '#007bff',
  [ListingStatus.Cancelled]: '#dc3545',
  [ListingStatus.Expired]: '#ffc107'
};

export const BID_STATUS_COLORS: Record<BidStatus, string> = {
  [BidStatus.Pending]: '#ffc107',
  [BidStatus.Accepted]: '#28a745',
  [BidStatus.Rejected]: '#dc3545',
  [BidStatus.Withdrawn]: '#6c757d'
};

export const DEAL_STATUS_COLORS: Record<DealStatus, string> = {
  [DealStatus.Active]: '#17a2b8',
  [DealStatus.Completed]: '#28a745',
  [DealStatus.Cancelled]: '#dc3545'
};

export const DISPATCH_STATUS_COLORS: Record<DispatchStatus, string> = {
  [DispatchStatus.Pending]: '#6c757d',
  [DispatchStatus.Assigned]: '#007bff',
  [DispatchStatus.PickedUp]: '#0d6efd',
  [DispatchStatus.EnRoute]: '#17a2b8',
  [DispatchStatus.Delivered]: '#28a745',
  [DispatchStatus.Failed]: '#dc3545',
  [DispatchStatus.Cancelled]: '#6c757d'
};

export const VEHICLE_STATUS_COLORS: Record<VehicleStatus, string> = {
  [VehicleStatus.Available]: '#28a745',
  [VehicleStatus.InUse]: '#007bff',
  [VehicleStatus.Maintenance]: '#ffc107',
  [VehicleStatus.Retired]: '#6c757d'
};

export const DRIVER_STATUS_COLORS: Record<DriverStatus, string> = {
  [DriverStatus.Available]: '#28a745',
  [DriverStatus.OnDuty]: '#007bff',
  [DriverStatus.OffDuty]: '#ffc107',
  [DriverStatus.OnLeave]: '#6c757d'
};