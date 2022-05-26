import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Spinner, Tables } from '../../../../../../../../../Components';
import { GetAllAmountReceivedUnitTransactionId } from '../../../../../../../../../Services';

export const AmountReceivedTable = ({
  unitTransactionId,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 999999,
  });
  const [amountReceived, setAmountReceived] = useState({
    result: [],
    totalCount: 0,
  });
  const getAllAmountReceivedUnitTransactionId = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllAmountReceivedUnitTransactionId(unitTransactionId);
    if (!((res && res.data && res.data.ErrorId) || !res)) {
      setAmountReceived({
        result: res.result || [],
        totalCount: res.totalCount || 0,
      });
    } else {
      setAmountReceived({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [unitTransactionId]);
  const getTotal = () =>
    amountReceived.result.reduce((total, item) => total + (item.amount || 0), 0);
  useEffect(() => {
    if (unitTransactionId) getAllAmountReceivedUnitTransactionId();
  }, [getAllAmountReceivedUnitTransactionId, unitTransactionId]);
  return (
    <div className='amount-received-table-wrapper presentational-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <Tables
        idRef='amountReceivedTableRef'
        data={amountReceived.result}
        headerData={[
          {
            id: 1,
            label: 'receipt-no',
            input: 'receiptNo',
          },
          {
            id: 2,
            label: 'amount',
            input: 'amount',
          },
        ]}
        footerData={[
          {
            value: t(`${translationPath}total`),
            // colSpan: 5,
          },
          {
            component: () => getTotal(),
          },
        ]}
        defaultActions={[]}
        activePage={filter.pageIndex}
        itemsPerPage={filter.pageSize}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        totalItems={amountReceived.totalCount}
      />
    </div>
  );
};

AmountReceivedTable.propTypes = {
  unitTransactionId: PropTypes.number,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
AmountReceivedTable.defaultProps = {
  unitTransactionId: null,
};
