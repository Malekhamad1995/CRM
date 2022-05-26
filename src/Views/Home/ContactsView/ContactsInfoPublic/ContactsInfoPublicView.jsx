import { Button, Tooltip } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { LoadableImageComponant, Spinner } from '../../../../Components';
import {
  getPublicDownloadableLink, GetParams, showError, GlobalHistory
} from '../../../../Helper';
import { ContactTypeEnum } from '../../../../Enums';
import { GetContactActivitiesByPhoneNumber } from '../../../../Services';
import { PhoneNumberIncorrectComponent } from './PhoneNumberIncorrectComponent/PhoneNumberIncorrectComponent';

export const ContactsInfoPublicView = () => {
  const { t } = useTranslation('ContactsInfoPublic');
  const translationPath = '';
  const [state, setstate] = useState({
    detailsData: {},
    activitiesData: [],
    correctnumber: true,
    number: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const getDetails = useCallback(async () => {
    setIsLoading(true);
    const res = await GetContactActivitiesByPhoneNumber(state.number || +GetParams('phonenumber'));
    if (!(res && res.status && res.status !== 200)) {
      setstate((item) => ({
        ...item,
        allData: res.contact,
        detailsData: res.contact.contact,
        activitiesData: res.activities,
        correctnumber: true,
      }));
      setIsLoading(false);
    } else {
      if (!(state.number === null))
        showError(t(`${translationPath}Error-in-mobile-number-or-not-exist`));
      setstate((item) => ({
        ...item,
        detailsData: {},
        activitiesData: [],
        correctnumber: false,
        number: null,
      }));
    }
    setIsLoading(false);
  }, [state.number, t]);
  useEffect(() => {
    getDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.number]);

  return (
    <>
      {(state.correctnumber && (
        <div className='pt-5'>
          <div className='ContactsInfoPublic-wraper'>
            <div className='about'>
              {`${state.detailsData.title && state.detailsData.title.lookupItemName} ${state.detailsData.first_name
                } ${state.detailsData.last_name}` || 'N/A'}
            </div>
          </div>
          <div className='ContactsInfoPublicView-main-wrapper'>
            <div className='about-Contacts-card-wrapper'>
              <Spinner isActive={isLoading} isAbsolute />
              <div className='main-title'>{t(`${translationPath}about-Contacts`)}</div>
              <div className='information-Contacts-card-wrapper'>
                <div className='img-wrapper-con'>
                  <div className='img-wrapper'>
                    <LoadableImageComponant
                      classes='user-img'
                      alt='user-img'
                      src={
                        (state.detailsData.contact_image &&
                          state.detailsData.contact_image['Image Upload'] &&
                          state.detailsData.contact_image['Image Upload'][0] &&
                          getPublicDownloadableLink(
                            state.detailsData.contact_image['Image Upload'][0].uuid
                          )) ||
                        ContactTypeEnum.man.defaultImg
                      }
                    />
                    <div className='back-img' />
                  </div>
                </div>
                <div className='w-100 '>
                  <div className='name'>
                    {`${state.detailsData.title && state.detailsData.title.lookupItemName} ${state.detailsData.first_name
                      } ${state.detailsData.last_name}` || 'N/A'}
                  </div>
                  <div className='dates'>
                    <span className='details-icon mdi mdi-calendar mdi-16px' />
                    <span className='fw-simi-bold px-2'>
                      {t(`${translationPath}created-date`)}
                      :
                    </span>
                    <span>
                      {moment(state.allData && state.allData.createdOn).format('DD-MMM-YYYY') ||
                        'N/A'}
                    </span>
                  </div>
                  <div className='Type-wrapper'>
                    {state.allData && state.allData.leadTypes.length > 0 && (
                      <>
                        {state.allData.leadTypes.map((w, subIndex) => (
                          <div
                            key={`leadTypesRef${subIndex + 1}`}
                            className={`contact-type  ${w.toLowerCase()}`}
                          >
                            {t(`${translationPath}${w.toLowerCase()}`)}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  <div className='Contact-profile-action-wrapper'>
                    <Button
                      className='MuiButtonBase-root btns theme-solid'
                      onClick={() =>
                        GlobalHistory.push(
                          `/home/Contacts-CRM/contact-profile-edit?formType=${state.detailsData.contact_type_id
                          }&id=${state.allData && state.allData.contactsId}`
                        )}
                    >
                      <span className='mdi mdi-cursor-default-outline' />
                      <span>{t(`${translationPath}Open-Contact-profile`)}</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className='details-Contacts-card-wrapper'>
                <div className='details'>
                  <div className='item-details'>{t(`${translationPath}Mobile`)}</div>
                  <div className='item-value-impratent'>
                    {(state &&
                      state.detailsData &&
                      state.detailsData.mobile &&
                      state.detailsData.mobile.phone) ||
                      'N/A'}
                  </div>
                </div>
                <div className='details'>
                  <div className='item-details'>{t(`${translationPath}Email`)}</div>
                  <div className='item-value-impratent'>
                    {(state &&
                      state.detailsData &&
                      state.detailsData.email_address &&
                      state.detailsData.email_address.email) ||
                      'N/A'}
                  </div>
                </div>
                <div className='details'>
                  <div className='item-details'>{t(`${translationPath}Location`)}</div>
                  <div className='item-value'>
                    <Tooltip
                      title={`
                      ${state.detailsData.country && state.detailsData.country.lookupItemName} ${state.detailsData.city && state.detailsData.city.lookupItemName
                        }
                      ${state.detailsData.city && state.detailsData.district.lookupItemName}
                      ${state.detailsData.city && state.detailsData.community.lookupItemName}
                      `}
                      aria-label='add'
                    >
                      <div className='city-d'>
                        {state.detailsData.country && state.detailsData.country.lookupItemName}
                        &nbsp;-
                        {state.detailsData.city && state.detailsData.city.lookupItemName}
                        &nbsp;-
                        {state.detailsData.district && state.detailsData.district.lookupItemName}
                        &nbsp;-
                        {state.detailsData.community && state.detailsData.community.lookupItemName}
                        &nbsp;-
                      </div>
                    </Tooltip>
                  </div>
                </div>
                <div className='details'>
                  <div className='item-details'>{t(`${translationPath}Nationality`)}</div>
                  <div className='item-value'>
                    {(state.detailsData.nationality &&
                      state.detailsData.nationality.lookupItemName) ||
                      'N/A'}
                  </div>
                </div>
                <div className='details'>
                  <div className='item-details'>{t(`${translationPath}Language`)}</div>
                  <div className='item-value'>
                    {(state.detailsData.language && state.detailsData.language.lookupItemName) ||
                      'N/A'}
                  </div>
                </div>
                <div className='details'>
                  <div className='item-details'>{t(`${translationPath}Work-company-Name`)}</div>
                  <div className='item-value'>
                    {(state.detailsData.works_company_name &&
                      state.detailsData.works_company_name.name) ||
                      'N/A'}
                  </div>
                </div>
              </div>
            </div>
            <div className='call-Contacts-card-container'>
              <Spinner isActive={isLoading} isAbsolute />
              {state &&
                state.activitiesData &&
                state.activitiesData.map((item, key) => (
                  <div className='card-opp' Index={key}>
                    <div className='card-line'>
                      <div
                        className={
                          key + 1 >= state.activitiesData.length ? '' : 'timeline-wrapper'
                        }
                      >
                        <div className='timeline-yr' />
                        <div className='timeline-info' />
                      </div>
                    </div>
                    <div className='call-Contacts-card-wrapper'>
                      <div className='details-call-Contacts-card-wrapper'>
                        <div className='details'>
                          <div className='item-value-impratent' />
                        </div>
                        <div className='details'>
                          <div className='item-value'>
                            {`   ${t('Called')}
                      ${item.agentName}
                      ${t('at')}  ${moment(
                              state && state.activitiesData && state.activitiesData.createdOn
                            ).format('HH:mm') || 'N/A'
                              }
                      ${t('in')}   ${moment(
                                state && state.activitiesData && state.activitiesData.createdOn
                              ).format('DD-MMM-YYYY') || 'N/A'
                              }
                      `}
                          </div>
                        </div>
                        <div className='details'>
                          <div className='item-details'>{t(`${translationPath}Mobile`)}</div>
                          <div className='item-value-impratent'>
                            {(state && state.detailsData && state.detailsData.mobile.phone) ||
                              'N/A'}
                          </div>
                        </div>
                        <div className='details'>
                          <div className='item-details'>{t(`${translationPath}subject`)}</div>
                          <div className='item-value'>{(item && item.subject) || 'N/A'}</div>
                        </div>
                        <div className='details'>
                          <div className='item-details'>{t(`${translationPath}comments`)}</div>
                          <div className='item-value'>{(item && item.comments) || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )) || (
      <PhoneNumberIncorrectComponent
        change={(it) => setstate((item) => ({ ...item, number: it }))}
      />
        )}
    </>
  );
};
