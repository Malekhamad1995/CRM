import { ActiveItemStatus } from './ActiveItemStatus';

const activeItemRequest = (payload) => ({ type: ActiveItemStatus.REQUEST, payload });
const activeItemSuccess = (payload) => ({ type: ActiveItemStatus.SUCCESS, payload });
const activeItemError = (payload) => ({ type: ActiveItemStatus.ERROR, payload });
const activeItemReset = (payload) => ({ type: ActiveItemStatus.RESET, payload });

// Units Active item

const activeUnitItemRequest = (payload) => ({ type: ActiveItemStatus.REQUEST_UNIT, payload });
const activeUnitItemSuccess = (payload) => ({ type: ActiveItemStatus.SUCCESS_UNIT, payload });
const activeUnitItemError = (payload) => ({ type: ActiveItemStatus.ERROR_UNIT, payload });

export const ActiveItemActions = {
  activeItemRequest,
  activeItemSuccess,
  activeItemError,
  activeItemReset,
  activeUnitItemRequest,
  activeUnitItemSuccess,
  activeUnitItemError,
};
