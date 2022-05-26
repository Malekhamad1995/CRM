import { GlobalOrderFilterStatus } from './GlobalOrderFilterStatus';

const globalOrderFilterRequest = (payload) => ({ type: GlobalOrderFilterStatus.REQUEST, payload });
const globalOrderFilterSuccess = (payload) => ({ type: GlobalOrderFilterStatus.SUCCESS, payload });
const globalOrderFilterError = (payload) => ({ type: GlobalOrderFilterStatus.ERROR, payload });
const globalOrderFilterReset = (payload) => ({ type: GlobalOrderFilterStatus.RESET, payload });

export const GlobalOrderFilterActions = {
  globalOrderFilterRequest,
  globalOrderFilterSuccess,
  globalOrderFilterError,
  globalOrderFilterReset,
};
