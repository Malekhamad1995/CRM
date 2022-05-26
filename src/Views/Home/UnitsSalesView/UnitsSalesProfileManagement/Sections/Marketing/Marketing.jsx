import React, {
  useCallback, useEffect, useReducer, useState
} from 'react';
import { PropTypes } from 'prop-types';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';
import { Spinner, TabsComponent } from '../../../../../../Components';
import { UnitProfileMarketingTabsData } from './TabsData';
import { GlobalHistory, showError, showSuccess } from '../../../../../../Helper';
import {
  UpdateUnitMarketing,
  CreateUnitMarketing,
  GetUnitMarketingByUnitId,
} from '../../../../../../Services';

export const Marketing = ({
  unitId,
  activeItem,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isMarketAsADifferentAgent, setIsMarketAsADifferentAgent] = useState(false);
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
    unitId,
    uspId: null,
    agentsId: null,
    titleEn: null,
    titleAr: null,
    descriptionEn: null,
    descriptionAr: null,
    isFeatureUnit: false,
    isHotDealUnit: false,
    marketingWebPortalIds: [],
    isPublishUnitSale: false,
    isPublishUnitLease: false,
  });
  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  const schema = Joi.object({
    // uspId: Joi.number()
    //   .required()
    //   .messages({
    //     'number.base': t(`${translationPath}usp-is-required`),
    //     'number.empty': t(`${translationPath}usp-is-required`),
    //   }),
    agentsId: Joi.any()
      .custom((value, helpers) => {
        if (!value && isMarketAsADifferentAgent) return helpers.error('state.agentRequired');
        return value;
      })
      .messages({
        'state.agentRequired': t(`${translationPath}marketing-agent-is-required`),
      }),
    titleEn: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}marketing-title-is-required`),
        'string.empty': t(`${translationPath}marketing-title-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const cancelHandler = () => {
    GlobalHistory.goBack();
  };
  const getUnitMarketingByUnitId = useCallback(async () => {
    setIsLoading(true);
    const res = await GetUnitMarketingByUnitId(unitId);
    if (!(res && res.status && res.status !== 200)) {
      setState({
        id: 'edit',
        value: {
          unitMarketingId: res.unitMarketingId || null,
          unitId,
          uspId: res.uspId || null,
          agentsId: res.agentsId || null,
          titleEn: res.titleEn || null,
          titleAr: res.titleAr || null,
          descriptionEn: res.descriptionEn || null,
          descriptionAr: res.descriptionAr || null,
          isFeatureUnit: res.isFeatureUnit || false,
          isHotDealUnit: res.isHotDealUnit || false,
          isPublishUnitSale: res.isPublishUnitSale || false,
          isPublishUnitLease: res.isPublishUnitLease || false,
          marketingWebPortalIds:
            (res.unitMarketingWebPortals &&
              res.unitMarketingWebPortals.map((item) => item.marketingWebPortalId)) ||
            [],
        },
      });
      if (res.agentsId) setIsMarketAsADifferentAgent(true);
      else setIsMarketAsADifferentAgent(false);
      setId(res.unitMarketingId || null);
    }
    setIsLoading(false);
  }, [unitId]);

  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    const res =
      (id && (await UpdateUnitMarketing(id, state))) || (await CreateUnitMarketing(state));
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      if (id) showSuccess(t(`${translationPath}unit-marketing-updated-successfully`));
      else showSuccess(t(`${translationPath}unit-marketing-created-successfully`));
    } else if (id) showError(t(`${translationPath}unit-marketing-update-failed`));
    else showError(t(`${translationPath}unit-marketing-create-failed`));
    getUnitMarketingByUnitId();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, schema, state, t, translationPath]);
  useEffect(() => {
    if (unitId) getUnitMarketingByUnitId();
  }, [getUnitMarketingByUnitId, unitId]);
  return (
    <div className='units-profile-marketing-wrapper childs-wrapper b-0'>
      <Spinner isActive={isLoading} isAbsolute />
      <TabsComponent
        data={UnitProfileMarketingTabsData}
        labelInput='label'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-curved'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
        dynamicComponentProps={{
          state,
          isMarketAsADifferentAgent,
          onIsMarketAsADifferentAgent: (newValue) => setIsMarketAsADifferentAgent(newValue),
          onStateChanged,
          isSubmitted,
          schema,
          activeItem,
          cancelHandler,
          saveHandler,
          parentTranslationPath,
          translationPath,
        }}
      />
    </div>
  );
};

Marketing.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  unitId: PropTypes.number,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
Marketing.defaultProps = {
  activeItem: undefined,
  unitId: undefined,
};
