import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Spinner, Tables } from '../../../../../../Components';
import { GetAllContactUnitTransactions } from '../../../../../../Services';

export const ContactProfileTransactionsComponent = ({ 
  id,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
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
    const res = await GetAllContactUnitTransactions(filter, id);
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
  }, [filter, id]);

  useEffect(() => {
    if (id) getAllContactUnitTransactions();
  }, [getAllContactUnitTransactions, id]);

  return (
    <div className='associated-contacts-wrapper childs-wrapper p-relative'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='title-section'>
        <span>{t(`${translationPath}transactions-history`)}</span>
      </div>
      <div className='w-100 px-2'>
        <div className='filter-sections-wrapper' />
        <Tables
          data={transactions.result}
          headerData={[
            { id: 1, label: 'lead-no', input: 'leadNo' },
            {
              id: 2,
              label: 'lead-type',
              input: 'leadType',
            },
            {
              id: 3,
              label: 'contact-type',
              input: 'contactName',
            },
            {
              id: 4,
              label: 'transaction-type',
              input: 'transactionType',
            },
            {
              id: 5,
              label: 'unit-ref-no',
              input: 'unitReferenceNo',
            },
            {
              id: 6,
              label: 'property',
              input: 'propertyName',
            },
            {
              id: 5,
              label: 'transaction-date-time-des',
              input: 'createdOn',
              isDate: true,
            },
            {
              id:6,
              label:'Transaction ID',
              input:'transactionId'
            }
          ]}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
          dateFormat='MMM, DD, YYYY / hh:mm A'
          defaultActions={[]}
          // activePageChanged={activePageChanged}
          // itemsPerPageChanged={itemsPerPageChanged}
          // actionsOptions={
          //   {
          //     //   onActionClicked: tableActionClicked,
          //   }
          // }
          itemsPerPage={filter.pageSize}
          activePage={filter.pageIndex}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          // focusedRowChanged={focusedRowChanged}
          totalItems={transactions.totalCount}
        />
      </div>
    </div>
  );
};

ContactProfileTransactionsComponent.propTypes = {
  id: PropTypes.number.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
