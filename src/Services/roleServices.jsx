import { config } from '../config/config';
import { HttpServices } from '../Helper';

const GetAllRoles = async (pageIndex, pageSize, searchedItem, filterBy, orderBy) => {
  // eslint-disable-next-line prefer-const
  let queryList = [];
  if (searchedItem) queryList.push(`search=${searchedItem}`);
  if (filterBy) queryList.push(`filterBy=${filterBy}`);
  if (orderBy) queryList.push(`orderBy=${orderBy}`);
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Roles/${pageIndex}/${pageSize}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const DeleteRoleByRolesId = async (rolesId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/Authorization/Roles/${rolesId}`
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const GetAllPermissionsByRoleId = async (rolesId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Roles/GetAllPermissionsByRolesId/${rolesId}/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAllRoleTypes = async () => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Roles/GetAllRolesType`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAllApplicationService = async (pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/PreSale/ApplicationService/GetAllApplicationService/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllModules = async (pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Module/GetAllModules/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllComponentsByAppServiceId = async (appId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Components/GetAllComponentsByApplicationServicesId/${appId}/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllModuleComponents = async (Id, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Module/GetAllModuleComponents/${pageIndex}/${pageSize}?moduleId=${Id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllPermissionsByComponentsId = async (comId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Permissions/GetAllPermissionsByComponentsId/${comId}/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllPermissionsByModuleId = async (moduleId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Module/GetAllPermissionsByModuleId/${moduleId}/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllAccessTypes = async (pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/AccessTypes/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const PostRole = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/Authorization/Roles`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const AssignPermissionsToRole = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/Authorization/Roles/AssignPermissionsToRole`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const RemovePermissionsFromRole = async (body) => {
  const result = await HttpServices.put(
    `${config.server_address}/Authorization/Roles/RemovePermissionsFromRole`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const EditRoleName = async (roleId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/Authorization/Roles/${roleId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export {
  GetAllRoles,
  GetAllPermissionsByRoleId,
  GetAllApplicationService,
  GetAllComponentsByAppServiceId,
  GetAllPermissionsByComponentsId,
  GetAllAccessTypes,
  PostRole,
  GetAllRoleTypes,
  AssignPermissionsToRole,
  RemovePermissionsFromRole,
  DeleteRoleByRolesId,
  EditRoleName,
  GetAllModules,
  GetAllPermissionsByModuleId,
  GetAllModuleComponents,
};
