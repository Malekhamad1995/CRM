import React, { useReducer, useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogTitle, Grid
} from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { GoogleMapsComponent } from '../../../../Components';
import { GlobalTranslate } from '../../../../Helper';

export function MapDialog(props) {
  const { t } = useTranslation(['FormBuilder', 'Shared']);
  const reducer = (state, action) => ({ ...state, [action.id]: action.value });
  const [state, setState] = useReducer(reducer, props.initialState);
  // const ref = useRef(null);

  //
  // useEffect(() => {
  //     const width = ref.current ? ref.current.offsetWidth : 500;
  //     setMapState({...mapState ,width })
  // }, [mapState]);
  const [location, setLocation] = useState('');
  useEffect(() => {
    setLocation(`${state.latitude},${state.longitude}`);
  }, [state]);
  const locationChangeHandler = (event) => {
    let locationSeparated = event.target.value;
    locationSeparated = locationSeparated.replace(/[^.,\d]+/g, '');
    setLocation(locationSeparated);
    locationSeparated = locationSeparated.split(',');

    if (locationSeparated.length >= 2) {
      setState({ id: 'latitude', value: +locationSeparated[0] });
      setState({ id: 'longitude', value: +locationSeparated[1] });
    } else {
      setState({ id: 'latitude', value: null });
      setState({ id: 'longitude', value: null });
    }
  };

  return (
    <>
      <Dialog className='dialogmap' open={props.open} maxWidth='xl'>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            props.onChange(state);
            props.closeDialog();
          }}
        >

          <DialogTitle>
            {GlobalTranslate.t('Shared:Map')}
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={12}>
                {/* <div className="position-relative w-100" ref={ref}> */}
                {/*    <ReactMapGL */}
                {/*        { ...mapState} */}
                {/*        mapboxApiAccessToken={"pk.eyJ1IjoiYWFsdGFpciIsImEiOiJjazN5N2dsZjYwNXpqM2ttd2M0aWduNnBzIn0.E-Rp5C6-pYJo9Gut3tvGEA"} */}
                {/*         onClick={(e)=>{ */}
                {/*            if( Array.isArray(e.lngLat)) */}
                {/*                   { */}
                {/*                        setState({id:"latitude",value:e.lngLat[1]}) */}
                {/*                        setState({id:"longitude",value:e.lngLat[0]}) */}
                {/*                   } */}
                {/*         } */}

                {/*         } */}

                {/*        onViewportChange={(e)=>{setMapState(e)}} */}

                {/*    > */}

                {/*        <Marker     latitude={state.latitude}                   longitude={state.longitude}         > */}
                {/*            <RoomIcon /> */}
                {/*        </Marker> */}

                {/*    </ReactMapGL> */}
                {/* </div> */}
                {state && state.longitude && state.latitude && (
                  <GoogleMapsComponent
                    defaultCenter={{ lat: state.latitude, lng: state.longitude }}
                    location={location}
                    locations={
                      (state && [
                        {
                          latitude: state.latitude,
                          longitude: state.longitude,
                        },
                      ]) ||
                      []
                    }
                    onChange={locationChangeHandler}
                    onClick={(location) => {
                      setState({ id: 'latitude', value: location.lat });
                      setState({ id: 'longitude', value: location.lng });
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions className='mt-2'>
            <Button
              className='btns theme-solid bg-cancel'
              onClick={() => {
                props.closeDialog();
              }}
            >
              {t('Shared:cancel')}
            </Button>

            <Button
              className='btns theme-solid'
              onClick={() => {
                setState({ id: 'latitude', value: 24.414833592365972 });
                setState({ id: 'longitude', value: 54.59777364239554 });
              }}
            >
              {t('Shared:Rest')}
            </Button>
            {' '}
            <Button className='btns theme-solid' type='submit'>
              {t('Shared:save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
//  const googleComponant =   GoogleApiWrapper({ apiKey: 'AIzaSyBVJ175WsWgBrNgHXmqojYaU7roFSUe3ME'}) (MapDialog)  ;
// export {googleComponant as MapDialog }
