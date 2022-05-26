import {
  RECORDS_RETRIEVAL_DONE,
} from '../../Views/FormBuilder/actions/Server';

const INITIAL_STATE = [];

export default function collections(state = INITIAL_STATE, action) {
  switch (action.type) {
  case RECORDS_RETRIEVAL_DONE:
    return action.records;

  default:
    return state;
  }
}
