import type { SagaIterator } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import dashboardSaga from '../features/dashboard/store/dashboardSaga';
import dispatchesSaga from '../features/dispatches/store/dispatchesSaga';
import driversSaga from '../features/fleet/store/driversSaga';
import vehiclesSaga from '../features/fleet/store/vehiclesSaga';
import marketplaceSaga from '../features/marketplace/store/marketplaceSaga';
import myBidsSaga from '../features/my-bids/store/myBidsSaga';

export default function* rootSaga(): SagaIterator {
  yield all([
    fork(dashboardSaga),
    fork(dispatchesSaga),
    fork(driversSaga),
    fork(vehiclesSaga),
    fork(marketplaceSaga),
    fork(myBidsSaga),
  ]);
}
