import { config } from '../config';
import { HttpServices } from '../Helper';

export const GetAllOperatingCosts = async ({
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
    `${config.server_address}/CrmDfm/OperatingCost/GetAllOperatingCosts?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetOperatingCostById = async (operatingCostId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/OperatingCost/GetOperatingCostById/${operatingCostId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllOperatingCostsByPortfolioId = async (portfolioId, { pageIndex, pageSize }) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/OperatingCost/GetAllOperatingCostsByPortfolioId/${portfolioId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllOperatingCostsByPropertyId = async (propertyId, { pageIndex, pageSize }) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/OperatingCost/GetAllOperatingCostsByPropertyId/${propertyId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteOperatingCost = async (operatingCostId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/OperatingCost/DeleteOperatingCost/${operatingCostId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateOperatingCost = async (operatingCostId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/OperatingCost/UpdateOperatingCost/${operatingCostId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateOperatingCost = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/OperatingCost/CreateOperatingCost`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
