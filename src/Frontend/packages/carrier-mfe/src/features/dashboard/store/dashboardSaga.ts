import {
  authService,
  bidService,
  dealService,
  dispatchService,
  listingService,
  BidStatus,
  DealStatus,
  DispatchStatus,
} from '@logistics-marketplace/shared';
import type { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
  DashboardStats,
  fetchDashboardStats,
  fetchDashboardStatsFailed,
  fetchDashboardStatsSucceeded,
} from './dashboardSlice';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Failed to fetch dashboard stats';
}

function* fetchDashboardStatsWorker(): SagaIterator {
  try {
    const organizationId = authService.getStoredUser()?.organizationId;

    if (!organizationId) {
      throw new Error('Carrier organization is required');
    }

    const [listings, bids, deals, dispatches]: [
      Awaited<ReturnType<typeof listingService.getAll>>,
      Awaited<ReturnType<typeof bidService.getForCarrier>>,
      Awaited<ReturnType<typeof dealService.getForCarrier>>,
      Awaited<ReturnType<typeof dispatchService.getForCarrier>>,
    ] = yield all([
      call(listingService.getAll),
      call(bidService.getForCarrier, organizationId),
      call(dealService.getForCarrier, organizationId),
      call(dispatchService.getForCarrier, organizationId),
    ]);

    const stats: DashboardStats = {
      availableLoads: listings.length,
      activeBids: bids.filter((bid) => bid.status === BidStatus.Pending).length,
      activeDispatches: dispatches.filter(
        (dispatch) =>
          dispatch.status !== DispatchStatus.Delivered &&
          dispatch.status !== DispatchStatus.Cancelled &&
          dispatch.status !== DispatchStatus.Failed,
      ).length,
      totalRevenue: deals
        .filter((deal) => deal.status === DealStatus.Completed)
        .reduce((total, deal) => total + deal.agreedPriceAmount, 0),
    };

    yield put(fetchDashboardStatsSucceeded(stats));
  } catch (error) {
    yield put(fetchDashboardStatsFailed(getErrorMessage(error)));
  }
}

export default function* dashboardSaga(): SagaIterator {
  yield takeLatest(fetchDashboardStats.type, fetchDashboardStatsWorker);
}
