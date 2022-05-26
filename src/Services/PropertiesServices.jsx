import { config } from '../config';
import { HttpServices } from '../Helper';

const getProperties = async ({ pageSize, pageIndex, search }) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`search=${search}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Properties/ViewProperties?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAllUnitModelAndFilesByPropertyId = async ({ propertyId }) => {
  // const queryList = [];
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Properties/GetAllUnitModelAndFilesByPropertyId/${propertyId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAdvanceSearchProperties = async ({ pageSize, pageIndex }, body) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Properties/AdvanceSearch?${queryList.join('&')}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAdvanceSearchPropertyManagement = async ({ pageSize, pageIndex }, body) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Properties/AdvanceSearchPropertyManagement?${queryList.join(
      '&'
    )}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const propertyDetailsGet = async ({ id }) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Properties/GetPropertyById/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const propertyDetailsPut = async ({ id, body }) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Properties/UpdateProperty/${id}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const archivePropertyPut = async (propertyId) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Properties/ArchiveProperty/${propertyId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const propertyPost = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Properties`, body)
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};
const propertyFieldsGet = async (payload) =>
  // await base('get', `v1/properties/fields/${searchableValue}`, '', null);
  [];
const mergePropertyPut = async (payload) =>
  // await base('put', `v1/properties/mergeProperties/${id}`, token, body.data);
  ({});
const GetLatitudeAndLongitudeByProperty = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Properties/GetLatitudeAndLongitudeByPropertyId/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetPropertyDocumentByProperty = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Properties/GetPropertyDocumentByPropertyId/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetPropertyImage = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Properties/GetPropertyImageByPropertyId/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const PropertySpecification = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Properties/PropertySpecification`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetPropertySpecificationByPropertyId = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Properties/GetPropertySpecificationByPropertyId/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllPropertyImagesCategoryByPropertyId = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Properties/GetAllPropertyImagesCategoryByPropertyId/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAllPropertyImageLocationCategoryByPropertyId = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Properties/GetAllPropertyImageLocationCategoryByProperty/${id}/${1}/${500}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllPropertyImages = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Properties/GetAllPropertyImages`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const CreatePropertyImage = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Properties/CreatePropertyImage`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const UpdatePropertyImage = async (body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Properties/UpdatePropertyImage`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetPropertyFixturesAndAmenities = async (propertyId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Properties/GetPropertyFixturesAndAmenities/${propertyId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export {
  GetAllUnitModelAndFilesByPropertyId,
  PropertySpecification,
  GetPropertySpecificationByPropertyId,
  getProperties,
  GetAdvanceSearchProperties,
  propertyDetailsGet,
  propertyDetailsPut,
  propertyPost,
  propertyFieldsGet,
  mergePropertyPut,
  archivePropertyPut,
  GetLatitudeAndLongitudeByProperty,
  GetPropertyDocumentByProperty,
  GetPropertyImage,
  GetAdvanceSearchPropertyManagement,
  GetAllPropertyImagesCategoryByPropertyId,
  GetAllPropertyImageLocationCategoryByPropertyId,
  GetAllPropertyImages,
  CreatePropertyImage,
  UpdatePropertyImage,
  GetPropertyFixturesAndAmenities,
};
