import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import { GoogleMapsComponent, Spinner } from '../../../../../../Components';
import { GetLatitudeAndLongitudeByUnit } from '../../../../../../Services';
import { bottomBoxComponentUpdate, GetParams, GlobalHistory } from '../../../../../../Helper';

export const UnitProfileMapComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [state, setState] = useState({
    latitude: null,
    longitude: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const getMapByFormId = useCallback(async () => {
    setIsLoading(true);
    const result = await GetLatitudeAndLongitudeByUnit(+GetParams('id'));
    if (!(result && result.status && result.status !== 200)) {
      setState({
        latitude: result.latitude,
        longitude: result.longitude,
      });
    }
    setIsLoading(false);
  }, []);
  const cancelHandler = () => {
    GlobalHistory.push('/home/units-sales/view');
  };
  const saveHandler = async () => {};
  useEffect(() => {
    getMapByFormId();
  }, [getMapByFormId]);
  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
          <span>{t('Shared:save')}</span>
        </ButtonBase>
      </div>
    );
  });
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );
  return (
    <div className='unit-profile-map-wrapper childs-wrapper'>
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
    </div>
  );
};
UnitProfileMapComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
