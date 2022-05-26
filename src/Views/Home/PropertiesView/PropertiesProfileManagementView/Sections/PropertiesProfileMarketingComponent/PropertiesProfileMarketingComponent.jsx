import React, {
  useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { ButtonBase } from '@material-ui/core';
import { PropertiesPermissionsCRM } from '../../../../../../Permissions/PropertiesPermissions';
import { Spinner, TabsComponent, PermissionsComponent } from '../../../../../../Components';
import {
  bottomBoxComponentUpdate,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../Helper';
import {
  CreatePropertyMarketing,
  GetPropertyMarketingByPropertyId,
  UpdatePropertyMarketing,
} from '../../../../../../Services';
import { PropertiesProfileMarketingTabsData } from './TabsData';

export const PropertiesProfileMarketingComponent = ({
  propertyId,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [state, setState] = useReducer(reducer, {
    propertyId,
    propertyOverView: null,
    localAreaAndAmenitiesDescription: null,
    webRemarks: null,
    siteInfoAndAmenitiesDescription: null,
    developerDescription: null,
    isShowInWeb: false,
    luxuryIds: [],
    financeIds: [],
    styleIds: [],
    viewIds: [],
  });
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  const schema = Joi.object({
    propertyOverView: Joi.string()
      .allow(null, '')
      .min(200)
      .max(5000)
      .messages({
        'string.min': t(`${translationPath}least-allowed-character-description`),
        'string.max': t(
          `${translationPath}max-allowed-character-descriptionmax-allowed-character-description`
        ),
      }),
    localAreaAndAmenitiesDescription: Joi.string()
      .allow(null, '')
      .min(200)
      .max(5000)
      .messages({
        'string.min': t(`${translationPath}least-allowed-character-description`),
        'string.max': t(
          `${translationPath}max-allowed-character-descriptionmax-allowed-character-description`
        ),
      }),
    webRemarks: Joi.string()
      .allow(null, '')
      .min(200)
      .max(5000)
      .messages({
        'string.min': t(`${translationPath}least-allowed-character-description`),
        'string.max': t(
          `${translationPath}max-allowed-character-descriptionmax-allowed-character-description`
        ),
      }),
    siteInfoAndAmenitiesDescription: Joi.string()
      .allow(null, '')
      .min(200)
      .max(5000)
      .messages({
        'string.min': t(`${translationPath}least-allowed-character-description`),
        'string.max': t(
          `${translationPath}max-allowed-character-descriptionmax-allowed-character-description`
        ),
      }),
    developerDescription: Joi.string()
      .allow(null, '')
      .min(200)
      .max(5000)
      .messages({
        'string.min': t(`${translationPath}least-allowed-character-description`),
        'string.max': t(
          `${translationPath}max-allowed-character-descriptionmax-allowed-character-description`
        ),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const getPropertyMarketingByPropertyId = useCallback(async () => {
    setIsLoading(true);
    const res = await GetPropertyMarketingByPropertyId(propertyId);
    if (!(res && res.status && res.status !== 200) && res && res.propertyMarketingId) {
      setState({
        id: 'edit',
        value: {
          ...state,
          relatedUnit: res && res.relatedUnit,
          relatedLead: res && res.relatedLead,
          propertyId: res && res.propertyId,
          isShowInWeb: res && res.isShowInWeb,
          propertyOverView: res && res.propertyOverView,
          localAreaAndAmenitiesDescription: res && res.localAreaAndAmenitiesDescription,
          webRemarks: res && res.webRemarks,
          siteInfoAndAmenitiesDescription: res && res.siteInfoAndAmenitiesDescription,
          developerDescription: res && res.developerDescription,
          luxuryIds: res && res.luxuryIds.map((item) => item.luxurysId || []),
          financeIds: res && res.financeIds.map((item) => item.financesId || []),
          viewIds: res && res.viewIds.map((item) => item.viewsId || []),
          styleIds: res && res.styleIds.map((item) => item.stylesId || []),
        }

      });
      setId(res.propertyMarketingId || null);
    }
    setIsLoading(false);
  }, [propertyId]);
  const cancelHandler = () => {
    GlobalHistory.goBack();
  };
  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    const res =
      (id !== null ? (await UpdatePropertyMarketing(id,
        {
          propertyId: state.propertyId,
          propertyOverView: state.propertyOverView,
          localAreaAndAmenitiesDescription: state.localAreaAndAmenitiesDescription,
          webRemarks: state.webRemarks,
          siteInfoAndAmenitiesDescription: state.siteInfoAndAmenitiesDescription,
          developerDescription: state.developerDescription,
          isShowInWeb: state.isShowInWeb,
          luxuryIds: state.luxuryIds,
          financeIds: state.financeIds,
          styleIds: state.styleIds,
          viewIds: state.viewIds
        })) : (await CreatePropertyMarketing(state)));
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      if (id) {
        showSuccess(t(`${translationPath}property-marketing-updated-successfully`));
        getPropertyMarketingByPropertyId();
      } else showSuccess(t(`${translationPath}property-marketing-created-successfully`));
    } else if (id) showError(t(`${translationPath}property-marketing-update-failed`));
    else showError(t(`${translationPath}property-marketing-create-failed`));
  }, [id, schema, state, t, translationPath]);
  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <PermissionsComponent
          permissionsList={Object.values(PropertiesPermissionsCRM)}
          permissionsId={PropertiesPermissionsCRM.EditPropertyMarketingInfo.permissionsId}
        >
          <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
            <span>{t('Shared:save')}</span>
          </ButtonBase>
        </PermissionsComponent>
      </div>
    );
  });
  useEffect(() => {
    if (propertyId) getPropertyMarketingByPropertyId();
  }, [getPropertyMarketingByPropertyId, propertyId]);
  return (
    <div className='properties-profile-marketing-wrapper childs-wrapper p-0 b-0'>
      <Spinner isActive={isLoading} isAbsolute />
      <TabsComponent
        data={PropertiesProfileMarketingTabsData}
        labelInput='label'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-curved'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
        dynamicComponentProps={{
          state,
          onStateChanged,
          isSubmitted,
          schema,
          parentTranslationPath,
          translationPath,
        }}
      />
    </div>
  );
};

PropertiesProfileMarketingComponent.propTypes = {
  propertyId: PropTypes.number.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
