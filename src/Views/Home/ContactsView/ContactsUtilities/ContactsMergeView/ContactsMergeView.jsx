import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase, IconButton } from '@material-ui/core';
import moment from 'moment';
import { ContactTypeEnum } from '../../../../../Enums';
import { Spinner, RadiosGroupComponent } from '../../../../../Components';
import {
  contactsDetailsGet,
  GetAllFormFieldsByFormId,
  MergeContact,
} from '../../../../../Services';
import {
  GetParams, GlobalHistory, showError, showSuccess
} from '../../../../../Helper';

const parentTranslationPath = 'ContactsView';
const translationPath = 'utilities.contactsMergeView.';

export const ContactsMergeView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [isReverse, setIsReverse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormsLoading, setIsFormsLoading] = useState(false);
  const [firstContactsData, setFirstContactsData] = useState([]);
  const [secondContactsData, setSecondContactsData] = useState([]);
  const [mergedContact, setMergedContact] = useState({});
  const [radioValue, setRadioValue] = useState([]);
  const [formsContent, setFormsContent] = useState([]);
  const [firstId, setFirstId] = useState(null);
  const [secondId, setSecondId] = useState(null);
  const [userTypeId, setUserTypeId] = useState(null);

  useEffect(() => {
    setFirstId(+GetParams('firstId'));
    setSecondId(+GetParams('secondId'));
    setUserTypeId(+GetParams('userTypeId') === 1 ? 1 : 2);
    return () => { };
  }, []);

  const getContactDetails = useCallback(async () => {
    setIsLoading(true);
    if (firstId && secondId) {
      const firstContactDetailsRes = await contactsDetailsGet({ id: firstId });
      const secondContactDetailsRes = await contactsDetailsGet({ id: secondId });
      if (
        !(
          firstContactDetailsRes &&
          firstContactDetailsRes.status &&
          firstContactDetailsRes.status !== 200
        )
      ) {
        setFirstContactsData(firstContactDetailsRes);
        setMergedContact(JSON.parse(JSON.stringify(firstContactDetailsRes.contact)));
      }

      if (
        !(
          secondContactDetailsRes &&
          secondContactDetailsRes.status &&
          secondContactDetailsRes.status !== 200
        )
      )
        setSecondContactsData(secondContactDetailsRes);
    }
    setIsLoading(false);
  }, [firstId, secondId]);

  useEffect(() => {
    getContactDetails();
  }, [getContactDetails]);

  const mergeHandler = useCallback(async () => {
    const result = await MergeContact({
      originalId: isReverse ? +secondId : +firstId,
      obsoleteId: !isReverse ? +secondId : +firstId,
      mergedJson: {
        contact: mergedContact,
      },
    });
    if (!(result && result.status && result.status !== 200)) {
      GlobalHistory.goBack();
      showSuccess(t(`${translationPath}contacts-merged-successfully`));
    } else showError(t(`${translationPath}contacts-merged-failed`));
  }, [firstId, isReverse, mergedContact, secondId, t]);

  const cancelHandler = () => {
    GlobalHistory.goBack();
  };

  const GetAllFormByFormId = useCallback(async () => {
    setIsFormsLoading(true);
    if (userTypeId) {
      const result = await GetAllFormFieldsByFormId(userTypeId);
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
  }, [userTypeId]);

  useEffect(() => {
    GetAllFormByFormId();
  }, [GetAllFormByFormId]);

  const getDefaultContactImage = (contactType) => ContactTypeEnum[contactType].defaultImg;

  const checkWidgetType = useCallback(
    (item, contact) => {
      let type;
      switch (item.uiWidgetType) {
        case 'select':
          if (
            item.formFieldName === 'promo_sms_email' ||
            item.formFieldName === 'promo_smsemail' ||
            item.formFieldName === 'multi_property_owner' ||
            item.formFieldName === 'high_net_worth' ||
            item.formFieldName === 'owner_in-multiple_areas' ||
            item.formFieldName === 'owner_for_one_unit' ||
            item.formFieldName === 'owner_in_multiple_areas' ||
            item.formFieldName === 'investor' ||
            item.formFieldName === 'exclusive'
          )
            type = contact;
          else if (item.formFieldName === 'contact_preference')
            type = contact.map((el) => `${el.lookupItemName}  ` || 'N/A');
          else type = contact.lookupItemName;
          break;
        case 'communication':
          if (
            item.formFieldName === 'email_address' ||
            item.formFieldName === 'spouse_email' ||
            item.formFieldName === 'general_email' ||
            item.formFieldName === 'representative_email'
          )
            type = contact.email;
          else if (
            item.formFieldName === 'twitter_link' ||
            item.formFieldName === 'instagram_link' ||
            item.formFieldName === 'linkedin_link' ||
            item.formFieldName === 'facebook_link'
          )
            type = contact.link;
          else type = contact.phone;
          break;
        case 'alt-date':
          type = moment(`${contact}`).format('DD, MMM YYYY');
          break;
        case 'UploadFiles':
          if (userTypeId === 2) type = contact && contact.ID && contact.ID[0].fileName;
          break;
        case 'address':
          if (
            item.formFieldName === 'country' ||
            item.formFieldName === 'city' ||
            item.formFieldName === 'community' ||
            item.formFieldName === 'sub_community' ||
            item.formFieldName === 'workcity' ||
            item.formFieldName === 'workcountry' ||
            item.formFieldName === 'workdistrict' ||
            item.formFieldName === 'worksubcommunity' ||
            item.formFieldName === 'workcommunity' ||
            item.formFieldName === 'work_street' ||
            item.formFieldName === 'district'
          )
            type = contact.lookupItemName;
          else if (item.formFieldName === 'map' || item.formFieldName === 'workmap')
            type = `latitude: ${contact.latitude} , longitude: ${contact.longitude}`;
          else type = contact.value;
          break;
        case 'StepValidation':
          type = contact;
          break;
        case 'textarea':
          type = contact;
          break;
        case 'searchField':
          if (userTypeId === 2) type = contact[0].name;
          break;
        default:
      }
      return type;
    },
    [userTypeId]
  );

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
      setMergedContact((items) => {
        if (radioValue[index].split('-')[1] === 'original')
          items[mergeRes] = firstContactsData.contact[mergeRes];
        else items[mergeRes] = secondContactsData.contact[mergeRes];
        return items;
      });
    },
    [firstContactsData.contact, radioValue, secondContactsData.contact]
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
    setMergedContact((items) => {
      radioValue.map((item) => {
        if (item.split('-')[1] === 'obsolete')
          items[item.split('-')[0]] = firstContactsData.contact[item.split('-')[0]];
        else items[item.split('-')[0]] = secondContactsData.contact[item.split('-')[0]];
      });
      return items;
    });
  };

  return (
    <div className='contacts-merge-view-wrapper w-100'>
      <Spinner isActive={isLoading} />
      <div className='contacts-merge-content'>
        {firstContactsData &&
          secondContactsData &&
          firstContactsData.contact &&
          secondContactsData.contact && (
            <div>
              <div className='content-header'>
                <div className='header-item-postion'>
                  <div className='header-item'>
                    <div>
                      <img
                        src={getDefaultContactImage(
                          +firstContactsData.contact.contact_type_id === 2 ?
                            ContactTypeEnum.corporate.value :
                            (firstContactsData &&
                              firstContactsData.contact.gender &&
                              firstContactsData.contact.gender.lookupItemName === 'Male' &&
                              ContactTypeEnum.man.value) ||
                            ContactTypeEnum.woman.value
                        )}
                        className='details-img'
                        alt={t(`${translationPath}user-image`)}
                      />
                    </div>
                    <div className='item-info'>
                      <div className='item-name'>
                        {t(`${translationPath}contact-id`)}
                        :
                        {`  ${isReverse ? secondContactsData.contactsId : firstContactsData.contactsId
                          }`}
                      </div>
                      <div className='original-item'>{t(`${translationPath}original`)}</div>
                    </div>
                  </div>
                  <div className='header-item'>
                    <div>
                      <img
                        src={getDefaultContactImage(
                          +secondContactsData.contact.contact_type_id === 2 ?
                            ContactTypeEnum.corporate.value :
                            (secondContactsData.contact.gender &&
                              secondContactsData.contact.gender.lookupItemName === 'Male' &&
                              ContactTypeEnum.man.value) ||
                            ContactTypeEnum.woman.value
                        )}
                        className='details-img'
                        alt={t(`${translationPath}user-image`)}
                      />
                    </div>
                    <div className='item-info'>
                      <div className='item-name'>
                        {t(`${translationPath}contact-id`)}
                        :
                        {`  ${!isReverse ? secondContactsData.contactsId : firstContactsData.contactsId
                          }`}
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
                                label: `${item.formFieldTitle}:  ${item.uiWidgetType ?
                                  (firstContactsData.contact[item.formFieldName] &&
                                    checkWidgetType(
                                      item,
                                      firstContactsData.contact[item.formFieldName]
                                    )) ||
                                  'N/A' :
                                  firstContactsData.contact[item.formFieldName] || 'N/A'
                                  }`,
                              },
                              {
                                value: `${item.formFieldName}-obsolete`,
                                label: `${item.formFieldTitle}:  ${item.uiWidgetType ?
                                  (secondContactsData.contact[item.formFieldName] &&
                                    checkWidgetType(
                                      item,
                                      secondContactsData.contact[item.formFieldName]
                                    )) ||
                                  'N/A' :
                                  secondContactsData.contact[item.formFieldName] || 'N/A'
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
