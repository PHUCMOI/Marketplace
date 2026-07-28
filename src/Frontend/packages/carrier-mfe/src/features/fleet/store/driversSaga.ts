import {
  authService,
  driverService,
  Driver as ApiDriver,
  DriverStatus,
} from '@logistics-marketplace/shared';
import type { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { Driver, fetchDrivers, fetchDriversFailed, fetchDriversSucceeded } from './driversSlice';

const mapDriver = (item: ApiDriver): Driver => ({
  id: item.id,
  name: item.userId,
  licenseNumber: item.licenseNumber,
  phone: item.phone,
  status:
    item.status === DriverStatus.OnLeave
      ? 'On Leave'
      : item.status === DriverStatus.OnDuty
        ? 'On Duty'
        : item.status === DriverStatus.Available
        ? 'Active'
        : 'Inactive',
  yearsExperience: 0,
  rating: 0,
});

function* fetchDriversWorker(): SagaIterator {
  try {
    const organizationId = authService.getStoredUser()?.organizationId;

    if (!organizationId) {
      throw new Error('Carrier organization is required');
    }

    const items: Awaited<ReturnType<typeof driverService.getForOrganization>> = yield call(
      driverService.getForOrganization,
      organizationId,
    );
    yield put(fetchDriversSucceeded(items.map(mapDriver)));
  } catch (error) {
    yield put(
      fetchDriversFailed(error instanceof Error ? error.message : 'Failed to fetch drivers'),
    );
  }
}

export default function* driversSaga(): SagaIterator {
  yield takeLatest(fetchDrivers.type, fetchDriversWorker);
}
