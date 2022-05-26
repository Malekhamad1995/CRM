import { createReducer } from '@reduxjs/toolkit';

import {
  UNIT_GET,
  UNIT_GET_SUCCESS,
  UNIT_GET_FAIL,
  UNIT_DETAILS_GET,
  UNIT_DETAILS_GET_SUCCESS,
  UNIT_DETAILS_GET_FAIL,
  UNIT_DETAILS_GET_DIALOG,
  UNIT_DETAILS_GET_DIALOG_SUCCESS,
  UNIT_DETAILS_GET_DIALOG_FAIL,
  UNIT_DETAILS_FIELD_GET,
  UNIT_DETAILS_FIELD_GET_SUCCESS,
  UNIT_DETAILS_FIELD_GET_FAIL,
  UNIT_DETAILS_PUT,
  UNIT_DETAILS_PUT_SUCCESS,
  UNIT_DETAILS_PUT_FAIL,
  UNIT_POST,
  UNIT_POST_SUCCESS,
  UNIT_POST_FAIL,
  UNIT_BY_ID_PUT,
  UNIT_BY_ID_PUT_SUCCESS,
  UNIT_BY_ID_PUT_FAIL,
  UNIT_SEARCH_GET,
  UNIT_SEARCH_GET_SUCCESS,
  UNIT_SEARCH_FAIL,
  UNIT_DETAILS_RESET,
  UNIT_RESET,
} from './Actions';

const initialState = {
  getUnitsResponse: null,
  getUnitsDetailsResponse: null,
  getUnitsDetailsDialogResponse: null,
  putUnitsDetailsResponse: null,
  getUnitsDetailsFieldResponse: null,
  postUnitsResponse: null,
  putContacsResponse: null,
  getUnitsSearchResponse: null,
};
const Reducer = createReducer(initialState, {
  [UNIT_GET]: (state, action) => ({
    ...state,
    getUnitsResponse: null,
  }),
  [UNIT_GET_SUCCESS]: (state, action) => ({
    ...state,
    getUnitsResponse: action.payload,
  }),
  [UNIT_GET_FAIL]: (state, action) => ({
    ...state,
    getUnitsResponse: action.payload,
  }),
  [UNIT_RESET]: (state, action) => ({
    ...state,
    getUnitsResponse: null,
    getUnitsDetailsResponse: null,
    getUnitsDetailsDialogResponse: null,
    putUnitsDetailsResponse: null,
    getUnitsDetailsFieldResponse: null,
    postUnitsResponse: null,
    putContacsResponse: null,
    getUnitsSearchResponse: null,
  }),
  [UNIT_DETAILS_GET]: (state, action) => ({
    ...state,
    getUnitsDetailsResponse: null,
  }),
  [UNIT_DETAILS_GET_SUCCESS]: (state, action) => ({
    ...state,
    getUnitsDetailsResponse: action.payload,
  }),
  [UNIT_DETAILS_GET_FAIL]: (state, action) => ({
    ...state,
    getUnitsDetailsResponse: action.payload,
  }),
  [UNIT_DETAILS_GET_DIALOG]: (state, action) => ({
    ...state,
    getUnitsDetailsDialogResponse: null,
  }),
  [UNIT_DETAILS_GET_DIALOG_SUCCESS]: (state, action) => ({
    ...state,
    getUnitsDetailsDialogResponse: action.payload,
  }),
  [UNIT_DETAILS_GET_DIALOG_FAIL]: (state, action) => ({
    ...state,
    getUnitsDetailsDialogResponse: action.payload,
  }),
  [UNIT_DETAILS_FIELD_GET]: (state, action) => ({
    ...state,
    getUnitsDetailsResponse: null,
  }),
  [UNIT_DETAILS_FIELD_GET_SUCCESS]: (state, action) => ({
    ...state,
    getUnitsDetailsFieldResponse: action.payload,
  }),
  [UNIT_DETAILS_FIELD_GET_FAIL]: (state, action) => ({
    ...state,
    getUnitsDetailsFieldResponse: action.payload,
  }),
  [UNIT_DETAILS_PUT]: (state, action) => ({
    ...state,
    getUnitsDetailsFieldResponse: null,
  }),
  [UNIT_DETAILS_PUT_SUCCESS]: (state, action) => ({
    ...state,
    putUnitsDetailsResponse: action.payload,
  }),
  [UNIT_DETAILS_PUT_FAIL]: (state, action) => ({
    ...state,
    putUnitsDetailsResponse: action.payload,
  }),
  [UNIT_POST]: (state, action) => ({
    ...state,
    postUnitsResponse: null,
  }),
  [UNIT_POST_SUCCESS]: (state, action) => ({
    ...state,
    postUnitsResponse: action.payload,
  }),
  [UNIT_POST_FAIL]: (state, action) => ({
    ...state,
    postUnitsResponse: action.payload,
  }),

  [UNIT_BY_ID_PUT]: (state, action) => ({
    ...state,
    putContacsResponse: null,
  }),
  [UNIT_BY_ID_PUT_SUCCESS]: (state, action) => ({
    ...state,
    putContacsResponse: action.payload,
  }),
  [UNIT_BY_ID_PUT_FAIL]: (state, action) => ({
    ...state,
    putContacsResponse: action.payload,
  }),

  [UNIT_SEARCH_GET]: (state, action) => ({
    ...state,
    getUnitsSearchResponse: null,
  }),
  [UNIT_SEARCH_GET_SUCCESS]: (state, action) => ({
    ...state,
    getUnitsSearchResponse: action.payload,
  }),
  [UNIT_SEARCH_FAIL]: (state, action) => ({
    ...state,
    getUnitsSearchResponse: action.payload,
  }),

  [UNIT_DETAILS_RESET]: (state, action) => (initialState),

});
export default Reducer;
