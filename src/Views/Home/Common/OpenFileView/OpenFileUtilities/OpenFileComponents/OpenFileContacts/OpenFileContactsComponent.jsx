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
import { contactsDetailsGet, contactsDetailsPut } from '../../../../../../../Services';
import {
  margeDataWithSteps,
  cardDetailsItemHandler,
  getFormdata,
  showSuccess,
  showError,
} from '../../../../../../../Helper';
import GenricStpeper from '../../../../../../../Components/OLD/dfmAddEditAndDelete/typePicker/DfmAddEditAndDeleteStepper';

const translationPath = 'openFileContactsComponent.';
export const OpenFileContactsComponent = ({
  activeItem,
  formSteps,
  othersActionValueClicked,
  onOpenFileSaved,
}) => {
  const { t } = useTranslation('OpenFileView');
  const [activeTab, setActiveTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [contactDetails, setContactDetails] = useState(() => []);
  const [contactDetailsSteps, setContactDetailsSteps] = useState(() => []);
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
    const contactsData = contactDetails.contact;
    setContactDetailsSteps(Object.values(margeDataWithSteps(formSteps, contactsData)));
  }, [contactDetails, formSteps]);

  const getContactDetails = useCallback(async () => {
    setIsLoading(true);
    const contactDetailsRes = await contactsDetailsGet({ id: activeItem.id });
    if (!(contactDetailsRes && contactDetailsRes.status && contactDetailsRes.status !== 200))
      setContactDetails(contactDetailsRes);
    else setContactDetails([]);
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
    const jsonContentData = getFormdata(
      'contact',
      updatedValues,
      updateArray,
      activeItem.userTypeId
    );
    jsonContentData.data.contact.data_completed = Math.round(
      (Object.values(updatedValues).length / updateArray.length) * 100
    );
    setIsLoading(true);
    const result = await contactsDetailsPut({
      id: activeItem.id,
      body: { contactJson: jsonContentData.data },
    });
    if (!(result && result.status && result.status !== 200)) {
      showSuccess(t(`${translationPath}NotificationEditContacts`));
      onOpenFileSaved();
      setIsEditMode(false);
    } else showError(t(`${translationPath}NotificationEditErrorContacts`));
    setIsLoading(false);
  };
  useEffect(() => {
    if (contactDetails) dataHandler();
  }, [contactDetails, dataHandler]);
  useEffect(() => {
    setIsEditMode(false);
    if (formSteps.length > 0) getContactDetails();
  }, [formSteps, getContactDetails]);
  return (
    <div className='open-file-contacts view-wrapper'>
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
            <Button type='submit' className='btns theme-solid bg-gradient-primary-right my-3 mx-2'>
              <span>{t(`${translationPath}${!isEditMode ? 'edit' : 'save'}`)}</span>
            </Button>
          </div>
          {!isEditMode &&
            formSteps.length > 0 &&
            formSteps[activeTab].fieldType === 'UploadFiles' && (
              <GalleryComponent
                elements={(contactDetailsSteps.length > 0 && contactDetailsSteps[activeTab]) || []}
                isFormBuilderArray
              />
            )}
          {!isEditMode && formSteps.length > 0 && formSteps[activeTab].fieldType !== 'UploadFiles' && (
            <CardsComponent
              data={activeItem}
              detailsData={(contactDetailsSteps.length > 0 && contactDetailsSteps[activeTab]) || []}
              parentTranslationPath={translationPath}
              getItem={(item) => cardDetailsItemHandler(item, othersActionValueClicked)}
              isOpenFile
              defaultImg={
                (activeItem.userTypeId === 2 && ContactTypeEnum.corporate.defaultImg) ||
                (activeItem.type === ContactTypeEnum.man.value && ContactTypeEnum.man.defaultImg) ||
                ContactTypeEnum.woman.defaultImg
              }
              theme={CardsEnum.detailsContacts}
              detailsContactsOptions={{
                actions: [],
                sideActions: [],
                isExpanded: true,
                maxNumberOfItemsOnNotExpanded: 4,
                imageAlt: 'contact-image',
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
              pageName={OpenFileEnum.contacts.key}
              type={activeItem.userTypeId.toString()}
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

OpenFileContactsComponent.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  formSteps: PropTypes.instanceOf(Array).isRequired,
  othersActionValueClicked: PropTypes.func.isRequired,
  onOpenFileSaved: PropTypes.func.isRequired,
};
