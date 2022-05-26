import { config } from '../config';
import { HttpServices } from '../Helper';

export const GetAllPortfolio = async ({
 pageIndex, pageSize, search, filterBy, orderBy
}) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`search=${search}`);
  if (filterBy) queryList.push(`filterBy=${filterBy}`);
  if (orderBy) queryList.push(`orderBy=${orderBy}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Portfolio/GetAllPortfolio?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const PostPortfolio = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Portfolio`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdatePortfolio = async (portfolioId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Portfolio/UpdatePortfolio/${portfolioId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetPortfolioById = async (portfolioId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Portfolio/GetPortfolioById/${portfolioId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllPropertyByPortfolioId = async (portfolioId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Portfolio/GetAllPropertyByPortfolioId/${portfolioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllLandLordByPortfolioId = async (portfolioId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Portfolio/GetAllLandLordByPortfolioId/${portfolioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllPortfolioBankAccountByPortfolioId = async (portfolioId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/PortfolioBankAccount/GetAllPortfolioBankAccountByPortfolioId/${portfolioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeletePortfolioBankAccount = async (portfolioBankAccountId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/PortfolioBankAccount/DeletePortfolioBankAccount/${portfolioBankAccountId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreatePortfolioBankAccount = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/PortfolioBankAccount/CreatePortfolioBankAccount`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const AssignPortfolioToUnit = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Portfolio/AssignPortfolioToUnit`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeAssignPortfolioToUnit = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Portfolio/DeAssignPortfolioToUnit`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateBankAccount = async (portfolioBankAccountId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/PortfolioBankAccount/UpdatePortfolioBankAccount/${portfolioBankAccountId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetPortfolioDocumentById = async (portfolioId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/PropertyManagementDocument/GetAllDocumentsByPortfolioId/${portfolioId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DleteDocumentById = async (documentId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/PropertyManagementDocument/${documentId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const PropertyManagementDocument = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/PropertyManagementDocument`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllPortfolioPropertiesByLandlordId = async (portfolioId, landlordId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Portfolio/GetAllPortfolioPropertiesByLandlordId/${portfolioId}?landlordId=${landlordId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllActivitiesByPortfolioId = async (pageIndex, pageSize, portfolioId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Activities/GetAllActivitiesByPortfolioId/${pageIndex}/${pageSize}?portfolioId=${portfolioId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

/// /////////////////////////////////// Maintenance Contracts (Services) By Portfolio  /////////////////////////////////////////////

export const GetAllMaintenanceContractsAPIByPortfolio = async (pageIndex, pageSize, portfolioId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/MaintenanceContract/GetAllMaintenanceContractsByPortfolioId?pageIndex=${pageIndex}&pageSize=${pageSize}&portfolioId=${portfolioId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
