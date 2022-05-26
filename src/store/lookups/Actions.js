import { createAction } from '@reduxjs/toolkit';
const GET_LOOKUP_TYPES = createAction('GET_LOOKUP_TYPES');
const GET_LOOKUP_TYPES_SUCCESS = createAction('GET_LOOKUP_TYPES_SUCCESS');
const GET_LOOKUP_TYPES_FAIL = createAction('GET_LOOKUP_TYPES_FAIL');
const GET_LOOKUP_ITEMS = createAction('GET_LOOKUP_ITEMS');
const GET_LOOKUP_ITEMS_SUCCESS = createAction('GET_LOOKUP_ITEMS_SUCCESS');
const GET_LOOKUP_ITEMS_FAIL = createAction('GET_LOOKUP_ITEMS_FAIL');
export {
	GET_LOOKUP_TYPES,
	GET_LOOKUP_TYPES_SUCCESS,
	GET_LOOKUP_TYPES_FAIL,
	GET_LOOKUP_ITEMS,
	GET_LOOKUP_ITEMS_SUCCESS,
	GET_LOOKUP_ITEMS_FAIL,
};
