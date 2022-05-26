import { config } from '../config/config';
import { GlobalTranslate, showError, HttpServices } from '../Helper';

const PostBusinessGroups = async (body) => {
  const result = await HttpServices.post(
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

const GetBusinessGroups = async (pageIndex, pageSize, searchedItem) => {
  const result = await HttpServices.get(
    `${config.server_address}/Authorization/BusinessGroups/${pageIndex}/${pageSize}?search=${searchedItem}`
  )
    .then((data) => data)
    .catch((error) => showError(GlobalTranslate.t('BusinessGroupsView:NotificationErrorView')));

  return result;
};

const DeleteBusinessGroup = async (groupId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/Authorization/BusinessGroups/${groupId}`
  )
    .then((data) => data)
    .catch((error) => {
      // showError(GlobalTranslate.t('BusinessGroupsView:DeleteDialog.DELETE_RELATED_TEAMS_BEFORE_BUSINESS_GROUP'));
    });

  return result;
};

const EditBusinessGroup = async (groupId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/Authorization/BusinessGroups/${groupId}`,
    body
  )
    .then((data) => data)
    .catch((error) =>
      showError(GlobalTranslate.t('BusinessGroupsView:EditDialog.NotificationErrorEdit')));
  return result;
};

export {
  GetBusinessGroups, PostBusinessGroups, DeleteBusinessGroup, EditBusinessGroup
};
