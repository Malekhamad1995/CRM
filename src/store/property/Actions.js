import { createAction } from '@reduxjs/toolkit';
const PROPERTY_GET = createAction('PROPERTY_GET');
const PROPERTY_GET_SUCCESS = createAction('PROPERTY_GET_SUCCESS');
const PROPERTY_GET_FAIL = createAction('PROPERTY_GET_FAIL');
const PROPERTY_RESET = createAction('PROPERTY_RESET');


const PROPERTY_DETAILS_GET = createAction('PROPERTY_DETAILS_GET');
const PROPERTY_DETAILS_GET_SUCCESS = createAction('PROPERTY_DETAILS_GET_SUCCESS');
const PROPERTY_DETAILS_GET_FAIL = createAction('PROPERTY_DETAILS_GET_FAIL');

const PROPERTY_DETAILS_DIALOG_GET = createAction('PROPERTY_DETAILS_DIALOG_GET');
const PROPERTY_DETAILS_DIALOG_GET_SUCCESS = createAction('PROPERTY_DETAILS_DIALOG_GET_SUCCESS');
const PROPERTY_DETAILS_DIALOG_GET_FAIL = createAction('PROPERTY_DETAILS_DIALOG_GET_FAIL');

const PROPERTY_DETAILS_RESET = createAction('PROPERTY_DETAILS_RESET');

const PROPERTY_DETAILS_FIELD_GET = createAction('PROPERTY_DETAILS_FIELD_GET');
const PROPERTY_DETAILS_FIELD_GET_SUCCESS = createAction('PROPERTY_DETAILS_FIELD_GET_SUCCESS');
const PROPERTY_DETAILS_FIELD_GET_FAIL = createAction('PROPERTY_DETAILS_FIELD_GET_FAIL');

const PROPERTY_DETAILS_PUT = createAction('PROPERTY_DETAILS_PUT');
const PROPERTY_DETAILS_PUT_SUCCESS = createAction('PROPERTY_DETAILS_PUT_SUCCESS');
const PROPERTY_DETAILS_PUT_FAIL = createAction('PROPERTY_DETAILS_PUT_FAIL');

const PROPERTY_POST = createAction('PROPERTY_POST');
const PROPERTY_POST_SUCCESS = createAction('PROPERTY_POST_SUCCESS');
const PROPERTY_POST_FAIL = createAction('PROPERTY_POST_FAIL');

const PROPERTY_BY_ID_PUT = createAction('PROPERTY_PUT');
const PROPERTY_BY_ID_PUT_SUCCESS = createAction('PROPERTY_PUT_SUCCESS');
const PROPERTY_BY_ID_PUT_FAIL = createAction('PROPERTY_PUT_FAIL');

const PROPERTY_SEARCH_GET = createAction('PROPERTY_SEARCH_GET');
const PROPERTY_SEARCH_GET_SUCCESS = createAction('PROPERTY_SEARCH_GET_SUCCESS');
const PROPERTY_SEARCH_FAIL = createAction('PROPERTY_SEARCH_FAIL');



export {
	PROPERTY_GET,
	PROPERTY_GET_SUCCESS,
	PROPERTY_GET_FAIL,
	PROPERTY_RESET,
	PROPERTY_DETAILS_GET,
	PROPERTY_DETAILS_GET_SUCCESS,
	PROPERTY_DETAILS_GET_FAIL,
	PROPERTY_DETAILS_DIALOG_GET,
	PROPERTY_DETAILS_DIALOG_GET_SUCCESS,
	PROPERTY_DETAILS_DIALOG_GET_FAIL,
	PROPERTY_DETAILS_FIELD_GET,
	PROPERTY_DETAILS_FIELD_GET_SUCCESS,
	PROPERTY_DETAILS_FIELD_GET_FAIL,
	PROPERTY_DETAILS_RESET,
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
	PROPERTY_SEARCH_FAIL
};