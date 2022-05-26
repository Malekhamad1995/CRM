import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import {
  GetContactServiceOfferByContactId,
  ContactServiceOfferPost,
  lookupItemsGetId,
} from '../../../../../../Services';
import { ServicesOfferedEnum } from '../../../../../../Enums';
import { Spinner, CheckboxesComponent } from '../../../../../../Components';
import {
  bottomBoxComponentUpdate,
  GetParams,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../Helper';

export const ContactProfileMaintenanceComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [loading, setLoading] = useState(false);
  const [servicesOffers, setServicesOffers] = useState(null);
  const defaultState = {
    contactId: +GetParams('id'),
    contactServiceOffersIds: [],
  };
  const [state, setState] = useState(defaultState);

  const getAllMaintenanceServices = useCallback(async () => {
    setLoading(true);
    const result = await GetContactServiceOfferByContactId(+GetParams('id'));
    if (!(result && result.status && result.status !== 200)) {
      setState((items) => {
        items.contactServiceOffersIds = result.map((item) => item.contactServiceOffersId);
        return items;
      });
    }
    setLoading(false);
  }, []);

  const getAllServicesOffers = useCallback(async () => {
    const result = await lookupItemsGetId({ lookupTypeId: ServicesOfferedEnum.key });
    if (!(result && result.status && result.status !== 200)) setServicesOffers(result);
    else setServicesOffers({});
  }, []);

  const cancelHandler = () => {
    GlobalHistory.goBack();
  };

  const saveHandler = useCallback(async () => {
    const result = await ContactServiceOfferPost(state);
    if (!(result && result.status && result.status !== 200))
      showSuccess(t(`${translationPath}contact-services-saved-successfully`));
    else showError(t(`${translationPath}contact-services-saved-failed`));
  }, [state, t, translationPath]);

  useEffect(() => {
    getAllMaintenanceServices();
  }, [getAllMaintenanceServices]);
  useEffect(() => {
    getAllServicesOffers();
  }, [getAllServicesOffers]);

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
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );

  return (
    <div className='associated-contacts-wrapper childs-wrapper'>
      <Spinner isActive={loading} />
      <div className='title-section'>
        <span>{t(`${translationPath}maintenance-services`)}</span>
      </div>
      <div className='maintenance-contact-wrapper w-100 px-2'>
        <div className='maintenance-table-wrapper'>
          <div className='services-row '>
            {servicesOffers &&
              servicesOffers.map((item, index) => (
                <div className='service-item' key={`${index + 1}-service`}>
                  <CheckboxesComponent
                    singleChecked={
                      state.contactServiceOffersIds.findIndex((el) => el === item.lookupItemId) !==
                      -1
                    }
                    value={item.lookupItemId}
                    label={item.lookupItemName}
                    themeClass='theme-secondary'
                    translationPath={translationPath}
                    idRef={`${index + 5}-service-ref`}
                    parentTranslationPath={parentTranslationPath}
                    onSelectedCheckboxChanged={() => {
                      setState((items) => {
                        const itemIndex = items.contactServiceOffersIds.findIndex(
                          (el) => el === item.lookupItemId
                        );
                        if (itemIndex !== -1) items.contactServiceOffersIds.splice(itemIndex, 1);
                        else items.contactServiceOffersIds.push(item.lookupItemId);
                        return { ...items };
                      });
                    }}
                  />
                </div>
              ))}
          </div>
          <div className='services-item-wrapper'>
            {servicesOffers &&
              servicesOffers.map(
                (item, index) =>
                  index < servicesOffers.length / 3 && (
                    <div
                      className={`service-item-row ${index % 2 === 0 ? 'is-gray' : ''}`}
                      key={`${index + 1}-services`}
                    />
                  )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

ContactProfileMaintenanceComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
