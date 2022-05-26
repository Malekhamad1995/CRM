import { createReducer } from '@reduxjs/toolkit';

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
  CONTACTS_DETAILS_RESET,
  CONTACTS_RESET
} from './Actions';

const initialState = {
  getContactsResponse: null,
  getContactsDetailsResponse: null,
  getContactsDetailsDialogResponse: null,
  putContactsDetailsResponse: null,
  getContactsDetailsFieldResponse: null,
  postContactsResponse: null,
  putContacsResponse: null,
  getContantsSearchResponse: null,
};
const Reducer = createReducer(initialState, {
  [CONTACTS_GET]: (state, action) =>
    ({
      ...state,
      getContactsResponse: null,
    }),
  [CONTACTS_GET_SUCCESS]: (state, action) =>
    ({
      ...state,
      getContactsResponse: action.payload,
    }),
  [CONTACTS_GET_FAIL]: (state, action) =>
    ({
      ...state,
      getContactsResponse: action.payload,
    }),
  [CONTACTS_RESET]: (state, action) =>
    ({
      ...state,
        getContactsResponse: null,
        getContactsDetailsResponse: null,
        getContactsDetailsDialogResponse: null,
        putContactsDetailsResponse: null,
        getContactsDetailsFieldResponse: null,
        postContactsResponse: null,
        putContacsResponse: null,
        getContantsSearchResponse: null,
    }),
  [CONTACTS_DETAILS_GET]: (state, action) =>
    ({
      ...state,
      getContactsDetailsResponse: null,
    }),
  [CONTACTS_DETAILS_GET_SUCCESS]: (state, action) =>
    ({
      ...state,
      getContactsDetailsResponse: action.payload,
    }),
  [CONTACTS_DETAILS_GET_FAIL]: (state, action) =>
    ({
      ...state,
      getContactsDetailsResponse: action.payload,
    }),
  [CONTACTS_DETAILS_GET_DIALOG]: (state, action) =>
    ({
      ...state,
      getContactsDetailsDialogResponse: null,
    }),
  [CONTACTS_DETAILS_GET_DIALOG_SUCCESS]: (state, action) =>
    ({
      ...state,
      getContactsDetailsDialogResponse: action.payload,
    }),
  [CONTACTS_DETAILS_GET_DIALOG_FAIL]: (state, action) =>
    ({
      ...state,
      getContactsDetailsDialogResponse: action.payload,
    }),
    [CONTACTS_DETAILS_FIELD_GET]: (state, action) =>
    ({
      ...state,
      getContactsDetailsResponse: null,
    }),
  [CONTACTS_DETAILS_FIELD_GET_SUCCESS]: (state, action) =>
    ({
      ...state,
      getContactsDetailsFieldResponse: action.payload,
    }),
  [CONTACTS_DETAILS_FIELD_GET_FAIL]: (state, action) =>
    ({
      ...state,
      getContactsDetailsFieldResponse: action.payload,
    }),
  [CONTACTS_DETAILS_PUT]: (state, action) =>
    ({
      ...state,
      getContactsDetailsFieldResponse: null,
    }),
  [CONTACTS_DETAILS_PUT_SUCCESS]: (state, action) =>
    ({
      ...state,
      putContactsDetailsResponse: action.payload,
    }),
  [CONTACTS_DETAILS_PUT_FAIL]: (state, action) =>
    ({
      ...state,
      putContactsDetailsResponse: action.payload,
    }),
  [CONTACTS_POST]: (state, action) =>
    ({
      ...state,
      postContactsResponse: null,
    }),
  [CONTACTS_POST_SUCCESS]: (state, action) =>
    ({
      ...state,
      postContactsResponse: action.payload,
    }),
  [CONTACTS_POST_FAIL]: (state, action) =>
    ({
      ...state,
      postContactsResponse: action.payload,
    }),

  [CONTACTS_BY_ID_PUT]: (state, action) =>
    ({
      ...state,
      putContacsResponse: null,
    }),
  [CONTACTS_BY_ID_PUT_SUCCESS]: (state, action) =>
    ({
      ...state,
      putContacsResponse: action.payload,
    }),
  [CONTACTS_BY_ID_PUT_FAIL]: (state, action) =>
    ({
      ...state,
      putContacsResponse: action.payload,
    }),

  [CONTACTS_SEARCH_GET]: (state, action) =>
    ({
      ...state,
      getContantsSearchResponse: null,
    }),
  [CONTACTS_SEARCH_GET_SUCCESS]: (state, action) =>
    ({
      ...state,
      getContantsSearchResponse: action.payload,
    }),
  [CONTACTS_SEARCH_FAIL]: (state, action) =>
    ({
      ...state,
      getContantsSearchResponse: action.payload,
    }),
   
  [CONTACTS_DETAILS_RESET]: (state, action) =>
  (initialState)

});
export default Reducer;
