import React from 'react';
import { useTranslation } from 'react-i18next';

const parentTranslationPath = 'InvoicesView';
const translationPath = '';
export const InvoicesHeaderData = () => {
  const { t } = useTranslation(parentTranslationPath);
  return [
    {
      id: 1,
      isSortable: true,
      label: t(`${translationPath}invoice-no`),
      input: 'invoiceId',
    },
    {
      id: 2,
      isSortable: true,
      label: t(`${translationPath}invoice`),
      input: 'dueOn',
      isDate: true,
    },
    {
      id: 3,
      isSortable: true,
      label: t(`${translationPath}payment-type`),
      input: 'paymentTypeName',
    },
    {
      id: 4,
      isSortable: true,
      label: t(`${translationPath}mode`),
      input: 'paymentModeName',
    },
    {
      id: 5,
      label: t(`${translationPath}status`),
      component: (item) => (
        <span>{t(`${translationPath}${(item.invoiceStatus && 'paid') || 'unpaid'}`)}</span>
      ),
    },
    {
      id: 6,
      isSortable: true,
      label: t(`${translationPath}receipts`),
      input: 'receipts',
    },
    {
      id: 7,
      isSortable: true,
      label: t(`${translationPath}amount-due`),
      input: 'amountDue',
    },
    {
      id: 7,
      isSortable: true,
      label: t(`${translationPath}amount-paid`),
      input: 'amountPaid',
    },
    {
      id: 8,
      isSortable: true,
      label: t(`${translationPath}paid-on`),
      input: 'paidOn',
    },
    {
      id: 9,
      isSortable: true,
      label: t(`${translationPath}balance`),
      input: 'balance',
    },
    {
      id: 10,
      isSortable: true,
      label: t(`${translationPath}unit-ref-no`),
      input: 'unitRefNo',
    },
  ];
};
