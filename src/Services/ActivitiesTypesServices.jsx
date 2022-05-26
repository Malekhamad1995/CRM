import { config } from '../config';
import { HttpServices } from '../Helper';

export const GetAllActivityTypes = async ({
  pageIndex, pageSize, search, categoryId, filterBy, orderBy,
}) => {
  const queryList = [];
  if (search) queryList.push(`search=${search}`);
  if (categoryId) queryList.push(`categoryId=${categoryId}`);
  if (filterBy)
  queryList.push(`filterBy=${filterBy}`);
  if (orderBy)
  queryList.push(`orderBy=${orderBy}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/ActivityTypes/${pageIndex}/${pageSize}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetActivityTypeByActivityId = async (activityId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/ActivityTypes/GetActivityTypeByActivityId/${activityId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllActivityTypeDependencies = async (activityTypeId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/ActivityTypes/GetAllActivityTypeDependencies/${activityTypeId}/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetActivityTypeById = async (ActivityTypeById) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/ActivityTypes/GetActivityTypeById/${ActivityTypeById}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteActivityType = async (activityTypeId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/ActivityTypes/${activityTypeId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateActivityTypes = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/ActivityTypes`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateActivityTypes = async (activityId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/ActivityTypes/${activityId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
