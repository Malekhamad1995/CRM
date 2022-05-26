import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import {
  ConvertJsonV2Component, Spinner, TabsComponent, PermissionsComponent
} from '../../../../../../Components';
import {
  leadDetailsPut,
  leadDetailsGet,
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
import { FormsIdsEnum } from '../../../../../../Enums';
import { LeadsSalesPermissions } from '../../../../../../Permissions/Sales/LeadsSalesPermissions';
import { LeadsLeasePermissions } from '../../../../../../Permissions/Lease/LeadsLeasePermissions';
import { LeadsPermissions } from '../../../../../../Permissions';

export const LeadInformationComponent = ({ viewType, parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath, 'Shared');
  const [activeItem, setActiveItem] = useState({
    id: null,
    leadTypeId: null,
  });
  const [isPropertyManagementView, setIsPropertyManagementView] = useState(false);
  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loadings, setLoadings] = useState([]);
  const [formData, setFormData] = useState([]);
  const [enumsInitFinished, setEnumsInitFinished] = useState(false);
  const [errors, setErrors] = useState([]);
  const [leadInitDetails, setLeadInitDetails] = useState({});
  const [leadDetails, setLeadDetails] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [formAndTabs, setFormAndTabs] = useState([]);

  const onTabChanged = (e, newTap) => {
    setEnumsInitFinished(false);
    setActiveTab(newTap);
  };
  const getAllFormFieldTabsByFormId = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAllFormFieldTabsByFormId({
      formId:
        (activeItem.leadTypeId === 1 && FormsIdsEnum.leadsOwner.id) || FormsIdsEnum.leadsSeeker.id,
    });
    if (!(result && result.status && result.status !== 200)) setFormAndTabs(result[0] || []);
    else setFormAndTabs([]);
    setIsLoading(false);
  }, [activeItem.leadTypeId]);
  const getLeadDetails = useCallback(async () => {
    setIsLoading(true);
    const leadDetailsRes = await leadDetailsGet({ id: activeItem.id });
    if (!(leadDetailsRes && leadDetailsRes.status && leadDetailsRes.status !== 200)) {
      setLeadInitDetails(JSON.parse(JSON.stringify(leadDetailsRes)));
      setLeadDetails(leadDetailsRes);
    } else {
      setLeadInitDetails({});
      setLeadDetails({});
    }
    setIsLoading(false);
  }, [activeItem]);

  const dataHandler = useCallback(() => {
    if (formData.length === 0) setFormData(formItemsBuilder(leadDetails.lead, formAndTabs));
  }, [leadDetails.lead, formAndTabs, formData.length]);
  const cancelHandler = () => {
    localStorage.removeItem('leadStatus');
    GlobalHistory.goBack();
  };
  const saveHandler = async () => {
    localStorage.removeItem('leadStatus');
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
    const totalValues = Object.values(leadDetails.lead).filter(
      (item) => item !== null && item !== '' && item !== undefined
    ).length;
    const total = (totalValues / totalItems) * 100;
    leadDetails.lead.data_completed = Math.round(total);
    setIsLoading(true);
    const putResponse = await leadDetailsPut({
      id: activeItem.id,
      body: { leadJson: leadDetails },
    });
    if (!(putResponse && putResponse.status && putResponse.status !== 200)) {
      showSuccess(t(`${translationPath}lead-updated-successfully`));
      setIsLoading(false);
      // cancelHandler();
    } else {
      setIsLoading(false);
      showError(t(`${translationPath}lead-update-failed`));
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
    setLeadDetails((items) => {
      if ((itemIndex || itemIndex === 0) && itemIndex !== -1)
        items.lead[id || formData[activeTab][itemIndex].field.id] = newValue;
      else items.lead[item.field.id] = newValue;
      return { ...items };
    });
  };

  const getIsClosedLead = () => {
    const leadStatus = localStorage.getItem('leadStatus');
    if (leadStatus) {
      const leadStatusJson = JSON.parse(leadStatus);
      if (leadStatusJson && leadStatusJson.lookupItemName === 'Closed')
      return true;
    }
     return false;
  };
  const lookupInit = useCallback(() => {
    setIsLoading(true);
    const result = LookupsRules(formData[activeTab], leadDetails.lead, onLoadingsChanged);
    setFormData((items) => {
      items.splice(activeTab, 1, result);
      return [...items];
    });
    setIsLoading(false);
  }, [activeTab, leadDetails.lead, formData]);
  useEffect(() => {
    if (formData.length > 0 && leadDetails.lead)
      setErrors(FormErrorsHandler(formData, leadDetails.lead));
  }, [leadDetails, formData]);
  useEffect(() => {
    if (!enumsInitFinished && formData.length > 0) {
      setEnumsInitFinished(true);
      lookupInit();
    }
  }, [activeTab, enumsInitFinished, formData.length, lookupInit]);
  useEffect(() => {
    if (leadDetails.lead) dataHandler();
  }, [leadDetails.lead, dataHandler]);
  useEffect(() => {
    if (formAndTabs.length > 0) getLeadDetails();
  }, [formAndTabs, getLeadDetails]);
  useEffect(() => {
    if (activeItem && activeItem.leadTypeId) getAllFormFieldTabsByFormId();
  }, [activeItem, getAllFormFieldTabsByFormId]);
  useEffect(() => {
    setActiveItem({
      id: GetParams('id'),
      leadTypeId: (GetParams('formType') && +GetParams('formType')) || 1,
    });
    if (pathName === 'Leads-property-management/lead-profile-edit')
      setIsPropertyManagementView(true);
    else
      setIsPropertyManagementView(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>
            {' '}
            {t('Shared:cancel')}
          </span>
        </ButtonBase>
        {
          isPropertyManagementView && (
            <PermissionsComponent
              permissionsList={Object.values(LeadsPermissions)}
              permissionsId={LeadsPermissions.EditLeadDetails.permissionsId}
            >
              <ButtonBase
                className='btns theme-solid mb-2'
                disabled={getIsClosedLead()}
                onClick={saveHandler}
              >
                <span>{t('Shared:save')}</span>
              </ButtonBase>
            </PermissionsComponent>
          )
        }
        {
          !isPropertyManagementView && (
            <PermissionsComponent
              permissionsList={[...Object.values(LeadsSalesPermissions), ...Object.values(LeadsLeasePermissions)]}
              permissionsId={[LeadsSalesPermissions.EditLeadDetails.permissionsId, LeadsLeasePermissions.EditLeadDetails.permissionsId]}
            >
              <ButtonBase
                className='btns theme-solid mb-2'
                onClick={saveHandler}
                disabled={getIsClosedLead()}
              >
                <span>{t('Shared:save')}</span>
              </ButtonBase>
            </PermissionsComponent>
          )
        }
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
    <div className='lead-information-wrapper childs-wrapper b-0'>
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
                  (leadInitDetails.lead[item.field.id] === null ||
                    leadInitDetails.lead[item.field.id] === undefined ||
                    leadInitDetails.lead[item.field.id] === ''))
            )
            .map((item, index) => (
              <ConvertJsonV2Component
                key={`form${index + 1}`}
                item={item}
                allItems={formData[activeTab]}
                allItemsValues={leadDetails.lead}
                itemValue={leadDetails.lead[item.field.id]}
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

LeadInformationComponent.propTypes = {
  viewType: PropTypes.oneOf([1, 2]).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
