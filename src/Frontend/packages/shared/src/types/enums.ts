export enum UserRole {
  Admin = 'Admin',
  Shipper = 'Shipper',
  Carrier = 'Carrier',
  Broker = 'Broker',
  Dispatcher = 'Dispatcher'
}
export enum ListingStatus { Draft = 'Draft', Open = 'Open', Awarded = 'Awarded', Cancelled = 'Cancelled', Expired = 'Expired' }
export enum BidStatus { Pending = 'Pending', Accepted = 'Accepted', Rejected = 'Rejected', Withdrawn = 'Withdrawn' }
export enum DealStatus { Active = 'Active', Completed = 'Completed', Cancelled = 'Cancelled' }
export enum DispatchStatus { Pending = 'Pending', Assigned = 'Assigned', PickedUp = 'PickedUp', EnRoute = 'EnRoute', Delivered = 'Delivered', Failed = 'Failed', Cancelled = 'Cancelled' }
export enum VehicleStatus { Available = 'Available', InUse = 'InUse', Maintenance = 'Maintenance', Retired = 'Retired' }
export enum DriverStatus { Available = 'Available', OnDuty = 'OnDuty', OffDuty = 'OffDuty', OnLeave = 'OnLeave' }