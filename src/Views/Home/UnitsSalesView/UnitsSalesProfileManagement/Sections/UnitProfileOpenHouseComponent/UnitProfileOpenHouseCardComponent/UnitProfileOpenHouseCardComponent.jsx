import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import i18next from 'i18next';
import { Fab } from '@material-ui/core';
import { LoadableImageComponant } from '../../../../../../../Components';
import { getDownloadableLink } from '../../../../../../../Helper';
import { PermissionsComponent } from '../../../../../../../Components/PermissionsComponent/PermissionsComponent';
import { UnitsSalesPermissions } from '../../../../../../../Permissions';

export const UnitProfileOpenHouseCardComponent = ({
  parentTranslationPath,
  translationPath,
  data,
  setid,
  edithouse,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const handleid = () => {
    setid(data);
  };
  const HandleidEdit = () => {
    edithouse(data);
  };
  return (
    <div className='UnitProfileOpenHouseCardComponent-wraper'>
      <div className='UnitProfileOpenHouseCard'>
        <LoadableImageComponant
          classes='Image-wraper'
          src={getDownloadableLink(data.imageId) || 'N/A'}
          alt={data.imageName}
        />
        <div className='Fab-contenar'>
          <PermissionsComponent
            permissionsList={Object.values(UnitsSalesPermissions)}
            permissionsId={UnitsSalesPermissions.UpdateOpenHouseForUnit.permissionsId}
          >
            <div className='icon1'>
              <Fab size='small' color='secondary' aria-label='add' onClick={HandleidEdit}>
                <span className='mdi mdi-mdi mdi-lead-pencil' />
              </Fab>
            </div>
          </PermissionsComponent>
          <PermissionsComponent
            permissionsList={Object.values(UnitsSalesPermissions)}
            permissionsId={UnitsSalesPermissions.DeleteOpenHouseForUnit.permissionsId}
          >
            <div className='icon2'>
              <Fab size='small' color='secondary' aria-label='add' onClick={handleid}>
                <span className='mdi mdi-trash-can-outline' />
              </Fab>
            </div>
          </PermissionsComponent>
        </div>

        <div className='data-wraper'>
          <div className='Name-House'>
            {' '}
            {data.unitOpenHouseLocation || 'N/A'}
          </div>
          <div className='calendar-wraper'>
            <div className='mdi mdi-calendar' />
            <div className='calendar-open'>
              <span className='title'>
                {t(`${translationPath}Openon`)}
                &nbsp;:&nbsp;
              </span>
              {moment(data.unitOpenHouseStartTime).locale(i18next.language).format('DD/MM/YYYY') ||
                'N/A'}
            </div>
          </div>
          <div className='details-wraper'>
            <div>
              <div className='title-low-weight'>{t(`${translationPath}Start`)}</div>
              <div className='title'>
                {moment(data.unitOpenHouseStartTime).locale(i18next.language).format('HH:mm A') ||
                  'N/A'}
              </div>
            </div>
            <div className='arrow'>
              <span
                className={i18next.language ? 'mdi mdi-chevron-right' : 'mdi mdi-chevron-left'}
              />
            </div>
            <div>
              <div className='title-low-weight'>{t(`${translationPath}end`)}</div>
              <div className='title'>
                {moment(data.unitOpenHouseEndTime).locale(i18next.language).format('HH:mm A') ||
                  'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UnitProfileOpenHouseCardComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
