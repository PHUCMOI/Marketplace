import type { SagaIterator } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import bidsSaga from '../features/bids/store/bidsSaga';
import dashboardSaga from '../features/dashboard/store/dashboardSaga';
import dealsSaga from '../features/deals/store/dealsSaga';
import listingsSaga from '../features/listings/store/listingsSaga';

export default function* rootSaga(): SagaIterator {
  yield all([
    fork(bidsSaga),
    fork(dashboardSaga),
    fork(dealsSaga),
    fork(listingsSaga),
  ]);
}
