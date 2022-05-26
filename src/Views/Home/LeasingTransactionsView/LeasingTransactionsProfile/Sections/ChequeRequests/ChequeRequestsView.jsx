import React from 'react';
import PropTypes from 'prop-types';
import { AmountReceived, ChequeRequests } from './Sections';

export const ChequeRequestsView = ({
  unitTransactionId,
  parentTranslationPath,
  translationPath,
}) => (
  <div className='leasing-transactions-cheque-requests-wrapper childs-wrapper'>
    <AmountReceived
      unitTransactionId={unitTransactionId}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
    <ChequeRequests
      unitTransactionId={unitTransactionId}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  </div>
);

ChequeRequestsView.propTypes = {
  unitTransactionId: PropTypes.number,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ChequeRequestsView.defaultProps = {
  unitTransactionId: null,
};
