import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import { CheckboxesComponent } from '../../../../../../../Components';

export const RolesAccessTypesComponent = ({
  state,
  onStateChanged,
  activePermission,
  onActivePermissionChanged,
  accessTypes,
}) => {
  const getIsSelectedAccessType = useCallback(
    (accessType) =>
      state.permissions &&
      state.permissions.findIndex(
        (item) =>
          item.permissionsId === activePermission.id &&
          item.accessTypesId === accessType.accessTypesId
      ) !== -1,
    [activePermission.id, state.permissions]
  );
  const onSelectedCheckboxChanged = (accessType) => {
    const permissionIndex =
      state.permissions &&
      state.permissions.findIndex((item) => item.permissionsId === activePermission.id);
    if (permissionIndex >= 0) {
      const localPermissions = [...state.permissions];
      localPermissions[permissionIndex].accessTypesId = accessType.accessTypesId;
      if (onStateChanged) onStateChanged({ id: 'permissions', value: localPermissions });
    }
  };

  return (
    <div className='roles-access-types-wrapper childs-wrapper'>
      <div className='access-types-content-wrapper'>
        <div className='access-types-header-wrapper'>
          <div className='permission-name-wrapper'>
            <span className='description-text'>{activePermission.name}</span>
          </div>
          <ButtonBase
            className='btns-icon theme-transparent close-btn'
            onClick={() => onActivePermissionChanged(null)}
          >
            <span className='mdi mdi-close' />
          </ButtonBase>
        </div>
        <div className='access-types-body-wrapper'>
          <CheckboxesComponent
            idRef='accessTypesRef'
            data={accessTypes}
            labelInput='accessTypesName'
            isRow
            checked={getIsSelectedAccessType}
            checkboxClassesInput='color'
            onSelectedCheckboxChanged={onSelectedCheckboxChanged}
          />
        </div>
      </div>
    </div>
  );
};

RolesAccessTypesComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  activePermission: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }).isRequired,
  accessTypes: PropTypes.arrayOf(
    PropTypes.shape({
      accessTypesId: PropTypes.number,
      accessTypesName: PropTypes.string,
      color: PropTypes.string,
    })
  ).isRequired,
  onActivePermissionChanged: PropTypes.func.isRequired,
};
