import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { PropTypes } from 'prop-types';
import { Button } from 'react-bootstrap';
import { ApiKey } from '../../Services';
import { Inputs } from '../Controls/Inputs/Inputs';
import { GoogleMapsStyles } from './Styles/GoogleMapsStyles';
import { RadiosGroupComponent } from '../Controls';
import { GlobalTranslate, showError } from '../../Helper';

const MapPoint = () => (
  <div className='map-marker'>
    <span className='mdi mdi-map-marker c-danger' />
  </div>
);

export const GoogleMapsComponent = ({
  defaultCenter,
  hoverDistance,
  defaultZoom,
  onClick,
  location,
  onChange,
  center,
  locations,
  searchLocationValue,
}) => {
  const [google, setGoogle] = useState(null);
  const [StyleMode, setStyleMode] = useState(null);
  const [viewType, setViewType] = useState(1);
  const [searchLocation, setSearchLocation] = useState(null);
  const [premadeChildren] = useState(null);
  const onClickHandler = (clickValue) => {
    if (searchLocation) setSearchLocation(null);
    if (onClick) onClick(clickValue);
  };
  useEffect(() => {
    setSearchLocation(searchLocationValue);
  }, [searchLocationValue]);
  useEffect(() => {
    if (center && premadeChildren) premadeChildren.setCenter(center);
  }, [center, premadeChildren]);
  const handleMap = (map, maps) => {
    setGoogle(maps);
    // eslint-disable-next-line no-new
    // new maps.DirectionsRenderer(map);
  };

  const onViewTypeChangedHandler = (event, newValue) => {
    setViewType(+newValue);
    localStorage.setItem('GoogleMapsViewType', JSON.stringify(+newValue));
  };

  useEffect(() => {
    const data = localStorage.getItem('GoogleMapsViewType');
    if (data === null) {
      localStorage.setItem('GoogleMapsViewType', JSON.stringify(viewType));
      setStyleMode(GoogleMapsStyles.default);
    } else
      setViewType(+data);
    switch (+viewType) {
      case 1:
        setStyleMode(GoogleMapsStyles.default);
        break;
      case 2:
        setStyleMode(GoogleMapsStyles.night);
        break;
      case 3:
        setStyleMode(GoogleMapsStyles.retro);
        break;
      case 4:
        setStyleMode(GoogleMapsStyles.silver);
        break;
      case 5:
        setStyleMode(GoogleMapsStyles.hiding);
        break;
      case 6:
        setStyleMode(GoogleMapsStyles.graa);
        break;
      case 7:
        setStyleMode(GoogleMapsStyles.Hopper);
        break;
      default:
        setStyleMode(GoogleMapsStyles.default);
    }
  }, [onViewTypeChangedHandler]);

  const mapOptions = {
    scrollwheel: true,
    zoomControlOptions: {
      //   position: 'RIGHT_CENTER',    // as long as this is not set it works
      style: 'SMALL',
    },
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'map'],
      position: 'BOTTOM_RIGHT', // this makes the map type control disappear
    },
    types: ['hospital', 'health'],
    draggable: true,
    panControl: true,
    zoomControl: true,
    mapTypeControl: true,
    rotateControl: true,
    scaleControl: true,
    styles: StyleMode,
    streetViewControl: true,
    libraries: ['places', 'geometry', 'drawing', 'visualization'],
    overviewMapControl: true,
  };
  return (
    <div className='google-maps-wrapper'>
      <div className='Manual-Location'>
        <Inputs
          labelValue={GlobalTranslate.t('Shared:latitude-longitude')}
          inputPlaceholder='location'
          value={location}
          getOptionLabel={(option) => option.formatted_address || ''}
          // getOptionSelected={(option) => option.id === state.agentId}
          multiple={false}
          withoutSearchButton
          onInputChanged={onChange}
          endAdornment={(
            <>
              <Button
                title={GlobalTranslate.t('Shared:open-google-map-w')}
                onClick={() => {
                  try {
                    window.open(`https://www.google.com/maps/search/?api=1&query=${location}`);
                  } catch (error) {
                    showError(GlobalTranslate.t('Shared:this-link-is-not-valid'));
                  }
                }}
                className='open-link'
              >
                <span className='p-1 youtube-wraper'><span className='mdi mdi-map-legend' /></span>
              </Button>
            </>
          )}
        />
      </div>
      <div>
        <span>{GlobalTranslate.t('Shared:view-style')}</span>
        <div className='d-flex'>
          <RadiosGroupComponent
            idRef='viewRef'
            data={[
              {
                key: 1,
                value: GlobalTranslate.t('Shared:default'),
              },
              {
                key: 2,
                value: GlobalTranslate.t('Shared:night'),
              },
              {
                key: 3,
                value: GlobalTranslate.t('Shared:retro'),
              },
              {
                key: 4,
                value: GlobalTranslate.t('Shared:silver'),
              },
              {
                key: 5,
                value: GlobalTranslate.t('Shared:hiding'),
              },
              {
                key: 6,
                value: GlobalTranslate.t('Shared:graa'),
              },
              {
                key: 7,
                value: GlobalTranslate.t('Shared:Hopper'),
              },
            ]}
            value={viewType}
            labelInput='value'
            valueInput='key'
            themeClass='theme-line'
            onSelectedRadioChanged={(e, newValue) => onViewTypeChangedHandler(e, newValue)}
          />
        </div>
      </div>
      <div className='google-maps'>
        {locations && (
          <GoogleMapReact
            bootstrapURLKeys={{ key: ApiKey }}
            hoverDistance={hoverDistance}
            defaultCenter={{
              lat: +defaultCenter.lat,
              lng: +defaultCenter.lng,
            }}
            defaultZoom={defaultZoom}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => handleMap(map, maps)}
            onClick={onClickHandler}
            options={mapOptions}
          >
            {locations &&
              locations.map((item, index) => (
                <MapPoint lat={item.latitude} lng={item.longitude} key={`${index + 1}-marker`} />
              ))}
          </GoogleMapReact>
        )}
      </div>
    </div>
  );
};
GoogleMapsComponent.propTypes = {
  location: PropTypes.string.isRequired,
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      text: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.instanceOf(Object)), // for popover content
      component: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
    })
  ).isRequired,
  searchLocationValue: PropTypes.instanceOf(Object),
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  defaultCenter: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  hoverDistance: PropTypes.number,
  defaultZoom: PropTypes.number,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
};
GoogleMapsComponent.defaultProps = {
  defaultCenter: { lat: 24.414833592365972, lng: 54.59777364239554 },
  hoverDistance: 30,
  defaultZoom: 10,
  onClick: undefined,
  onChange: undefined,
  center: undefined,
  searchLocationValue: null,
};
