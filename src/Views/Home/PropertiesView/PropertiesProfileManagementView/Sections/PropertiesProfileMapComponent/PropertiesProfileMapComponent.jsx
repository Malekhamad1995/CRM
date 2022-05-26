import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Spinner } from '../../../../../../Components';
import { GoogleMapsComponent } from '../../../../../../Components/GoogleMapsComponent/GoogleMapsComponent';
import { GetLatitudeAndLongitudeByProperty } from '../../../../../../Services';
import { GetParams } from '../../../../../../Helper';

export const PropertiesProfileMapComponent = ({
  parentTranslationPath,
  translationPath,
  propertiesId,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    latitude: null,
    longitude: null,
  });

  const getMapByFormId = useCallback(async (Id) => {
    setIsLoading(true);
    const result = await GetLatitudeAndLongitudeByProperty(Id);

    setState({
      latitude: result.latitude,
      longitude: result.longitude,
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const editId = GetParams('id');
    if (editId !== null) getMapByFormId(editId);
  }, [propertiesId, getMapByFormId]);

  return (
    <div className='associated-Properties-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='title-section'>
        <span>{t(`${translationPath}Map`)}</span>
      </div>

      <div className='map-conteaner'>
        {state && state.longitude && state.latitude && (
          <GoogleMapsComponent
            defaultCenter={{ lat: +state.latitude, lng: +state.longitude }}
            locations={[state]}
            onClick={(e) => {
              if (Array.isArray(e.latLng)) {
                setState({
                  latitude: e.latLng[0],
                  longitude: e.latLng[1],
                });
              }
            }}
          />
        )}
      </div>
      <div className='contral'>
        <div className='mb-2'>
          <ButtonBase className='btns theme-solid bg-cancel'>
            <span>{t(`${translationPath}Cancel`)}</span>
          </ButtonBase>
          <ButtonBase className='btns theme-solid'>
            <span>{t(`${translationPath}SaveChanges`)}</span>
          </ButtonBase>
        </div>
      </div>
    </div>
  );
};
PropertiesProfileMapComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  propertiesId: PropTypes.number.isRequired,
};
