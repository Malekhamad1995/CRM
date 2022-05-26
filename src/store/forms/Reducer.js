import { createReducer } from '@reduxjs/toolkit';

import {
  FORM_GET,
  FORM_GET_SUCCESS,
  FORM_GET_FAIL,
  FORM_POST,
  FORM_POST_SUCCESS,
  FORM_POST_FAIL,
  FORM_BY_ID_PUT,
	FORM_BY_ID_PUT_SUCCESS,
	FORM_BY_ID_PUT_FAIL,
	FORM_BY_ID_GET,
	FORM_BY_ID_GET_SUCCESS,
  FORM_BY_ID_GET_FAIL,
	FORM_BY_ID_GET_DIALOG,
	FORM_BY_ID_GET_DIALOG_SUCCESS,
  FORM_BY_ID_GET_DIALOG_FAIL,
  FORM_RESET
} from './Actions';

const initialState = {
  getFormResponse: null,
  postFormResponse: null,
  getFormByIdResponse: null,
  putFormeByIdRsponse: null,
  getFormByIdDialogResponse:null,
};
const Reducer = createReducer(initialState, {
  [FORM_GET]: (state, action) =>
    ({
      ...state,
      getFormResponse: null,
    }),
  [FORM_GET_SUCCESS]: (state, action) =>
    ({
      ...state,
      getFormResponse: action.payload,
    }),
  [FORM_GET_FAIL]: (state, action) =>
    ({
      ...state,
      getFormResponse: action.payload,
    }),

  [FORM_POST]: (state, action) =>
    ({
      ...state,
      postFormResponse: null,
    }),
  [FORM_POST_SUCCESS]: (state, action) =>
    ({
      ...state,
      postFormResponse: action.payload,
    }),
  [FORM_POST_FAIL]: (state, action) =>
    ({
      ...state,
      postFormResponse: action.payload,
    }),

    [FORM_BY_ID_PUT]: (state, action) =>
    ({
      ...state,
      putFormeByIdRsponse: null,
    }),
  [FORM_BY_ID_PUT_SUCCESS]: (state, action) =>
    ({
      ...state,
      putFormeByIdRsponse: action.payload,
    }),
  [FORM_BY_ID_PUT_FAIL]: (state, action) =>
    ({
      ...state,
      putFormeByIdRsponse: action.payload,
    }),


    [FORM_BY_ID_GET]: (state, action) =>
    ({
      ...state,
      getFormByIdResponse: null,
    }),
  [FORM_BY_ID_GET_SUCCESS]: (state, action) =>
    ({
      ...state,
      getFormByIdResponse: action.payload,
    }),
  [FORM_BY_ID_GET_FAIL]: (state, action) =>
    ({
      ...state,
      getFormByIdResponse: action.payload
    }),
    [FORM_BY_ID_GET_DIALOG]: (state, action) =>
    ({
      ...state,
      getFormByIdDialogResponse: null,
    }),
  [FORM_BY_ID_GET_DIALOG_SUCCESS]: (state, action) =>
    ({
      ...state,
      getFormByIdDialogResponse: action.payload,
    }),
  [FORM_BY_ID_GET_DIALOG_FAIL]: (state, action) =>
    ({
      ...state,
      getFormByIdDialogResponse: action.payload,
    }),
  [	FORM_RESET]: (state, action) =>
    (initialState),


});
export default Reducer;
