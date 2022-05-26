import { config } from '../config/config';
import { HttpServices } from '../Helper';

const GetUserPages = async (formsId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/FormBuilder/Pages/${formsId}/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => {
      return undefined;
    });
  return result;
};

const PostUserViews = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/FormBuilder/Views`, body)
    .then((data) => data)
    .catch((error) => {
      return undefined;
    });
  return result;
};

const GetViews = async (pageIndex, pageSize, searchedItem) => {
  const result = await HttpServices.get(
    `${config.server_address}/FormBuilder/Views/${pageIndex}/${pageSize}?search=${searchedItem}`
  )
    .then((data) => data)
    .catch((error) => {
      return undefined;
    });
  return result;
};

const DeleteViews = async (viewId) => {
  const result = await HttpServices.delete(`${config.server_address}/FormBuilder/Views/${viewId}`)
    .then((data) => data)
    .catch((error) => {
      return undefined;
    });
  return result;
};

const GetViewsByViewId = async (viewId) => {
  const result = await HttpServices.get(`${config.server_address}/FormBuilder/Views/${viewId}`)
    .then((data) => data)
    .catch((error) => {
      return undefined;
    });
  return result;
};

const EditViewsByViewId = async (viewId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/FormBuilder/Views/${viewId}`,
    body
  )
    .then((data) => data)
    .catch((error) => {
      return undefined;
    });
  return result;
};

const SavePageViewAsTemplate = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/FormBuilder/Views/SavePageViewAsTemplate`,
    body
  )
    .then((data) => data)
    .catch((error) => {
      return undefined;
    });
  return result;
};

const GetTemplateByPageId = async (pageId) => {
  const result = await HttpServices.get(
    `${config.server_address}/FormBuilder/Views/GetTemplateByPage/${pageId}`
  )
    .then((data) => data)
    .catch((error) => {
      return undefined;
    });
  return result;
};

export {
  GetUserPages,
  GetViews,
  GetTemplateByPageId,
  PostUserViews,
  DeleteViews,
  GetViewsByViewId,
  EditViewsByViewId,
  SavePageViewAsTemplate,
};
