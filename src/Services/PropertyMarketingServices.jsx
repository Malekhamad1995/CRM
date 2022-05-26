import { config } from '../config';
import { HttpServices } from '../Helper';

export const CreatePropertyMarketing = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/PropertyMarketing`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdatePropertyMarketing = async (propertyMarketingId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/PropertyMarketing/UpdatePropertyMarketing/${propertyMarketingId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetPropertyOverViewByUnitId = async (unitId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/PropertyMarketing/GetPropertyOverViewByUnitId?unitId=${unitId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetPropertyMarketingByPropertyId = async (propertyId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/PropertyMarketing/GetPropertyMarketingByPropertyId/${propertyId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
