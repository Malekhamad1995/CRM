import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import { GetAllPermissionsByModuleId } from '../../../../../../../../../Services';
import {
  CheckboxesComponent,
  CollapseComponent,
  Spinner,
} from '../../../../../../../../../Components';
import { GlobalTranslate } from '../../../../../../../../../Helper';

export const RolesPermissionsComponent = ({
  rolesId,
  state,
  onStateChanged,
  componentItem,
  activePermission,
  onActivePermissionChanged,
  accessTypes,
  index
}) => {
  const [isExtended, setIsExtended] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectAll, setisSelectAll] = useState(false);
  const [filter] = useState({
    pageIndex: 1,
    pageSize: 4,
    extendedPageSize: 999999,
  });
  const [permissions, setPermissions] = useState({
    result: [],
    totalCount: 0,
  });
  const getAllPermissionsByComponentsId = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllPermissionsByModuleId(
      componentItem.moduleId,
      filter.pageIndex,
      (isExtended && filter.extendedPageSize) || filter.pageSize
    );
    if (!(res && res.data && res.data.ErrorId) && res && res.result) setPermissions(res);
    else {
      setPermissions({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [componentItem, isExtended, filter]);
  const getIsSelectedPermission = useCallback(
    (permission) =>
      state.permissions &&
      state.permissions.findIndex((item) => item.permissionsId === permission.permissionsId) !== -1,
    [state]
  );
  const getPermissionClassName = useCallback(
    (permission) => {
      const permissionIndex =
        state.permissions &&
        state.permissions.findIndex((item) => item.permissionsId === permission.permissionsId);
      if (permissionIndex >= 0) {
        const accessType = accessTypes.find(
          (item) => item.accessTypesId === state.permissions[permissionIndex].accessTypesId
        );
        return (accessType && accessType.color) || undefined;
      }
      return undefined;
    },
    [accessTypes, state.permissions]
  );
  const onSelectedCheckboxChanged = useCallback(
    (permission) => (event) => {
      const localPermissions = [...state.permissions];
      if (event.target.checked) {
        localPermissions.push({
          accessTypesId: 3,
          permissionsId: permission.permissionsId,
          rolesId,
        });
        if (onStateChanged) onStateChanged({ id: 'permissions', value: localPermissions });
        if (onActivePermissionChanged) {
          onActivePermissionChanged({
            id: permission.permissionsId,
            name: permission.permissionsName,
          });
        }
      } else {
        const permissionIndex = localPermissions.findIndex(
          (item) => item.permissionsId === permission.permissionsId
        );
        if (permissionIndex !== -1) {
          localPermissions.splice(permissionIndex, 1);
          if (onStateChanged) onStateChanged({ id: 'permissions', value: localPermissions });
          if (
            onActivePermissionChanged &&
            activePermission &&
            activePermission.id === permission.permissionsId
          )
            onActivePermissionChanged(null);
        }
      }
    },
    [activePermission, onActivePermissionChanged, onStateChanged, rolesId, state.permissions]
  );


  // const onSelectAllClicked = (permission) => {
  //   const localPermissions = state.permissions;
  //   if (isSelectAll) {
  //     permission.map((item, index) => (
  //       localPermissions.push({
  //         accessTypesId: 3,
  //         permissionsId: item.permissionsId,
  //         rolesId,
  //       })));

  //     if (onStateChanged) onStateChanged({ id: 'permissions', value: localPermissions });
  //   } else if (!isSelectAll) {
  //     permission.map((item) => {
  //       const isSelectedIndex = localPermissions.findIndex(
  //         (element) => element.permissionsId === item.permissionsId
  //       );
  //       if (isSelectedIndex !== -1) localPermissions.splice(isSelectedIndex, 1);
  //     });
  //     if (onStateChanged) onStateChanged({ id: 'permissions', value: localPermissions });
  //   }
  // };


  //   const onSelectAllClicked = (permission) => {
  //   const localPermissions = state.permissions;
  //     permission.map((item, index) => (
  //       localPermissions.push({
  //         accessTypesId: 3,
  //         permissionsId: item.permissionsId,
  //         rolesId,
  //       })));

  //     if (onStateChanged) onStateChanged({ id: 'permissions', value: localPermissions });
  // };

  useEffect(() => {
    if (componentItem) getAllPermissionsByComponentsId();
  }, [componentItem, isExtended, getAllPermissionsByComponentsId]);
  return (
    <div className='roles-permissions-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute isWithoutText isSmall />
      <div className='roles-permission-items-wrapper'>
        <span className='title-text px-2'>
          {(componentItem && componentItem.moduleName) || 'N/A'}
        </span>
        {/* <CheckboxesComponent
          idRef={`Checkboxesntref${index}`}
          label={GlobalTranslate.t('Shared:select-all')}
          singleChecked={isSelectAll}
          themeClass='theme-secondary'
          onSelectedCheckboxClicked={(event) => {
            event.preventDefault();
            setIsExtended(true);
            setisSelectAll((item) => !item);
            onSelectAllClicked(permissions && permissions.result);
          }}
        /> */}
        {permissions.result &&
          permissions.result
            .filter((item, index) => index < filter.pageSize)
            .map((item, index) => (
              <div
                className='roles-permission-item'
                key={`permissionCheckboxKey${componentItem.moduleId}${index + 1}`}
              >
                <CheckboxesComponent
                  idRef={`permissionCheckboxRef${index + 1}`}
                  singleChecked={getIsSelectedPermission(item)}
                  label={item.permissionsName}
                  checkboxClasses={getPermissionClassName(item)}
                  onSelectedCheckboxChanged={onSelectedCheckboxChanged(item)}
                />
              </div>
            ))}
      </div>
      <CollapseComponent
        isOpen={isExtended && permissions.result.length > filter.pageSize}
        classes='roles-permission-extended-items-wrapper w-100'
        component={(
          <>
            {permissions.result &&
              permissions.result
                .filter((item, index) => index >= filter.pageSize)
                .map((item, index) => (
                  <div
                    className='roles-permission-item'
                    key={`permissionCheckboxKey${componentItem.moduleId}${index + 1}`}
                  >
                    <CheckboxesComponent
                      idRef={`permissionCheckboxRef${index + 1}`}
                      singleChecked={getIsSelectedPermission(item)}
                      label={item.permissionsName}
                      checkboxClasses={getPermissionClassName(item)}
                      onSelectedCheckboxChanged={onSelectedCheckboxChanged(item)}
                    />
                  </div>
                ))}
          </>
        )}
      />
      {permissions.totalCount > filter.pageSize && (
        <ButtonBase
          className='btns-icon theme-solid expanding-btn'
          onClick={() => {
            setIsExtended((item) => !item);
          }}
        >
          <span
            className={`mdi mdi-chevron-${(isExtended && permissions.result.length > filter.pageSize && 'up') || 'down'
              }`}
          />
        </ButtonBase>
      )}
    </div>
  );
};

RolesPermissionsComponent.propTypes = {
  rolesId: PropTypes.string,
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  componentItem: PropTypes.instanceOf(Object).isRequired,
  index: PropTypes.number.isRequired,
  activePermission: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
  onActivePermissionChanged: PropTypes.func.isRequired,
  accessTypes: PropTypes.arrayOf(
    PropTypes.shape({
      accessTypesId: PropTypes.number,
      accessTypesName: PropTypes.string,
      color: PropTypes.string,
    })
  ).isRequired,
};
RolesPermissionsComponent.defaultProps = {
  activePermission: undefined,
  rolesId: null,
};
