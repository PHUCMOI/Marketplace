import {
  bidService,
  dealService,
  listingService,
  BidStatus,
  DealStatus,
} from '@logistics-marketplace/shared';
import type { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
  DashboardStats,
  fetchDashboardStats,
  fetchDashboardStatsFailed,
  fetchDashboardStatsSucceeded,
} from './dashboardSlice';

function* fetchDashboardStatsWorker(): SagaIterator {
  try {
    const [listings, deals]: [
      Awaited<ReturnType<typeof listingService.getAll>>,
      Awaited<ReturnType<typeof dealService.getAll>>,
    ] = yield all([call(listingService.getAll), call(dealService.getAll)]);

    const bidGroups: Awaited<ReturnType<typeof bidService.getByListing>>[] = yield all(
      listings.map((listing) => call(bidService.getByListing, listing.id)),
    );
    const today = new Date().toISOString().slice(0, 10);
    const stats: DashboardStats = {
      activeListings: listings.length,
      pendingBids: bidGroups.flat().filter((bid) => bid.status === BidStatus.Pending).length,
      activeDeals: deals.filter((deal) => deal.status === DealStatus.Active).length,
      completedToday: deals.filter(
        (deal) =>
          deal.status === DealStatus.Completed && deal.completedAt?.slice(0, 10) === today,
      ).length,
    };

    yield put(fetchDashboardStatsSucceeded(stats));
  } catch (error) {
    yield put(
      fetchDashboardStatsFailed(
        error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
      ),
    );
  }
}

export default function* dashboardSaga(): SagaIterator {
  yield takeLatest(fetchDashboardStats.type, fetchDashboardStatsWorker);
}
