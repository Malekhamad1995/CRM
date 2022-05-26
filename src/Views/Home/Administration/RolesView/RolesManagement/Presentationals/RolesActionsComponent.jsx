import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import { useTranslation } from 'react-i18next';
import { GlobalHistory } from '../../../../../../Helper';
import { RolesPermissions } from '../../../../../../Permissions';
import { PermissionsComponent } from '../../../../../../Components';

export const RolesActionsComponent = ({
  rolesId,
  saveHandler,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className='roles-actions-wrapper'>
      <div className='roles-actions'>
        <ButtonBase
          className='btns theme-transparent c-danger mb-2'
          onClick={() => GlobalHistory.push('/home/Roles/view')}
        >
          <span>{t(`${translationPath}cancel`)}</span>
        </ButtonBase>
      </div>
      <div className='roles-actions'>
        <PermissionsComponent
          permissionsList={Object.values(RolesPermissions)}
          permissionsId={RolesPermissions.SaveRoles.permissionsId}
        >
          <ButtonBase className='btns theme-solid' type='submit'>
            <span>{t(`${translationPath}${(rolesId && 'update') || 'save'}`)}</span>
          </ButtonBase>
        </PermissionsComponent>
      </div>
    </div>
  );
};

RolesActionsComponent.propTypes = {
  rolesId: PropTypes.string,
  saveHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
RolesActionsComponent.defaultProps = {
  rolesId: undefined,
};
