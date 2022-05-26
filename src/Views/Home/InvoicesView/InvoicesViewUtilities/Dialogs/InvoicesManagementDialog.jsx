import React, {
 useCallback, useReducer, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../../Components';
import { lookupItemsGetId, CreateInvoicesReceipt, GetInvoices } from '../../../../../Services';
import { showError, showSuccess } from '../../../../../Helper';
import { InvoicesManagementDialogFields } from './InvoicesManagementDialogFields';
import { BankAccount, ContactTypeIdEnum, PaymentModeId } from '../../../../../Enums';

export const InvoicesManagementDialog = ({
  open,
  close,
  state,
  onSave,
  selected,
  onStateChanged,
  translationPath,
  onSelectedChanged,
  setTotalAmountPaid,
  parentTranslationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const searchTimer = useRef(null);
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
    search: '',
  });
  const reducer = useCallback((itemsState, action) => {
    if (action.id !== 'edit') return { ...itemsState, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [data, setData] = useReducer(reducer, {
    bankId: [],
    invoicesIds: [],
    paymentModeId: [],
    receiptContactTypeId: [],
  });
  const [loadings, setLoadings] = useReducer(reducer, {
    bankId: false,
    invoicesIds: false,
    paymentModeId: false,
    receiptContactTypeId: false,
  });
  const onFilterChange = (value) => {
    setFilter({ ...filter, search: value });
  };
  const onPaymentModeChange = (newValue) => {
    onStateChanged('draftNo', null);
    onStateChanged('chequeNo', null);
    onStateChanged('bondDetails', null);
    onStateChanged('creditCardNo', null);
    onStateChanged('bankTransferNo', null);
    onSelectedChanged('paymentModeId', newValue);
    onStateChanged('paymentModeId', newValue && newValue.lookupItemId);
    if (state.paymentModeId === PaymentModeId.cash || state.paymentModeId === null) {
      onStateChanged('bankId', null);
      onStateChanged('branch', null);
      onSelectedChanged('bankId', null);
    }
  };
  const getAllBanks = useCallback(async () => {
    setLoadings({ id: 'bankId', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: BankAccount.Babk.value });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'bankId', value: res });
    else setData({ id: 'bankId', value: [] });
    setLoadings({ id: 'bankId', value: false });
  }, []);
  const getAllPaymentModes = useCallback(async () => {
    setLoadings({ id: 'paymentModeId', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: PaymentModeId.lookupTypeId });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'paymentModeId', value: res });
    else setData({ id: 'paymentModeId', value: [] });
    setLoadings({ id: 'paymentModeId', value: false });
  }, []);
  const getAllInvoiceContactTypes = useCallback(async () => {
    setLoadings({ id: 'receiptContactTypeId', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: ContactTypeIdEnum.lookupTypeId });
    if (!(res && res.status && res.status !== 200))
      setData({ id: 'receiptContactTypeId', value: res });
    else setData({ id: 'receiptContactTypeId', value: [] });
    setLoadings({ id: 'receiptContactTypeId', value: false });
  }, []);
  const getAllInvoices = useCallback(async () => {
    setLoadings({ id: 'invoicesIds', value: true });
    const res = await GetInvoices(filter);
    if (!(res && res.status && res.status !== 200))
      setData({ id: 'invoicesIds', value: res.result });
    else setData({ id: 'invoicesIds', value: [] });
    setLoadings({ id: 'invoicesIds', value: false });
  }, [filter]);
  useEffect(() => {
    getAllBanks();
    getAllPaymentModes();
    getAllInvoiceContactTypes();
  }, [getAllBanks, getAllInvoiceContactTypes, getAllPaymentModes]);
  useEffect(() => {
    getAllInvoices();
  }, [getAllInvoices]);
  const saveHandler = useCallback(async () => {
    const res = await CreateInvoicesReceipt(state);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t(`${translationPath}receipt-created-successfully`));
      onSave();
    } else showError(t(`${translationPath}receipt-create-failed`));
  }, [onSave, state, t, translationPath]);
  return (
    <DialogComponent
      saveText='save'
      saveType='button'
      titleText='receipt-details'
      dialogContent={(
        <InvoicesManagementDialogFields
          data={data}
          state={state}
          loadings={loadings}
          selected={selected}
          searchTimer={searchTimer}
          onStateChanged={onStateChanged}
          onFilterChange={onFilterChange}
          translationPath={translationPath}
          onSelectedChanged={onSelectedChanged}
          setTotalAmountPaid={setTotalAmountPaid}
          onPaymentModeChange={onPaymentModeChange}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      isOpen={open}
      onCloseClicked={close}
      onCancelClicked={close}
      onSaveClicked={saveHandler}
      translationPath={translationPath}
      parentTranslationPath={parentTranslationPath}
      saveClasses='btns theme-solid bg-primary w-100 mx-2 mb-2'
    />
  );
};
InvoicesManagementDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string,
  onStateChanged: PropTypes.func.isRequired,
  onSelectedChanged: PropTypes.func.isRequired,
  setTotalAmountPaid: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
};
InvoicesManagementDialog.defaultProps = {
  parentTranslationPath: '',
  translationPath: '',
};
