import { config } from '../../config/config';
import { GlobalTranslate, HttpServices, showError } from '../../Helper';

const GetAllOrganizationUser = async (pageIndex, pageSize, userStatusId) => {
  const GetUrl = () => {
    let url = '';
    if (userStatusId === null)
      url = `${config.server_address}/Identity/Account/GetAllApplicationUser/${pageIndex}/${pageSize}`;
    else
      url = `${config.server_address}/Identity/Account/GetAllApplicationUser/${pageIndex}/${pageSize}?userStatusId=${userStatusId}`;

    return url;
  };
  const result = await HttpServices.get(GetUrl())
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('UsersView:NotificationErrorView'));
      return undefined;
    });
  return result;
};

const CancelOrganizationUser = async (userId) => {
  const result = await HttpServices.put(
    `${config.server_address}/Identity/Account/CancelApplicationUser/${userId}`
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('UsersView:UsersDeleteDialog.NotificationErrorDeleteUsers'));
      return undefined;
    });
  return result;
};

const DeleteOrganizationUser = async (userId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/Identity/Account/DeleteApplicationUser/${userId}`
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const ActiveOrganizationUser = async (userId) => {
  const result = await HttpServices.put(
    `${config.server_address}/Identity/Account/ActiveApplicationUser/${userId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const EditOrganizationUserProfile = async (userId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/Identity/Account/EditApplicationUserProfile/${userId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const CreateOrganizationUser = async (body) =>{
  const result = await HttpServices.post(
    `${config.server_address}/Identity/Account/CreateApplicationUser`,
    body
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const UploadUserPicture = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/FileManager/File/Upload`, body)
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const GetLookupItem = async (typeName) => {
  const result = await HttpServices.get(
    `${config.server_address}/Lookups/LookupItem?lookupTypeName=${typeName}`
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const OrganizationUserSearch = async (body) => {
  const localBody = body;
  if (localBody.pageIndex === 0) localBody.pageIndex = 1;
  if (localBody.userStatusId === 0 || !localBody.userStatusId) localBody.userStatusId = 2;
  const result = await HttpServices.post( 
    `${config.server_address}/Identity/Account/ApplicationUserSearch`,
    localBody
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const AssignRolesToUser = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/Authorization/Roles/AssignRolesToUser`,
    body
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const GetAllRolesByUserId = async (userId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Roles/GetAllRolesByUsersId/${userId}/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};
const GetUserId = async (userId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Users/GetApplicationUserIdByUserId?userId=${userId}`
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const GetUsersOfQaRoles = async () => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Users/GetUsersOfQaRoles`
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const countryservis = async (body) => {
  const result = await HttpServices.get(
    `${config.server_address}/Lookups/LookupItem?lookupTypeName=country`,
    body
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const RemoveRolesFromUser = async (userRolesId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/Authorization/Roles/RemoveRolesFromUser/${userRolesId}`
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const CheckExistUserName = async (identity) => {
  const result = await HttpServices.post(
    `${config.server_address}/Identity/Account/CheckExistUserName`,
    {
      identity,
    }
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const CheckExistEmail = async (identity) => {
  const result = await HttpServices.post(
    `${config.server_address}/Identity/Account/CheckExistEmail`,
    {
      identity,
    }
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const CheckExistPhone = async (identity) => {
  const result = await HttpServices.post(
    `${config.server_address}/Identity/Account/CheckExistPhone`,
    {
      identity,
    }
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};
const GetToursInformation = async (userId) => {
  const result = await HttpServices.get(
    `${config.serverAddress}/PSTViewing/Tours/GetToursInformationByUserId/${userId}`
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};
const UpdateMyProfileImage = async (fileId) => {
  const result = await HttpServices.put(
    `${config.server_address}/Identity/Account/UpdateMyProfileImage`,
    { fileId }
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export {
  RemoveRolesFromUser,
  GetAllOrganizationUser,
  CancelOrganizationUser,
  ActiveOrganizationUser,
  EditOrganizationUserProfile,
  CreateOrganizationUser,
  UploadUserPicture,
  GetLookupItem,
  OrganizationUserSearch,
  DeleteOrganizationUser,
  AssignRolesToUser,
  GetAllRolesByUserId,
  countryservis,
  CheckExistUserName,
  CheckExistEmail,
  CheckExistPhone,
  GetToursInformation,
  UpdateMyProfileImage,
  GetUsersOfQaRoles,
  GetUserId,
};
