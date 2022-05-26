import { config } from '../config';
import { HttpServices } from '../Helper';

export const GetAllAgentsServices = async ({
 pageSize, pageIndex, search, filterBy, orderBy
}) => {
  // eslint-disable-next-line prefer-const
  let queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search)
  queryList.push(`search=${search}`);
  if (filterBy)
  queryList.push(`filterBy=${filterBy}`);
  if (orderBy)
  queryList.push(`orderBy=${orderBy}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Agents/GetAllAgents?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAgentById = async (agentId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Agents/GetAgentById?agentId=${agentId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateAgentById = async (agentId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Agents/UpdateAgentInfo?agentId=${agentId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllListingAgentsServices = async ({ pageSize, pageIndex, search }) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Agents/GetAllListingAgents?pageIndex=${pageIndex + 1
    }&pageSize=${pageSize}&search=${search}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllLeaseOrSaleAgentsServices = async ({ pageSize, pageIndex, search }) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Agents/GetAllLeaseOrSaleAgents?pageIndex=${pageIndex + 1
    }&pageSize=${pageSize}&search=${search}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllSaleAgentsServices = async ({ pageSize, pageIndex, search }) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Agents/GetAllSaleAgents?pageIndex=${pageIndex + 1
    }&pageSize=${pageSize}&search=${search}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllLeaseAgentsServices = async ({ pageSize, pageIndex, search }) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Agents/GetAllLeaseAgents?pageIndex=${pageIndex + 1
    }&pageSize=${pageSize}&search=${search}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAgentsForContactLeads = async (contactId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Agents/GetAgentsForContactLeads?contactId=${contactId}`)
    .then((data) => data)
    .catch((error) => error.response)
  return result
}