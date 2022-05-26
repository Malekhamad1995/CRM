import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { Spinner, Tables } from '../../../../../../../Components';
import { InvoiceDeleteDialog, InvoiceManagementDialog } from '../../../Dialogs';
import { TableActions, UnitsOperationTypeEnum } from '../../../../../../../Enums';
import { GetReservationInvoices } from '../../../../../../../Services';

export const InvoiceRentRelatedComponent = ({
  state,
  selected,
  onSelectedChanged,
  unitTransactionId,
  unitData,
  //   schema,
  //   isSubmitted,
  onStateChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenInvoiceDialog, setIsOpenInvoiceDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [localList, setLocalList] = useState([]);
  const [invoiceId, setInvoiceId] = useState([]);
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const tableActionClicked = useCallback((actionEnum, item) => {
    if (actionEnum === TableActions.editText.key) {
      setActiveItem(item);
      setIsOpenInvoiceDialog(true);
    } else if (actionEnum === TableActions.deleteText.key) {
      setActiveItem(item);
      setIsOpenConfirm(true);
    }
  }, []);

  const getAllInvoices = useCallback(async () => {
    setIsLoading(true);
    setIsFirstLoad(false);
    const res = await GetReservationInvoices(unitTransactionId);
    if (!(res && res.status && res.status !== 200)) {
      if (onSelectedChanged) {
        onSelectedChanged({
          id: 'invoices',
          value: res.map((item) => ({
            ...item,
            paymentMode: {
              lookupItemId: item.paymentModeId,
              lookupItemName: item.paymentModeName || 'N/A',
            },
            paymentType: {
              lookupItemId: item.paymentTypeId,
              lookupItemName: item.paymentTypeName || 'N/A',
            },
          })),
        });
      }
    }
    setIsLoading(false);
  }, [onSelectedChanged, unitTransactionId]);

  useEffect(() => {
    if (
      unitTransactionId &&
      state.invoicesIds.length > 0 &&
      isFirstLoad &&
      (!selected.invoices || selected.invoices.length === 0)
    )
      getAllInvoices();
  }, [unitTransactionId, getAllInvoices, selected.invoices, state.invoicesIds, isFirstLoad]);
  return (
    <div className='unit-status-contact-info-wapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='d-flex mb-3'>
        <ButtonBase className='btns theme-solid mx-2' onClick={() => setIsOpenInvoiceDialog(true)}>
          <span className='mdi mdi-plus' />
          <span className='px-1'>{t(`${translationPath}add-invoice`)}</span>
        </ButtonBase>
      </div>
      <Tables
        data={selected.invoices || []}
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
            input: 'paymentType.lookupItemName',
          },
          {
            id: 4,
            label: 'mode',
            input: 'paymentMode.lookupItemName',
          },
          {
            id: 4,
            label: 'ref-no',
            component: () => <span>{unitData && unitData.refNo}</span>,
          },
          {
            id: 5,
            label: 'status',
            component: (item) => (
              <span>{t(`${translationPath}${(item.invoiceStatus && 'paid') || 'unpaid'}`)}</span>
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
        actionsOptions={{
          onActionClicked: tableActionClicked,
        }}
        defaultActions={
          (!unitTransactionId && [
            {
              enum: TableActions.deleteText.key,
            },
            {
              enum: TableActions.editText.key,
            },
          ]) ||
          []
        }
        activePage={filter.pageIndex}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        totalItems={(selected.invoices && selected.invoices.length) || 0}
      />
      {isOpenInvoiceDialog && (
        <InvoiceManagementDialog
          currentOperationType={UnitsOperationTypeEnum.rent.key}
          effectedByNumber={state.rentPerYear}
          effectedByName='rent-per-year'
          totalInvoicesLength={(state.invoicesIds && state.invoicesIds.length) || 0}
          activeItem={activeItem}
          isOpen={isOpenInvoiceDialog}
          reloadData={(savedItem) => {
            const localInvoices = (selected.invoices && [...selected.invoices]) || [];
            const index = localInvoices.findIndex((item) => item.invoiceId === savedItem.invoiceId);
            if (index !== -1) {
              localInvoices.splice(index, 1);
              localInvoices.push(savedItem);
            } else
            localInvoices.push(savedItem);
            setLocalList(localInvoices)
            if (onSelectedChanged) onSelectedChanged({ id: 'invoices', value: localInvoices });
            let localStatuses = [];
            if (state && state.invoicesIds) localStatuses = [...state.invoicesIds];
            localStatuses.push(savedItem.invoiceId);
            onStateChanged({ id: 'invoicesIds', value: localStatuses });
            setInvoiceId(localStatuses);
            setIsOpenInvoiceDialog(false);
            setActiveItem(null);
          }}
          isOpenChanged={() => {
            setIsOpenInvoiceDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {activeItem && (
        <InvoiceDeleteDialog
          activeItem={activeItem}
          isOpen={isOpenConfirm}
          isOpenChanged={() => {
            setIsOpenConfirm(false);
            setActiveItem(null);
          }}
          reloadData={() => {
            setFilter((item) => ({ ...item, pageIndex: 0 }));
            setActiveItem(null);
            setIsOpenConfirm(false);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          localTableList={localList}
          invoiceId={{invoiceId}}
        />
      )}
    </div>
  );
};

InvoiceRentRelatedComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  unitData: PropTypes.instanceOf(Object).isRequired,
  unitTransactionId: PropTypes.number,
  //   schema: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onSelectedChanged: PropTypes.func.isRequired,
  //   isSubmitted: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
InvoiceRentRelatedComponent.defaultProps = {
  unitTransactionId: undefined,
};
