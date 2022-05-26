import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { ConvertJsonV2Component, Spinner, TabsComponent } from '../../../../../../Components';
import {
  unitDetailsPut,
  unitDetailsGet,
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
import { UnitsOperationTypeEnum } from '../../../../../../Enums';

export const UnitInformationComponent = ({ viewType, parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath, 'Shared');
  const [activeItem, setActiveItem] = useState({
    id: null,
    userTypeId: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hiddenTabByOperationType, setHiddenTabByOperationType] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loadings, setLoadings] = useState([]);
  const [formData, setFormData] = useState([]);
  const [enumsInitFinished, setEnumsInitFinished] = useState(false);
  const [errors, setErrors] = useState([]);
  const [unitInitDetails, setUnitInitDetails] = useState({});
  const [unitDetails, setUnitDetails] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [formAndTabs, setFormAndTabs] = useState([]);

  const onTabChanged = (e, newTap) => {
    setEnumsInitFinished(false);
    setActiveTab(newTap);
  };
  const getAllFormFieldTabsByFormId = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAllFormFieldTabsByFormId({ formId: 14 });
    if (!(result && result.status && result.status !== 200)) setFormAndTabs(result[0] || []);
    else setFormAndTabs([]);
    setIsLoading(false);
  }, []);
  const getUnitDetails = useCallback(async () => {
    setIsLoading(true);
    const unitDetailsRes = await unitDetailsGet({ id: activeItem.id });
    if (!(unitDetailsRes && unitDetailsRes.status && unitDetailsRes.status !== 200)) {
      setUnitInitDetails(JSON.parse(JSON.stringify(unitDetailsRes)));
      setUnitDetails(unitDetailsRes);
    } else {
      setUnitInitDetails({});
      setUnitDetails({});
    }
    setIsLoading(false);
  }, [activeItem]);

  const dataHandler = useCallback(() => {
    if (formData.length === 0) setFormData(formItemsBuilder(unitDetails.unit, formAndTabs));
  }, [unitDetails.unit, formAndTabs, formData.length]);
  const cancelHandler = () => {
    GlobalHistory.goBack();
  };
  const saveHandler = async () => {
    setIsSubmitted(true);
    if (errors && errors.length > 0) {
      const firstErrorTapIndex = formData.findIndex(
        (item) => item.findIndex((element) => element.field.id === errors[0].key) !== -1
      );
      if (firstErrorTapIndex !== -1) {
        setActiveTab(
          (hiddenTabByOperationType !== null &&
            firstErrorTapIndex >= hiddenTabByOperationType &&
            firstErrorTapIndex + 1) ||
            firstErrorTapIndex
        );
      }
      showError(errors[0].message);
      return;
    }
    const totalItems = formData.reduce((total, items) => total + items.length, 0);
    const totalValues = Object.values(unitDetails.unit).filter(
      (item) => item !== null && item !== '' && item !== undefined
    ).length;
    const total = (totalValues / totalItems) * 100;
    unitDetails.unit.data_completed = Math.round(total);
    const newOwners = [];
    if (unitDetails && unitDetails.unit && (!unitDetails.unit.owner || !unitDetails.unit.owner.length) && (unitDetails.unit.lease_lead_owner || unitDetails.unit.lead_owner))
        newOwners.push((unitDetails && unitDetails.unit.lead_owner) || (unitDetails.unit.lease_lead_owner));
     const unitUpdated = { ...unitDetails.unit, owner: newOwners };
     const unitUpdateWithNewOwners = { ...unitDetails, unit: unitUpdated };

    setIsLoading(true);
    const putResponse = await unitDetailsPut({
      id: activeItem.id,
      body: { unitJson: newOwners.length ? unitUpdateWithNewOwners : unitDetails, rowVersion: unitDetails.rowVersion },
    });
    if (!(putResponse && putResponse.status && putResponse.status !== 200)) {
      showSuccess(t(`${translationPath}unit-updated-successfully`));
      setIsLoading(false);
      // cancelHandler();
    } else {
      setIsLoading(false);
      showError(t(`${translationPath}unit-update-failed`));
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
        if (itemIndex !== undefined) {
          elements[
            (hiddenTabByOperationType !== null &&
              activeTab >= hiddenTabByOperationType[0] && activeTab >= hiddenTabByOperationType[1] &&
              activeTab + 1) ||
              activeTab
          ][itemIndex][parentItemKey][itemKey] = newValue;
        } else {
          elements[
            (hiddenTabByOperationType !== null &&
              activeTab >= hiddenTabByOperationType[0] && activeTab >= hiddenTabByOperationType[1] &&
              activeTab + 1) ||
              activeTab
          ][index][parentItemKey][itemKey] = newValue;
        }
      } else if (itemIndex) {
        elements[
          (hiddenTabByOperationType !== null &&
            activeTab >= hiddenTabByOperationType[0] && activeTab >= hiddenTabByOperationType[1] &&
            activeTab + 1) ||
            activeTab
        ][itemIndex][itemKey] = newValue;
      } else {
        elements[
          (hiddenTabByOperationType !== null &&
            activeTab >= hiddenTabByOperationType[0] && activeTab >= hiddenTabByOperationType[1] &&
            activeTab + 1) ||
            activeTab
        ][index][itemKey] = newValue;
      }
      return [...elements];
    });
  };
  const onValueChanged = (item) => (newValue, itemIndex, itemKey) => {
    setUnitDetails((items) => {
      if (itemKey) items.unit[itemKey] = newValue;
      else if ((itemIndex || itemIndex === 0) && itemIndex !== -1) {
        items.unit[
          formData[
            (hiddenTabByOperationType !== null &&
              activeTab >= hiddenTabByOperationType[0] && activeTab >= hiddenTabByOperationType[1] &&
              activeTab + 1) ||
              activeTab
          ][itemIndex].field.id
        ] = newValue;
      } else items.unit[item.field.id] = newValue;
      return { ...items };
    });
  };
  const lookupInit = useCallback(() => {
    setIsLoading(true);
    const result = LookupsRules(
      formData[
        (hiddenTabByOperationType !== null &&
          activeTab >= hiddenTabByOperationType[0] && activeTab >= hiddenTabByOperationType[1] &&
          activeTab + 1) ||
          activeTab
      ],
      unitDetails.unit,
      onLoadingsChanged
    );
    setFormData((items) => {
      items.splice(
        (hiddenTabByOperationType !== null &&
          activeTab >= hiddenTabByOperationType[0] && activeTab >= hiddenTabByOperationType[1] &&
          activeTab + 1) ||
          activeTab,
        1,
        result
      );
      return [...items];
    });
    setIsLoading(false);
  }, [formData, hiddenTabByOperationType, activeTab, unitDetails.unit]);
  useEffect(() => {
    if (formData.length > 0 && unitDetails.unit)
      setErrors(FormErrorsHandler(formData, unitDetails.unit));
  }, [unitDetails, formData]);
  useEffect(() => {
    if (!enumsInitFinished && formData.length > 0) {
      setEnumsInitFinished(true);
      lookupInit();
    }
  }, [activeTab, enumsInitFinished, formData.length, lookupInit]);
  useEffect(() => {
    if (unitDetails.unit) dataHandler();
  }, [unitDetails.unit, dataHandler]);
  useEffect(() => {
    if (formAndTabs.length > 0) getUnitDetails();
  }, [formAndTabs, getUnitDetails]);
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
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
          <span>{t('Shared:save')}</span>
        </ButtonBase>
      </div>
    );
  });
  useEffect(() => {
    if (
      unitDetails.unit &&
      unitDetails.unit.operation_type &&
      unitDetails.unit.operation_type.lookupItemId === UnitsOperationTypeEnum.sale.key
    )
      setHiddenTabByOperationType([4, 6]);
    else if (
      unitDetails.unit &&
      unitDetails.unit.operation_type &&
      unitDetails.unit.operation_type.lookupItemId === UnitsOperationTypeEnum.rent.key
    )
      setHiddenTabByOperationType([3, 5]);
    else setHiddenTabByOperationType(null);
  }, [unitDetails]);
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );
  return (
    <div className='units-information-wrapper childs-wrapper b-0'>
      <Spinner isActive={isLoading} isAbsolute />
      <TabsComponent
        data={formAndTabs}
        labelInput='tab'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-curved'
        currentTab={activeTab}
        hiddenTabIndexes={(hiddenTabByOperationType !== null && hiddenTabByOperationType) || []}
        onTabChanged={onTabChanged}
      />
      <div className='tabs-content-wrapper'>
        {formData &&
          formData[activeTab] &&
          formData[activeTab]
            .filter(
              (item) =>
                viewType === 1 ||
                (viewType === 2 &&
                  (unitInitDetails.unit[item.field.id] === null ||
                    unitInitDetails.unit[item.field.id] === undefined ||
                    unitInitDetails.unit[item.field.id] === ''))
            )
            .map((item, index) => (
              <ConvertJsonV2Component
                key={`form${index + 1}`}
                item={item}
                allItems={
                  formData[
                    (hiddenTabByOperationType !== null &&
                      activeTab >= hiddenTabByOperationType &&
                      activeTab + 1) ||
                      activeTab
                  ]
                }
                allItemsValues={unitDetails.unit}
                itemValue={unitDetails.unit[item.field.id] === 0 ? '0' : unitDetails.unit[item.field.id]}
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
UnitInformationComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  viewType: PropTypes.number.isRequired,
};
