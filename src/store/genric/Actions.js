import { createAction } from '@reduxjs/toolkit';
const SNACKBAR_MSG = createAction('SNACKBAR_MSG');
const SET_SNACKBAR_MSG = createAction('SET_SNACKBAR_MSG');
export {
	SNACKBAR_MSG, SET_SNACKBAR_MSG
};