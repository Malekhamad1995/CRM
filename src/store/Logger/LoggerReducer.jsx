import { LoggerStatus } from './LoggerStatus';

const initialState = [];

export const LoggerReducer = (state = initialState, action) => {
  switch (action.type) {
    case LoggerStatus.ERROR:
    case LoggerStatus.REQUEST:
      return [...state];

    case LoggerStatus.SUCCESS:
      return [...state, action.payload];

    case LoggerStatus.REST:
      return initialState;

    default:
      return state;
  }
};
