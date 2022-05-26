import {
  SET_DRAG_STATUS,
} from '../../Views/FormBuilder/actions/dragndrop';

const INITIAL_STATE = {
  dragndropStatus: false
};

export default function form(state = INITIAL_STATE, action) {
  switch (action.type) {
  case SET_DRAG_STATUS:
    return {
      dragndropStatus: action.status
    };
  default:
    return state;
  }
}
