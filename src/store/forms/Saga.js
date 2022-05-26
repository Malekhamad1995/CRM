import { call, put, takeEvery } from 'redux-saga/effects';
import {
  FORM_GET,
  FORM_GET_SUCCESS,
  FORM_GET_FAIL,
  FORM_POST,
  FORM_POST_SUCCESS,
  FORM_POST_FAIL,
  FORM_BY_ID_PUT,
  FORM_BY_ID_PUT_SUCCESS,
  FORM_BY_ID_PUT_FAIL,
  FORM_BY_ID_GET,
  FORM_BY_ID_GET_SUCCESS,
  FORM_BY_ID_GET_FAIL,
  FORM_BY_ID_GET_DIALOG,
  FORM_BY_ID_GET_DIALOG_SUCCESS,
  FORM_BY_ID_GET_DIALOG_FAIL,
} from './Actions';
import {
 formGet, formPost, formByIdPut, formByIdGet
} from '../../Services';

export function* fetchFormGet(action) {
  try {
    const results = yield call(formGet, action.payload);
    yield put(FORM_GET_SUCCESS(results));
  } catch (err) {
    yield put(FORM_GET_FAIL(err));
  }
}
export function* watchFormGet() {
  yield takeEvery(FORM_GET, fetchFormGet);
}
// //////////////////////////////////////////
export function* fetchFormPost(action) {
  try {
    const results = yield call(formPost, action.payload);
    yield put(FORM_POST_SUCCESS(results));
  } catch (err) {
    yield put(FORM_POST_FAIL(err));
  }
}
export function* watchFormPost() {
  yield takeEvery(FORM_POST, fetchFormPost);
}
// //////////////////////////////////////////
export function* fetchFormbyIdGet(action) {
  try {
    const results = yield call(formByIdGet, action.payload);

    yield put(FORM_BY_ID_GET_SUCCESS(results));
  } catch (err) {
    yield put(FORM_BY_ID_GET_FAIL(err));
  }
}
export function* watchFormbyIdGet() {
  yield takeEvery(FORM_BY_ID_GET, fetchFormbyIdGet);
}
// //////////////////////////////////////////
export function* fetchFormbyIdGetDialog(action) {
  try {
    const results = yield call(formByIdGet, action.payload);
    yield put(FORM_BY_ID_GET_DIALOG_SUCCESS(results));
  } catch (err) {
    yield put(FORM_BY_ID_GET_DIALOG_FAIL(err));
  }
}
export function* watchFormbyIdGetDialog() {
  yield takeEvery(FORM_BY_ID_GET_DIALOG, fetchFormbyIdGetDialog);
}
// //////////////////////////////////////////
export function* PutFormbyIdGet(action) {
  try {
    const results = yield call(formByIdGet, action.payload);
    yield put(FORM_BY_ID_PUT_SUCCESS(results));
  } catch (err) {
    yield put(FORM_BY_ID_PUT_FAIL(err));
  }
}
export function* watchFormbyIdPut() {
  yield takeEvery(FORM_BY_ID_PUT, formByIdPut);
}
