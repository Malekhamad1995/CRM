import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import {
  Inputs, Spinner, TabsComponent, PermissionsComponent
} from '../../../../../../Components';
import { PropertiesPermissionsCRM } from '../../../../../../Permissions/PropertiesPermissions';
import {
  bottomBoxComponentUpdate,
  GetParams,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../Helper';
import { PropertiesProfileSpecificationTabsData } from './PropertiesProfileSpecificationTabsData';
import {
  PropertySpecification,
  GetPropertySpecificationByPropertyId,
} from '../../../../../../Services';

export const PropertiesProfileSpecificationComponent = ({
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const defaultState = {
    propertyId: +GetParams('id'),
    numberOfApartment: 0,
    minApartmentArea: 0,
    maxApartmentArea: 0,
    numberOfApartmentStudio: 0,
    numberOfApartmentPenthouse: 0,
    numberOfApartmentOneBedroom: 0,
    numberOfApartmentTowBedroom: 0,
    numberOfApartmentThreeBedroom: 0,
    numberOfApartmentFourBedroom: 0,
    numberOfApartmentFiveBedroom: 0,
    numberOfApartmentBedroomMoreThanFive: 0,
    numberOfVilla: 0,
    minVillaArea: 0,
    maxVillaArea: 0,
    numberOfVillaStudio: 0,
    numberOfVillaPenthouse: 0,
    numberOfVillaOneBedroom: 0,
    numberOfVillaTowBedroom: 0,
    numberOfVillaThreeBedroom: 0,
    numberOfVillaFourBedroom: 0,
    numberOfVillaFiveBedroom: 0,
    numberOfVillaBedroomMoreThanFive: 0,
    retailUnitGrossArea: 0,
    minRetailUnitArea: 0,
    maxRetailUnitArea: 0,
    officeGrossArea: 0,
    minOfficeArea: 0,
    maxOfficeArea: 0,
    laborCampGrossArea: 0,
    minLaborCampArea: 0,
    maxLaborCampArea: 0,
    wareHouseGrossArea: 0,
    minWareHouseArea: 0,
    maxWareHouseArea: 0,
  };
  const [state, setState] = useState(defaultState);

  const GetSpecificationById = useCallback(async () => {
    setIsLoading(true);
    const result = await GetPropertySpecificationByPropertyId(+GetParams('id'));
    if (!(result && result.status && result.status !== 200)) setState({ ...result, propertyId: +GetParams('id') });
    else setState(defaultState);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    GetSpecificationById();
  }, [GetSpecificationById]);

  const cancelHandler = () => {
    GlobalHistory.goBack();
    setState(defaultState);
  };
  const saveHandler = async () => {
    const result = await PropertySpecification(state);
    if (!(result && result.status && result.status !== 200))
      showSuccess(t(`${translationPath}property-specification-saved-successfully`));
    else showError(t(`${translationPath}property-specification-saved-failed`));
  };

  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <PermissionsComponent
          permissionsList={Object.values(PropertiesPermissionsCRM)}
          permissionsId={PropertiesPermissionsCRM.EditPropertySpecifications.permissionsId}
        >
          <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
            <span>{t('Shared:save')}</span>
          </ButtonBase>
        </PermissionsComponent>
      </div>
    );
  });
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );

  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };

  return (
    <div className='properties-information-wrapper childs-wrapper b-0 properties-specification-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <TabsComponent
        data={PropertiesProfileSpecificationTabsData}
        labelInput='tab'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-curved'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
      />
      <div className='tabs-content-wrapper'>
        {activeTab === 0 && (
          <div className='tab-item-wrapper '>
            <div className='form-item'>
              <Inputs
                idRef='NoOfapartmentRef'
                labelValue='no-of-apartment'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfApartment}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfApartment: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                wrapperClasses='px-2'
                idRef='MinSqftRef'
                labelValue='min-sq-ft'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.minApartmentArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, minApartmentArea: value });
                }}
              />
              <Inputs
                wrapperClasses='px-2'
                idRef='MaxSqftRef'
                labelValue='max-sq-ft'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.maxApartmentArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, maxApartmentArea: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='NoOfStudioRef'
                labelValue='no-of-studio'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfApartmentStudio}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfApartmentStudio: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                wrapperClasses='px-2'
                idRef='MinNoOfBedroomsRef'
                labelValue='no-of-1-bedrooms'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfApartmentOneBedroom}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfApartmentOneBedroom: value });
                }}
              />
              <Inputs
                wrapperClasses='px-2'
                idRef='MaxNoOfBedroomsRef'
                labelValue='no-of-2-bedrooms'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfApartmentTwoBedroom}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfApartmentTwoBedroom: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                wrapperClasses='px-2'
                idRef='MinNoOfBedroomsRef'
                labelValue='no-of-3-bedrooms'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfApartmentThreeBedroom}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfApartmentThreeBedroom: value });
                }}
              />
              <Inputs
                wrapperClasses='px-2'
                idRef='MaxNoOfBedroomsRef'
                labelValue='no-of-4-bedrooms'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfApartmentFourBedroom}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfApartmentFourBedroom: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                wrapperClasses='px-2'
                idRef='MinNoOfBedroomsRef'
                labelValue='no-of-5-bedrooms'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfApartmentFiveBedroom}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfApartmentFiveBedroom: value });
                }}
              />
              <Inputs
                wrapperClasses='px-2 more-than-five-wrapper'
                idRef='MaxNoOfBedroomsRef'
                labelValue='no-of-bedrooms'
                helperText='more-than-five'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfApartmentBedroomMoreThanFive}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfApartmentBedroomMoreThanFive: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='NoOfPenthouseRef'
                labelValue='no-of-penthouse'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfApartmentPenthouse}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfApartmentPenthouse: value });
                }}
              />
            </div>
          </div>
        )}
        {activeTab === 1 && (
          <div className='tab-item-wrapper '>
            <div className='form-item'>
              <Inputs
                idRef='NoOfVillaRef'
                labelValue='no-of-villa'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfVilla}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfVilla: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                wrapperClasses='px-2'
                idRef='MinSqftRef'
                labelValue='min-sq-ft'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.minVillaArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, minVillaArea: value });
                }}
              />
              <Inputs
                wrapperClasses='px-2'
                idRef='MaxSqftRef'
                labelValue='max-sq-ft'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.maxVillaArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, maxVillaArea: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='NoOfStudioRef'
                labelValue='no-of-studio'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfVillaStudio}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfVillaStudio: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                wrapperClasses='px-2'
                idRef='MinNoOfBedroomsRef'
                labelValue='no-of-1-bedrooms'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfVillaOneBedroom}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfVillaOneBedroom: value });
                }}
              />
              <Inputs
                wrapperClasses='px-2'
                idRef='MaxNoOfBedroomsRef'
                labelValue='no-of-2-bedrooms'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfVillaTwoBedroom}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfVillaTwoBedroom: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                wrapperClasses='px-2'
                idRef='MinNoOfBedroomsRef'
                labelValue='no-of-3-bedrooms'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfVillaThreeBedroom}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfVillaThreeBedroom: value });
                }}
              />
              <Inputs
                wrapperClasses='px-2'
                idRef='MaxNoOfBedroomsRef'
                labelValue='no-of-4-bedrooms'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfVillaFourBedroom}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfVillaFourBedroom: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                wrapperClasses='px-2'
                idRef='MinNoOfBedroomsRef'
                labelValue='no-of-5-bedrooms'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfVillaFiveBedroom}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfVillaFiveBedroom: value });
                }}
              />
              <Inputs
                wrapperClasses='px-2 more-than-five-wrapper'
                idRef='MaxNoOfBedroomsRef'
                labelValue='no-of-bedrooms'
                helperText='more-than-five'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfVillaBedroomMoreThanFive}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfVillaBedroomMoreThanFive: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='NoOfPenthouseRef'
                labelValue='no-of-penthouse'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.numberOfVillaPenthouse}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, numberOfVillaPenthouse: value });
                }}
              />
            </div>
          </div>
        )}
        {activeTab === 2 && (
          <div className='tab-item-wrapper '>
            <div className='form-item'>
              <Inputs
                idRef='GrossSqFootageRef'
                labelValue='gross-sq-footage'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.retailUnitGrossArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, retailUnitGrossArea: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                wrapperClasses='px-2'
                idRef='MinSqftRef'
                labelValue='min-sq-ft'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.minRetailUnitArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, minRetailUnitArea: value });
                }}
              />
              <Inputs
                wrapperClasses='px-2'
                idRef='MaxSqftRef'
                labelValue='max-sq-ft'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.maxRetailUnitArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, maxRetailUnitArea: value });
                }}
              />
            </div>
          </div>
        )}
        {activeTab === 3 && (
          <div className='tab-item-wrapper '>
            <div className='form-item'>
              <Inputs
                idRef='GrossSqFootageRef'
                labelValue='gross-sq-footage'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.officeGrossArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, officeGrossArea: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                wrapperClasses='px-2'
                idRef='MinSqftRef'
                labelValue='min-sq-ft'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.minOfficeArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, minOfficeArea: value });
                }}
              />
              <Inputs
                wrapperClasses='px-2'
                idRef='MaxSqftRef'
                labelValue='max-sq-ft'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.maxOfficeArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, maxOfficeArea: value });
                }}
              />
            </div>
          </div>
        )}
        {activeTab === 4 && (
          <div className='tab-item-wrapper '>
            <div className='form-item'>
              <Inputs
                idRef='GrossSqFootageRef'
                labelValue='gross-sq-footage'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.laborCampGrossArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, laborCampGrossArea: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                wrapperClasses='px-2'
                idRef='MinSqftRef'
                labelValue='min-sq-ft'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.minLaborCampArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, minLaborCampArea: value });
                }}
              />
              <Inputs
                wrapperClasses='px-2'
                idRef='MaxSqftRef'
                labelValue='max-sq-ft'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.maxLaborCampArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, maxLaborCampArea: value });
                }}
              />
            </div>
          </div>
        )}
        {activeTab === 5 && (
          <div className='tab-item-wrapper '>
            <div className='form-item'>
              <Inputs
                idRef='GrossSqFootageRef'
                labelValue='gross-sq-footage'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.wareHouseGrossArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, wareHouseGrossArea: value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                wrapperClasses='px-2'
                idRef='MinSqftRef'
                labelValue='min-sq-ft'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.minWareHouseArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, minWareHouseArea: value });
                }}
              />
              <Inputs
                wrapperClasses='px-2'
                idRef='MaxSqftRef'
                labelValue='max-sq-ft'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.maxWareHouseArea}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  value = value.replace(/^0+/, '');
                  setState({ ...state, maxWareHouseArea: value });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

PropertiesProfileSpecificationComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
