import { call, put, takeEvery } from 'redux-saga/effects';
import { LOGIN, LOGIN_SUCCESS, LOGIN_FAIL } from './Actions';
import { ApplicationLogin } from '../../Services';

export function* fetchLogin(action) {
  try {
    const results = yield call(ApplicationLogin, action.payload);
    yield put(LOGIN_SUCCESS(results));
  } catch (err) {
    yield put(LOGIN_FAIL(err));
  }
}
export function* watchLogin() {
  yield takeEvery(LOGIN, fetchLogin);
}
