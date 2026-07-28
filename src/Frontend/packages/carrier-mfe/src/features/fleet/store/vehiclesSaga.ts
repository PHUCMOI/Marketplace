import {
  authService,
  vehicleService,
  Vehicle as ApiVehicle,
  VehicleStatus,
} from '@logistics-marketplace/shared';
import type { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  Vehicle,
  fetchVehicles,
  fetchVehiclesFailed,
  fetchVehiclesSucceeded,
} from './vehiclesSlice';

const mapVehicle = (item: ApiVehicle): Vehicle => ({
  id: item.id,
  licensePlate: item.plateNumber,
  type: item.type,
  capacity: item.capacity,
  year: 0,
  status:
    item.status === VehicleStatus.Available
      ? 'Active'
      : item.status === VehicleStatus.Maintenance
        ? 'Maintenance'
        : 'Inactive',
  lastInspection: '',
});

function* fetchVehiclesWorker(): SagaIterator {
  try {
    const organizationId = authService.getStoredUser()?.organizationId;

    if (!organizationId) {
      throw new Error('Carrier organization is required');
    }

    const items: Awaited<ReturnType<typeof vehicleService.getForOrganization>> = yield call(
      vehicleService.getForOrganization,
      organizationId,
    );
    yield put(fetchVehiclesSucceeded(items.map(mapVehicle)));
  } catch (error) {
    yield put(
      fetchVehiclesFailed(error instanceof Error ? error.message : 'Failed to fetch vehicles'),
    );
  }
}

export default function* vehiclesSaga(): SagaIterator {
  yield takeLatest(fetchVehicles.type, fetchVehiclesWorker);
}
