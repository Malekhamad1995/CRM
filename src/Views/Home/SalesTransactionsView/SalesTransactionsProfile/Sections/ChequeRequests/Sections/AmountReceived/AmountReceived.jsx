import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
// import { Spinner } from '../../../../../../../../Components';
import { GetChequeRequestTransactionInfo } from '../../../../../../../../Services';
import { AmountReceivedTable } from './Controls';

export const AmountReceived = ({
  unitTransactionId,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  //   const [isLoading, setIsLoading] = useState(false);
  const [amountReceivedDetails, setAmountReceivedDetails] = useState({});
  const getAmountReceivedDetailsByUnitTransactionId = useCallback(async () => {
    const res = await GetChequeRequestTransactionInfo(unitTransactionId);
    if (!((res && res.data && res.data.ErrorId) || !res)) setAmountReceivedDetails(res);
  }, [unitTransactionId]);
  useEffect(() => {
    if (unitTransactionId) getAmountReceivedDetailsByUnitTransactionId();
  }, [getAmountReceivedDetailsByUnitTransactionId, unitTransactionId]);
  return (
    <div className='amount-received-wrapper childs-wrapper'>
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}amount-received`)}</span>
      </div>
      <div className='form-item'>
        <AmountReceivedTable
          unitTransactionId={unitTransactionId}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      {/* <Spinner isActive={isLoading} isAbsolute /> */}
      <div className='form-item'>
        <div className='details-items-wrapper'>
          <div className='details-item-wrapper'>
            <span className='details-title'>{t(`${translationPath}unit-ref-no`)}</span>
            <span className='details-value'>{amountReceivedDetails.unitRefNo || 'N/A'}</span>
          </div>
          <div className='details-item-wrapper'>
            <span className='details-title'>{t(`${translationPath}buyer`)}</span>
            <span className='details-value'>{amountReceivedDetails.buyer || 'N/A'}</span>
          </div>
          <div className='details-item-wrapper'>
            <span className='details-title'>{t(`${translationPath}seller`)}</span>
            <span className='details-value'>{amountReceivedDetails.seller || 'N/A'}</span>
          </div>
        </div>
      </div>
      <div className='form-item'>
        <div className='details-items-wrapper'>
          <div className='details-item-wrapper'>
            <span className='details-title'>{t(`${translationPath}agency-fee-buyer`)}</span>
            <span className='details-value'>{amountReceivedDetails.agencyFeeBuyer || 'N/A'}</span>
          </div>
          <div className='details-item-wrapper'>
            <span className='details-title'>{t(`${translationPath}agency-fee-seller`)}</span>
            <span className='details-value'>{amountReceivedDetails.agencyFeeSeller || 'N/A'}</span>
          </div>
          <div className='details-item-wrapper'>
            <span className='details-title'>{t(`${translationPath}total`)}</span>
            <span className='details-value'>{amountReceivedDetails.total || 'N/A'}</span>
          </div>
          <div className='details-item-wrapper'>
            <span className='details-title'>{t(`${translationPath}balance`)}</span>
            <span className='details-value'>{amountReceivedDetails.balance || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

 AmountReceived.propTypes = {
  unitTransactionId: PropTypes.number,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
AmountReceived.defaultProps = {
  unitTransactionId: null,
};
