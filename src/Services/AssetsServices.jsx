import { config } from '../config';
import { HttpServices } from '../Helper';

export const GetAllAssets = async ({
 pageIndex, pageSize, search, filterBy, orderBy
}) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`searchItemName=${search}`);
  if (filterBy) queryList.push(`filterBy=${filterBy}`);
  if (orderBy) queryList.push(`orderBy=${orderBy}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Asset/GetAllAssets?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllAssetsItemsByUnitId = async (unitId, { pageIndex, pageSize }) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Asset/GetAllAssetsItemsByUnitId/${unitId}?pageIndex=${
      pageIndex + 1
    }&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllAssetsByCommonArea = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Asset/GetAllAssetsByCommonArea`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAssetById = async (assetId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Asset/GetAssetById/${assetId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateAsset = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Asset/CreateAsset`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UpdateAsset = async (assetId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Asset/UpdateAsset/${assetId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteAsset = async (assetId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/Asset/DeleteAsset/${assetId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllDocumentsByAssetId = async (assetId, { pageIndex, pageSize }) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/PropertyManagementDocument/GetAllDocumentsByAssetId/${assetId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
