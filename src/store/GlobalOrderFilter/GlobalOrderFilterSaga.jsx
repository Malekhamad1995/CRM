import { put, takeEvery } from 'redux-saga/effects';
import { GlobalOrderFilterActions } from './GlobalOrderFilterActions';
import { GlobalOrderFilterStatus } from './GlobalOrderFilterStatus';

function* fetchGlobalFilter(action) {
  try {
    const results = action.payload;
    localStorage.setItem('GlobalFilter', JSON.stringify(results));
    yield put(GlobalOrderFilterActions.globalOrderFilterSuccess(results));
  } catch (err) {
    yield put(GlobalOrderFilterActions.globalOrderFilterError(err));
  }
}
export function* watchGlobalFilterFilter() {
  yield takeEvery(GlobalOrderFilterStatus.REQUEST, fetchGlobalFilter);
}
