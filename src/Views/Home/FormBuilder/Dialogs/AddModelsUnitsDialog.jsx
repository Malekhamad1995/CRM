import React, {
  useReducer, useEffect, useState, useCallback
} from 'react';
import {
  ButtonBase,
  DialogActions, DialogContent, DialogTitle, Dialog
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { getDownloadableLink, showSuccess, showError } from '../../../../Helper';
// import { config } from '../../../../config/config';
import {
  Inputs,
  UploaderComponent,
  AutocompleteComponent,
  Spinner,
} from '../../../../Components';
import {
  lookupItemsGetId, getProperties, propertyDetailsGet, propertyDetailsPut
} from '../../../../Services';

// import { DefaultImagesEnum, UploaderThemesEnum } from '../../../../Enums';
const translationPath = '';

export const AddModelsUnitsDialog = ({
  open,
  close , 
  propertyName , 
}) => {
  const { t } = useTranslation('FormBuilder');
  const [views, setViews] = useState([]);
  const [properties, setProperties] = useState([]);
  // eslint-disable-next-line prefer-const
  let property = {
    propertyId: null,
    property: { property_name: null }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [proprtySelect, setProprtySelect] = useState(null);
  const getAllViewsAPI = useCallback(async () => {
    setIsLoading(true);
    const result = await lookupItemsGetId({ lookupTypeId: 142 });
    if (!(result && result.status && result.status !== 200))
      setViews(result);
    else setViews([]);
    setIsLoading(false);
  }, []);
  const getPropertiesByIdAPI = useCallback(async (id) => {
    setIsLoading(true);
    const result = await propertyDetailsGet({ id });
    if (!(result && result.status && result.status !== 200))
      setProprtySelect(result);
    else setProprtySelect(null);
    setIsLoading(false);
  }, []);
  const getPropertiesAPI = useCallback(async (value) => {
    setIsLoading(true);
    const result = await getProperties({ pageIndex: 0, pageSize: 10, search: value });
    if (!(result && result.status && result.status !== 200))
      setProperties(result.result);
    else setProperties([]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
     let retrunProprty = propertyName;
      property.propertyId = retrunProprty &&  retrunProprty.id;
      property.property.property_name =  retrunProprty && retrunProprty.name;
    
    getPropertiesByIdAPI(property.propertyId);
    getAllViewsAPI();
    if (retrunProprty)
      getPropertiesAPI(retrunProprty.name);
    else getPropertiesAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllViewsAPI, getPropertiesAPI]);

  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);

  const [state, setState] = useReducer(reducer, {
    unitModelName: null,
    propertyId: null,
    primary_view: null,
    secondary_view: null,
    area: null,
    bedrooms: null,
    bathrooms: null,
    unit_number: null,
    selling_price_from: null,
    selling_price_to: null,
    rent_per_year_from: null,
    rent_per_year_to: null,
    files: []
  });

  useEffect(() => {
    setState({ id: 'propertyId', value: proprtySelect });
  }, [proprtySelect]);

  const saveHandler = useCallback(async () => {
    setIsLoading(true);
    if (state.unitModelName) {
      // eslint-disable-next-line no-unused-vars
      const id = state.propertyId.propertyId;
      const result = await propertyDetailsGet({ id });
      if (!(result && result.status && result.status !== 200)) {
        const unitModel = {};
        unitModel.Models = [];
        const unitModelOld = result.property.units_models;
        if (unitModelOld) {
          unitModelOld.Models.map((item) => {
            unitModel.Models.push(item);
          });
          Object.keys(unitModelOld).forEach((key) => {
            if (typeof unitModelOld[key] === 'object' && key !== 'Models') {
              if (unitModelOld[key])
                unitModel[key] = unitModelOld[key];
            }
          });
        }

        unitModel.Models.push(state.unitModelName);
        unitModel[state.unitModelName] = {
          area: state.area,
          bathroom: state.bathrooms,
          bedroom: state.bedrooms,
          primary_view: state.primary_view,
          rent_per_year_from: state.rent_per_year_from,
          rent_per_year_to: state.rent_per_year_to,
          secondary_view: state.secondary_view,
          selling_price_from: state.selling_price_from,
          selling_price_to: state.selling_price_to,
          units_no: state.unit_number,
          files: state.files
        };

        const propertyJson = {
          propertyId: result.propertyId,
          property: {
            ...result.property,
            units_models: unitModel
          },
          createdOn: result.createdOn,
          updateOn: result.updateOn,
          propertyImages: result.propertyImages
        };

        const putResponse = await propertyDetailsPut({
          id,
          body: { propertyJson },
        });
        if (!(putResponse && putResponse.status && putResponse.status !== 200))
          showSuccess(t`${translationPath}UpdatePropertySuccessfully`);
        else
          showError(t`${translationPath}updatePropertyFail`);
      }
      // eslint-disable-next-line prefer-const
    }
    setIsLoading(false);
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          close();
        }}
        disableBackdropClick
        className='rotationCriteriaDialog-dialog-wrapper'
      >
        <Spinner isActive={isLoading} />

        <form noValidate>
          <DialogTitle id='alert-dialog-slide-title'>
            <span>
              {t(`${translationPath}AddNewUnitModel`)}
            </span>
          </DialogTitle>
          <DialogContent>
            <div className='dialog-content-wrapper'>
              <div className='dialog-content-item'>
                <AutocompleteComponent
                  idRef='proprtyNameRef'
                  className='px-2'
                  labelValue={t(`${translationPath}Proprty Name`)}
                  selectedValues={state.propertyId || proprtySelect}
                  value={state.propertyId}
                  multiple={false}
                  data={properties || []}
                  displayLabel={(option) =>
                    (option && option.property.property_name) || ''}
                  chipsLabel={(option) => (option && option.property.property_name) || ''}
                  withoutSearchButton
                  onChange={(event, newValue) => {
                    setState({ id: 'propertyId', value: newValue || proprtySelect });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='modelUnitNameRef'
                  labelValue='Model Unit Name'
                  type='text'
                  onInputChanged={(event) => {
                    setState({ id: 'unitModelName', value: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='areaRef'
                  labelValue='Area'
                  type='number'
                  min={0}
                  onInputChanged={(event) => {
                    setState({ id: 'area', value: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='bedroomsRef'
                  labelValue='Bedrooms'
                  type='number'
                  min={0}
                  onInputChanged={(event) => {
                    setState({ id: 'bedrooms', value: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='bathroomsRef'
                  labelValue='Bathrooms'
                  type='number'
                  min={0}
                  onInputChanged={(event) => {
                    setState({ id: 'bathrooms', value: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='labelRef'
                  labelValue='Unit Number'
                  onInputChanged={(event) => {
                    setState({ id: 'unit_number', value: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='sellingPriceFromRef'
                  labelValue='Selling Price From'
                  type='number'
                  min={0}
                  onInputChanged={(event) => {
                    setState({ id: 'selling_price_from', value: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='sellingPriceToRef'
                  labelValue='Selling Price To'
                  type='number'
                  min={0}
                  onInputChanged={(event) => {
                    setState({ id: 'selling_price_to', value: event.target.value });
                  }}
                />
              </div>

              <div className='dialog-content-item'>
                <Inputs
                  idRef='RentPerYearFromRef'
                  labelValue='Rent Per Year From'
                  type='number'
                  min={0}
                  onInputChanged={(event) => {
                    setState({ id: 'rent_per_year_from', value: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='rentPerYearToRef'
                  labelValue='Rent Per Year To'
                  type='number'
                  min={0}
                  onInputChanged={(event) => {
                    setState({ id: 'rent_per_year_to', value: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <AutocompleteComponent
                  idRef='primaryViewRef'
                  className='px-2'
                  labelValue='Primary View'
                  multiple
                  data={views || []}
                  displayLabel={(option) =>
                    (option && option.lookupItemName) || ''}
                  chipsLabel={(option) => (option && option.lookupItemName) || ''}
                  withoutSearchButton
                  onChange={(event, newValue) => {
                    setState({ id: 'primary_view', value: newValue });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <AutocompleteComponent
                  idRef='secondaryViewRef'
                  className='px-2'
                  labelValue='Secondary View'
                  multiple={false}
                  data={views || []}
                  displayLabel={(option) =>
                    (option && option.lookupItemName) || ''}
                  chipsLabel={(option) => (option && option.lookupItemName) || ''}
                  withoutSearchButton
                  onChange={(event, newValue) => {
                    setState({ id: 'secondary_view', value: newValue });
                  }}
                />
              </div>
              <div className='dialog-content-item w-100'>
                <UploaderComponent
                  idRef='modelsUnitsImportRef'
                  multiple
                  accept='*'
                  uploadedChanged={(files) => {
                    setState({ id: 'files', value: files });
                  }}
                  chipHandler={(value) => () => {
                    const link = document.createElement('a');
                    // If you don't know the name or want to use
                    // the webserver default set name = ''
                    link.setAttribute('download', value.fileName);
                    link.href = getDownloadableLink(value.uuid);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  }}
                  viewUploadedFilesCount
                  initUploadedFiles={
                    []
                  }

                />
              </div>

            </div>
          </DialogContent>
          <DialogActions>
            <div className='form-builder-wrapper'>
              <div className='form-builder-footer-wrapper is-dialog w-100 MuiGrid-align-items-xs-center MuiGrid-justify-xs-space-between'>
                <div className='MuiDialogActions-root dialog-footer-wrapper  MuiDialogActions-spacing'>
                  <div className='save-cancel-wrapper d-flex-v-center-h-end flex-wrap p-2'>
                    <div className='cancel-wrapper d-inline-flex-center'>
                      <ButtonBase
                        className='MuiButtonBase-root MuiButton-root MuiButton-text cancel-btn-wrapper btns theme-transparent c-primary'
                        tabIndex='0'
                        onClick={() => close()}
                      >
                        <span className='MuiButton-label'>
                          <span>
                            {t(`${translationPath}Cancel`)}

                          </span>
                        </span>
                        <span className='MuiTouchRipple-root' />
                      </ButtonBase>
                    </div>
                    <div className='save-wrapper d-inline-flex-center'>
                      <ButtonBase
                        className='MuiButtonBase-root MuiButton-root MuiButton-text save-btn-wrapper btns theme-solid bg-primary w-100 mx-2 mb-2'
                        tabIndex='0'
                        onClick={() => {
                          saveHandler();
                        }}
                      >
                        <span className='MuiButton-label'>
                          <span>
                            {t(`${translationPath}Save`)}

                          </span>
                        </span>
                        <span className='MuiTouchRipple-root' />
                      </ButtonBase>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
