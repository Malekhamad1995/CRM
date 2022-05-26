import { put, takeEvery } from 'redux-saga/effects';
import { TableColumnsFilterActions } from './TableColumnsFilterActions';
import { TableColumnsFilterStatus } from './TableColumnsFilterStatus';

function* fetchTableColumnsFilter(action) {
  try {
    localStorage.setItem('TableColumnsFilter', JSON.stringify(action.payload));
    yield put(TableColumnsFilterActions.TableColumnsFilterSuccess(action.payload));
  } catch (err) {
    yield put(TableColumnsFilterActions.TableColumnsFilterError(err));
  }
}
export function* watchTableColumnsFilter() {
  yield takeEvery(TableColumnsFilterStatus.REQUEST, fetchTableColumnsFilter);
}
