import { config } from '../config/config';
import { GlobalTranslate, showError, HttpServices } from '../Helper';

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
    .catch((error) => undefined);
  return result;
};

const DeActivedUser = async (userId) => {
  const result = await HttpServices.post(
    `${config.server_address}/Identity/Account/DeactivateUser??userId=${userId}`
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const EditOrganizationUserProfile = async (userId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/Identity/Account/EditApplicationUserProfile/${userId}`,
    body
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('UsersView:UsersEditDialog.NotificationEditUsers'));
      return undefined;
    });
  return result;
};

const AdminChangePasswordWithoutVerification = async (body) => {
  const result = await HttpServices.put(
    `${config.server_address}/Identity/Account/AdminChangePasswordWithoutVerification`,
    body
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};


const CreateOrganizationUser = async (body) => {
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
  if (body.pageIndex === 0) body.pageIndex = 1;
  if (body.userStatusId === 0) body.userStatusId = 2;
  const result = await HttpServices.post(
    `${config.server_address}/Identity/Account/ApplicationUserSearch`,
    body
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};


const GetAllBranches = async () => {
  const result = await HttpServices.get(
    `${config.server_address}/Identity/Branch/GetAllBranches`
  )
    .then((data) => data)
    .catch((error) =>undefined);
  return result;
};
const GetApplicationUserById = async (userId) => {
  const result = await HttpServices.get(
    `${config.server_address}/Identity/Account/GetApplicationUserById?userId=${userId}`
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const AssignRolesToUser = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/Authorization/Roles/AssignRolesToUser`,
    body
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('UsersView:UsersAddDialog.NotificationErrorAddUsers'));
      return undefined;
    });
  return result;
};

const GetAllRolesByUserId = async (userId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Roles/GetAllRolesByUsersId/${userId}/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('UsersView:UsersAddDialog.NotificationErrorAddUsers'));
      return undefined;
    });
  return result;
};

const countryservis = async (body) => {
  const result = await HttpServices.get(
    `${config.server_address}/Lookups/LookupItem?lookupTypeName=country`,
    body
  )
    .then((data) => data)
    .catch((error) => {
      const { t } = GlobalTranslate;
      showError(t('LookupsView:LookupItems.NotificationLookupaddErorr'));
      return undefined;
    });
  return result;
};

const RemoveRolesFromUser = async (userRolesId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/Authorization/Roles/RemoveRolesFromUser/${userRolesId}`
  )
    .then((data) => data)
    .catch((error) => {
      const { t } = GlobalTranslate;
      showError(t('LookupsView:LookupItems.NotificationLookupaddErorr'));
      return undefined;
    });
  return result;
};

const GetUserTeamsInfo = async (userId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Team/GetUserTeamsInfo?userId=${userId}`
  )
    .then((data) => data)
    .catch((error) =>
      // showError(GlobalTranslate.t('UsersView:UsersAddDialog.NotificationErrorAddUsers'));
      undefined);
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
  GetUserTeamsInfo,
  AdminChangePasswordWithoutVerification,
  DeActivedUser,
  GetAllBranches,
  GetApplicationUserById
};
