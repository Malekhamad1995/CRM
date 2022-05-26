import { TableColumnsFilterStatus } from './TableColumnsFilterStatus';

const TableColumnsFilterRequest = (payload) => ({
  type: TableColumnsFilterStatus.REQUEST,
  payload,
});
const TableColumnsFilterSuccess = (payload) => ({
  type: TableColumnsFilterStatus.SUCCESS,
  payload,
});
const TableColumnsFilterError = (payload) => ({ type: TableColumnsFilterStatus.ERROR, payload });
const TableColumnsFilterReset = (payload) => ({ type: TableColumnsFilterStatus.RESET, payload });

export const TableColumnsFilterActions = {
  TableColumnsFilterRequest,
  TableColumnsFilterSuccess,
  TableColumnsFilterError,
  TableColumnsFilterReset,
};
