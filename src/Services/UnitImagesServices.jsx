import { config } from '../config/config';
import { HttpServices } from '../Helper';

export const CreateUnitImages = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Unit/CreateUnitImages`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllUnitImagesCategoryByUnitId = async (unitId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetAllUnitImagesCategoryByUnitId/${unitId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllFloorPlansImagesCategoryByUnitId = async (unitId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetAllFloorPlansImagesCategoryByUnitId/${unitId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllGeneralImagesCategoryByUnitId = async (unitId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetAllGeneralImagesCategoryByUnitId/${unitId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllUnitImages = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Unit/GetAllUnitImages`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateUnitImages = async (body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Unit/UpdateUnitImages`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

// export const CreateUnitImageInfo = async (body) => {
//   const result = await HttpServices.post(
//     `${config.server_address}/CrmDfm/Unit/CreateUnitImageInfo`,
//     body
//   )
//     .then((data) => data)
//     .catch((error) => error.response);
//   return result;
// };

export const UpdateUnitImageInfo = async (body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Unit/UpdateUnitImageInfo`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateOrUpdateUnitImageInfo = async (body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Unit/CreateOrUpdateUnitImageInfo`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetUnitImageInfoByImageInfoId = async (unitId, fileId, categoryId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetUnitImageInfo/${unitId}/${fileId}/${categoryId}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetPublishedUnitImages = async (unitId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetPublishedUnitImages/${unitId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
