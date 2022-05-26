import { config } from '../config';
import { HttpServices } from '../Helper';

export const CreateUnitMarketing = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/UnitMarketing`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateUnitMarketing = async (unitMarketingId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/UnitMarketing/UpdateTemplate/${unitMarketingId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetUnitMarketingByUnitId = async (unitId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/UnitMarketing/GetUnitMarketingByUnitId/${unitId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
