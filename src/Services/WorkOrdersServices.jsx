import { config } from '../config';
import { HttpServices } from '../Helper';

export const GetAllWorkOrders = async ({ pageSize, pageIndex, search }) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`search=${search}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/WorkOrder/GetAllWorkOrders?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllActivitiesByWorkOrderId = async (workOrderId, { pageSize, pageIndex }) => {
  const queryList = [];
  if (workOrderId) queryList.push(`workOrderId=${workOrderId}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Activities/GetAllActivitiesByWorkOrderId/${pageIndex + 1
    }/${pageSize}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllWorkOrder = async ({
  pageSize, pageIndex, search, status, filterBy, orderBy
}) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`search=${search}`);
  if (status) queryList.push(`status=${status}`);
  if (filterBy) queryList.push(`filterBy=${filterBy}`);
  if (orderBy) queryList.push(`orderBy=${orderBy}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/WorkOrder/GetAllWorkOrder?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetWorkOrderStatusHistory = async ({ pageSize, pageIndex, id }) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (id) queryList.push(`workOrderId=${id}`);
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/WorkOrder/GetWorkOrderStatusHistory?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetWorkOrderPortfolio = async ({ pageSize, pageIndex, search }) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`search=${search}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/WorkOrder/GetWorkOrderPortfolio?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetOwnersKeyAccess = async () => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/WorkOrder/GetOwnersKeyAccess`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetWorkOrderById = async ({ workOrderById }) => {
  const queryList = [];
  if (workOrderById) queryList.push(`workOrderById=${workOrderById}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/WorkOrder/GetWorkOrderById?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetWorkOrderProperties = async ({ search, portfolioId }) => {
  const queryList = [];
  if (portfolioId) queryList.push(`portfolioId=${portfolioId}`);
  if (search) queryList.push(`search=${search}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/WorkOrder/GetWorkOrderProperties?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetWorkOrderUnits = async ({ search, portfolioId, propertyId }) => {
  const queryList = [];
  if (portfolioId) queryList.push(`portfolioId=${portfolioId}`);
  if (propertyId) queryList.push(`propertyId=${propertyId}`);
  if (search) queryList.push(`search=${search}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/WorkOrder/GetWorkOrderUnits?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeleteWorkOrder = async (id) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/WorkOrder/DeleteWorkOrder/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetWorkOrderQuotations = async ({ workOrderId }) => {
  const queryList = [];
  if (workOrderId) queryList.push(`workOrderId=${workOrderId}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/WorkOrder/GetWorkOrderQuotations?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetWorkOrderQuotationById = async ({ quotationById }) => {
  const queryList = [];
  if (quotationById) queryList.push(`quotationById=${quotationById}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/WorkOrder/GetWorkOrderQuotationById?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetWorkOrderReference = async ({ workOrderId }) => {
  const queryList = [];
  if (workOrderId) queryList.push(`workOrderId=${workOrderId}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/WorkOrder/GetWorkOrderReference?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllWorkOrderByMaintenanceContractId = async (
  maintenanceContractId,
  { pageIndex, pageSize }
) => {
  const queryList = [];
  if (maintenanceContractId) queryList.push(`maintenanceContactId=${maintenanceContractId}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/WorkOrder/GetAllWorkOrderByMaintenanceContractId/${pageIndex + 1
    }/${pageSize}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetWorkOrderDocuments = async (id, { pageIndex, pageSize }) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/PropertyManagementDocument/GetAllDocumentsByWorkOrderId/${id}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateWorkOrderDocument = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/PropertyManagementDocument`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateWorkOrderDocument = async (documentId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/PropertyManagementDocument/UpdateDocument/${documentId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeleteQuotation = async (id) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/WorkOrder/DeleteQuotation/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeleteDocument = async (id) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/WorkOrder/DeleteDocument/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateOrUpdateQuotations = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/WorkOrder/CreateOrUpdateQuotations`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateWorkOrderStatus = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/WorkOrder/CreateWorkOrderStatus`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateOrUpdateReferences = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/WorkOrder/CreateOrUpdateWorkOrderReference`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateOrUpdateWorkOrder = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/WorkOrder/CreateOrUpdateWorkOrder`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteTransactionDocument = async (id) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/PropertyManagementDocument/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
