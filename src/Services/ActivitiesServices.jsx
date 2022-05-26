import { config } from '../config';
import { HttpServices } from '../Helper';

export const GetAllActivities = async ({ pageSize, pageIndex, search }) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Activities/${pageIndex + 1}/${pageSize}?search=${search || ''}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllActivityTypesAPI = async ({ pageSize, pageIndex, search }) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/ActivityTypes/${pageIndex + 1}/${pageSize}?search=${search || ''}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllActivitiesFilter = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Activities/GetFilteredActivities`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllRelatedActivities = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Activities/GetAllNotRelatedActivities`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllRelatedActivitiesByActivityId = async (activityId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Activities/GetAllRelatedActivitiesByActivityId?activityId=${activityId}`
  )
    .then((data) => data)
    .catch(() => undefined);
  return result;
};

export const GetAllActivitiesForPropertyManagement = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Activities/GetAllActivitiesForPropertyManagement`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllNotRelatedActivitiesForPropertyManagement = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Activities/GetAllNotRelatedActivitiesForPropertyManagement`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetQaActivitiesWithLeadInfo = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Activities/GetQaActivitiesWithLeadInfo`, body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllActivitiesByMaintenanceContractId = async (
  maintenanceContractId,
  { pageSize, pageIndex }
) => {
  const queryList = [];
  if (maintenanceContractId) queryList.push(`maintenanceContractId=${maintenanceContractId}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Activities/GetAllActivitiesByMaintenanceContractId/${pageIndex + 1
    }/${pageSize}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllActivitiesByLeadId = async (leadId, { pageSize, pageIndex }) => {
  const queryList = [];
  if (leadId) queryList.push(`leadId=${leadId}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Activities/GetAllActivitiesByLeadId/${pageIndex + 1
    }/${pageSize}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetActivitiesWithUnitsOfTypeSale = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Activities/GetActivitiesWithUnitsOfTypeSale`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllNotRelatedActivitiesOfTypeSale = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Activities/GetAllNotRelatedActivitiesOfTypeSale`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetActivitiesWithUnitsOfTypeLease = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Activities/GetActivitiesWithUnitsOfTypeLease`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllNotRelatedActivitiesOfTypeLease = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Activities/GetAllNotRelatedActivitiesOfTypeLease`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllActivityTypes = async () => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Activities/GetAllActivityTypes`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllActivityTypesSearch = async (search) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Activities/GetAllActivityTypes?search=${search}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllReplyActivityType = async (activityTypeId, search) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Activities/GetAllReplyActivityType?activityTypeId=${activityTypeId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetMyActivities = async (startDate, endDate) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Activities/GetMyActivities/${startDate}/${endDate}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const EditActivity = async (activityId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Activities/${activityId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateActivity = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Activities`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteActivity = async (id) => {
  const result = await HttpServices.delete(`${config.server_address}/CrmDfm/Activities/${id}`)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllActivitiesByContactId = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Activities/GetAllActivitiesByContactId`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllActivitiesByUnitId = async ({
  contactId, pageIndex, pageSize, search
}) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Activities/GetAllActivitiesByUnitId/${contactId}?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${search}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetActivityById = async (activityId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Activities/GetActivityById/${activityId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetContactActivitiesByPhoneNumber = async (id) => {
  const headers = {
    ApiKey: config.ApiKey,
  };
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Activities/GetContactActivitiesByPhoneNumber/?phoneNumber=${id}`,
    { headers }
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetMyNotifications = async (pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Activities/GetMyNotifications/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch(() => undefined);
  return result;
};


export const GetActivityTypeBasedOnRelatedType = async (activityType) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/ActivityTypes/GetActivityTypeBasedOnRelatedType/${activityType}`

  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
