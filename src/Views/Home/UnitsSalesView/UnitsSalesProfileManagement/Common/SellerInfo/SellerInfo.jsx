import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './SellerInfoStyle.scss';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { GlobalHistory } from '../../../../../../Helper';
import { ActiveItemActions } from '../../../../../../store/ActiveItem/ActiveItemActions';

export const SellerInfo = ({ parentTranslationPath, translationPath, leadOwner }) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const dispatch = useDispatch();
  const moveToContact = () => {
    if (leadOwner) {
      dispatch(ActiveItemActions.activeItemRequest({ name: leadOwner.contactName, id: leadOwner.contactId }));
      GlobalHistory.push(
        `/home/Contacts-CRM/contact-profile-edit?formType=${leadOwner.contactsTypeId}&id=${leadOwner.contactId}`
      );
    }
  };

  const moveToLead = () => {
     if (leadOwner)
     dispatch(ActiveItemActions.activeItemRequest({ id: leadOwner.leadId, name: leadOwner.contactName }));
     const leadClass = leadOwner && leadOwner.leadClass && (leadOwner.leadClass === 'Seller' || leadOwner.leadClass === 'Landlord') ? 1 : 2;
     GlobalHistory.push(
      `/home/lead-sales/lead-profile-edit?formType=${leadClass}&id=${leadOwner.leadId}`
     );
  };

  return (
    <div className='sellerInfo'>
      <div className='card'>
        <div>
          <span className='titleSection'>
            <span className='mdi mdi-account-multiple-outline' />
            {t('sellerInformation')}
          </span>
        </div>
        <div className='sellerInfoContant'>
          <div className='sectionItem'>
            <span className='mdi mdi-account-tie' />
            {' '}
            {leadOwner && leadOwner.contactName ? (
              <a href='# ' onClick={() => moveToContact()}>
                <span className='navbar-item' activeClassName='is-active'>
                  {(leadOwner && leadOwner.contactName)}
                </span>
              </a>
            ) : 'N/A'}

          </div>

          <div className='sectionItem'>
            <span className='mdi mdi-account-tie' />
            {' '}
            { leadOwner && leadOwner.leadId ? (
              <a href='# ' onClick={() => moveToLead()}>
                <span className='navbar-item' activeClassName='is-active'>
                  {(leadOwner && leadOwner.leadId)}
                  {' '}
                </span>
              </a>
            ) : 'N/A'}
          </div>

          <div className='sectionItem'>
            <span className='mdi mdi-phone' />
            {' '}
            {(leadOwner && leadOwner.phone) || 'N/A' }
          </div>
          <div className='sectionItem'>
            <span className='mdi mdi-email-outline'> </span>
            {' '}
            {(leadOwner && leadOwner.email) || 'N/A' }
          </div>

        </div>

      </div>
    </div>
  );
};

SellerInfo.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  leadOwner: PropTypes.instanceOf(Object).isRequired,
};
