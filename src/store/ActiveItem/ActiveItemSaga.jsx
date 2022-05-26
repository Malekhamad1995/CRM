import { put, takeEvery } from 'redux-saga/effects';
import { ActiveItemActions } from './ActiveItemActions';
import { ActiveItemStatus } from './ActiveItemStatus';
import { unitDetailsGet } from '../../Services';
import { UnitMapper } from '../../Views/Home/UnitsLeaseView/UnitLeaseMapper/UnitMapper';

function* fetchActiveItem(action) {
  try {
    localStorage.setItem('activeItem', JSON.stringify(action.payload));
    yield put(ActiveItemActions.activeItemSuccess(action.payload));
  } catch (err) {
    yield put(ActiveItemActions.activeItemError(err));
  }
}
export function* watchActiveItem() {
  yield takeEvery(ActiveItemStatus.REQUEST, fetchActiveItem);
}

export function* fetchUnitDetailsGet(action) {
  try {
    const results = yield unitDetailsGet(action.payload);
    const payload = UnitMapper(results);
    localStorage.setItem('activeItem', JSON.stringify(payload));
    yield put(ActiveItemActions.activeUnitItemSuccess(payload));
  } catch (err) {
    yield put(ActiveItemActions.activeUnitItemError(err));
  }
}
export function* watchUnitDetailsGet() {
  yield takeEvery(ActiveItemStatus.REQUEST_UNIT, fetchUnitDetailsGet);
}
