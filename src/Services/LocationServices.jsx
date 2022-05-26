import { config } from '../config';
import { HttpServices } from '../Helper';

export const CreateLocationDetails = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/LocationDetails/CreateLocationDetails`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdatelocationDetails = async (locationDetailsId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/LocationDetails/UpdateLocationDetails/${locationDetailsId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetLocationDetailsByLookupItem = async (lookupItemId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/LocationDetails/GetLocationDetailsByLookupItemId/${lookupItemId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetCitiesLookups = async ({ lookupItemId, pageIndex, pageSize }) => {
  const queryList = [];
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/LocationDetails/GetCitiesLookups/${lookupItemId}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetDistrictsLookups = async ({
  lookupItemId, pageIndex, pageSize, search, filterBy, orderBy
}) => {
  const queryList = [];

  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (search) queryList.push(`search=${search}`);
  if (filterBy)
  queryList.push(`filterBy=${filterBy}`);
  if (orderBy)
  queryList.push(`orderBy=${orderBy}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/LocationDetails/GetDistrictsLookups/${lookupItemId}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetCommunitiesLookups = async ({
 lookupItemId, pageIndex, pageSize, filterBy, orderBy
}) => {
  const queryList = [];
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (filterBy) queryList.push(`filterBy=${filterBy}`);
  if (orderBy) queryList.push(`orderBy=${orderBy}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/LocationDetails/GetCommunitiesLookups/${lookupItemId}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetSubCommunitiesLookups = async ({
 lookupItemId, pageIndex, pageSize, filterBy, orderBy
}) => {
  const queryList = [];
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (filterBy)
  queryList.push(`filterBy=${filterBy}`);
  if (orderBy)
  queryList.push(`orderBy=${orderBy}`);

  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/LocationDetails/GetSubCommunitiesLookups/${lookupItemId}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateOrUpdateLocationDetails = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/LocationDetails/CreateOrUpdateLocationDetails`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
