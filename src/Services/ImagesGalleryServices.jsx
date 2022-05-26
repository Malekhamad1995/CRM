import { config } from '../config';
import { HttpServices } from '../Helper';

export const GetAllImagesByTypeId = async (body) => {
  const localBody = { ...body };
  if (localBody.pageIndex !== null || localBody.pageIndex === 0) localBody.pageIndex += 1;
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Albums/GetAllImagesByTypeId`,
    localBody
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetFilteredAlbumsImages = async (body) => {
  const localBody = { ...body };
  if (localBody.pageIndex !== null || localBody.pageIndex === 0) localBody.pageIndex += 1;
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Albums/GetFilteredAlbumsImages`,
    localBody
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeleteAlbum = async (albumId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/Albums/DeleteAlbum/${albumId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeleteAlbumImage = async (albumImageId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/Albums/DeleteAlbumImage/${albumImageId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateAlbum = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Albums/CreateAlbum`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateOrUpdateLocationLookupAlbum = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Albums/CreateOrUpdateLocationLookupAlbum`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateAlbum = async (albumId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Albums/UpdateAlbum/${albumId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
