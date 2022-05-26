import { createReducer } from '@reduxjs/toolkit';
import {
 LOGIN, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUt, UPDATE
} from './Actions';

const initialState = {
  loginResponse: localStorage.getItem('session') ?
    JSON.parse(localStorage.getItem('session')) :
    null,
};

const Reducer = createReducer(initialState, {
  [LOGIN]: (state) => ({
    ...state,
    loginResponse: null,
  }),
  [LOGIN_SUCCESS]: (state, action) => ({
    ...state,
    loginResponse: action.payload,
  }),
  [LOGIN_FAIL]: (state, action) => ({
    ...state,
    loginResponse: action.payload,
  }),
  [LOGOUt]: (state) => ({
    ...state,
    loginResponse: null,
  }),
  [UPDATE]: (state, action) => ({
    ...state,
    loginResponse: action.payload,
  }),
});
export default Reducer;
