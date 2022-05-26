import { call, put, takeEvery } from 'redux-saga/effects';
import {
  LEAD_DETAILS_GET,
  LEAD_DETAILS_GET_SUCCESS,
  LEAD_DETAILS_GET_FAIL,
  LEAD_DETAILS_GET_DIALOG,
  LEAD_DETAILS_GET_DIALOG_SUCCESS,
  LEAD_DETAILS_GET_DIALOG_FAIL,
  LEAD_DETAILS_PUT,
  LEAD_DETAILS_PUT_SUCCESS,
  LEAD_DETAILS_PUT_FAIL,
  LEAD_POST,
  LEAD_POST_SUCCESS,
  LEAD_POST_FAIL,
} from './Actions';
import {
  leadDetailsGet,
  leadPost,
  leadDetailsPut,
} from '../../Services';

// //////////////////////////////////////////
export function* fetchLeadsDetailsGet(action) {
  try {
    const results = yield call(leadDetailsGet, action.payload);
    yield put(LEAD_DETAILS_GET_SUCCESS(results));
  } catch (err) {
    yield put(LEAD_DETAILS_GET_FAIL(err));
  }
}
export function* watchLeadsDetailsGet() {
  yield takeEvery(LEAD_DETAILS_GET, fetchLeadsDetailsGet);
}
// //////////////////////////////////////////
export function* fetchLeadsDetailsDialogGet(action) {
  try {
    const results = yield call(leadDetailsGet, action.payload);
    yield put(LEAD_DETAILS_GET_DIALOG_SUCCESS(results));
  } catch (err) {
    yield put(LEAD_DETAILS_GET_DIALOG_FAIL(err));
  }
}
export function* watchLeadsDetailsDialogGet() {
  yield takeEvery(LEAD_DETAILS_GET_DIALOG, fetchLeadsDetailsDialogGet);
}
// //////////////////////////////////////////
export function* fetchLeadsDetailsPut(action) {
  try {
    const results = yield call(leadDetailsPut, action.payload);
    yield put(LEAD_DETAILS_PUT_SUCCESS(results));
  } catch (err) {
    yield put(LEAD_DETAILS_PUT_FAIL(err));
  }
}
export function* watchLeadsDetailsPut() {
  yield takeEvery(LEAD_DETAILS_PUT, fetchLeadsDetailsPut);
}
// //////////////////////////////////////////
export function* fetchLeadsPost(action) {
  try {
    const results = yield call(leadPost, action.payload);
    yield put(LEAD_POST_SUCCESS(results));
  } catch (err) {
    yield put(LEAD_POST_FAIL(err));
  }
}
export function* watchLeadsPost() {
  yield takeEvery(LEAD_POST, fetchLeadsPost);
}
