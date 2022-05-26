import { ActiveItemStatus } from './ActiveItemStatus';

const initialState = localStorage.getItem('activeItem') ?
  JSON.parse(localStorage.getItem('activeItem')) :
  {};

export const ActiveItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActiveItemStatus.ERROR:
    case ActiveItemStatus.REQUEST:
    case ActiveItemStatus.REQUEST_UNIT:
    case ActiveItemStatus.ERROR_UNIT:
      return state;

    case ActiveItemStatus.SUCCESS:
    case ActiveItemStatus.SUCCESS_UNIT:
      return action.payload;

    case ActiveItemStatus.RESET:
      return initialState;

    default:
      return state;
  }
};
