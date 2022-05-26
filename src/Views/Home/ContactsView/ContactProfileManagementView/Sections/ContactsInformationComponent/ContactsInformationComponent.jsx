import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import {
  ConvertJsonV2Component,
  PermissionsComponent,
  Spinner,
  TabsComponent,
} from '../../../../../../Components';
import {
  contactsDetailsPut,
  contactsDetailsGet,
  GetAllFormFieldTabsByFormId,
} from '../../../../../../Services';
import {
  bottomBoxComponentUpdate,
  FormErrorsHandler,
  formItemsBuilder,
  GetParams,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../Helper';
// import ConvertJson from '../../../../FormBuilder/Utilities/FormRender/ConvertJson';
import { LookupsRules } from '../../../../../../Rule';
import { ContactsPermissions } from '../../../../../../Permissions';
// import { LookupsRules } from '../../../../../../Rule';
// import ConvertJson from '../../../../FormBuilder/Utilities/FormRender/ConvertJson';

export const ContactsInformationComponent = ({
  viewType,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath, 'Shared');
  const [activeItem, setActiveItem] = useState({
    id: null,
    userTypeId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loadings, setLoadings] = useState([]);
  const [formData, setFormData] = useState([]);

  const [enumsInitFinished, setEnumsInitFinished] = useState(false);
  const [errors, setErrors] = useState([]);
  const [contactInitDetails, setContactInitDetails] = useState({});
  const [contactDetails, setContactDetails] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [formAndTabs, setFormAndTabs] = useState([]);

  const onTabChanged = (e, newTap) => {
    setEnumsInitFinished(false);
    setActiveTab(newTap);
  };
  const getAllFormFieldTabsByFormId = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAllFormFieldTabsByFormId({ formId: activeItem.userTypeId });
    if (!(result && result.status && result.status !== 200)) setFormAndTabs(result[0] || []);
    else setFormAndTabs([]);
    setIsLoading(false);
  }, [activeItem.userTypeId]);
  const getContactDetails = useCallback(async () => {
    setIsLoading(true);
    const contactDetailsRes = await contactsDetailsGet({ id: +GetParams('id') });
    if (!(contactDetailsRes && contactDetailsRes.status && contactDetailsRes.status !== 200)) {
      setContactInitDetails(JSON.parse(JSON.stringify(contactDetailsRes)));
      setContactDetails(contactDetailsRes);
    } else {
      setContactInitDetails({});
      setContactDetails({});
    }
    setIsLoading(false);
  }, []);

  const dataHandler = useCallback(() => {
    if (formData.length === 0) setFormData(formItemsBuilder(contactDetails.contact, formAndTabs));
  }, [contactDetails.contact, formAndTabs, formData.length]);
  const cancelHandler = () => {
    GlobalHistory.goBack();
  };
  const saveHandler = async () => {
    setIsSubmitted(true);
    if (errors && errors.length > 0) {
      const firstErrorTapIndex = formData.findIndex(
        (item) => item.findIndex((element) => element.field.id === errors[0].key) !== -1
      );
      if (firstErrorTapIndex !== -1) setActiveTab(firstErrorTapIndex);
      showError(errors[0].message);
      return;
    }
    const totalItems = formData.reduce((total, items) => total + items.length, 0);
    const totalValues = Object.values(contactDetails.contact).filter(
      (item) => item !== null && item !== '' && item !== undefined
    ).length;
    const total = (totalValues / totalItems) * 100;
    contactDetails.contact.data_completed = Math.round(total);
    setIsLoading(true);
    const putResponse = await contactsDetailsPut({
      id: activeItem.id,
      body: { contactJson: contactDetails },
    });
    if (!(putResponse && putResponse.status && putResponse.status !== 200)) {
      showSuccess(t(`${translationPath}contact-updated-successfully`));
      setIsLoading(false);
      // cancelHandler();
    } else {
      setIsLoading(false);
      showError(t(`${translationPath}contact-update-failed`));
    }
  };
  const onLoadingsChanged = (value, key) => {
    setLoadings((items) => {
      const itemIndex = items.findIndex((item) => item.key === key);
      if (value) {
        const addItem = {
          key,
          value,
        };
        if (itemIndex !== -1) items[itemIndex] = addItem;
        else items.push(addItem);
      } else if (itemIndex !== -1) items.splice(itemIndex, 1);
      return [...items];
    });
  };
  const onItemChanged = (item, index) => (newValue, itemIndex, itemKey, parentItemKey) => {
    setFormData((elements) => {
      if (parentItemKey) {
        if (itemIndex !== undefined)
          elements[activeTab][itemIndex][parentItemKey][itemKey] = newValue;
        else elements[activeTab][index][parentItemKey][itemKey] = newValue;
      } else if (itemIndex) elements[activeTab][itemIndex][itemKey] = newValue;
      else elements[activeTab][index][itemKey] = newValue;
      return [...elements];
    });
  };
  const onValueChanged = (item) => (newValue, itemIndex, id) => {
    setContactDetails((items) => {
      if ((itemIndex || itemIndex === 0) && itemIndex !== -1)
        items.contact[id || formData[activeTab][itemIndex].field.id] = newValue;
      else items.contact[item.field.id] = newValue;
      return { ...items };
    });
  };
  const lookupInit = useCallback(() => {
    setIsLoading(true);
    const result = LookupsRules(formData[activeTab], contactDetails.contact, onLoadingsChanged);
    setFormData((items) => {
      items.splice(activeTab, 1, result);
      return [...items];
    });
    setIsLoading(false);
  }, [activeTab, contactDetails.contact, formData]);
  useEffect(() => {
    if (formData.length > 0 && contactDetails.contact)
      setErrors(FormErrorsHandler(formData, contactDetails.contact));
  }, [contactDetails, formData]);
  useEffect(() => {
    if (!enumsInitFinished && formData.length > 0) {
      setEnumsInitFinished(true);
      lookupInit();
    }
  }, [activeTab, enumsInitFinished, formData.length, lookupInit]);
  useEffect(() => {
    if (contactDetails.contact) dataHandler();
  }, [contactDetails.contact, dataHandler]);
  useEffect(() => {
    if (formAndTabs.length > 0) getContactDetails();
  }, [formAndTabs, getContactDetails]);
  useEffect(() => {
    if (activeItem && activeItem.userTypeId) getAllFormFieldTabsByFormId();
  }, [activeItem, getAllFormFieldTabsByFormId]);
  useEffect(() => {
    setActiveItem({
      id: GetParams('id'),
      userTypeId: GetParams('formType'),
    });
  }, []);
  useEffect(() => {
    localStorage.removeItem('leadStatus');
    GlobalHistory.listen(
      () =>
        GlobalHistory.action === 'POP' &&
        setActiveItem({
          id: GetParams('id'),
          userTypeId: GetParams('formType'),
        })
    );
  }, []);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <PermissionsComponent
          permissionsList={Object.values(ContactsPermissions)}
          permissionsId={ContactsPermissions.EditContactInformation.permissionsId}
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
  return (
    <div className='contacts-information-wrapper childs-wrapper b-0'>
      <Spinner isActive={isLoading} isAbsolute />
      <TabsComponent
        data={formAndTabs}
        labelInput='tab'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-curved'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
      />
      <div className='tabs-content-wrapper'>
        {formData &&
          // enumsInitFinished &&
          formData[activeTab] &&
          formData[activeTab]
            .filter(
              (item) =>
                viewType === 1 ||
                (viewType === 2 &&
                  (contactInitDetails.contact[item.field.id] === null ||
                    contactInitDetails.contact[item.field.id] === undefined ||
                    contactInitDetails.contact[item.field.id] === ''))
            )
            .map((item, index) => (
              <ConvertJsonV2Component
                key={`form${index + 1}`}
                item={item}
                allItems={formData[activeTab]}
                allItemsValues={contactDetails.contact}
                itemValue={contactDetails.contact[item.field.id]}
                isSubmitted={isSubmitted}
                onItemChanged={onItemChanged(item, index)}
                onValueChanged={onValueChanged(item, index)}
                helperText={
                  (errors.find((element) => element.key === item.field.id) &&
                    errors.find((element) => element.key === item.field.id).message) ||
                  ''
                }
                error={errors.findIndex((element) => element.key === item.field.id) !== -1}
                isLoading={
                  loadings.findIndex(
                    (element) => element.key === item.field.id && element.value
                  ) !== -1
                }
                onLoadingsChanged={onLoadingsChanged}
              />
            ))}
      </div>
    </div>
  );
};

ContactsInformationComponent.propTypes = {
  viewType: PropTypes.oneOf([1, 2]).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
