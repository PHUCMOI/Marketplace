import {
  authService,
  dispatchService,
  Dispatch as ApiDispatch,
  DispatchStatus,
} from '@logistics-marketplace/shared';
import type { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  Dispatch,
  assignDispatch,
  assignDispatchFailed,
  assignDispatchSucceeded,
  fetchDispatchById,
  fetchDispatchByIdFailed,
  fetchDispatchByIdSucceeded,
  fetchDispatches,
  fetchDispatchesFailed,
  fetchDispatchesSucceeded,
} from './dispatchesSlice';

const mapStatus = (value: DispatchStatus): Dispatch['status'] => {
  if (value === DispatchStatus.Assigned) return 'Assigned';
  if (value === DispatchStatus.Delivered) return 'Delivered';
  if (value === DispatchStatus.Failed) return 'Delayed';
  if (value === DispatchStatus.PickedUp || value === DispatchStatus.EnRoute) {
    return 'In Transit';
  }
  return 'Pending';
};

const mapDispatch = (item: ApiDispatch): Dispatch => ({
  id: item.id,
  listingId: item.dealId,
  listingTitle: `Deal ${item.dealId}`,
  origin: '-',
  destination: '-',
  status: mapStatus(item.status),
  driver: item.driverId ?? 'Unassigned',
  vehicle: item.vehicleId ?? 'Unassigned',
  estimatedDelivery: item.scheduledDelivery,
  actualDelivery: item.actualDelivery,
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

function* loadDispatches(): SagaIterator {
  const organizationId = authService.getStoredUser()?.organizationId;

  if (!organizationId) {
    throw new Error('Carrier organization is required');
  }

  const items: Awaited<ReturnType<typeof dispatchService.getForCarrier>> = yield call(
    dispatchService.getForCarrier,
    organizationId,
  );
  return items.map(mapDispatch);
}

function* fetchDispatchesWorker(): SagaIterator {
  try {
    const dispatches: Dispatch[] = yield call(loadDispatches);
    yield put(fetchDispatchesSucceeded(dispatches));
  } catch (error) {
    yield put(fetchDispatchesFailed(getErrorMessage(error, 'Failed to fetch dispatches')));
  }
}

function* fetchDispatchByIdWorker(
  action: ReturnType<typeof fetchDispatchById>,
): SagaIterator {
  try {
    const dispatches: Dispatch[] = yield call(loadDispatches);
    const dispatch = dispatches.find((item) => item.id === action.payload);

    if (!dispatch) {
      throw new Error('Dispatch not found');
    }

    yield put(fetchDispatchByIdSucceeded(dispatch));
  } catch (error) {
    yield put(fetchDispatchByIdFailed(getErrorMessage(error, 'Failed to fetch dispatch')));
  }
}

function* assignDispatchWorker(
  action: ReturnType<typeof assignDispatch>,
): SagaIterator {
  try {
    const item: Awaited<ReturnType<typeof dispatchService.assign>> = yield call(
      dispatchService.assign,
      action.payload.dispatchId,
      action.payload.vehicleId,
      action.payload.driverId,
    );
    yield put(assignDispatchSucceeded(mapDispatch(item)));
  } catch (error) {
    yield put(assignDispatchFailed(getErrorMessage(error, 'Unable to assign this dispatch.')));
  }
}

export default function* dispatchesSaga(): SagaIterator {
  yield takeLatest(fetchDispatches.type, fetchDispatchesWorker);
  yield takeLatest(fetchDispatchById.type, fetchDispatchByIdWorker);
  yield takeLatest(assignDispatch.type, assignDispatchWorker);
}
