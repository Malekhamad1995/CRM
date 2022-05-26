import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase, IconButton } from '@material-ui/core';
import { ContactTypeEnum } from '../../../../../Enums';
import { Spinner, RadiosGroupComponent } from '../../../../../Components';
import { leadDetailsGet, MergeLeads, GetAllFormFieldsByFormId } from '../../../../../Services';
import {
 GetParams, GlobalHistory, showError, showSuccess
} from '../../../../../Helper';

const parentTranslationPath = 'LeadsView';
const translationPath = 'utilities.leadsMergeView.';

export const LeadsLeaseMergeView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [isReverse, setIsReverse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormsLoading, setIsFormsLoading] = useState(false);
  const [firstLeadData, setFirstLeadData] = useState([]);
  const [secondLeadData, setSecondLeadData] = useState([]);
  const [mergedLead, setMergedLead] = useState({});
  const [radioValue, setRadioValue] = useState([]);
  const [formsContent, setFormsContent] = useState([]);
  const [firstId, setFirstId] = useState(null);
  const [secondId, setSecondId] = useState(null);
  const [leadTypeId, setLeadTypeId] = useState(null);

  useEffect(() => {
    setFirstId(+GetParams('firstId'));
    setSecondId(+GetParams('secondId'));
    setLeadTypeId(+GetParams('leadTypeId') === 1 ? 6 : 7);
    return () => {};
  }, []);

  const getLeadsDetails = useCallback(async () => {
    setIsLoading(true);
    if (firstId && secondId) {
      const firstLeadDetailsRes = await leadDetailsGet({ id: firstId });
      const secondLeadDetailsRes = await leadDetailsGet({ id: secondId });
      if (
        !(firstLeadDetailsRes && firstLeadDetailsRes.status && firstLeadDetailsRes.status !== 200)
      ) {
        setFirstLeadData(firstLeadDetailsRes);
        setMergedLead(JSON.parse(JSON.stringify(firstLeadDetailsRes.lead)));
      }

      if (
        !(
          secondLeadDetailsRes &&
          secondLeadDetailsRes.status &&
          secondLeadDetailsRes.status !== 200
        )
      )
        setSecondLeadData(secondLeadDetailsRes);
    }
    setIsLoading(false);
  }, [firstId, secondId]);

  useEffect(() => {
    getLeadsDetails();
  }, [getLeadsDetails]);

  const mergeHandler = useCallback(async () => {
    const result = await MergeLeads({
      originalId: isReverse ? +secondId : +firstId,
      obsoleteId: !isReverse ? +secondId : +firstId,
      mergedJson: {
        lead: mergedLead,
      },
    });
    if (!(result && result.status && result.status !== 200)) {
      GlobalHistory.push('/home/contact-lease/view');
      showSuccess(t(`${translationPath}leads-merged-successfully`));
    } else showError(t(`${translationPath}leads-merged-failed`));
  }, [firstId, isReverse, mergedLead, secondId, t]);

  const cancelHandler = () => {
    GlobalHistory.goBack();
  };

  const GetAllFormByFormId = useCallback(async () => {
    setIsFormsLoading(true);
    if (leadTypeId) {
      const result = await GetAllFormFieldsByFormId(leadTypeId);
      setFormsContent((items) => {
        result.map((item) =>
          items.push({
            formFieldTitle: item.formFieldTitle,
            formFieldName: item.formFieldName,
            uiWidgetType: item.uiWidgetType,
            formFieldId: item.formFieldId,
          }));
        return [...items];
      });
      const arr = result.map((item) => `${item.formFieldName}-original`);
      setRadioValue(JSON.parse(JSON.stringify(arr)));
    }
    setIsFormsLoading(false);
  }, [leadTypeId]);

  useEffect(() => {
    GetAllFormByFormId();
  }, [GetAllFormByFormId]);

  const getDefaultContactImage = (contactType) => ContactTypeEnum[contactType].defaultImg;
  const checkWidgetType = useCallback((item, lead) => {
    let type;
    switch (item.uiWidgetType) {
      case 'select':
        if (
          item.formFieldName === 'propertyunit_type' ||
          item.formFieldName === 'developers' ||
          item.formFieldName === 'fitting_and_fixtures' ||
          item.formFieldName === 'view' ||
          item.formFieldName === 'fitting_and_fixtures'
        )
          type = lead[0].lookupItemName;
        else if (
          item.formFieldName === 'notifications_for_agent_by' ||
          item.formFieldName === 'notifications_for_lead_by'
        )
          type = lead.map((el) => `  ${el.lookupItemName}`);
        else if (
          item.formFieldName === 'bedrooms' ||
          item.formFieldName === 'bathrooms' ||
          item.formFieldName === 'other_notifications'
        )
          type = [...lead];
        else if (item.formFieldName === 'rotation_label') type = lead;
        else type = lead.lookupItemName;
        break;
      case 'searchField':
        if (item.formFieldName === 'contact_name' || item.formFieldName === 'unit_number')
          type = lead.name;
        break;
      case 'rangeField':
        type = `${lead[0]} x ${lead[1]}`;
        break;
      case 'textarea':
        type = lead;
        break;
      default:
    }
    return type;
  }, []);

  const handleRadioValueChange = useCallback(
    (value, index) => {
      let res;
      if (radioValue[index].split('-')[1] === 'original')
        res = `${radioValue[index].split('-')[0]}-original`;
      else res = `${radioValue[index].split('-')[0]}-obsolete`;
      const i = radioValue.findIndex((el) => el === res);
      setRadioValue((items) => {
        items[i] = value;
        return [...items];
      });

      const mergeRes = `${radioValue[index].split('-')[0]}`;
      setMergedLead((items) => {
        if (radioValue[index].split('-')[1] === 'original')
          items[mergeRes] = firstLeadData.lead[mergeRes];
        else items[mergeRes] = secondLeadData.lead[mergeRes];
        return items;
      });
    },
    [firstLeadData.lead, radioValue, secondLeadData.lead]
  );

  const reverseHandler = () => {
    setIsReverse(!isReverse);
    setRadioValue((items) => {
      items.map((item, i) => {
        if (item.split('-')[1] === 'original') items[i] = `${item.split('-')[0]}-obsolete`;
        else items[i] = `${item.split('-')[0]}-original`;
      });
      return items;
    });
    setMergedLead((items) => {
      radioValue.map((item) => {
        if (item.split('-')[1] === 'obsolete')
          items[item.split('-')[0]] = firstLeadData.lead[item.split('-')[0]];
        else items[item.split('-')[0]] = secondLeadData.lead[item.split('-')[0]];
      });
      return items;
    });
  };

  return (
    <div className='contacts-merge-view-wrapper w-100'>
      <Spinner isActive={isLoading} />
      <div className='contacts-merge-content'>
        {firstLeadData && secondLeadData && firstLeadData.lead && secondLeadData.lead && (
          <div>
            <div className='content-header'>
              <div className='header-item-postion'>
                <div className='header-item'>
                  <div>
                    <img
                      src={getDefaultContactImage(ContactTypeEnum.man.value)}
                      className='details-img'
                      alt={t(`${translationPath}user-image`)}
                    />
                  </div>
                  <div className='item-info'>
                    <div className='item-name'>
                      {t(`${translationPath}lead-id`)}
                      :
                      {`  ${isReverse ? secondLeadData.leadId : secondLeadData.leadId}`}
                    </div>
                    <div className='original-item'>{t(`${translationPath}original`)}</div>
                  </div>
                </div>
                <div className='header-item'>
                  <div>
                    <img
                      src={getDefaultContactImage(ContactTypeEnum.man.value)}
                      className='details-img'
                      alt={t(`${translationPath}user-image`)}
                    />
                  </div>
                  <div className='item-info'>
                    <div className='item-name'>
                      {t(`${translationPath}lead-id`)}
                      :
                      {`  ${!isReverse ? secondLeadData.leadId : firstLeadData.leadId}`}
                    </div>
                    <div className='obsolete-item'>{t(`${translationPath}obsolete`)}</div>
                  </div>
                </div>
              </div>
              <div className='header-button'>
                <IconButton onClick={reverseHandler}>
                  <span className='mdi mdi-swap-horizontal' />
                </IconButton>
              </div>
            </div>
            <div className='content-body'>
              <>
                <Spinner isAbsolute isActive={isFormsLoading} />
                {formsContent.map(
                  (item, index) =>
                    item.uiWidgetType !== 'StepValidation' && (
                      <div
                        key={`contact-${index + 1}`}
                        className={`content-container ${index % 2 === 0 ? 'is-gray' : ''} `}
                      >
                        <RadiosGroupComponent
                          idRef='contacts-actions'
                          data={[
                            {
                              value: `${item.formFieldName}-original`,
                              label: `${item.formFieldTitle}:  ${
                                item.uiWidgetType ?
                                  (firstLeadData.lead[item.formFieldName] &&
                                      checkWidgetType(
                                        item,
                                        firstLeadData.lead[item.formFieldName]
                                      )) ||
                                    'N/A' :
                                  firstLeadData.lead[item.formFieldName] || 'N/A'
                              }`,
                            },
                            {
                              value: `${item.formFieldName}-obsolete`,
                              label: `${item.formFieldTitle}:  ${
                                item.uiWidgetType ?
                                  (secondLeadData.lead[item.formFieldName] &&
                                      checkWidgetType(
                                        item,
                                        secondLeadData.lead[item.formFieldName]
                                      )) ||
                                    'N/A' :
                                  secondLeadData.lead[item.formFieldName] || 'N/A'
                              }`,
                            },
                          ]}
                          onSelectedRadioChanged={(e) =>
                            handleRadioValueChange(e.target.value, index)}
                          value={`${radioValue[index]}`}
                          labelInput='label'
                          valueInput='value'
                        />
                      </div>
                    )
                )}
              </>
            </div>
          </div>
        )}
      </div>
      <div className='bottom-box-merge'>
        <div className='merge-bottom'>
          <div className='contacts-merge-bottom'>
            <ButtonBase className='btns mx-2' onClick={cancelHandler}>
              {t(`${translationPath}cancel`)}
            </ButtonBase>
            <ButtonBase className='btns mx-2 theme-solid' onClick={mergeHandler}>
              {t(`${translationPath}merge`)}
            </ButtonBase>
          </div>
        </div>
      </div>
    </div>
  );
};
