import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  TabsComponent,
  CardsComponent,
  GalleryComponent,
  Spinner,
} from '../../../../../../../Components';
import { CardsEnum, ContactTypeEnum, OpenFileEnum } from '../../../../../../../Enums';
import { unitDetailsGet, unitDetailsPut } from '../../../../../../../Services';
import {
  margeDataWithSteps,
  cardDetailsItemHandler,
  getFormdata,
  showSuccess,
  showError,
} from '../../../../../../../Helper';
import GenricStpeper from '../../../../../../../Components/OLD/dfmAddEditAndDelete/typePicker/DfmAddEditAndDeleteStepper';

const translationPath = 'openFileUnitsComponent.';
export const OpenFileUnitsComponent = ({
  activeItem,
  formSteps,
  othersActionValueClicked,
  onOpenFileSaved,
}) => {
  const { t } = useTranslation('OpenFileView');
  const [activeTab, setActiveTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [unitDetails, setUnitDetails] = useState(() => []);
  const [unitDetailsSteps, setUnitDetailsSteps] = useState(() => []);
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
    const unitsData = unitDetails.unit;
    setUnitDetailsSteps(Object.values(margeDataWithSteps(formSteps, unitsData)));
  }, [unitDetails, formSteps]);

  const getUnitDetails = useCallback(async () => {
    setIsLoading(true);
    const unitDetailsRes = await unitDetailsGet({ id: activeItem.id });
    if (!(unitDetailsRes && unitDetailsRes.status && unitDetailsRes.status !== 200))
      setUnitDetails(unitDetailsRes);
    else setUnitDetails([]);
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
    const jsonContentData = getFormdata('unit', updatedValues, updateArray, activeItem.unitTypeId);
    jsonContentData.data.unit.data_completed = Math.round(
      (Object.values(updatedValues).length / updateArray.length) * 100
    );
    setIsLoading(true);
    const result = await unitDetailsPut({
      id: activeItem.id,
      body: { unitJson: jsonContentData.data, rowVersion: unitDetails.rowVersion },
    });
    if (!(result && result.status && result.status !== 200)) {
      showSuccess(t(`${translationPath}NotificationEditUnit`));
      onOpenFileSaved();
      setIsEditMode(false);
    } else showError(t(`${translationPath}NotificationEditErrorUnit`));
    setIsLoading(false);
  };
  useEffect(() => {
    if (unitDetails) dataHandler();
  }, [unitDetails, dataHandler]);
  useEffect(() => {
    setIsEditMode(false);
    if (formSteps.length > 0) getUnitDetails();
  }, [formSteps, getUnitDetails]);
  return (
    <div className='open-file-units view-wrapper'>
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
            <Button type='submit' className='btns theme-solid bg-gradient-primary-right my-3 mx-2'>
              <span>{t(`${translationPath}${!isEditMode ? 'edit' : 'save'}`)}</span>
            </Button>
          </div>
          {!isEditMode &&
            formSteps.length > 0 &&
            formSteps[activeTab].fieldType === 'UploadFiles' && (
              <GalleryComponent
                elements={(unitDetailsSteps.length > 0 && unitDetailsSteps[activeTab]) || []}
                isFormBuilderArray
              />
            )}
          {!isEditMode && formSteps.length > 0 && formSteps[activeTab].fieldType !== 'UploadFiles' && (
            <CardsComponent
              data={activeItem}
              detailsData={(unitDetailsSteps.length > 0 && unitDetailsSteps[activeTab]) || []}
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
                imageAlt: 'unit-image',
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
              pageName={OpenFileEnum.units.key}
              type={activeItem.unitTypeId.toString()}
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

OpenFileUnitsComponent.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  formSteps: PropTypes.instanceOf(Array).isRequired,
  othersActionValueClicked: PropTypes.func.isRequired,
  onOpenFileSaved: PropTypes.func.isRequired,
};
