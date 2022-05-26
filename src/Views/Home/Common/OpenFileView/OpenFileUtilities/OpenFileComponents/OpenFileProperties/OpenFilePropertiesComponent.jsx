import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  TabsComponent,
  CardsComponent,
  GalleryComponent,
  Spinner,
  PermissionsComponent,
} from '../../../../../../../Components';
import { CardsEnum, ContactTypeEnum, OpenFileEnum } from '../../../../../../../Enums';
import { propertyDetailsGet, propertyDetailsPut } from '../../../../../../../Services';
import {
  margeDataWithSteps,
  cardDetailsItemHandler,
  getFormdata,
  showSuccess,
  showError,
} from '../../../../../../../Helper';
import { PropertiesPermissionsCRM } from '../../../../../../../Permissions/PropertiesPermissions';
import GenricStpeper from '../../../../../../../Components/OLD/dfmAddEditAndDelete/typePicker/DfmAddEditAndDeleteStepper';

const translationPath = 'openFilePropertiesComponent.';
export const OpenFilePropertiesComponent = ({
  activeItem,
  formSteps,
  othersActionValueClicked,
  onOpenFileSaved,
}) => {
  const { t } = useTranslation('OpenFileView');
  const [activeTab, setActiveTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState(() => []);
  const [propertyDetailsSteps, setPropertyDetailsSteps] = useState(() => []);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updateArray, setUpdateArray] = useState(() => []);
  const [updatedValues, setUpdatedValues] = useState(() => null);
  const [isLoading, setIsLoading] = useState(false);

  const isOpenClicked = () => {
    setIsOpen((item) => !item);
  };
  const onTabChanged = (event, newTab) => {
    setActiveTab(newTab);
  };
  const dataHandler = useCallback(() => {
    const propertiesData = propertyDetails.property;
    setPropertyDetailsSteps(Object.values(margeDataWithSteps(formSteps, propertiesData)));
  }, [propertyDetails, formSteps]);

  const getPropertyDetails = useCallback(async () => {
    setIsLoading(true);
    const propertyDetailsRes = await propertyDetailsGet({ id: activeItem.id });
    if (!(propertyDetailsRes && propertyDetailsRes.status && propertyDetailsRes.status !== 200))
      setPropertyDetails(propertyDetailsRes);
    else setPropertyDetails([]);
    setIsLoading(false);
  }, [activeItem]);
  const onFormSubmit = async (event) => {
    event.preventDefault();
    if (!isEditMode) {
      setIsEditMode(true);
      return;
    }
    updateArray.map((item, index) => {
      if (item.data.valueToEdit)
        if (!updatedValues[index]) updatedValues[index] = item.data.valueToEdit;
      return undefined;
    });
    const jsonContentData = getFormdata('property', updatedValues, updateArray, null);
    jsonContentData.data.property.data_completed = Math.round(
      (Object.values(updatedValues).length / updateArray.length) * 100
    );
    setIsLoading(true);
    const result = await propertyDetailsPut({
      id: activeItem.id,
      body: { propertyJson: jsonContentData.data },
    });
    if (!(result && result.status && result.status !== 200)) {
      showSuccess(t(`${translationPath}NotificationEditProperty`));
      onOpenFileSaved();
      setIsEditMode(false);
    } else showError(t(`${translationPath}NotificationEditErrorProperty`));
    setIsLoading(false);
  };
  useEffect(() => {
    if (propertyDetails) dataHandler();
  }, [propertyDetails, dataHandler]);
  useEffect(() => {
    setIsEditMode(false);
    if (formSteps.length > 0) getPropertyDetails();
  }, [formSteps, getPropertyDetails]);
  return (
    <div className='open-file-properties view-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <form noValidate onSubmit={onFormSubmit} className='d-flex w-100 p-relative'>
        <div className={`animated-open-close collabse-vertical${isOpen ? ' is-open' : ''}`}>
          <ButtonBase className='btns-icon theme-outline open-button' onClick={isOpenClicked}>
            <span className={`mdi ${isOpen ? 'mdi-chevron-right' : 'mdi-chevron-left'}`} />
          </ButtonBase>
          <div className='open-close-content'>
            <TabsComponent
              data={formSteps}
              iconOnly={!isOpen}
              iconInput='icon'
              //   translationPath={translationPath}
              parentTranslationPath='OpenFileView'
              labelInput='key'
              currentTab={activeTab}
              onTabChanged={onTabChanged}
              orientation='vertical'
            />
          </div>
        </div>
        <div className='separator-v' />
        <div className='body-section'>
          <div className='d-flex-v-center-h-end'>
            <PermissionsComponent
              permissionsList={Object.values(PropertiesPermissionsCRM)}
              permissionsId={PropertiesPermissionsCRM.EditPropertyDetails.permissionsId}
            >
              <Button
                type='submit'
                className='btns theme-solid bg-gradient-primary-right my-3 mx-2'
              >
                <span>{t(`${translationPath}${!isEditMode ? 'edit' : 'save'}`)}</span>
              </Button>
            </PermissionsComponent>
          </div>
          {!isEditMode &&
            formSteps.length > 0 &&
            formSteps[activeTab].fieldType === 'UploadFiles' && (
              <GalleryComponent
                elements={
                  (propertyDetailsSteps.length > 0 && propertyDetailsSteps[activeTab]) || []
                }
                isFormBuilderArray
              />
            )}
          {!isEditMode && formSteps.length > 0 && formSteps[activeTab].fieldType !== 'UploadFiles' && (
            <CardsComponent
              data={activeItem}
              detailsData={
                (propertyDetailsSteps.length > 0 && propertyDetailsSteps[activeTab]) || []
              }
              parentTranslationPath={translationPath}
              getItem={(item) => cardDetailsItemHandler(item, othersActionValueClicked)}
              isOpenFile
              defaultImg={ContactTypeEnum.corporate.defaultImg}
              theme={CardsEnum.detailsProperties}
              detailsContactsOptions={{
                // actions: [],
                // sideActions: [],
                isExpanded: true,
                maxNumberOfItemsOnNotExpanded: 4,
                imageAlt: 'property-image',
                // imageInput: 'imagePath',
                nameInput: 'name',
                dateFormat: 'DD/MM/YYYY',
                // dateInput: 'creationDate',
                dataListInputs: {
                  iconInput: 'iconClasses',
                  titleInput: 'title',
                  valueInput: 'value',
                },
                withCheckbox: false,
              }}
            />
          )}
          {isEditMode && (
            <GenricStpeper
              pageName={OpenFileEnum.properties.key}
              type={activeItem.propertyTypeId.toString()}
              onValuesChanged={(itemsValues) => {
                setUpdatedValues(itemsValues);
              }}
              onItemArrayChanged={(itemArray) => {
                setUpdateArray(itemArray);
              }}
              withoutStepper
              withoutButtons
              // onSaveClicked={onSaveClicked}
              activeTab={activeTab}
              id={activeItem.id}
              isDialog={false}
            />
          )}
        </div>
      </form>
    </div>
  );
};

OpenFilePropertiesComponent.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  formSteps: PropTypes.instanceOf(Array).isRequired,
  othersActionValueClicked: PropTypes.func.isRequired,
  onOpenFileSaved: PropTypes.func.isRequired,
};
