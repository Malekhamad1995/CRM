import { config } from '../../config';
import { HttpServices } from '../../Helper';

export const GetAllIncidents = async ({
 pageIndex, pageSize, search, filterBy, orderBy
}) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`search=${search}`);
  if (filterBy)
  queryList.push(`filterBy=${filterBy}`);
  if (orderBy)
  queryList.push(`orderBy=${orderBy}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Incident/GetAllIncidents?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const IncidentsGetAllPropertyByPortfolioId = async (portfolioId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Portfolio/GetAllPropertyByPortfolioId/${portfolioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateIncident = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Incident/CreateIncident`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetIncidentById = async (incidentId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Incident/GetIncidentById/${incidentId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateIncident = async (incidentId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Incident/UpdateIncident/${incidentId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteIncident = async (incidentId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/Incident/DeleteIncident/${incidentId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllDocumentsByIncidentId = async (incidentId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/PropertyManagementDocument/GetAllDocumentsByIncidentId/${incidentId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const incidentDocument = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/PropertyManagementDocument`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
