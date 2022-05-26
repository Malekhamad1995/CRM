import { config } from '../config';
import { HttpServices } from '../Helper';

export const UnitPayablesPost = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/UnitPayables`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllUnitPayablesByUnitId = async (unitId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/UnitPayables/GetAllUnitPayablesByUnitId?unitId=${unitId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
