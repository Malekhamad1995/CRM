import { config } from '../config';
import { HttpServices } from '../Helper';

export const GetAllTemplates = async ({ pageSize, pageIndex, search }) => {
  const queryList = [];

  if (search) queryList.push(`search=${search}`);
  const result = await HttpServices.get(
    `${config.server_address}/FormBuilder/Templates/${
      pageIndex + 1
    }/${pageSize}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteTemplate = async (id) => {
  const result = await HttpServices.delete(
    `${config.server_address}/FormBuilder/Templates/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateTemplate = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/FormBuilder/Templates`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateTemplate = async (templateId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/FormBuilder/Templates/${templateId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllTemplatesByCategoriesId = async ({
  pageSize,
  pageIndex,
  categoriesIds,
}) => {
  const result = await HttpServices.post(
    `${
      config.server_address
    }/FormBuilder/Templates/GetAllTemplatesByCategoriesId/${
      pageIndex + 1
    }/${pageSize}`,
    { categoriesIds }
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
