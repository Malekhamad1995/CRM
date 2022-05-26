import React, {
  useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Inputs, Spinner } from '../../../../../../Components';
import { GetEarningByUnitTransactionId } from '../../../../../../Services';

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
    agencyFeeFromBuyerNetAmount: 0,
    agencyFeeFromBuyerBalance: 0,
    agencyFeeFromSellerNetAmount: 0,
    agencyFeeFromSellerBalance: 0,
  });
  const getEarningByUnitTransactionId = useCallback(async () => {
    setIsLoading(true);
    const res = await GetEarningByUnitTransactionId(unitTransactionId);
    if (!((res && res.data && res.data.ErrorId) || !res)) setState({ id: 'edit', value: res });
    setIsLoading(false);
  }, [unitTransactionId]);
  useEffect(() => {
    if (unitTransactionId) getEarningByUnitTransactionId();
  }, [getEarningByUnitTransactionId, unitTransactionId]);
  return (
    <div className='sale-transactions-earnings-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}agency-fee-from-buyer`)}</span>
      </div>
      <div className='form-item'>
        <Inputs
          idRef='agencyFeeFromBuyerNetAmountRef'
          labelValue='net-amount'
          value={state.agencyFeeFromBuyerNetAmount || 0}
          type='number'
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='agencyFeeFromBuyerBalanceRef'
          labelValue='balance'
          value={state.agencyFeeFromBuyerBalance || 0}
          type='number'
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}agency-fee-from-seller`)}</span>
      </div>
      <div className='form-item'>
        <Inputs
          idRef='agencyFeeFromSellerNetAmountRef'
          labelValue='net-amount'
          value={state.agencyFeeFromSellerNetAmount || 0}
          type='number'
          isDisabled
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='agencyFeeFromSellerBalanceRef'
          labelValue='balance'
          value={state.agencyFeeFromSellerBalance || 0}
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
