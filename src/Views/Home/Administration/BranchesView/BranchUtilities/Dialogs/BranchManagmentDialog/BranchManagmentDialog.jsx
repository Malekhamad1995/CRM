import React, { useEffect, useState, useReducer, useCallback } from 'react'
import {
  DialogActions, DialogContent, DialogTitle, Dialog,
  ButtonBase, Fab
} from '@material-ui/core';
import {
  AutocompleteComponent,
  Inputs,
  UploaderComponentCircular,
} from '../../../../../../../Components';
import {UploaderComponent} from '../../UploaderComponent/UploaderComponent'
import { DefaultImagesEnum, UploaderThemesEnum, CityTypeIdEnum } from '../../../../../../../Enums'
import { lookupItemsGetId, CreateBranch } from '../../../../../../../Services'
import { getErrorByName, showError, showSuccess } from '../../../../../../../Helper'
import Joi from "joi";
import { useTranslation } from 'react-i18next';
import {UpdateBranch} from '../../../../../../../Services'

export const BranchManagmentDialog = ({
  activeItem,
  open,
  close,
  onSave,
  reloadData,
  translationPath,
  parentTranslationPath
}) => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryValue, setCountryValue] = useState(null);
  const [cityValue, setCityValue] = useState(null);
  const [isCityPicked, setIsCityPicked] = useState(false);
  const [isInitialCityCountry, setIsInitialCityCountry] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { t } = useTranslation(parentTranslationPath);

  const reducer = useCallback((state, action) => {
    if (action.id !== "edit") return { ...state, [action.id]: action.value }
    else return {
      ...action.value,
    };
  }, []);


  const initialState = {
    branchName: null,
    branchNumber: null,
    branchCountryId: null,
    branchCityId: null,
    maximumNumberOfUsers: null,
    branchLogoId: null,
    documentsFooterImageId: null,
    documentsHeaderImageId: null,
    isActive: true
  }
  const [state, setState] = useReducer(reducer, initialState);


  const schema = Joi.object({
    branchName: Joi.string()
      .required()
      .messages({
        "string.empty": t(`${translationPath}branch-name-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);


  const getCountriesLookups = async () => {
    const res = await lookupItemsGetId({ lookupTypeId: 16 });
    if (!(res && res.status && res.status !== 200)) setCountries(res || []);
    else setCountries([]);
  };

  const getCitiesLookups = async () => {
    const res = await lookupItemsGetId({ lookupTypeId: CityTypeIdEnum.lookupTypeId, lookupParentId: countryValue && countryValue.lookupItemId });
    if (!(res && res.status && res.status !== 200)) setCities(res || []);
    else setCities([]);
  };

  const changeCountryValueOfSelectedCity = () => {
    if(cityValue){
      const filterResult = countries && countries.filter((item) => item.lookupItemId === (cityValue && cityValue.parentLookupItemId))
      setCountryValue((filterResult && filterResult.length) && filterResult[0] || null);
      const countryId = (filterResult && filterResult.length) && filterResult[0].lookupItemId || null
      
      setState({ id: "branchCountryId", value: countryId })
    }
  }


  const setValuesFromActiveIteme = () => {
    if (activeItem && isInitialCityCountry && countries.length &&
      cities.length) {

      const countryFilterResult = countries && countries.filter((item) => item.lookupItemId === (state && state.branchCountryId))

      setCountryValue((countryFilterResult && countryFilterResult.length) && countryFilterResult[0] || null);


      const cityFilterResult = cities && cities.filter((item) => item.lookupItemId === (state && state.branchCityId))

      setCityValue((cityFilterResult && cityFilterResult.length) && cityFilterResult[0] || null);

      setIsInitialCityCountry(false)
    }
  }


  useEffect(() => {
    setValuesFromActiveIteme();
  }, [activeItem, countries, cities])

  useEffect(() => {
    getCountriesLookups();
    getCitiesLookups();
  }, [])

  useEffect(() => {
    getCitiesLookups();
  }, [countryValue])

  useEffect(() => {
    changeCountryValueOfSelectedCity();
  }, [cityValue])

  useEffect(() => {
    if (activeItem) {
      setState({
        id: 'edit',
        value: {
          branchName: activeItem.branchName,
          branchNumber: activeItem.branchNumber,
          branchCountryId: activeItem.branchCountryId,
          branchCityId: activeItem.branchCityId,
          maximumNumberOfUsers: activeItem.maximumNumberOfUsers,
          branchLogoId: activeItem.branchLogoId,
          documentsFooterImageId: activeItem.documentsFooterImageId,
          documentsHeaderImageId: activeItem.documentsHeaderImageId,
          isActive: activeItem.isActive
        },
      });
    }
  }, [activeItem]);

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true)
    if (schema.error) {
      showError(t(`${translationPath}please-fill-required-fields`));
      return;
    }
    const saveState = { ...state };
    const res = (activeItem &&
      activeItem.branchId && UpdateBranch({branchId:activeItem.branchId,
         body:saveState})) ||
      (await CreateBranch(saveState))
    if (!(res && res.status && res.status !== 200)) {
      if (activeItem && activeItem.branchId)
        showSuccess(t(`${translationPath}branch-updated-successfully`));
      else showSuccess(t(`${translationPath}branch-created-successfully`));
      if (onSave) onSave();

    } else if (activeItem && activeItem.branchId)
      showError(t(`${translationPath}branch-update-failed`));
    else showError(t(`${translationPath}branch-create-failed`));

  }





  return (
    <Dialog
      open={open}
      maxWidth='lg'
      onClose={() => {
        close();
      }}
      className='rotationCriteriaDialog-dialog-wrapper branch-dialog-wrapper'
    >
      <form>
        <DialogTitle id='alert-dialog-slide-title'>
          <span>
            {t(`${translationPath}${(activeItem && 'edit-branch') || 'add-new-branch'}`)}
          </span>
        </DialogTitle>

        <DialogContent>
          <div className='dialog-content-wrapper'>
            <UploaderComponentCircular
              idRef="branchLogoIdRef"
              circleDefaultImage={DefaultImagesEnum.corporate.defaultImg}
              initUploadedFiles={
                (state &&
                  state.branchLogoId && [
                    { uuid: state.branchLogoId, fileName: "branch-logo" },
                  ]) ||
                []
              }
              uploadedChanged={(files) =>
                setState({
                  id: "branchLogoId",
                  value: (files.length > 0 && files[0].uuid) || null,
                })
              } />
            <div className='dialog-content-item item-wrapper'>
              <Inputs
                labelValue='branch-name'
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                helperText={
                  getErrorByName(schema, "branchName").message
                }
                error={getErrorByName(schema, "branchName").error}
                value={state.branchName || null}
                onInputChanged={(event) =>
                  setState({
                    id: "branchName",
                    value: event.target.value,
                  })
                }
              />
            </div>
            <div className='dialog-content-item'>
              <Inputs
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                withNumberFormat
                labelValue='branch-number'
                value={state.branchNumber || null}
                onInputChanged={(event) => {
                  const value = event.target && event.target.value;
                  const parsedValue = value && parseInt(value);
                  setState({
                    id: "branchNumber",
                    value: parsedValue,
                  })
                }
                }
              />
            </div>
            <div className='dialog-content-item'>
              <AutocompleteComponent
                selectedValues={countryValue}
                labelValue={t(`${translationPath}branch-country`)}
                multiple={false}
                withoutSearchButton
                value={(countryValue && countryValue.lookupItemName) || null}
                data={(!isCityPicked && countries) || (countryValue && [countryValue]) || []
                }
                displayLabel={(option) => {
                  return option && option.lookupItemName
                }}
                onChange={(event, value) => {
                  setCountryValue(value);
                  const countryId = value && value.lookupItemId
                  setState({
                    id: "branchCountryId",
                    value: countryId
                  })
                  if (value === null) {
                    setCityValue(value)
                    setState({ id: "branchCityId", value })
                  }

                  if (countryValue) {
                    setIsCityPicked(false)
                    setCityValue(null)
                    setState({ id: "branchCityId", value:null })
                  }
                }}
              />
            </div>
            <div className='dialog-content-item'>
              <AutocompleteComponent
                selectedValues={cityValue}
                labelValue={t(`${translationPath}branch-city`)}
                multiple={false}
                withoutSearchButton
                value={(cityValue && cityValue.lookupItemName) || null}
                data={cities || []}
                displayLabel={(option) => option && option.lookupItemName}
                onChange={(event, value) => {
                  const cityId = value && value.lookupItemId;
                  setCityValue(value);
                  setState({ id: "branchCityId", value: cityId })
                  if (!cityValue)
                    setIsCityPicked(true)
                  else setIsCityPicked(false)
                }}
              />
            </div>
            <div className='dialog-content-item'>
              <Inputs
                withNumberFormat
                labelValue='maximum-number-of-users'
                value={state.maximumNumberOfUsers || null}
                onInputChanged={(event) => {
                  const value = event.target && event.target.value;
                  const parsedValue = value && parseInt(value);
                  setState({
                    id: "maximumNumberOfUsers",
                    value: parsedValue,
                  })
                }}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </div>

            <div className='w-100 mb-3 document-images-wrapper'>
              <UploaderComponent
                idRef='galleryPhotosUploaderRef'
                labelValue='documents-footer-image'
                multiple
                accept='image/*'
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                viewUploadedFilesCount
                initUploadedFiles={
                  (
                    state && state.documentsFooterImageId && (
                      [{ uuid: state.documentsFooterImageId }]
                    ) || []
                  )
                }
                uploadedChanged={(files) => {
                  setState({
                    id: 'documentsFooterImageId',
                    value:
                      (files && files.length &&
                        files[0].uuid) ||
                      '',
                  })
                }}
                uploaderTheme={UploaderThemesEnum.GalleryShow.key}
                isOneFile
              />
              <UploaderComponent
                idRef='galleryPhotosUploaderRef'
                labelValue='documents-header-image'
                multiple
                accept='image/*'
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                viewUploadedFilesCount
                initUploadedFiles={
                  (
                    state && state.documentsHeaderImageId && (
                      [{ uuid: state.documentsHeaderImageId }]
                    ) || []
                  )
                }
                uploadedChanged={(files) => {
                  setState({
                    id: 'documentsHeaderImageId',
                    value:
                      (files && files.length &&
                        files[0].uuid) ||
                      '',
                  })
                }}
                uploaderTheme={UploaderThemesEnum.GalleryShow.key}
                isOneFile
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <ButtonBase onClick={() =>
            close()
          } className='btns theme-solid bg-cancel'>
            {t(`${translationPath}cancel`)}
          </ButtonBase>
          <ButtonBase className='btns theme-solid' type='submit' onClick={saveHandler}>
            {t(`${translationPath}${(activeItem && 'edit-branch') || 'add-branch'}`)}
          </ButtonBase>
        </DialogActions>
      </form>
    </Dialog>
  )
}


