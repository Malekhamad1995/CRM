import { createReducer } from '@reduxjs/toolkit';

import {
  FETCH_FILE_BY_PROCESS_ID_S,
  FETCH_FILE_BY_PROCESS_ID_S_SUCCESS,
  FETCH_FILE_BY_PROCESS_ID_S_FAIL,
  FETCH_FILE_BY_PROCESS_ID_F,
  FETCH_FILE_BY_PROCESS_ID_F_SUCCESS,
  FETCH_FILE_BY_PROCESS_ID_F_FAIL,
  FETCH_APPROVE_IMPORTED_FILE,
  FETCH_APPROVE_IMPORTED_FILE_SUCCESS,
  FETCH_APPROVE_IMPORTED_FILE_FAIL,
} from './Actions';

const initialState = {
  filesByProcessSuccessIDResponse: null,
  filesByProcessFailIDResponse: null,
  approveImportedFileResponse: null,
};
const Reducer = createReducer(initialState, {
  [FETCH_FILE_BY_PROCESS_ID_S]: (state, action) => ({
    ...state,
    filesByProcessSuccessIDResponse: null,
  }),
  [FETCH_FILE_BY_PROCESS_ID_S_SUCCESS]: (state, action) => ({
    ...state,
    filesByProcessSuccessIDResponse: action.payload,
  }),
  [FETCH_FILE_BY_PROCESS_ID_S_FAIL]: (state, action) => ({
    ...state,
    filesByProcessSuccessIDResponse: action.payload,
  }),

  [FETCH_FILE_BY_PROCESS_ID_F]: (state, action) => ({
    ...state,
    filesByProcessFailIDResponse: null,
  }),
  [FETCH_FILE_BY_PROCESS_ID_F_SUCCESS]: (state, action) => ({
    ...state,
    filesByProcessFailIDResponse: action.payload,
  }),
  [FETCH_FILE_BY_PROCESS_ID_F_FAIL]: (state, action) => ({
    ...state,
    filesByProcessFailIDResponse: action.payload,
  }),
  [FETCH_APPROVE_IMPORTED_FILE]: (state, action) => ({
    ...state,
    approveImportedFileResponse: null,
  }),
  [FETCH_APPROVE_IMPORTED_FILE_SUCCESS]: (state, action) => ({
    ...state,
    approveImportedFileResponse: action.payload,
  }),
  [FETCH_APPROVE_IMPORTED_FILE_FAIL]: (state, action) => ({
    ...state,
    approveImportedFileResponse: action.payload,
  }),
});
export default Reducer;
