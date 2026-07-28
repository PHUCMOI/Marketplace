import {
  bidService,
  listingService,
  Listing as ApiListing,
  ListingStatus,
} from '@logistics-marketplace/shared';
import type { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
  Listing,
  fetchListingById,
  fetchListingByIdFailed,
  fetchListingByIdSucceeded,
  fetchListings,
  fetchListingsFailed,
  fetchListingsSucceeded,
} from './listingsSlice';

const mapStatus = (value: ListingStatus): Listing['status'] => {
  if (value === ListingStatus.Open) return 'Active';
  if (value === ListingStatus.Draft) return 'Pending';
  if (value === ListingStatus.Awarded) return 'Completed';
  return 'Cancelled';
};

const mapListing = (item: ApiListing, bidCount: number): Listing => ({
  id: item.id,
  title: item.cargoDescription,
  origin: item.pickupLocationId,
  destination: item.deliveryLocationId,
  weight: item.weight,
  status: mapStatus(item.status),
  createdAt: item.createdAt,
  bidCount,
});

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function* fetchListingsWorker(): SagaIterator {
  try {
    const items: Awaited<ReturnType<typeof listingService.getAll>> = yield call(
      listingService.getAll,
    );
    const bidGroups: Awaited<ReturnType<typeof bidService.getByListing>>[] = yield all(
      items.map((item) => call(bidService.getByListing, item.id)),
    );
    yield put(
      fetchListingsSucceeded(
        items.map((item, index) => mapListing(item, bidGroups[index].length)),
      ),
    );
  } catch (error) {
    yield put(fetchListingsFailed(getErrorMessage(error, 'Failed to fetch listings')));
  }
}

function* fetchListingByIdWorker(
  action: ReturnType<typeof fetchListingById>,
): SagaIterator {
  try {
    const item: Awaited<ReturnType<typeof listingService.getById>> = yield call(
      listingService.getById,
      action.payload,
    );
    const bids: Awaited<ReturnType<typeof bidService.getByListing>> = yield call(
      bidService.getByListing,
      item.id,
    );
    yield put(fetchListingByIdSucceeded(mapListing(item, bids.length)));
  } catch (error) {
    yield put(fetchListingByIdFailed(getErrorMessage(error, 'Failed to fetch listing')));
  }
}

export default function* listingsSaga(): SagaIterator {
  yield takeLatest(fetchListings.type, fetchListingsWorker);
  yield takeLatest(fetchListingById.type, fetchListingByIdWorker);
}
