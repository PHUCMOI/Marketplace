import {
  dealService,
  Deal as ApiDeal,
  DealStatus,
} from '@logistics-marketplace/shared';
import type { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  Deal,
  fetchDealById,
  fetchDealByIdFailed,
  fetchDealByIdSucceeded,
  fetchDeals,
  fetchDealsFailed,
  fetchDealsSucceeded,
} from './dealsSlice';

const mapDeal = (item: ApiDeal): Deal => ({
  id: item.id,
  listingId: item.listingId,
  listingTitle: item.listingId,
  carrierName: item.carrierOrgId,
  amount: item.agreedPriceAmount,
  status: item.status,
  startDate: item.createdAt,
  estimatedDelivery: item.completedAt ?? '',
  progress:
    item.status === DealStatus.Completed ? 100 : item.status === DealStatus.Active ? 50 : 0,
});

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function* fetchDealsWorker(): SagaIterator {
  try {
    const items: Awaited<ReturnType<typeof dealService.getAll>> = yield call(
      dealService.getAll,
    );
    yield put(fetchDealsSucceeded(items.map(mapDeal)));
  } catch (error) {
    yield put(fetchDealsFailed(getErrorMessage(error, 'Failed to fetch deals')));
  }
}

function* fetchDealByIdWorker(action: ReturnType<typeof fetchDealById>): SagaIterator {
  try {
    const item: Awaited<ReturnType<typeof dealService.getById>> = yield call(
      dealService.getById,
      action.payload,
    );
    yield put(fetchDealByIdSucceeded(mapDeal(item)));
  } catch (error) {
    yield put(fetchDealByIdFailed(getErrorMessage(error, 'Failed to fetch deal')));
  }
}

export default function* dealsSaga(): SagaIterator {
  yield takeLatest(fetchDeals.type, fetchDealsWorker);
  yield takeLatest(fetchDealById.type, fetchDealByIdWorker);
}
