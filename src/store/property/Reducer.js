import { createReducer } from '@reduxjs/toolkit';

import {
  PROPERTY_GET,
  PROPERTY_GET_SUCCESS,
  PROPERTY_GET_FAIL,
  PROPERTY_DETAILS_GET,
  PROPERTY_DETAILS_GET_SUCCESS,
  PROPERTY_DETAILS_GET_FAIL,
  PROPERTY_DETAILS_DIALOG_GET,
  PROPERTY_DETAILS_DIALOG_GET_SUCCESS,
  PROPERTY_DETAILS_DIALOG_GET_FAIL,
  PROPERTY_DETAILS_FIELD_GET,
  PROPERTY_DETAILS_FIELD_GET_SUCCESS,
  PROPERTY_DETAILS_FIELD_GET_FAIL,
  PROPERTY_DETAILS_PUT,
  PROPERTY_DETAILS_PUT_SUCCESS,
  PROPERTY_DETAILS_PUT_FAIL,
  PROPERTY_POST,
  PROPERTY_POST_SUCCESS,
  PROPERTY_POST_FAIL,
  PROPERTY_BY_ID_PUT,
  PROPERTY_BY_ID_PUT_SUCCESS,
  PROPERTY_BY_ID_PUT_FAIL,
  PROPERTY_SEARCH_GET,
  PROPERTY_SEARCH_GET_SUCCESS,
  PROPERTY_SEARCH_FAIL,
  PROPERTY_DETAILS_RESET,
  PROPERTY_RESET,
} from './Actions';

const initialState = {
  getPropertyResponse: null,
  getPropertyDetailsResponse: null,
  putPropertyDetailsResponse: null,
  getPropertyDetailsFieldResponse: null,
  postPropertyResponse: null,
  putPropertyResponse: null,
  getPropertySearchResponse: null,
  getPropertyDetailsDialogResponse: null,
};
const Reducer = createReducer(initialState, {
  [PROPERTY_GET]: (state, action) => ({
    ...state,
    getPropertyResponse: null,
  }),
  [PROPERTY_GET_SUCCESS]: (state, action) => ({
    ...state,
    getPropertyResponse: action.payload,
  }),
  [PROPERTY_GET_FAIL]: (state, action) => ({
    ...state,
    getPropertyResponse: action.payload,
  }),
  [PROPERTY_RESET]: (state, action) => ({
    ...state,
    getPropertyResponse: null,
    getPropertyDetailsResponse: null,
    putPropertyDetailsResponse: null,
    getPropertyDetailsFieldResponse: null,
    postPropertyResponse: null,
    putPropertyResponse: null,
    getPropertySearchResponse: null,
    getPropertyDetailsDialogResponse: null,
  }),
  [PROPERTY_DETAILS_GET]: (state, action) => ({
    ...state,
    getPropertyDetailsResponse: null,
  }),
  [PROPERTY_DETAILS_GET_SUCCESS]: (state, action) => ({
    ...state,
    getPropertyDetailsResponse: action.payload,
  }),
  [PROPERTY_DETAILS_GET_FAIL]: (state, action) => ({
    ...state,
    getPropertyDetailsResponse: action.payload,
  }),
  [PROPERTY_DETAILS_DIALOG_GET]: (state, action) => ({
    ...state,
    getPropertyDetailsDialogResponse: null,
  }),
  [PROPERTY_DETAILS_DIALOG_GET_SUCCESS]: (state, action) => ({
    ...state,
    getPropertyDetailsDialogResponse: action.payload,
  }),
  [PROPERTY_DETAILS_DIALOG_GET_FAIL]: (state, action) => ({
    ...state,
    getPropertyDetailsDialogResponse: action.payload,
  }),
  [PROPERTY_DETAILS_FIELD_GET]: (state, action) => ({
    ...state,
    getPropertyDetailsResponse: null,
  }),
  [PROPERTY_DETAILS_FIELD_GET_SUCCESS]: (state, action) => ({
    ...state,
    getPropertyDetailsFieldResponse: action.payload,
  }),
  [PROPERTY_DETAILS_FIELD_GET_FAIL]: (state, action) => ({
    ...state,
    getPropertyDetailsFieldResponse: action.payload,
  }),
  [PROPERTY_DETAILS_PUT]: (state, action) => ({
    ...state,
    getPropertyDetailsFieldResponse: null,
  }),
  [PROPERTY_DETAILS_PUT_SUCCESS]: (state, action) => ({
    ...state,
    putPropertyDetailsResponse: action.payload,
  }),
  [PROPERTY_DETAILS_PUT_FAIL]: (state, action) => ({
    ...state,
    putPropertyDetailsResponse: action.payload,
  }),
  [PROPERTY_POST]: (state, action) => ({
    ...state,
    postPropertyResponse: null,
  }),
  [PROPERTY_POST_SUCCESS]: (state, action) => ({
    ...state,
    postPropertyResponse: action.payload,
  }),
  [PROPERTY_POST_FAIL]: (state, action) => ({
    ...state,
    postPropertyResponse: action.payload,
  }),

  [PROPERTY_BY_ID_PUT]: (state, action) => ({
    ...state,
    putPropertyResponse: null,
  }),
  [PROPERTY_BY_ID_PUT_SUCCESS]: (state, action) => ({
    ...state,
    putPropertyResponse: action.payload,
  }),
  [PROPERTY_BY_ID_PUT_FAIL]: (state, action) => ({
    ...state,
    putPropertyResponse: action.payload,
  }),


  [PROPERTY_SEARCH_GET]: (state, action) => ({
    ...state,
    getPropertySearchResponse: null,
  }),
  [PROPERTY_SEARCH_GET_SUCCESS]: (state, action) => ({
    ...state,
    getPropertySearchResponse: action.payload,
  }),
  [PROPERTY_SEARCH_FAIL]: (state, action) => ({
    ...state,
    getPropertySearchResponse: action.payload,
  }),

  [PROPERTY_DETAILS_RESET]: (state, action) => (initialState),


});
export default Reducer;
