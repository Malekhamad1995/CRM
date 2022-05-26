import { config } from '../config';
import { HttpServices } from '../Helper';

export const GetAllPortfolioMaintenance = async ({ pageIndex, pageSize }) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Portfolio/GetAllPortfolio?pageIndex=${
      pageIndex + 1
    }&pageSize=${pageSize}&search=${''}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const MaintenanceContract = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/MaintenanceContract`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllMaintenanceContract = async ({
 pageIndex, pageSize, search, filterBy, orderBy
}) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`search=${search}`);
  if (filterBy) queryList.push(`filterBy=${filterBy}`);
  if (orderBy) queryList.push(`orderBy=${orderBy}`);

  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/MaintenanceContract/GetAllMaintenanceContract?${queryList.join(
      '&'
    )}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeleteMaintenanceContract = async (MaintenanceContractid) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/MaintenanceContract/${MaintenanceContractid}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateMaintenanceContract = async (maintenanceContractId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/MaintenanceContract/UpdateMaintenanceContract/${maintenanceContractId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response.data);
  return result;
};

export const GetMaintenanceContract = async (maintenanceContractId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/MaintenanceContract/GetMaintenanceContractById/${maintenanceContractId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetMaintenanceContractDocuments = async (id, { pageIndex, pageSize }) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.get(
    `${
      config.server_address
    }/CrmDfm/PropertyManagementDocument/GetAllDocumentsByMaintenanceContractId/${id}?${queryList.join(
      '&'
    )}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
