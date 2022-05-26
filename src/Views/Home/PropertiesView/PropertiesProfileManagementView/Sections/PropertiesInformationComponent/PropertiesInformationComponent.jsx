import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import {
  ConvertJsonV2Component,
  Spinner,
  TabsComponent,
  PermissionsComponent,
} from '../../../../../../Components';
import {
  propertyDetailsPut,
  propertyDetailsGet,
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
import { LookupsRules } from '../../../../../../Rule';
import { PropertiesPermissionsCRM } from '../../../../../../Permissions/PropertiesPermissions';
import { PropertyManagementListPermissions } from '../../../../../../Permissions';

export const PropertiesInformationComponent = ({
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
  const [propertyInitDetails, setPropertyInitDetails] = useState({});
  const [propertyDetails, setPropertyDetails] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [formAndTabs, setFormAndTabs] = useState([]);
  const onTabChanged = (e, newTap) => {
    setEnumsInitFinished(false);
    setActiveTab(newTap);
  };
  const [isPropertyManagementView, setIsPropertyManagementView] = useState(false);

  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];
  const getAllFormFieldTabsByFormId = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAllFormFieldTabsByFormId({ formId: 3 });
    if (!(result && result.status && result.status !== 200))
      setFormAndTabs((result && result[0]) || []);
    else setFormAndTabs([]);
    setIsLoading(false);
  }, []);
  const getPropertyDetails = useCallback(async () => {
    setIsLoading(true);
    const propertyDetailsRes = await propertyDetailsGet({ id: activeItem.id });
    if (!(propertyDetailsRes && propertyDetailsRes.status && propertyDetailsRes.status !== 200)) {
      setPropertyInitDetails(JSON.parse(JSON.stringify(propertyDetailsRes)));
      setPropertyDetails(propertyDetailsRes);
    } else {
      setPropertyInitDetails({});
      setPropertyDetails({});
    }
    setIsLoading(false);
  }, [activeItem]);

  const dataHandler = useCallback(() => {
    if (formData.length === 0) setFormData(formItemsBuilder(propertyDetails.property, formAndTabs));
  }, [propertyDetails.property, formAndTabs, formData.length]);
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
    const totalValues = Object.values(propertyDetails.property).filter(
      (item) => item !== null && item !== '' && item !== undefined
    ).length;
    const total = (totalValues / totalItems) * 100;
    propertyDetails.property.data_completed = Math.round(total);
    setIsLoading(true);
    const putResponse = await propertyDetailsPut({
      id: activeItem.id,
      body: { propertyJson: propertyDetails },
    });
    if (!(putResponse && putResponse.status && putResponse.status !== 200)) {
      showSuccess(t(`${translationPath}property-updated-successfully`));
      setIsLoading(false);
      // cancelHandler();
    } else {
      setIsLoading(false);
      showError(t(`${translationPath}property-update-failed`));
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
  }, [activeTab, enumsInitFinished, formData.length, lookupInit]);
  useEffect(() => {
    if (propertyDetails.property) dataHandler();
  }, [propertyDetails.property, dataHandler]);
  useEffect(() => {
    if (formAndTabs.length > 0) getPropertyDetails();
  }, [formAndTabs, getPropertyDetails]);
  useEffect(() => {
    if (activeItem && activeItem.userTypeId) getAllFormFieldTabsByFormId();
  }, [activeItem, getAllFormFieldTabsByFormId]);
  useEffect(() => {
    setActiveItem({
      id: GetParams('id'),
      userTypeId: GetParams('formType'),
    });
    if (pathName === 'properties/property-profile-edit')
      setIsPropertyManagementView(true);
    else
      setIsPropertyManagementView(false);
  }, [pathName]);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <PermissionsComponent
          permissionsList={!isPropertyManagementView ? Object.values(PropertiesPermissionsCRM) : Object.values(PropertyManagementListPermissions)}
          permissionsId={!isPropertyManagementView ? PropertiesPermissionsCRM.EditPropertyDetails.permissionsId : PropertyManagementListPermissions.UpdateProperty.permissionsId}
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
    <div className='properties-information-wrapper childs-wrapper b-0'>
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
                  (propertyInitDetails.property[item.field.id] === null ||
                    propertyInitDetails.property[item.field.id] === undefined ||
                    propertyInitDetails.property[item.field.id] === ''))
            )
            .map((item, index) => (
              <ConvertJsonV2Component
                key={`form${index + 1}`}
                item={item}
                allItems={formData[activeTab]}
                allItemsValues={propertyDetails.property}
                itemValue={propertyDetails.property[item.field.id]}
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

PropertiesInformationComponent.propTypes = {
  viewType: PropTypes.oneOf([1, 2]).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
