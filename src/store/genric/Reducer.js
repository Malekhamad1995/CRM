import { SNACKBAR_MSG } from './Actions';
import { createReducer } from '@reduxjs/toolkit';
const initialState = {
	snackbarMsg: null,
};
const Reducer = createReducer(initialState, {
	[SNACKBAR_MSG]: (state,action) =>
		({
			...state,
			snackbarMsg: action.payload
		}),
   
});
export default Reducer;