import { LoggerStatus } from './LoggerStatus';

const logRequest = (payload) => ({ type: LoggerStatus.REQUEST, payload });

const logSuccess = (payload) => ({ type: LoggerStatus.SUCCESS, payload });

const logError = (payload) => ({ type: LoggerStatus.ERROR, payload });

const logRest = (payload) => ({ type: LoggerStatus.RESET, payload });

export const LoggerActions = {
  logRequest,
  logSuccess,
  logError,
  logRest,
};
