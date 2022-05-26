import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Descriptions, UnitDetails } from './Sections';
import { bottomBoxComponentUpdate } from '../../../../../../../../Helper';
import { PermissionsComponent } from '../../../../../../../../Components/PermissionsComponent/PermissionsComponent';
import { UnitsLeasePermissions, UnitPermissions } from '../../../../../../../../Permissions';

export const DescriptionsView = ({
  state,
  onStateChanged,
  schema,
  isMarketAsADifferentAgent,
  onIsMarketAsADifferentAgent,
  isSubmitted,
  activeItem,
  cancelHandler,
  saveHandler,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation('Shared');
  const [isPropertyManagementView, setIsPropertyManagementView] = useState(false);

  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];
  useEffect(() => {
    if (pathName === 'units-property-management/unit-profile-edit')
      setIsPropertyManagementView(true);
    else
      setIsPropertyManagementView(false);
  }, [pathName]);
  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        {
          isPropertyManagementView && (
            <PermissionsComponent
              permissionsList={Object.values(UnitPermissions)}
              permissionsId={UnitPermissions.EditUnitMarketingInfo.permissionsId}
            >
              <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
                <span>{t('Shared:save')}</span>
              </ButtonBase>
            </PermissionsComponent>

          )

        }

        {
          !isPropertyManagementView && (
            <PermissionsComponent
              permissionsList={Object.values(UnitsLeasePermissions)}
              permissionsId={UnitsLeasePermissions.EditUnitMarketingInfo.permissionsId}
            >
              <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
                <span>{t('Shared:save')}</span>
              </ButtonBase>
            </PermissionsComponent>

          )

        }
      </div>
    );
  });
  return (
    <div className='marketing-documentations-wrapper childs-wrapper bt-0'>
      <UnitDetails
        activeItem={activeItem}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      <Descriptions
        isMarketAsADifferentAgent={isMarketAsADifferentAgent}
        onIsMarketAsADifferentAgent={onIsMarketAsADifferentAgent}
        state={state}
        activeItem={activeItem}
        schema={schema}
        onStateChanged={onStateChanged}
        isSubmitted={isSubmitted}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};

DescriptionsView.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isMarketAsADifferentAgent: PropTypes.bool.isRequired,
  onIsMarketAsADifferentAgent: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  activeItem: PropTypes.instanceOf(Object),
  cancelHandler: PropTypes.func.isRequired,
  saveHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
DescriptionsView.defaultProps = {
  activeItem: undefined,
};
