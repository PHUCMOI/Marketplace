import { BidStatus, DealStatus, DispatchStatus, DriverStatus, ListingStatus, VehicleStatus } from './enums';

export interface Listing {
  id: string;
  shipperOrgId: string;
  pickupLocationId: string;
  deliveryLocationId: string;
  pickupDate: string;
  deliveryDate: string;
  cargoDescription: string;
  weight: number;
  status: ListingStatus;
  priceAmount?: number;
  priceCurrency?: string;
  createdBy: string;
  createdAt: string;
}

export interface ListingDetail extends Listing {
  bidsCount: number;
  lowestBidAmount?: number;
  bids: Bid[];
}

export interface Bid {
  id: string;
  listingId: string;
  carrierOrgId: string;
  proposedPriceAmount: number;
  proposedPriceCurrency: string;
  message?: string;
  status: BidStatus;
  createdBy: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  listingId: string;
  acceptedBidId: string;
  shipperOrgId: string;
  carrierOrgId: string;
  agreedPriceAmount: number;
  agreedPriceCurrency: string;
  status: DealStatus;
  createdAt: string;
  completedAt?: string;
}

export interface Dispatch {
  id: string;
  dealId: string;
  carrierOrgId: string;
  vehicleId?: string;
  driverId?: string;
  status: DispatchStatus;
  scheduledPickup: string;
  scheduledDelivery: string;
  actualPickup?: string;
  actualDelivery?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  capacity: number;
  status: VehicleStatus;
  organizationId: string;
  currentLocation?: string;
}

export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  status: DriverStatus;
  phone: string;
  organizationId: string;
}