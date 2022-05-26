import { createReducer } from '@reduxjs/toolkit';

import {
  GET_LOOKUP_TYPES,
  GET_LOOKUP_TYPES_SUCCESS,
  GET_LOOKUP_TYPES_FAIL,
  GET_LOOKUP_ITEMS,
  GET_LOOKUP_ITEMS_SUCCESS,
  GET_LOOKUP_ITEMS_FAIL,
} from './Actions';

const initialState = {
  lookupType: null,
  lookupItems: null,
};
const Reducer = createReducer(initialState, {
  [GET_LOOKUP_TYPES]: (state, action) => ({
    ...state,
    lookupType: null,
  }),
  [GET_LOOKUP_TYPES_SUCCESS]: (state, action) => ({
    ...state,
    lookupType: action.payload,
  }),
  [GET_LOOKUP_TYPES_FAIL]: (state, action) => ({
    ...state,
    lookupType: action.payload,
  }),
  [GET_LOOKUP_ITEMS]: (state, action) => ({
    ...state,
    lookupItems: null,
  }),
  [GET_LOOKUP_ITEMS_SUCCESS]: (state, action) => ({
    ...state,
    lookupItems: action.payload,
  }),
  [GET_LOOKUP_ITEMS_FAIL]: (state, action) => ({
    ...state,
    lookupItems: action.payload,
  }),
});
export default Reducer;
