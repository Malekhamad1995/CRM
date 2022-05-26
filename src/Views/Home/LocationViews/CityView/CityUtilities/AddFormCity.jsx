import React, {
  useEffect, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { Button } from 'react-bootstrap';
import Joi from 'joi';
import { Inputs } from '../../../../../Components';
import googlemaps from '../../../../../assets/images/icons/Google_Maps_icon.png';
import { MapDialog } from '../../../FormBuilder/Dialogs/MapDialog';
import 'react-quill/dist/quill.snow.css';
import { getErrorByName, GetParams, showError } from '../../../../../Helper';
import { DescriptionComponents } from './DescriptionComponents';
import { isURL, matchYoutubeUrl } from '../../../../../Helper/Link.helper';

export const AddFormCity = ({
  parentTranslationPath,
  translationPath,
  validatestate,
  obejectDTO,
  details,
  substate
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [openMapDialog, setOpenMapDialog] = useState(false);
  const [ActiveButton, setActiveButton] = useState(true);
  const [DescriptionComponentstate, setDescriptionComponentstate] = useState({});
  const [state, setState] = useState({
    lookupItemId: 0,
    arabicLocationName: '',
    LocationName: '',
    slug: '',
    latitude: 25.178495,
    longitude: 55.545002,
    youtubeLink: '',
    virtualToursLink: '',
    usefulLink: '',
    isActive: true,
  });

  const schema = Joi.object({
    LocationName: Joi.string()
      .required()
      .messages({
        'string.empty': t(`${translationPath}name-is-required`),
      }),
    arabicLocationName: Joi.string()
      .required()
      .messages({
        'string.empty': t(`${translationPath}name-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);

  useEffect(() => {
    if (details) {
      setState({
        ...state,
        LocationName: GetParams('lookupItemName'),
        lookupItemId: +GetParams('id') || (details && details.lookupItemId),
        arabicLocationName: details && details.arabicLocationName,
        slug: (details && details.slug) || '',
        locationDetailsId: details && details.locationDetailsId,
        virtualToursLink: details && details.virtualToursLink,
        latitude: details && details.latitude,
        longitude: details && details.longitude,
        youtubeLink: details && details.youtubeLink,
        usefulLink: details && details.usefulLink,
        isActive: details && details.isActive,
        arabicDescription: details && details.arabicDescription,
      });
      setActiveButton((details && details.isActive));
    } else
      setState({ ...state, LocationName: GetParams('lookupItemName'), lookupItemId: +GetParams('id') });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  useEffect(() => {
    validatestate(schema.error);
    obejectDTO({ ...state, ...DescriptionComponentstate });
  }, [state, DescriptionComponentstate]);

  return (
    <div className='view-wrapper-AddFormCountry'>
      <div className='d-flex-column'>
        <div className='w-100 px-2'>
          <div className='pt-3'>
            <Inputs
              idRef='Country-nameRef'
              helperText={getErrorByName(schema, 'LocationName').message}
              error={getErrorByName(schema, 'LocationName').error}
              isWithError
              labelValue='city-name'
              labelClasses='Requierd-Color'
              isDisabled
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              value={state.LocationName}
              onInputChanged={(event) =>
                setState({ ...state, LocationName: event.target.value })}
            />
          </div>
          <div className='pt-3'>
            <Inputs
              idRef='Country-name-arRef'
              labelValue='city-name-ar'
              helperText={getErrorByName(schema, 'arabicLocationName').message}
              error={getErrorByName(schema, 'arabicLocationName').error}
              labelClasses='Requierd-Color'
              isWithError
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              value={state.arabicLocationName}
              onInputChanged={(event) =>
                setState({ ...state, arabicLocationName: event.target.value })}
            />
          </div>
          <div className='pt-3'>
            <Inputs
              idRef='Slug-arRef'
              labelValue='Slug'
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              value={state.slug}
              onInputChanged={(event) =>
                setState({ ...state, slug: event.target.value })}
            />
          </div>
          <div className='pt-3'>
            <Inputs
              idRef='GooglecordsRef'
              labelValue='Google-cords'
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              value={state.latitude}
              onInputChanged={(event) =>
                setState({ ...state, latitude: event.target.value })}
              endAdornment={(
                <>
                  <div className='d-flex-v-center '>
                    <Inputs
                      idRef='premiumPercentageOfBasePriceRef'
                      labelClasses='inside-input-label'
                      wrapperClasses='mb-0'
                      value={state.longitude}
                      onInputChanged={(event) =>
                        setState({ ...state, longitude: event.target.value })}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      setOpenMapDialog(true);
                    }}
                    className='googlemaps-bbt '
                  >
                    <img
                      src={googlemaps}
                      alt={t(`${translationPath}googlemaps`)}
                      className='Open-map'
                    />
                    <span className='p-1'>{t(`${translationPath}Open-map`)}</span>
                  </Button>
                </>
              )}
            />
          </div>
          <div>
            <DescriptionComponents
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              details={details}
              setDescription={(e) => setDescriptionComponentstate(e)}
            />
          </div>
          <div className='pt-3'>
            <Inputs
              idRef='VirtualtoursRef'
              labelValue={t(`${translationPath}arbic-description`)}
              translationPath={translationPath}
              multiline
              inputPlaceholder={t(`${translationPath}TypeHere`)}
              rows={10}
              parentTranslationPath={parentTranslationPath}
              value={state.arabicDescription}
              onInputChanged={(event) =>
                setState({ ...state, arabicDescription: event.target.value })}
            />
          </div>
          <div className='pt-3'>
            <Inputs
              idRef='VirtualtoursRef'
              labelValue='Virtual-tours'
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              value={state.virtualToursLink}
              onInputChanged={(event) =>
                setState({ ...state, virtualToursLink: event.target.value })}
            />
          </div>
          <div className='pt-3'>

            <Inputs
              idRef='Useful linksRef'
              labelValue='Useful-links'
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              value={state.usefulLink}
              onInputChanged={(event) =>
                setState({ ...state, usefulLink: event.target.value })}
              endAdornment={(
                <>
                  <Button
                    disabled={!(isURL(state.usefulLink))}
                    onClick={() => {
                      try {
                        window.open(state.usefulLink || '');
                      } catch (error) {
                        showError(t(`${translationPath}this-link-is-not-valid`));
                      }
                    }}
                    className='googlemaps-bbt'
                  >
                    <span className='p-1 youtube-wraper'><span className='mdi mdi-web' /></span>
                  </Button>
                </>
              )}
            />
          </div>
          <div className='pt-3'>
            <Inputs
              idRef='youtubeLinksRef'
              labelValue='youtubeLink'
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              value={state.youtubeLink}
              onInputChanged={(event) =>
                setState({ ...state, youtubeLink: event.target.value })}
              endAdornment={(
                <>
                  <Button
                    disabled={!(matchYoutubeUrl(state.youtubeLink || ''))}
                    onClick={() => {
                      try {
                        window.open(state.youtubeLink || '');
                      } catch (error) { showError(t(`${translationPath}this-link-is-not-valid`)); }
                    }}
                    className='googlemaps-bbt '
                  >
                    <span className='p-1 youtube-wraper'><span className='mdi mdi-youtube' /></span>
                  </Button>
                </>
              )}
            />
          </div>
          <div className='Active-btt-menu    pt-3'>
            <ButtonBase
              className={`menu-button ${ActiveButton === true ? 'is-active' : ''}`}
              onClick={() => {
                setActiveButton(true);
                setState({ ...state, isActive: true });
              }}
            >
              <span className='mdi mdi-check-circle-outline' />
              {t(`${translationPath}Active`)}
            </ButtonBase>
            <ButtonBase
              className={`menu-button ${ActiveButton === false ? 'is-active' : ''}`}
              onClick={() => {
                setActiveButton(false);
                setState({ ...state, isActive: false });
              }}
            >
              <span className='mdi mdi-close-circle-outline' />
              {t(`${translationPath}inActive`)}
            </ButtonBase>
          </div>
          <div className='Active-btt-menu    pt-3' />
        </div>
      </div>
      {openMapDialog && (
        <MapDialog
          open={openMapDialog}
          onChange={(e) => {
            setState({ ...state, longitude: e.longitude, latitude: e.latitude });
          }}
          initialState={{ latitude: state.latitude, longitude: state.longitude }}
          closeDialog={() => {
            setOpenMapDialog(false);
          }}
        />
      )}
    </div>

  );
};

// AddFormCountry.propTypes = {
//   parentTranslationPath: PropTypes.string.isRequired,
//   translationPath: PropTypes.string.isRequired,
//   obejectDTO: PropTypes.instanceOf(Object).isRequired,
//   details: PropTypes.instanceOf(Object).isRequired,
//   validatestate: PropTypes.instanceOf(Object).isRequired,
//   DescriptionDTO: PropTypes.instanceOf(Array),
//   setStateDescription: PropTypes.func,
// };
