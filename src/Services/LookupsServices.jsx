import { config } from '../config/config';
import { GlobalTranslate, HttpServices, showError } from '../Helper';

const GetLookupItems = async (pageIndex, pageSize, lookupTypeName) => {
  const result = await HttpServices.get(
    `${config.server_address}/Lookups/LookupItem/${pageIndex}/${pageSize}?lookupTypeName=${lookupTypeName}`
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('BusinessGroupsView:AddDialog.NotificationErrorAdd'));
      return undefined;
    });
  return result;
};

const lookupGet = async ({ lookupType }) => {
  const result = await HttpServices.get(
    `${config.server_address}/api/v1/lookups/${lookupType}/getAll?market=US`
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const GetlookupTypeItems = async ({
  pageIndex,
  pageSize,
  lookupTypeId,
  search,
  filterBy,
  orderBy
}) => {
  const queryList = [];
  if (lookupTypeId) queryList.push(`lookupTypeId=${lookupTypeId}`);
  if (search) queryList.push(`search=${search}`);
  if (filterBy) queryList.push(`filterBy=${filterBy}`);
  if (orderBy) queryList.push(`orderBy=${orderBy}`);
  const result = await HttpServices.get(
    `${config.server_address}/Lookups/LookupItem/GetLookupsByTypeIdSearch/${pageIndex + 1}/${pageSize}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const lookupItemsGet = async ({
  pageIndex,
  pageSize,
  lookupTypeId,
  lookupTypeName,
  lookupParentId,
  searchedItem,
  filterBy,
  orderBy
}) => {
  const queryList = [];
  if (lookupTypeId) queryList.push(`lookupTypeId=${lookupTypeId}`);
  if (lookupTypeName) queryList.push(`lookupTypeName=${lookupTypeName}`);
  if (lookupParentId) queryList.push(`lookupParentId=${lookupParentId}`);
  if (searchedItem) queryList.push(`search=${searchedItem}`);
  if (filterBy) queryList.push(`filterBy=${filterBy}`);
  if (orderBy) queryList.push(`orderBy=${orderBy}`);
  const result = await HttpServices.get(
    `${config.server_address}/Lookups/LookupItem/${pageIndex}/${pageSize}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const lookupItemsGetId = async ({ lookupTypeId, lookupParentId }) => {
  const queryList = [];
  if (lookupParentId) queryList.push(`lookupParentId=${lookupParentId}`);
  const result = await HttpServices.get(
    `${config.server_address}/Lookups/LookupItem/${lookupTypeId}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const lookupItemsPost = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/Lookups/LookupItem`, body)
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const lookupItemsPut = async (lookupItemId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/Lookups/LookupItem/${lookupItemId}`,
    body
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const lookupItemsDelete = async (lookupItemId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/Lookups/LookupItem/${lookupItemId}`
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const lookupTypesGet = async ({
 pageIndex, pageSize, searchedItem, filterBy, orderBy
}) => {
  // eslint-disable-next-line prefer-const
  let queryList = [];
  if (searchedItem)
  queryList.push(`search=${searchedItem}`);
  if (filterBy)
  queryList.push(`filterBy=${filterBy}`);
  if (orderBy)
  queryList.push(`orderBy=${orderBy}`);

  const result = await HttpServices.get(
    `${config.server_address}/Lookups/LookupType/${pageIndex}/${pageSize}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};
const lookupTypesPut = async (lookupTypeId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/Lookups/LookupType/${lookupTypeId}`,
    body
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const lookupTypesDelete = async (lookupTypeId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/Lookups/LookupType/${lookupTypeId}`
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const lookupTypesPost = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/Lookups/LookupType`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export {
  lookupGet,
  lookupTypesGet,
  lookupTypesPost,
  lookupTypesPut,
  lookupTypesDelete,
  lookupItemsGet,
  lookupItemsPost,
  lookupItemsPut,
  lookupItemsDelete,
  lookupItemsGetId,
  GetLookupItems,
  GetlookupTypeItems,
};
