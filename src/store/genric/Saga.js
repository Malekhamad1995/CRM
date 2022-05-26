import {
	SNACKBAR_MSG,
	SET_SNACKBAR_MSG,
} from './Actions';
import { put, takeEvery } from 'redux-saga/effects';


export function* snackBarMsg(action) {
	yield put(SNACKBAR_MSG(action.payload));
}

export function* watchSetLoading() {
	yield takeEvery(SET_SNACKBAR_MSG, snackBarMsg);
}

