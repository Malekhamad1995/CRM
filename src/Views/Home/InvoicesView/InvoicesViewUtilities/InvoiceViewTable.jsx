import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Tables } from '../../../../Components';
import { TableActions, UnitsOperationTypeEnum } from '../../../../Enums';
import { InvoicesHeaderData } from './InvoicesHeaderData';
import { GetInvoicesById } from '../../../../Services';
import { InvoicesTransaction } from '../InvoicesTransaction';
import { useDispatch } from 'react-redux';
import {
  GlobalHistory,
} from '../../../../Helper';
import { InvoiceEditDialog } from '../InvoiceEditDialog';
import { ActiveItemActions } from '../../../../store/ActiveItem/ActiveItemActions'
export const InvoiceViewTable = ({
  state,
  filter,
  invoices,
  selected,
  setOpenDialog,
  onStateChanged,
  onFilterChange,
  totalAmountPaid,
  translationPath,
  onSelectedChanged,
  setTotalAmountPaid,
  parentTranslationPath,
  setSortBy,
  isWithCheckboxColumn

}) => {
  const onPageSizeChanged = (pageSize) => {
    onFilterChange((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState(null);
  const [activeItemid, setactiveItemid] = useState(null);
  const [isSale, setIsSale] = useState(false);
  const [isSaleAndRent, setIsSaleAndRent] = useState(false);
  const [oprationTypeValue, setOprationTypeValue] = useState(0);

  const [openInvoicesTransactionDialog, setOpenInvoicesTransactionDialog] = useState(false);
  const [openInvoiceEditDialog, setOpenInvoiceEditDialog] = useState(false);

  const onPageIndexChanged = (pageIndex) => {
    onFilterChange((item) => ({ ...item, pageIndex }));
  };
  const getIsSelectedAll = useCallback(
    () =>
      (state.invoicesIds &&
        invoices.result.findIndex((item) => !state.invoicesIds.includes(item.invoiceId)) === -1) ||
      false,
    [invoices.result, state.invoicesIds]
  );
  const getIsSelected = useCallback(
    (row) =>
      state.invoicesIds && state.invoicesIds.findIndex((item) => item === row.invoiceId) !== -1,
    [state.invoicesIds]
  );

  const GetInvoicesIdAPI = useCallback(async (InvoicesId) => {
    const res = await GetInvoicesById(InvoicesId);
    if (!(res && res.status && res.status !== 200)) setActiveItem(res);
    else
      setActiveItem(null);
  }, []);

  const tableActionClicked = useCallback(
    (actionEnum, item, focusedRow, event) => {
      event.stopPropagation();
      event.preventDefault();
      setActiveItem(item);
      setactiveItemid(item.invoiceId);
      GetInvoicesIdAPI(item.invoiceId);
      if (actionEnum === TableActions.addPrimaryText.key) {
        onStateChanged('invoicesIds', [item.invoiceId]);
        onSelectedChanged('invoicesIds', [item]);
        setTotalAmountPaid([item.amountPaid]);
        if (!item.invoiceStatus)
          setOpenDialog(true);
        else
          setOpenInvoicesTransactionDialog(true);
      } else if (actionEnum === TableActions.editText.key) {
        if (!item.invoiceStatus) {
          if (item.operationType === UnitsOperationTypeEnum.sale.key) {
            setIsSale(true);
            setOpenInvoiceEditDialog(true);
          } else
            if (item.operationType === UnitsOperationTypeEnum.rent.key) {
              setIsSale(false);
              setOpenInvoiceEditDialog(true);
            } else
              if (item.operationType === UnitsOperationTypeEnum.rentAndSale.key) {
                setIsSale(false);
                setIsSaleAndRent(true);
                setOprationTypeValue((item.invoiceContactType === 'Tenant' || item.invoiceContactType === 'Landlord') ? 431 : 430);
              }
        } else setOpenInvoicesTransactionDialog(true);
      } else if (actionEnum === TableActions.transactionText.key) {
        if (item.operationType === UnitsOperationTypeEnum.sale.key) {
          dispatch(ActiveItemActions.activeItemRequest(item));
          setIsSale(true);
          GlobalHistory.push(`/home/units-sales/unit-profile-reservation?id=${item.unitId}`);
        } else if (item.operationType === UnitsOperationTypeEnum.rent.key)
          GlobalHistory.push(`/home/units-lease/unit-profile-reservation?id=${item.unitId}`);
        else if (item.operationType === UnitsOperationTypeEnum.rentAndSale.key)
          GlobalHistory.push(`/home/units-lease/unit-profile-reservation?id=${item.unitId}`);
      }
    },
    [GetInvoicesIdAPI, onSelectedChanged, onStateChanged, setOpenDialog, setTotalAmountPaid]
  );

  const onSelectClicked = useCallback(
    (row) => {
      const itemIndex = state.invoicesIds ?
        state.invoicesIds.findIndex((item) => item === row.invoiceId) :
        -1;
      if (itemIndex !== -1) {
        state.invoicesIds.splice(itemIndex, 1);
        selected.invoicesIds.splice(itemIndex, 1);
        totalAmountPaid.splice(itemIndex, 1);
      } else {
        state.invoicesIds.push(row.invoiceId);
        selected.invoicesIds.push(row);
        totalAmountPaid.push(row.amountPaid);
      }
      onStateChanged('invoicesIds', state.invoicesIds);
      onSelectedChanged('invoicesIds', selected.invoicesIds);
      setTotalAmountPaid(totalAmountPaid);
    },
    [
      onSelectedChanged,
      onStateChanged,
      selected.invoicesIds,
      totalAmountPaid,
      setTotalAmountPaid,
      state.invoicesIds,
    ]
  );
  const onSelectAllClicked = () => {
    if (!getIsSelectedAll()) {
      invoices.result.map((item) => {
        if (!getIsSelected(item)) {
          state.invoicesIds.push(item.invoiceId);
          selected.invoicesIds.push(item);
          totalAmountPaid.push(item.amountPaid);
        }
      });
    } else {
      invoices.result.map((item) => {
        if (getIsSelected(item)) {
          const isSelectedIndex = state.invoicesIds.findIndex(
            (element) => element === item.invoiceId
          );
          if (isSelectedIndex !== -1) {
            state.invoicesIds.splice(isSelectedIndex, 1);
            selected.invoicesIds.splice(isSelectedIndex, 1);
            totalAmountPaid.splice(isSelectedIndex, 1);
          }
        }
      });
    }
    onStateChanged('invoicesIds', state.invoicesIds);
    onSelectedChanged('invoicesIds', selected.invoicesIds);
    setTotalAmountPaid(totalAmountPaid);
  };
  return (
    <div>
      <Tables
        data={invoices.result}
        headerData={InvoicesHeaderData()}
        defaultActions={[
          {
            enum: TableActions.addPrimaryText.key,
          },
          {
            enum: TableActions.editText.key
          },

          {
            enum: TableActions.transactionText.key,
          },
        ]}
        selectAllOptions={{
          getIsSelected,
          onSelectClicked,
          disabledRows: [],
          onSelectAllClicked,
          withCheckAll: true,
          totalAmountPaid: state.invoicesIds,
          isSelectAll: getIsSelectedAll(),
        }}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
        actionsOptions={{
          onActionClicked: tableActionClicked,
        }}
        setSortBy={setSortBy}
        activePage={filter.pageIndex}
        itemsPerPage={filter.pageSize}
        totalItems={invoices.totalCount}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
       // isWithCheckboxColumn
      />
      <InvoicesTransaction
        open={openInvoicesTransactionDialog}
        close={() => {
          setOpenInvoicesTransactionDialog(false);
        }}
        activeItem={activeItemid}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
      />
      {openInvoiceEditDialog && isSale && (
        <InvoiceEditDialog
          currentOperationType={UnitsOperationTypeEnum.sale.key}
          effectedByNumber={activeItem && activeItem.sellingPrice}
          effectedByName='selling-price'
          totalInvoicesLength={(state.invoicesIds && state.invoicesIds.length) || 0}
          activeItem={activeItem}
          isOpen={openInvoiceEditDialog}
          reloadData={() => {
            setOpenInvoiceEditDialog(false);
            setActiveItem(null);
            onFilterChange((item) => ({ ...item, pageIndex: 0 }));
          }}
          isOpenChanged={() => {
            setOpenInvoiceEditDialog(false);
            setActiveItem(null);
          }}
        />
      )}

      {openInvoiceEditDialog && !isSale && (
        <InvoiceEditDialog
          currentOperationType={UnitsOperationTypeEnum.rent.key}
          effectedByNumber={activeItem && activeItem.rentPerYear}
          effectedByName='rent-per-year'
          totalInvoicesLength={(state.invoicesIds && state.invoicesIds.length) || 0}
          activeItem={activeItem}
          isOpen={openInvoiceEditDialog}
          reloadData={() => {
            setOpenInvoiceEditDialog(false);
            setActiveItem(null);
            onFilterChange((item) => ({ ...item, pageIndex: 0 }));
          }}
          isOpenChanged={() => {
            setOpenInvoiceEditDialog(false);
            setActiveItem(null);
          }}
        />
      )}
      {!isSale && isSaleAndRent && (
        <InvoiceEditDialog
          currentOperationType={oprationTypeValue}
          effectedByNumber={activeItem && activeItem.rentPerYear}
          effectedByName={oprationTypeValue === 430 ? 'selling-price' : 'rent-per-year'}
          totalInvoicesLength={(state.invoicesIds && state.invoicesIds.length) || 0}
          activeItem={activeItem}
          isOpen={isSaleAndRent}
          reloadData={() => {
            setIsSaleAndRent(false);
            setActiveItem(null);
            onFilterChange((item) => ({ ...item, pageIndex: 0 }));
          }}
          isOpenChanged={() => {
            setIsSaleAndRent(false);
            setActiveItem(null);
          }}
        />
      )}

    </div>
  );
};

InvoiceViewTable.propTypes = {
  setOpenDialog: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  totalAmountPaid: PropTypes.number.isRequired,
  onSelectedChanged: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  setTotalAmountPaid: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  invoices: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  isWithCheckboxColumn: PropTypes.bool.isRequired,
};
