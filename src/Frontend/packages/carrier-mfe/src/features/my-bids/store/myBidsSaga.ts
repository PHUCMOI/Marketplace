import { authService, bidService } from '@logistics-marketplace/shared';
import type { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { Bid, fetchMyBids, fetchMyBidsFailed, fetchMyBidsSucceeded } from './myBidsSlice';

function* fetchMyBidsWorker(): SagaIterator {
  try {
    const organizationId = authService.getStoredUser()?.organizationId;

    if (!organizationId) {
      throw new Error('Carrier organization is required');
    }

    const items: Awaited<ReturnType<typeof bidService.getForCarrier>> = yield call(
      bidService.getForCarrier,
      organizationId,
    );
    const bids: Bid[] = items.map((item) => ({
      id: item.id,
      listingId: item.listingId,
      listingTitle: item.listingId,
      bidAmount: item.proposedPriceAmount,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.createdAt,
    }));

    yield put(fetchMyBidsSucceeded(bids));
  } catch (error) {
    yield put(
      fetchMyBidsFailed(error instanceof Error ? error.message : 'Failed to fetch bids'),
    );
  }
}

export default function* myBidsSaga(): SagaIterator {
  yield takeLatest(fetchMyBids.type, fetchMyBidsWorker);
}
