import { call, put, takeEvery } from 'redux-saga/effects';
import {
  CONTACTS_GET,
  CONTACTS_GET_SUCCESS,
  CONTACTS_GET_FAIL,
  CONTACTS_DETAILS_GET,
  CONTACTS_DETAILS_GET_SUCCESS,
  CONTACTS_DETAILS_GET_FAIL,
  CONTACTS_DETAILS_GET_DIALOG,
  CONTACTS_DETAILS_GET_DIALOG_SUCCESS,
  CONTACTS_DETAILS_GET_DIALOG_FAIL,
  CONTACTS_DETAILS_FIELD_GET,
  CONTACTS_DETAILS_FIELD_GET_SUCCESS,
  CONTACTS_DETAILS_FIELD_GET_FAIL,
  CONTACTS_DETAILS_PUT,
  CONTACTS_DETAILS_PUT_SUCCESS,
  CONTACTS_DETAILS_PUT_FAIL,
  CONTACTS_POST,
  CONTACTS_POST_SUCCESS,
  CONTACTS_POST_FAIL,
  CONTACTS_BY_ID_PUT,
  CONTACTS_BY_ID_PUT_SUCCESS,
  CONTACTS_BY_ID_PUT_FAIL,
  CONTACTS_SEARCH_GET,
  CONTACTS_SEARCH_GET_SUCCESS,
  CONTACTS_SEARCH_FAIL,
} from './Actions';
import {
  contactsGet,
  contactsDetailsGet,
  contactsDetailsFieldsGet,
  contactsPost,
  contactsPut,
  contactsSearchGet,
  contactsDetailsPut,
} from '../../Services';

export function* fetchContactsGet(action) {
  try {
    const results = yield call(contactsGet, action.payload);
    yield put(CONTACTS_GET_SUCCESS(results));
  } catch (err) {
    yield put(CONTACTS_GET_FAIL(err));
  }
}
export function* watchContactsGet() {
  yield takeEvery(CONTACTS_GET, fetchContactsGet);
}
// //////////////////////////////////////////
export function* fetchContactsDetailsGet(action) {
  try {
    const results = yield call(contactsDetailsGet, action.payload);
    yield put(CONTACTS_DETAILS_GET_SUCCESS(results));
  } catch (err) {
    yield put(CONTACTS_DETAILS_GET_FAIL(err));
  }
}
export function* watchContactsDetailsGet() {
  yield takeEvery(CONTACTS_DETAILS_GET, fetchContactsDetailsGet);
}
// //////////////////////////////////////////
export function* fetchContactsDetailsDialogGet(action) {
  try {
    const results = yield call(contactsDetailsGet, action.payload);
    yield put(CONTACTS_DETAILS_GET_DIALOG_SUCCESS(results));
  } catch (err) {
    yield put(CONTACTS_DETAILS_GET_DIALOG_FAIL(err));
  }
}
export function* watchContactsDetailsDialogGet() {
  yield takeEvery(CONTACTS_DETAILS_GET_DIALOG, fetchContactsDetailsDialogGet);
}
// //////////////////////////////////////////
export function* fetchContactsDetailsFieldGet(action) {
  try {
    const results = yield call(contactsDetailsFieldsGet, action.payload);
    yield put(CONTACTS_DETAILS_FIELD_GET_SUCCESS(results));
  } catch (err) {
    yield put(CONTACTS_DETAILS_FIELD_GET_FAIL(err));
  }
}
export function* watchContactsDetailsFieldGet() {
  yield takeEvery(CONTACTS_DETAILS_FIELD_GET, fetchContactsDetailsFieldGet);
}
// //////////////////////////////////////////
export function* fetchContactsDetailsPut(action) {
  try {
    const results = yield call(contactsDetailsPut, action.payload);
    yield put(CONTACTS_DETAILS_PUT_SUCCESS(results));
  } catch (err) {
    yield put(CONTACTS_DETAILS_PUT_FAIL(err));
  }
}
export function* watchContactsDetailsPut() {
  yield takeEvery(CONTACTS_DETAILS_PUT, fetchContactsDetailsPut);
}
// //////////////////////////////////////////
export function* fetchContactsPost(action) {
  try {
    const results = yield call(contactsPost, action.payload);
    yield put(CONTACTS_POST_SUCCESS(results));
  } catch (err) {
    yield put(CONTACTS_POST_FAIL(err));
  }
}
export function* watchContactsPost() {
  yield takeEvery(CONTACTS_POST, fetchContactsPost);
}
// //////////////////////////////////////////
export function* fetchContactsPut(action) {
  try {
    const results = yield call(contactsPut, action.payload);
    yield put(CONTACTS_BY_ID_PUT_SUCCESS(results));
  } catch (err) {
    yield put(CONTACTS_BY_ID_PUT_FAIL(err));
  }
}
export function* watchContactsPut() {
  yield takeEvery(CONTACTS_BY_ID_PUT, fetchContactsPut);
}
// //////////////////////////////////////////
export function* fetchContactsSearchGet(action) {
  try {
    const results = yield call(contactsSearchGet, action.payload);
    yield put(CONTACTS_SEARCH_GET_SUCCESS(results));
  } catch (err) {
    yield put(CONTACTS_SEARCH_FAIL(err));
  }
}
export function* watchContactsSearchGet() {
  yield takeEvery(CONTACTS_SEARCH_GET, fetchContactsSearchGet);
}
