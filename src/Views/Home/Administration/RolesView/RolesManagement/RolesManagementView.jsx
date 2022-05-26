import React, {
  useCallback, useEffect, useReducer, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { useSelector } from 'react-redux';
import {
  GetParams, GlobalHistory, showError, showSuccess
} from '../../../../../Helper';
import {
  AssignPermissionsToRole,
  EditRoleName,
  GetAllPermissionsByRoleId,
  PostRole,
  RemovePermissionsFromRole,
} from '../../../../../Services';
import { RolesComponentsComponent, RolesModulesComponent } from './Sections';
import { RolesActionsComponent, RolesNameComponent } from './Presentationals';
import { Spinner } from '../../../../../Components';
import { RolesPermissions } from '../../../../../Permissions';
import { getIsAllowedPermission } from '../../../../../Helper/Permissions.Helper';

const parentTranslationPath = 'RolesManagementView';
const translationPath = '';
export const RolesManagementView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [editRole, setEditRole] = useState({
    roleName: GetParams('roleName') || null,
    permissions: [],
  });
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [state, setState] = useReducer(reducer, {
    roleName: GetParams('roleName') || null,
    permissions: [],
  });
  const schema = Joi.object({
    roleName: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}role-name-is-required`),
        'string.empty': t(`${translationPath}role-name-is-required`),
      }),
    permissions: Joi.array()
      .min(1)
      .message(t(`${translationPath}please-select-at-least-one-permission`)),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const fromHandler = (from) => {
    if (from === 'save&add') GlobalHistory.push('/home/Roles/add-role-users');
    else GlobalHistory.push('/home/Roles/view');
  };
  const getAllPermissionsByRoleId = useCallback(async () => {
    setIsLoading(true);
    if (getIsAllowedPermission(
      Object.values(RolesPermissions),
      loginResponse,
      RolesPermissions.ViewPermissions.permissionsId
    )) {
      const res = await GetAllPermissionsByRoleId(id, filter.pageIndex, filter.pageSize);
      if (!(res && res.data && res.data.ErrorId) && res && res.result) {
        setEditRole((item) => ({ ...item, permissions: res.result || [] }));
        setState({ id: 'permissions', value: res.result });
      }
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.pageIndex, filter.pageSize, id]);
  const editRoleHandler = async (from) => {
    await EditRoleName(id, {
      rolesName: state.roleName,
    });
    const localDeletePermissionsIds = editRole.permissions
      .filter(
        (item) =>
          state.permissions.findIndex(
            (element) =>
              element.permissionsId === item.permissionsId &&
              element.accessTypesId === item.accessTypesId
          ) === -1
      )
      .map((item) => item.rolePermissionsId);
    Promise.resolve(RemovePermissionsFromRole(localDeletePermissionsIds))
      .then(async () => {
        const localNewPermissions = state.permissions.filter(
          (item) =>
            editRole.permissions.findIndex(
              (element) =>
                element.permissionsId === item.permissionsId &&
                element.accessTypesId === item.accessTypesId
            ) === -1
        );
        setIsLoading(false);
        if (localNewPermissions.length > 0) {
          const res = await AssignPermissionsToRole(localNewPermissions);
          if (!(res && res.data && res.data.ErrorId)) {
            showSuccess(t`${translationPath}role-updated-successfully`);
            fromHandler(from);
          } else showError(t(`${translationPath}role-update-failed`));
        } else {
          showSuccess(t`${translationPath}role-updated-successfully`);
          fromHandler(from);
        }
      })
      .catch(() => {
        showError(t(`${translationPath}role-update-failed`));
        setIsLoading(false);
      });
  };
  const saveRoleHandler = async (from) => {
    const roleRes = await PostRole({
      rolesName: state.roleName,
    });
    if (roleRes && roleRes.rolesId) {
      const res = await AssignPermissionsToRole(
        state.permissions.map((item) => ({
          ...item,
          rolesId: roleRes.rolesId,
        }))
      );
      if (!(res && res.data && res.data.ErrorId)) {
        showSuccess(t`${translationPath}role-created-successfully`);
        setIsLoading(false);
        fromHandler(from);
      } else {
        showError(t`${translationPath}role-create-failed`);
        setIsLoading(false);
      }
    } else {
      showError(t`${translationPath}role-create-failed`);
      setIsLoading(false);
    }
  };
  const saveHandler = (from) => async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    if (id) editRoleHandler(from);
    else saveRoleHandler(from);
  };
  const onActiveModuleChanged = (newValue) => {
    setActiveModule(newValue);
  };
  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  useEffect(() => {
    const localId = GetParams('id');
    if (localId) setId(localId);
  }, []);
  useEffect(() => {
    if (id) getAllPermissionsByRoleId();
  }, [id, getAllPermissionsByRoleId]);
  return (
    <form
      noValidate
      onSubmit={saveHandler('form')}
      className='roles-management-wrapper view-wrapper'
    >
      <Spinner isActive={isLoading} />
      <div className='roles-form-content-wrapper'>
        <RolesNameComponent
          rolesId={id}
          state={state}
          onStateChanged={onStateChanged}
          schema={schema}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        <div className='roles-sections-wrapper'>
          <RolesModulesComponent
            activeModule={activeModule}
            onActiveModuleChanged={onActiveModuleChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          {activeModule && (
            <RolesComponentsComponent
              rolesId={id}
              state={state}
              onStateChanged={onStateChanged}
              activeModule={activeModule}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
        </div>
        <RolesActionsComponent
          rolesId={id}
          saveHandler={saveHandler}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
    </form>
  );
};
