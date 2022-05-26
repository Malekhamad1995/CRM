import { config } from '../config/config';
import { GlobalTranslate, showError, HttpServices } from '../Helper';

const GetTeam = async (pageIndex, pageSize, searchItem) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Teams/${pageIndex}/${pageSize}?search=${searchItem}`
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:NotificationErrorView'));
      return undefined;
    });
  return result;
};
const Getuser = async (pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/Identity/Account/GetAllOrganizationUser/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:NotificationErrorView'));
      return undefined;
    });
  return result;
};
const Getuserinteam = async (teamsId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Teams/GetAllTeamMember/${teamsId}/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};
const PostTeamUser = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/Authorization/Teams/AddUserForTeams`,
    body
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:null'));
      return undefined;
    });
  return result;
};
const DeleteTeamUser = async (teamUsersId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/Authorization/Teams/RemoveUserFromTeams/${teamUsersId}`
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:DeleteDialog.NotificationErrorDelete'));
      return undefined;
    });
  return result;
};
const DeleteTeam = async (teamsId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/Authorization/Teams/${teamsId}`
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:DeleteDialog.NotificationErrorDelete'));
      return undefined;
    });
  return result;
};

const PostTeam = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/Authorization/Teams`, body)
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:AddTeamDialog.NotificationErrorAdd'));
      return undefined;
    });
  return result;
};

const EditTeam = async (teamsId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/Authorization/Teams/${teamsId}`,
    body
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:EditTeamDialog.NotificationEditTeam'));
      return undefined;
    });
  return result;
};
const GetallBusinessGroups = async (body) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/BusinessGroups`,
    body
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('BusinessGroupsView:AddDialog.NotificationErrorAdd'));
      return undefined;
    });
  return result;
};
const SearchTeam = async (pageIndex, pageSize, search) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Teams/${pageIndex}/${pageSize}/${search}`
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:search'));
      return undefined;
    });
  return result;
};

// /////////////////////////////////////////////////////////////////////

// /--Services

const GetTeamServices = async (pageIndex, pageSize, searchItem) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Teams/${pageIndex}/${pageSize}?search=${searchItem}`
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:NotificationErrorView'));
      return undefined;
    });
  return result;
};
const GetUserServices = async (pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/Identity/Account/GetAllOrganizationUser/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:NotificationErrorView'));
      return undefined;
    });
  return result;
};
const GetUserInTeamServices = async (teamsId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Teams/GetAllTeamMember/${teamsId}/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:null'));
      return undefined;
    });
  return result;
};
const PostTeamUserServices = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/Authorization/Teams/AddUserForTeams`,
    body
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:null'));
      return undefined;
    });
  return result;
};
const SetUserAsTeamLead = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/Authorization/Teams/SetUserAsTeamLead?userId=${body.userId}&teamId=${body.teamId}`,
    body
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:EditTeamDialog.selectTeamLeadfaild'));
      return undefined;
    });
  return result;
};
const DeleteTeamUserServices = async (teamUsersId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/Authorization/Teams/RemoveUserFromTeams/${teamUsersId}`
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:DeleteDialog.NotificationErrorDelete'));
      return undefined;
    });
  return result;
};
const DeleteTeamServices = async (teamsId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/Authorization/Teams/${teamsId}`
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:DeleteDialog.NotificationErrorDelete'));
      return undefined;
    });
  return result;
};

const PostTeamServices = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/Authorization/Teams`, body)
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:AddTeamDialog.NotificationErrorAdd'));
      return undefined;
    });
  return result;
};

const EditTeamServices = async (teamsId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/Authorization/Teams/${teamsId}`,
    body
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView:EditTeamDialog.NotificationEditTeam'));
      return undefined;
    });
  return result;
};
const GetallBusinessGroupsServices = async (body) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/BusinessGroups`,
    body
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('BusinessGroupsView:AddDialog.NotificationErrorAdd'));
      return undefined;
    });
  return result;
};
const SearchTeamServices = async (pageIndex, pageSize, search) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/Teams/${pageIndex}/${pageSize}/${search}`
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('TeamView: ... search'));
      return undefined;
    });
  return result;
};

export {
  GetTeam,
  DeleteTeam,
  PostTeam,
  EditTeam,
  Getuser,
  Getuserinteam,
  PostTeamUser,
  DeleteTeamUser,
  GetallBusinessGroups,
  SearchTeam,
  GetallBusinessGroupsServices,
  EditTeamServices,
  PostTeamServices,
  DeleteTeamServices,
  DeleteTeamUserServices,
  PostTeamUserServices,
  GetUserInTeamServices,
  GetUserServices,
  GetTeamServices,
  SearchTeamServices,
  SetUserAsTeamLead,
};
