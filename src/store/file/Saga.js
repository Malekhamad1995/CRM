import { call, put, takeEvery } from 'redux-saga/effects';
import {
	FETCH_FILE_BY_PROCESS_ID_S,
	FETCH_FILE_BY_PROCESS_ID_S_SUCCESS,
	FETCH_FILE_BY_PROCESS_ID_S_FAIL,
	FETCH_FILE_BY_PROCESS_ID_F,
	FETCH_FILE_BY_PROCESS_ID_F_SUCCESS,
	FETCH_FILE_BY_PROCESS_ID_F_FAIL,
	FETCH_APPROVE_IMPORTED_FILE_SUCCESS,
	FETCH_APPROVE_IMPORTED_FILE_FAIL,
	FETCH_APPROVE_IMPORTED_FILE,
} from './Actions';
import { getFilesByProcessID, approveImportedFile } from '../../Services/files';

export function* fetchFilesByProcessIDSucess(action) {
	try {
		const resultsSuccess = yield call(getFilesByProcessID, { ...action.payload, isValid: true });
		resultsSuccess[0].BulkData = resultsSuccess[0].BulkData.map((item) => {
			item.data = JSON.parse(item.data);
			return item;
		});
		yield put(FETCH_FILE_BY_PROCESS_ID_S_SUCCESS(resultsSuccess[0]));
	} catch (err) {
		yield put(FETCH_FILE_BY_PROCESS_ID_S_FAIL(err));
	}
}
export function* fetchFilesByProcessIDFail(action) {
	try {
		const resultsFail = yield call(getFilesByProcessID, { ...action.payload, isValid: false });
		resultsFail[0].BulkData = resultsFail[0].BulkData.map((item) => {
			item.data = JSON.parse(item.data);
			return item;
		});
		yield put(FETCH_FILE_BY_PROCESS_ID_F_SUCCESS(resultsFail[0]));
	} catch (err) {
		yield put(FETCH_FILE_BY_PROCESS_ID_F_FAIL(err));
	}
}
export function* fetchApproveImportedFile(action) {
	try {
		const results = yield call(approveImportedFile, { ...action.payload });
		yield put(FETCH_APPROVE_IMPORTED_FILE_SUCCESS(results));
	} catch (err) {
		yield put(FETCH_APPROVE_IMPORTED_FILE_FAIL(err));
	}
}
export function* watchApproveImportedFile() {
	yield takeEvery(FETCH_APPROVE_IMPORTED_FILE, fetchApproveImportedFile);
}
export function* watchFilesByProcessIDSuccess() {
	yield takeEvery(FETCH_FILE_BY_PROCESS_ID_S, fetchFilesByProcessIDSucess);
}
export function* watchFilesByProcessIDFail() {
	yield takeEvery(FETCH_FILE_BY_PROCESS_ID_F, fetchFilesByProcessIDFail);
}
