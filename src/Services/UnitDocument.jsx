import { config } from '../config/config';
import { HttpServices } from '../Helper';

export const CreateUnitDocument = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/UnitDocument/CreateUnitDocument`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateUnitDocument = async (body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/UnitDocument/UpdateUnitDocument`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateScopeDocument = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/ScopeDocument/CreateScopeDocument`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateScopeDocument = async (body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/ScopeDocument/UpdateScopeDocument`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllScopeDocuments = async ({ scopeId, pageSize, pageIndex }) => {
  const queryList = [];
  if (scopeId) queryList.push(`scopeId=${scopeId}`);
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/ScopeDocument/GetAllScopeDocuments?${queryList.join('&')}`

  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteScopeDocument = async (scopeDocumentId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/ScopeDocument/DeleteScopeDocument?scopeDocumentId=${scopeDocumentId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetScopeCategoryDocuments = async (body) => {

  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/ScopeDocument/GetScopeCategoryDocuments`,body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
