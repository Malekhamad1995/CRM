import { call, put, takeEvery } from 'redux-saga/effects';
import {
  PROPERTY_DETAILS_GET,
  PROPERTY_DETAILS_GET_SUCCESS,
  PROPERTY_DETAILS_GET_FAIL,
  PROPERTY_DETAILS_DIALOG_GET,
  PROPERTY_DETAILS_DIALOG_GET_SUCCESS,
  PROPERTY_DETAILS_DIALOG_GET_FAIL,
  PROPERTY_DETAILS_PUT,
  PROPERTY_DETAILS_PUT_SUCCESS,
  PROPERTY_DETAILS_PUT_FAIL,
  PROPERTY_POST,
  PROPERTY_POST_SUCCESS,
  PROPERTY_POST_FAIL,
} from './Actions';
import {
  propertyDetailsGet,
  propertyPost,
  propertyDetailsPut,
} from '../../Services';
// //////////////////////////////////////////
export function* fetchPropertyDetailsGet(action) {
  try {
    const results = yield call(propertyDetailsGet, action.payload);
    yield put(PROPERTY_DETAILS_GET_SUCCESS(results));
  } catch (err) {
    yield put(PROPERTY_DETAILS_GET_FAIL(err));
  }
}
export function* watchPropertyDetailsGet() {
  yield takeEvery(PROPERTY_DETAILS_GET, fetchPropertyDetailsGet);
}
// //////////////////////////////////////////
export function* fetchPropertyDetailsDialogGet(action) {
  try {
    const results = yield call(propertyDetailsGet, action.payload);
    yield put(PROPERTY_DETAILS_DIALOG_GET_SUCCESS(results));
  } catch (err) {
    yield put(PROPERTY_DETAILS_DIALOG_GET_FAIL(err));
  }
}
export function* watchPropertyDetailsDialogGet() {
  yield takeEvery(PROPERTY_DETAILS_DIALOG_GET, fetchPropertyDetailsDialogGet);
}
// //////////////////////////////////////////
export function* fetchPropertyDetailsPut(action) {
  try {
    const results = yield call(propertyDetailsPut, action.payload);
    yield put(PROPERTY_DETAILS_PUT_SUCCESS(results));
  } catch (err) {
    yield put(PROPERTY_DETAILS_PUT_FAIL(err));
  }
}
export function* watchPropertyDetailsPut() {
  yield takeEvery(PROPERTY_DETAILS_PUT, fetchPropertyDetailsPut);
}
// //////////////////////////////////////////
export function* fetchPropertyPost(action) {
  try {
    const results = yield call(propertyPost, action.payload);
    yield put(PROPERTY_POST_SUCCESS(results));
  } catch (err) {
    yield put(PROPERTY_POST_FAIL(err));
  }
}
export function* watchPropertyPost() {
  yield takeEvery(PROPERTY_POST, fetchPropertyPost);
}
// //////////////////////////////////////////
