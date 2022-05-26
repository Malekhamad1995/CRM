import { config } from '../config';
import { HttpServices } from '../Helper';

export const GetAllWebPortals = async ({ pageSize, pageIndex, search }) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`search=${search}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/MarketingWebPortal/GetAllWebPortal?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
