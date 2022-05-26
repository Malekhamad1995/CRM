import React, {
 useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {  GetLeasingEarningByUnitTransactionId } from '../../../../../../Services';
import { Inputs, Spinner } from '../../../../../../Components';

export const Earnings = ({
  unitTransactionId,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [state, setState] = useReducer(reducer, {
    agencyFeeFromTenantNetAmount: 0,
    agencyFeeFromTenantBalance: 0,
    agencyFeeFromLandlordNetAmount: 0,
    agencyFeeFromLandlordBalance: 0,
  });
  const getLeasingEarningByUnitTransactionId = useCallback(async () => {
    setIsLoading(true);
    // const res = await GetLeasingEarningByUnitTransactionId(unitTransactionId);
    const res = await GetLeasingEarningByUnitTransactionId(unitTransactionId);
    if (!((res && res.data && res.data.ErrorId) || !res)) {
      setState({
        id: 'edit',
        value: {
          agencyFeeFromTenantNetAmount: res.agencyFeeFromBuyerNetAmount,
          agencyFeeFromTenantBalance: res.agencyFeeFromBuyerBalance,
          agencyFeeFromLandlordNetAmount: res.agencyFeeFromSellerNetAmount,
          agencyFeeFromLandlordBalance: res.agencyFeeFromSellerBalance,
        },
      });
    }
    setIsLoading(false);
  }, [unitTransactionId]);
  useEffect(() => {
    if (unitTransactionId) getLeasingEarningByUnitTransactionId();
  }, [getLeasingEarningByUnitTransactionId, unitTransactionId]);
  return (
    <div className='Leasing-transactions-earnings-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}agency-fee-from-tenant`)}</span>
      </div>
      <div className='form-item'>
        <Inputs
          idRef='agencyFeeFromTenantNetAmountRef'
          labelValue='net-amount'
          value={state.agencyFeeFromTenantNetAmount || 0}
          type='number'
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='agencyFeeFromTenantBalanceRef'
          labelValue='balance'
          value={state.agencyFeeFromTenantBalance || 0}
          type='number'
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}agency-fee-from-landlord`)}</span>
      </div>
      <div className='form-item'>
        <Inputs
          idRef='agencyFeeFromLandlordNetAmountRef'
          labelValue='net-amount'
          value={state.agencyFeeFromLandlordNetAmount || 0}
          type='number'
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='agencyFeeFromLandlordBalanceRef'
          labelValue='balance'
          value={state.agencyFeeFromLandlordBalance || 0}
          type='number'
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
    </div>
  );
};

Earnings.propTypes = {
  unitTransactionId: PropTypes.number,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
Earnings.defaultProps = {
  unitTransactionId: null,
};
