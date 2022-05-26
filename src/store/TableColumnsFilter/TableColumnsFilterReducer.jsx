import { TableColumnsFilterStatus } from './TableColumnsFilterStatus';

const initialState = localStorage.getItem('TableColumnsFilter') ?
  JSON.parse(localStorage.getItem('TableColumnsFilter')) :
  null;

export const TableColumnsFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case TableColumnsFilterStatus.ERROR:
    case TableColumnsFilterStatus.REQUEST:
      return state;

    case TableColumnsFilterStatus.SUCCESS:
    case TableColumnsFilterStatus.SUCCESS_UNIT:
      return action.payload;

    case TableColumnsFilterStatus.RESET:
      return initialState;

    default:
      return state;
  }
};
