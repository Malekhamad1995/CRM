import { call, put, takeEvery } from 'redux-saga/effects';
import {
  UNIT_DETAILS_GET,
  UNIT_DETAILS_GET_SUCCESS,
  UNIT_DETAILS_GET_FAIL,
  UNIT_DETAILS_GET_DIALOG,
  UNIT_DETAILS_GET_DIALOG_SUCCESS,
  UNIT_DETAILS_GET_DIALOG_FAIL,
  UNIT_DETAILS_PUT,
  UNIT_DETAILS_PUT_SUCCESS,
  UNIT_DETAILS_PUT_FAIL,
  UNIT_POST,
  UNIT_POST_SUCCESS,
  UNIT_POST_FAIL,
  UNIT_BY_ID_PUT,
  UNIT_BY_ID_PUT_SUCCESS,
  UNIT_BY_ID_PUT_FAIL,
} from './Actions';
import {
 unitDetailsGet, unitPost, unitPut, unitDetailsPut
} from '../../Services';
// //////////////////////////////////////////
export function* fetchUnitsDetailsGet(action) {
  try {
    const results = yield call(unitDetailsGet, action.payload);
    yield put(UNIT_DETAILS_GET_SUCCESS(results));
  } catch (err) {
    yield put(UNIT_DETAILS_GET_FAIL(err));
  }
}
export function* watchUnitsDetailsGet() {
  yield takeEvery(UNIT_DETAILS_GET, fetchUnitsDetailsGet);
}
// //////////////////////////////////////////
export function* fetchUnitsDetailsDialogGet(action) {
  try {
    const results = yield call(unitDetailsGet, action.payload);
    yield put(UNIT_DETAILS_GET_DIALOG_SUCCESS(results));
  } catch (err) {
    yield put(UNIT_DETAILS_GET_DIALOG_FAIL(err));
  }
}
export function* watchUnitsDetailsDialogGet() {
  yield takeEvery(UNIT_DETAILS_GET_DIALOG, fetchUnitsDetailsDialogGet);
}
// //////////////////////////////////////////
export function* fetchUnitsDetailsPut(action) {
  try {
    const results = yield call(unitDetailsPut, action.payload);
    yield put(UNIT_DETAILS_PUT_SUCCESS(results));
  } catch (err) {
    yield put(UNIT_DETAILS_PUT_FAIL(err));
  }
}
export function* watchUnitsDetailsPut() {
  yield takeEvery(UNIT_DETAILS_PUT, fetchUnitsDetailsPut);
}
// //////////////////////////////////////////
export function* fetchUnitsPost(action) {
  try {
    const results = yield call(unitPost, action.payload);
    yield put(UNIT_POST_SUCCESS(results));
  } catch (err) {
    yield put(UNIT_POST_FAIL(err));
  }
}
export function* watchUnitsPost() {
  yield takeEvery(UNIT_POST, fetchUnitsPost);
}
// //////////////////////////////////////////
export function* fetchUnitsPut(action) {
  try {
    const results = yield call(unitPut, action.payload);
    yield put(UNIT_BY_ID_PUT_SUCCESS(results));
  } catch (err) {
    yield put(UNIT_BY_ID_PUT_FAIL(err));
  }
}
export function* watchUnitsPut() {
  yield takeEvery(UNIT_BY_ID_PUT, fetchUnitsPut);
}
