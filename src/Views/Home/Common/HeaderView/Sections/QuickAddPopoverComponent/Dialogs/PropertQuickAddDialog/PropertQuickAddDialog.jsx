import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Spinner,
  DialogComponent,
  ConvertJsonV2Component,
} from '../../../../../../../../Components';
import {
  showError,
  showSuccess,
  formItemsBuilder,
  FormErrorsHandler,
} from '../../../../../../../../Helper';
import { LookupsRules } from '../../../../../../../../Rule';
import { GetAllFormFieldTabsByFormId, propertyPost } from '../../../../../../../../Services';
import { propertyInitValue } from './PropertyQuickAddInitialValue';

const translationPath = '';
const parentTranslationPath = 'PropertiesView';
export const PropertQuickAddDialog = ({ open, onClose }) => {
  const [activeTab] = useState(0);
  const [errors, setErrors] = useState([]);
  const [loadings, setLoadings] = useState([]);
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(parentTranslationPath);
  const [formAndTabs, setFormAndTabs] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [enumsInitFinished, setEnumsInitFinished] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState(
    JSON.parse(JSON.stringify(propertyInitValue))
  );
  const history = useHistory();
  const getAllFormFieldTabsByFormId = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAllFormFieldTabsByFormId({ formId: 3 });
    if (!(result && result.status && result.status !== 200))
      setFormAndTabs((result && result[0]) || []);
    else setFormAndTabs([]);
    setIsLoading(false);
  }, []);

  const dataHandler = useCallback(() => {
    if (formData.length === 0) setFormData(formItemsBuilder(propertyDetails.property, formAndTabs));
  }, [propertyDetails.property, formAndTabs, formData.length]);
  const saveHandler = async (isContinue) => {
    setSaveDisabled(true);
    setIsSubmitted(true);
    if (errors && errors.length > 0) {
      showError(errors[0].message);
      return;
    }
    const totalItems = formData.reduce((total, items) => {
      // eslint-disable-next-line no-param-reassign
      total += items.length;
      return total;
    }, 0);
    const totalValues = Object.values(propertyDetails.property).filter(
      (item) => item !== null && item !== '' && item !== undefined
    ).length;
    const total = (totalValues / totalItems) * 100;
    propertyDetails.property.data_completed = Math.round(total);
    const postResponse = await propertyPost({
      propertyJson: propertyDetails,
    });
    setSaveDisabled(true);
    setIsLoading(true);

    if (!(postResponse && postResponse.status && postResponse.status !== 200)) {
      setPropertyDetails({
        property: {
          city: null,
          country: null,
          district: null,
          community: null,
          property_name: null,
          property_plan: null,
          property_type: null,
          property_owner: null,
          sub_community:null
        },
      });
      showSuccess(t(`${translationPath}property-Created-successfully`));
      if (isContinue)
      history.push(`/home/Properties-CRM/property-profile-edit?formType=1&id=${postResponse.propertyId}`);
      setSaveDisabled(false);
      setIsLoading(false);
      onClose();
    } else {
      setSaveDisabled(false);
      setIsLoading(false);
      showError(t(`${translationPath}property-create-failed`));
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
  const onValueChanged = (item) => (newValue, itemIndex) => {
    setPropertyDetails((items) => {
      if ((itemIndex || itemIndex === 0) && itemIndex !== -1)
        items.property[formData[activeTab][itemIndex].field.id] = newValue;
      else items.property[item.field.id] = newValue;
      return { ...items };
    });
  };
  const lookupInit = useCallback(() => {
    setIsLoading(true);
    const result = LookupsRules(formData[activeTab], propertyDetails.property, onLoadingsChanged);
    setFormData((items) => {
      items.splice(activeTab, 1, result);
      return [...items];
    });
    setIsLoading(false);
  }, [activeTab, propertyDetails.property, formData]);
  useEffect(() => {
    if (formData.length > 0 && propertyDetails.property)
      setErrors(FormErrorsHandler(formData, propertyDetails.property));
  }, [propertyDetails, formData]);
  useEffect(() => {
    if (!enumsInitFinished && formData.length > 0) {
      setEnumsInitFinished(true);
      lookupInit();
    }
  }, [enumsInitFinished, formData.length, lookupInit]);
  useEffect(() => {
    if (propertyDetails.property) dataHandler();
  }, [propertyDetails.property, dataHandler]);
  useEffect(() => {
    getAllFormFieldTabsByFormId();
  }, [getAllFormFieldTabsByFormId]);
  return (
    <DialogComponent
      maxWidth='md'
      saveText='save'
      SmothMove
      saveType='button'
      titleText='add-new-property'
      wrapperClasses='property-quick-add-wrapper'
      dialogContent={(
        <div className='dialog-content-wrapper'>
          <Spinner isActive={isLoading} isAbsolute />
          {formData &&
            formData[activeTab] &&
            formData[activeTab]
              .filter((item) => (item.field.isRequired) ||  item.field.id ==='sub_community')
              .map((item, index) => (
                <ConvertJsonV2Component
                  item={item}
                  isSubmitted={isSubmitted}
                  allItems={formData[activeTab]}
                  key={`propertyForm${index + 1}`}
                  onLoadingsChanged={onLoadingsChanged}
                  allItemsValues={propertyDetails.property}
                  onItemChanged={onItemChanged(item, index)}
                  onValueChanged={onValueChanged(item, index)}
                  itemValue={propertyDetails.property[item.field.id]}
                  error={errors.findIndex((element) => element.key === item.field.id) !== -1}
                  helperText={
                    (errors.find((element) => element.key === item.field.id) &&
                      errors.find((element) => element.key === item.field.id).message) ||
                    ''
                  }
                  isLoading={
                    loadings.findIndex(
                      (element) => element.key === item.field.id && element.value
                    ) !== -1
                  }
                />
              ))}
        </div>
      )}
      saveIsDisabled={saveDisabled}
      isOpen={open}
      onCancelClicked={onClose}
      onSaveClicked={saveHandler}
      onSaveAndContinueClicked={saveHandler}
      translationPath={translationPath}
      parentTranslationPath={parentTranslationPath}
      saveClasses='btns theme-solid bg-primary w-100 mx-2 mb-2'
    />
  );
};
