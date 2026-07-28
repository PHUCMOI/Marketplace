import {
  authService,
  bidService,
  listingService,
  Listing as ApiListing,
} from '@logistics-marketplace/shared';
import type { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  Listing,
  fetchAvailableListings,
  fetchAvailableListingsFailed,
  fetchAvailableListingsSucceeded,
  fetchListingById,
  fetchListingByIdFailed,
  fetchListingByIdSucceeded,
  placeBid,
  placeBidFailed,
  placeBidSucceeded,
} from './marketplaceSlice';

const mapListing = (item: ApiListing): Listing => ({
  id: item.id,
  title: item.cargoDescription,
  origin: item.pickupLocationId,
  destination: item.deliveryLocationId,
  pickupDate: item.pickupDate,
  deliveryDate: item.deliveryDate,
  weight: item.weight,
  rate: item.priceAmount ?? 0,
  currency: item.priceCurrency ?? 'VND',
  status: item.status,
});

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }
  return fallback;
}

function* fetchAvailableListingsWorker(): SagaIterator {
  try {
    const listings: Awaited<ReturnType<typeof listingService.getAll>> = yield call(
      listingService.getAll,
    );
    yield put(fetchAvailableListingsSucceeded(listings.map(mapListing)));
  } catch (error) {
    yield put(fetchAvailableListingsFailed(getErrorMessage(error, 'Failed to fetch listings')));
  }
}

function* fetchListingByIdWorker(
  action: ReturnType<typeof fetchListingById>,
): SagaIterator {
  try {
    const listing: Awaited<ReturnType<typeof listingService.getById>> = yield call(
      listingService.getById,
      action.payload,
    );
    yield put(fetchListingByIdSucceeded(mapListing(listing)));
  } catch (error) {
    yield put(fetchListingByIdFailed(getErrorMessage(error, 'Failed to fetch listing')));
  }
}

function* placeBidWorker(action: ReturnType<typeof placeBid>): SagaIterator {
  try {
    const carrierOrgId = authService.getStoredUser()?.organizationId;

    if (!carrierOrgId) {
      throw new Error('Your carrier account is not linked to an organization.');
    }

    const bid: Awaited<ReturnType<typeof bidService.create>> = yield call(
      bidService.create,
      {
        ...action.payload,
        carrierOrgId,
      },
    );
    yield put(placeBidSucceeded(bid.id));
  } catch (error) {
    yield put(placeBidFailed(getErrorMessage(error, 'Unable to place this bid.')));
  }
}

export default function* marketplaceSaga(): SagaIterator {
  yield takeLatest(fetchAvailableListings.type, fetchAvailableListingsWorker);
  yield takeLatest(fetchListingById.type, fetchListingByIdWorker);
  yield takeLatest(placeBid.type, placeBidWorker);
}
