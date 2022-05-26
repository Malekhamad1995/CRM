import React, {
  useCallback,
  useState,
  useEffect
} from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import Joi from 'joi';
import { AutocompleteComponent, Inputs, Spinner } from '../../../../Components';
import 'react-quill/dist/quill.snow.css';
import {
  getErrorByName, showError, showSuccess
} from '../../../../Helper';
import { lookupItemsGetId, lookupItemsPost } from '../../../../Services';
import {
  Country, Cities, District, Community
} from '../../../../assets/json/StaticLookupsIds.json';

export const CreteDialogdView = ({
  parentTranslationPath,
  translationPath,
  lookupTypesId,
  onCancelClicked,
  relode,
  labelValueis,
  Type,
  autoData
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [parentId, setparentId] = useState(null);
  const [state, setState] = useState({
    lookupItemId: 0,
  });
  const [Data, setData] = useState({
    DataCountry: [],
    DataCity: [],
    DataDistrict: [],
    DataCommunity: [],
  });
  const [selected, setSelected] = useState({
    Country: null,
    Cities: null,
    District: null,
    Community: null,
  });

  const [loadings, setloadings] = useState({
    Counrty: false,
    City: false,
    District: false,
    Community: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [desbbt, setdesbbt] = useState(false);

  const schema = Joi.object({
    LocationName: Joi.string()
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

  const saveHandler = async () => {
    setIsLoading(true);
    const res = await lookupItemsPost(
      {
        lookupItemName: (state && state.LocationName),
        lookupItemCode: ((state && state.LocationName).substring(0, 2)).toUpperCase(),
        description: null,
        parentLookupItemId: parentId,
        lookupTypeId: lookupTypesId,
        order: null,
      }
    );
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t`${translationPath}Create-successfully`);
      relode();
      onCancelClicked();
    } else showError(t`${translationPath}Create-failed`);
  };
  const lookupGetServices = useCallback(async (id, lookupParent) => {
    const result = await lookupItemsGetId({
      lookupTypeId: id,
      lookupParentId: lookupParent
    });
    if (id === Country) {
      setData((items) => ({ ...items, DataCountry: result || [] }));
      setloadings((items) => ({ ...items, Counrty: false }));
    } else if (id === Cities) {
      setData((items) => ({ ...items, DataCity: result || [] }));
      setloadings((items) => ({ ...items, City: false }));
    } else if (id === District) {
      setData((items) => ({ ...items, DataDistrict: result || [] }));
      setloadings((items) => ({ ...items, District: false }));
    } else if (id === Community) {
      setData((items) => ({ ...items, DataCommunity: result || [] }));
      setloadings((items) => ({ ...items, Community: false }));
    }
  }, []);

  useEffect(() => {
    if (Type !== undefined)
      setloadings((items) => ({ ...items, Counrty: true }));
    lookupGetServices(Country);
  }, [Type, lookupGetServices]);

  useEffect(() => {
    if (Type === undefined)
      setdesbbt(false);
    else if
      (parentId === null)
      setdesbbt(true); else
      setdesbbt(false);
  }, [Type, parentId]);

  useEffect(() => {
    if (autoData) {
      if (Type === 'Counrty') {
        setparentId((autoData && autoData.Country && autoData.Country.lookupItemId) || null);
        setSelected((items) => ({ ...items, Country: (autoData && autoData.Country) || null }));
      } else if (Type === 'City') {
        setSelected((items) => ({ ...items, Country: autoData && autoData.Country }));
        if (autoData && autoData.Country && autoData.Country.lookupItemId)
          lookupGetServices(Cities, (autoData && autoData.Country.lookupItemId));
        setparentId((autoData && autoData.City && autoData.City.lookupItemId) || null);
        setSelected((items) => ({ ...items, Cities: (autoData && autoData.City) || null }));
      } else if (Type === 'District') {
        setSelected((items) => ({ ...items, Country: (autoData && autoData.Country) || null }));
        setSelected((items) => ({ ...items, Cities: (autoData && autoData.City) || null }));
        setSelected((items) => ({ ...items, District: (autoData && autoData.District) || null }));
        if (autoData && autoData.Country && autoData.Country.lookupItemId);
        lookupGetServices(Cities, (autoData && autoData.Country && autoData.Country.lookupItemId) || null);
        if (autoData && autoData.City && autoData.City.lookupItemId);
        lookupGetServices(District, (autoData && autoData.City && autoData.City.lookupItemId) || null);
        if (autoData && autoData.District && autoData.District.lookupItemId);
        lookupGetServices(Community, (autoData && autoData.District && autoData.District.lookupItemId) || null);
        setparentId((autoData && autoData.District && autoData.District.lookupItemId) || null);
      } else if (Type === 'Community') {
        setSelected((items) => ({ ...items, Country: (autoData && autoData.Country) || null }));
        setSelected((items) => ({ ...items, Cities: (autoData && autoData.City) || null }));
        setSelected((items) => ({ ...items, District: (autoData && autoData.District) || null }));
        setSelected((items) => ({ ...items, Community: (autoData && autoData.Community) || null }));
        if (autoData && autoData.Country && autoData.Country.lookupItemId);
        lookupGetServices(Cities, (autoData && autoData.Country.lookupItemId) || null);
        if (autoData && autoData.City && autoData.City.lookupItemId);
        lookupGetServices(District, (autoData && autoData.City && autoData.City.lookupItemId) || null);
        if (autoData && autoData.District && autoData.District.lookupItemId);
        lookupGetServices(Community, (autoData && autoData.District && autoData.District.lookupItemId) || null);
        setparentId((autoData && autoData.Community && autoData.Community.lookupItemId) || null);
      }
    }
  }, [Type, autoData, lookupGetServices]);

  return (
    <div className='view-wrapper-AddFormCountry'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='w-100 px-2'>
          {(Type !== undefined) ?
            (
              <div className='pt-3'>
                <AutocompleteComponent
                  idRef='CounrtyRef'
                  inputPlaceholder={t(`${translationPath}Select-Counrty`)}
                  multiple={false}
                  selectedValues={selected.Country || []}
                  getOptionSelected={(option) => option.lookupItemId === (selected.Country && selected.Country.lookupItemId) || null}
                  displayLabel={(option) => t(`${option.lookupItemName || ''}`)}
                  data={Data.DataCountry || []}
                  withoutSearchButton
                  isWithError
                  labelValue='Country'
                  labelClasses='Requierd-Color'
                  isLoading={loadings.Counrty}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onChange={(event, newValue) => {
                    if (Type === 'Counrty') {
                      setparentId((newValue && newValue.lookupItemId) || null);
                      setSelected((items) => ({ ...items, Country: newValue }));
                    } else {
                      lookupGetServices(Cities, (newValue && newValue.lookupItemId) || null);
                      setloadings((items) => ({ ...items, City: true }));
                      setSelected((items) => ({
                        ...items, District: null, Community: null, Cities: null
                      }));
                      setSelected((items) => ({ ...items, Country: newValue }));
                    }
                  }}
                />
              </div>
            ) : ''}
        </div>
        <div className='w-100 px-2'>
          {(Type !== 'Counrty') && (Type !== undefined) ? (
            <div className='pt-3'>
              <AutocompleteComponent
                idRef='CityRef'
                inputPlaceholder={t(`${translationPath}Select-City`)}
                multiple={false}
                labelValue='city'
                data={Data.DataCity || []}
                selectedValues={selected.Cities || []}
                getOptionSelected={(option) => option.lookupItemId === (selected.Cities && selected.Cities.lookupItemId) || null}
                displayLabel={(option) => t(`${option.lookupItemName || ''}`)}
                withoutSearchButton
                isWithError
                labelClasses='Requierd-Color'
                isLoading={loadings.City}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  if (Type === 'City') {
                    setparentId((newValue && newValue.lookupItemId) || null);
                    setSelected((items) => ({ ...items, Cities: newValue }));
                  } else {
                    lookupGetServices(District, newValue && newValue.lookupItemId);
                    setloadings((items) => ({ ...items, District: true }));
                    setSelected((items) => ({ ...items, District: null, Community: null }));
                    setSelected((items) => ({ ...items, Cities: newValue }));
                  }
                }}
              />
            </div>
          ) :
            ''}
        </div>
        <div className='w-100 px-2'>
          {((Type === ('District') || (Type === ('Community'))) && (
            <div className='pt-3'>
              <AutocompleteComponent
                idRef='DistrictRef'
                inputPlaceholder={t(`${translationPath}Select-District`)}
                multiple={false}
                data={Data.DataDistrict || []}
                labelValue='District'
                selectedValues={selected.District || []}
                getOptionSelected={(option) => option.lookupItemId === (selected.District && selected.District.lookupItemId) || null}
                displayLabel={(option) => t(`${option.lookupItemName || ''}`)}
                withoutSearchButton
                isWithError
                labelClasses='Requierd-Color'
                isLoading={loadings.District}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  if (Type === 'District') {
                    setparentId((newValue && newValue.lookupItemId) || null);
                    setSelected((items) => ({ ...items, District: newValue }));
                  } else {
                    lookupGetServices(Community, newValue && newValue.lookupItemId);
                    setloadings((items) => ({ ...items, Community: true }));
                    setSelected((items) => ({ ...items, Community: null }));
                    setSelected((items) => ({ ...items, District: newValue }));
                  }
                }}
              />
            </div>
          )) || ''}
          {((Type === ('Community')) && (
            <div className='pt-3'>
              <AutocompleteComponent
                idRef='Communityref'
                inputPlaceholder={t(`${translationPath}Select-Community`)}
                multiple={false}
                labelClasses='Requierd-Color'
                labelValue='Communitie'
                data={Data.DataCommunity || []}
                selectedValues={selected.Community || []}
                getOptionSelected={(option) => option.lookupItemId === (selected.Community && selected.Community.lookupItemId) || null}
                displayLabel={(option) => t(`${option.lookupItemName || ''}`)}
                withoutSearchButton
                isWithError
                isLoading={loadings.Community}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  setparentId((newValue && newValue.lookupItemId) || null);
                  setSelected((items) => ({ ...items, Community: newValue }));
                }}
              />
            </div>
          )) || ''}
        </div>
        <div className='w-100 px-2'>
          <div className='pt-3'>
            <Inputs
              idRef='Country-nameRef'
              helperText={getErrorByName(schema, 'LocationName').message}
              error={getErrorByName(schema, 'LocationName').error}
              isWithError
              labelValue={labelValueis}
              labelClasses='Requierd-Color'
              inputPlaceholder={t(`${translationPath}write-name`)}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              value={state.LocationName}
              onInputChanged={(event) =>
                setState({ ...state, LocationName: event.target.value })}
            />
          </div>
        </div>

      </div>
      <div className='d-flex-v-center-h-end flex-wrap mt-2'>
        <Button
          className='MuiButtonBase-root btns theme-transparent mb-2'
          onClick={() => { onCancelClicked(); }}
        >
          <span>{t(`${translationPath}Cancel`)}</span>
          <span className='MuiTouchRipple-root' />
        </Button>
        <Button
          className='MuiButtonBase-root btns theme-solid mb-2'
          disabled={((schema.error) || desbbt)}
          onClick={() => { saveHandler(); }}
        >
          <span>
            {t(`${translationPath}save`)}
          </span>
          <span className='MuiTouchRipple-root' />
        </Button>
      </div>
    </div>

  );
};

CreteDialogdView.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  Type: PropTypes.string.isRequired,
  labelValueis: PropTypes.string.isRequired,
  lookupTypesId: PropTypes.number.isRequired,
  relode: PropTypes.func.isRequired,
  onCancelClicked: PropTypes.func.isRequired,
  autoData: PropTypes.instanceOf(Object),
};

CreteDialogdView.defaultProps = {
  autoData: {},
};
