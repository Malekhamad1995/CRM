import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GetUnitTransactionsHistory } from '../../../../Services';
import { Tables } from '../../../TablesComponent/Tables';
import { Spinner } from '../../../SpinnerComponent/Spinner';
import { PaginationComponent } from '../../../PaginationComponent/PaginationComponent';
import { GetParams } from '../../../../Helper';

export const TransactionHistoryComponent = ({ parentTranslationPath, translationPath }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState({
    result: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const getAllContactUnitTransactions = useCallback(async () => {
    setIsLoading(true);
    const res = await GetUnitTransactionsHistory(+GetParams('id'), filter);
    if (!(res && res.status && res.status !== 200)) {
      setTransactions({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setTransactions({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);

  useEffect(() => {
    if (GetParams('id')) getAllContactUnitTransactions();
  }, [getAllContactUnitTransactions]);

  return (
    <div className='w-100 px-2 mt-2 transaction-history-component-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <Tables
        data={transactions.result || []}
        headerData={[
          {
            id: 1,
            label: 'date-and-time',
            input: 'createdOn',
            isDate: true,
          },
          {
            id: 2,
            label: 'user',
            input: 'userName',
          },
          {
            id: 3,
            label: 'client',
            input: 'clients',
          },
          {
            id: 4,
            label: 'amount-paid',
            input: 'amountPaid',
          },
          {
            id: 5,
            label: 'module',
            input: 'module',
          },
          {
            id: 6,
            label: 'remarks',
            input: 'remarks',
          },
          {
            id: 7,
            label: 'reservation-type',
            input: 'reservationTypeName',
          },
          {
            id: 8,
            label: 'agent',
            input: 'agentName',
          },
        ]}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
        dateFormat='MMM, DD, YYYY / hh:mm A'
        defaultActions={[]}
        itemsPerPage={filter.pageSize}
        activePage={filter.pageIndex}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        totalItems={transactions && transactions.totalCount}
      />
      <div className='pagination-history-wrapper'>
        <PaginationComponent
          pageIndex={filter.pageIndex}
          pageSize={filter.pageSize}
          totalCount={transactions.totalCount || 0}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
        />
      </div>
    </div>
  );
};

TransactionHistoryComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
