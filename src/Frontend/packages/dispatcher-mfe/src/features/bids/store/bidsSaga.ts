import {
  bidService,
  listingService,
  Bid as ApiBid,
} from '@logistics-marketplace/shared';
import type { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
  Bid,
  fetchBidById,
  fetchBidByIdFailed,
  fetchBidByIdSucceeded,
  fetchBids,
  fetchBidsFailed,
  fetchBidsSucceeded,
} from './bidsSlice';

const mapBid = (item: ApiBid, listingTitle: string): Bid => ({
  id: item.id,
  listingId: item.listingId,
  listingTitle,
  carrierName: item.carrierOrgId,
  amount: item.proposedPriceAmount,
  status: item.status === 'Withdrawn' ? 'Rejected' : item.status,
  submittedAt: item.createdAt,
  estimatedDelivery: '',
});

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function* loadBids(): SagaIterator {
  const listings: Awaited<ReturnType<typeof listingService.getAll>> = yield call(
    listingService.getAll,
  );
  const bidGroups: Awaited<ReturnType<typeof bidService.getByListing>>[] = yield all(
    listings.map((listing) => call(bidService.getByListing, listing.id)),
  );

  return bidGroups.flatMap((bids, index) =>
    bids.map((bid) => mapBid(bid, listings[index].cargoDescription)),
  );
}

function* fetchBidsWorker(): SagaIterator {
  try {
    const bids: Bid[] = yield call(loadBids);
    yield put(fetchBidsSucceeded(bids));
  } catch (error) {
    yield put(fetchBidsFailed(getErrorMessage(error, 'Failed to fetch bids')));
  }
}

function* fetchBidByIdWorker(action: ReturnType<typeof fetchBidById>): SagaIterator {
  try {
    const bids: Bid[] = yield call(loadBids);
    const bid = bids.find((item) => item.id === action.payload);

    if (!bid) {
      throw new Error('Bid not found');
    }

    yield put(fetchBidByIdSucceeded(bid));
  } catch (error) {
    yield put(fetchBidByIdFailed(getErrorMessage(error, 'Failed to fetch bid')));
  }
}

export default function* bidsSaga(): SagaIterator {
  yield takeLatest(fetchBids.type, fetchBidsWorker);
  yield takeLatest(fetchBidById.type, fetchBidByIdWorker);
}
