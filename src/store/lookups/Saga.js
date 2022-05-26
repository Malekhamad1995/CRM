import { call, put, takeEvery } from 'redux-saga/effects';
import {
  GET_LOOKUP_TYPES,
  GET_LOOKUP_TYPES_SUCCESS,
  GET_LOOKUP_TYPES_FAIL,
  GET_LOOKUP_ITEMS,
  GET_LOOKUP_ITEMS_SUCCESS,
  GET_LOOKUP_ITEMS_FAIL,
} from './Actions';
import { lookupTypesGet, lookupItemsGet } from '../../Services';

export function* fetchLookupTypes(action) {
  try {
    const results = yield call(lookupTypesGet, action.payload);
    yield put(GET_LOOKUP_TYPES_SUCCESS(results));
  } catch (err) {
    yield put(GET_LOOKUP_TYPES_FAIL(err));
  }
}
export function* fetchLookupItems(action) {
  try {
    const results = yield call(lookupItemsGet, action.payload);
    yield put(GET_LOOKUP_ITEMS_SUCCESS(results));
  } catch (err) {
    yield put(GET_LOOKUP_ITEMS_FAIL(err));
  }
}
export function* watchLookupTypes() {
  yield takeEvery(GET_LOOKUP_TYPES, fetchLookupTypes);
}
export function* watchLookupItems() {
  yield takeEvery(GET_LOOKUP_ITEMS, fetchLookupItems);
}
