import { call, put, takeEvery } from 'redux-saga/effects';
import { log } from '../../Services/LoggerService/LoggerService';
import { LoggerActions } from './LoggerAction';
import { LoggerStatus } from './LoggerStatus';

function* fetchLog(action) {
  try {
    const results = yield call(log, action.payload);
    yield put(LoggerActions.logSuccess(results));
  } catch (err) {
    yield put(LoggerActions.logError(err));
  }
}

export function* watchLog() {
  yield takeEvery(LoggerStatus.REQUEST, fetchLog);
}
