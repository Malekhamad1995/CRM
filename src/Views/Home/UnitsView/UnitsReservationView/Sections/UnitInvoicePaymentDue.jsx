import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PropTypes } from 'prop-types';
import { Spinner, Tables } from '../../../../../Components';
import { GetReservationInvoices } from '../../../../../Services';

const parentTranslationPath = 'UnitsProfileManagementView';
const translationPath = '';

export const UnitInvoicePaymentDue = ({ unitTransactionId }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [invoicePayments, setInvoicePayments] = useState([]);
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const getAllInvoices = useCallback(async () => {
    setIsLoading(true);
    const res = await GetReservationInvoices(unitTransactionId);
    if (!((res && res.data && res.data.ErrorId) || !res)) setInvoicePayments(res);
    else setInvoicePayments([]);
    setIsLoading(false);
  }, [unitTransactionId]);
  useEffect(() => {
    if (unitTransactionId) getAllInvoices();
  }, [getAllInvoices, unitTransactionId]);
  return (
    <div className='view-wrapper activities-view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='w-100 px-3'>
          <div className='mb-2'>
            <Tables
              data={invoicePayments}
              headerData={[
                {
                  id: 1,
                  label: 'payment-no',
                  input: 'paymentNo',
                },
                {
                  id: 2,
                  label: 'amount-due',
                  input: 'amountDue',
                },
                {
                  id: 3,
                  label: 'type',
                  input: 'paymentTypeName',
                },
                {
                  id: 4,
                  label: 'mode',
                  input: 'paymentModeName',
                },
                {
                  id: 4,
                  label: 'ref-no',
                  input: 'unitReferenceNo',
                },
                {
                  id: 5,
                  label: 'status',
                  component: (item) => (
                    <span>
                      {t(`${translationPath}${(item.invoiceStatus && 'paid') || 'unpaid'}`)}
                    </span>
                  ),
                },
                {
                  id: 6,
                  label: 'net-amount',
                  input: 'amountDue',
                },
                {
                  id: 7,
                  label: 'balance',
                  input: 'amountDue',
                },
              ]}
              defaultActions={[]}
              activePage={filter.pageIndex}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              totalItems={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
UnitInvoicePaymentDue.propTypes = {
  unitTransactionId: PropTypes.number,
};
UnitInvoicePaymentDue.defaultProps = {
  unitTransactionId: null,
};
