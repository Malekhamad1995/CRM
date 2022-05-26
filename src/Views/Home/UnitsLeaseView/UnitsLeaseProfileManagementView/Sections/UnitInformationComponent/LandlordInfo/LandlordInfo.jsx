import React from 'react';
import { useTranslation } from 'react-i18next';
import './LandlordInfoStyle.scss';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { GlobalHistory } from '../../../../../../../Helper';
import { ActiveItemActions } from '../../../../../../../store/ActiveItem/ActiveItemActions';

export const LandlordInfo = ({ parentTranslationPath, leaseLeadOwner }) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const dispatch = useDispatch();

  const moveToContact = () => {
    if (leaseLeadOwner) {
      dispatch(ActiveItemActions.activeItemRequest({ name: leaseLeadOwner.contactName, id: leaseLeadOwner.contactId }));
      GlobalHistory.push(
        `/home/Contacts-CRM/contact-profile-edit?formType=${leaseLeadOwner.contactsTypeId}&id=${leaseLeadOwner.contactId}`
      );
    }
  };

  const moveToLead = () => {
     if (leaseLeadOwner)
     dispatch(ActiveItemActions.activeItemRequest({ id: leaseLeadOwner.leadId, name: leaseLeadOwner.contactName }));
     const leadClass = leaseLeadOwner && leaseLeadOwner.leadClass && (leaseLeadOwner.leadClass === 'Seller' || leaseLeadOwner.leadClass === 'Landlord') ? 1 : 2;
     GlobalHistory.push(
      `/home/lead-lease/lead-profile-edit?formType=${leadClass}&id=${leaseLeadOwner.leadId}`
     );
  };

  return (
    <div className='landlordInformation'>
      <div className='card'>
        <div>
          <span className='titleSection'>
            <span className='mdi mdi-account-multiple-outline' />
            {t('landlordInformation')}
          </span>
        </div>
        <div className='landlordInfoContant'>
          <div className='sectionItem'>
            <span className='mdi mdi-account-tie' />
            {' '}
            {leaseLeadOwner && leaseLeadOwner.contactName ? (
              <a href='# ' onClick={() => moveToContact()}>
                <span className='navbar-item' activeClassName='is-active'>
                  {(leaseLeadOwner.contactName)}
                </span>
              </a>
            ) : 'N/A'}

          </div>
          <div className='sectionItem'>
            <span className='mdi mdi-account-tie' />
            {' '}
            {leaseLeadOwner && leaseLeadOwner.leadId ? (
              <a href='# ' onClick={() => moveToLead()}>
                <span className='navbar-item' activeClassName='is-active'>
                  {leaseLeadOwner.leadId}
                </span>
              </a>
            ) : 'N/A'}
          </div>

          <div className='sectionItem'>
            <span className='mdi mdi-phone' />
            {' '}
            {(leaseLeadOwner && leaseLeadOwner.phone) || 'N/A'}

          </div>
          <div className='sectionItem'>
            <span className='mdi mdi-email-outline'> </span>
            {' '}
            {(leaseLeadOwner && leaseLeadOwner.email) || 'N/A'}
          </div>

        </div>

      </div>
    </div>
  );
};

LandlordInfo.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  leaseLeadOwner: PropTypes.instanceOf(Object).isRequired,
};
