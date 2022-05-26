import {
    SET_JSON_FORM,
  } from '../../Views/FormBuilder/actions/jsonForm';

  const INITIAL_STATE = {
    jsonForm: null
  };

  export default function form(state = INITIAL_STATE, action) {
    switch (action.type) {
    case SET_JSON_FORM:
      return {
        jsonForm: action.status
      };
    default:
      return state;
    }
  }
