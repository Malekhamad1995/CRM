import { createReducer } from '@reduxjs/toolkit';

import {
  LEAD_GET,
  LEAD_GET_SUCCESS,
  LEAD_GET_FAIL,
  LEAD_DETAILS_GET,
  LEAD_DETAILS_GET_SUCCESS,
  LEAD_DETAILS_GET_FAIL,
  LEAD_DETAILS_GET_DIALOG,
  LEAD_DETAILS_GET_DIALOG_SUCCESS,
  LEAD_DETAILS_GET_DIALOG_FAIL,
  LEAD_DETAILS_FIELD_GET,
  LEAD_DETAILS_FIELD_GET_SUCCESS,
  LEAD_DETAILS_FIELD_GET_FAIL,
  LEAD_DETAILS_PUT,
  LEAD_DETAILS_PUT_SUCCESS,
  LEAD_DETAILS_PUT_FAIL,
  LEAD_POST,
  LEAD_POST_SUCCESS,
  LEAD_POST_FAIL,
  LEAD_BY_ID_PUT,
  LEAD_BY_ID_PUT_SUCCESS,
  LEAD_BY_ID_PUT_FAIL,
  LEAD_SEARCH_GET,
  LEAD_SEARCH_GET_SUCCESS,
  LEAD_SEARCH_FAIL,
  LEAD_DETAILS_RESET,
  LEAD_RESET,
} from './Actions';

const initialState = {
  getLeadsResponse: null,
  getLeadsDetailsResponse: null,
  getLeadsDetailsDialogResponse: null,
  putLeadsDetailsResponse: null,
  getLeadsDetailsFieldResponse: null,
  postLeadsResponse: null,
  putContacsResponse: null,
  getLeadsSearchResponse: null,
};
const Reducer = createReducer(initialState, {
  [LEAD_GET]: (state, action) => ({
    ...state,
    getLeadsResponse: null,
  }),
  [LEAD_GET_SUCCESS]: (state, action) => ({
    ...state,
    getLeadsResponse: action.payload,
  }),
  [LEAD_GET_FAIL]: (state, action) => ({
    ...state,
    getLeadsResponse: action.payload,
  }),
  [LEAD_RESET]: (state, action) => ({
    ...state,
    getLeadsResponse: null,
    getLeadsDetailsResponse: null,
    getLeadsDetailsDialogResponse: null,
    putLeadsDetailsResponse: null,
    getLeadsDetailsFieldResponse: null,
    postLeadsResponse: null,
    putContacsResponse: null,
    getLeadsSearchResponse: null,
  }),
  [LEAD_DETAILS_GET]: (state, action) => ({
    ...state,
    getLeadsDetailsResponse: null,
  }),
  [LEAD_DETAILS_GET_SUCCESS]: (state, action) => ({
    ...state,
    getLeadsDetailsResponse: action.payload,
  }),
  [LEAD_DETAILS_GET_FAIL]: (state, action) => ({
    ...state,
    getLeadsDetailsResponse: action.payload,
  }),
  [LEAD_DETAILS_GET_DIALOG]: (state, action) => ({
    ...state,
    getLeadsDetailsDialogResponse: null,
  }),
  [LEAD_DETAILS_GET_DIALOG_SUCCESS]: (state, action) => ({
    ...state,
    getLeadsDetailsDialogResponse: action.payload,
  }),
  [LEAD_DETAILS_GET_DIALOG_FAIL]: (state, action) => ({
    ...state,
    getLeadsDetailsDialogResponse: action.payload,
  }),
  [LEAD_DETAILS_FIELD_GET]: (state, action) => ({
    ...state,
    getLeadsDetailsResponse: null,
  }),
  [LEAD_DETAILS_FIELD_GET_SUCCESS]: (state, action) => ({
    ...state,
    getLeadsDetailsFieldResponse: action.payload,
  }),
  [LEAD_DETAILS_FIELD_GET_FAIL]: (state, action) => ({
    ...state,
    getLeadsDetailsFieldResponse: action.payload,
  }),
  [LEAD_DETAILS_PUT]: (state, action) => ({
    ...state,
    getLeadsDetailsFieldResponse: null,
  }),
  [LEAD_DETAILS_PUT_SUCCESS]: (state, action) => ({
    ...state,
    putLeadsDetailsResponse: action.payload,
  }),
  [LEAD_DETAILS_PUT_FAIL]: (state, action) => ({
    ...state,
    putLeadsDetailsResponse: action.payload,
  }),
  [LEAD_POST]: (state, action) => ({
    ...state,
    postLeadsResponse: null,
  }),
  [LEAD_POST_SUCCESS]: (state, action) => ({
    ...state,
    postLeadsResponse: action.payload,
  }),
  [LEAD_POST_FAIL]: (state, action) => ({
    ...state,
    postLeadsResponse: action.payload,
  }),

  [LEAD_BY_ID_PUT]: (state, action) => ({
    ...state,
    putContacsResponse: null,
  }),
  [LEAD_BY_ID_PUT_SUCCESS]: (state, action) => ({
    ...state,
    putContacsResponse: action.payload,
  }),
  [LEAD_BY_ID_PUT_FAIL]: (state, action) => ({
    ...state,
    putContacsResponse: action.payload,
  }),

  [LEAD_SEARCH_GET]: (state, action) => ({
    ...state,
    getLeadsSearchResponse: null,
  }),
  [LEAD_SEARCH_GET_SUCCESS]: (state, action) => ({
    ...state,
    getLeadsSearchResponse: action.payload,
  }),
  [LEAD_SEARCH_FAIL]: (state, action) => ({
    ...state,
    getLeadsSearchResponse: action.payload,
  }),

  [LEAD_DETAILS_RESET]: (state, action) => (initialState),

});
export default Reducer;
