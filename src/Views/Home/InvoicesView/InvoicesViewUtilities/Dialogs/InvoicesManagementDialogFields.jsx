import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { PaymentModeId } from '../../../../../Enums';
import { AutocompleteComponent, DatePickerComponent, Inputs } from '../../../../../Components';

export const InvoicesManagementDialogFields = ({
  data,
  state,
  loadings,
  selected,
  searchTimer,
  onFilterChange,
  onStateChanged,
  translationPath,
  onSelectedChanged,
  setTotalAmountPaid,
  onPaymentModeChange,
  parentTranslationPath,
}) => (
  <div className='quotations-management-dialog'>
    <div className='dialog-item'>
      <Inputs
        isDisabled
        inputPlaceholder='auto'
        labelValue='receipt-no'
        idRef='portfolioNameRef'
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
      />
    </div>
    <div className='dialog-item'>
      <AutocompleteComponent
        multiple={false}
        withoutSearchButton
        labelValue='payment-mode'
        idRef='propertyManagersRef'
        data={data.paymentModeId || []}
        translationPath={translationPath}
        isLoading={loadings.paymentModeId}
        selectedValues={selected.paymentModeId}
        parentTranslationPath={parentTranslationPath}
        displayLabel={(option) => option.lookupItemName || ''}
        onChange={(event, newValue) => onPaymentModeChange(newValue)}
      />
    </div>
    <div className='dialog-item'>
      <AutocompleteComponent
        multiple
        idRef='invoicesRef'
        withoutSearchButton
        labelValue='invoices'
        data={data.invoicesIds || []}
        isLoading={loadings.invoicesIds}
        translationPath={translationPath}
        selectedValues={selected.invoicesIds}
        parentTranslationPath={parentTranslationPath}
        chipsLabel={(option) => `Invoice #${option.invoiceId}` || ''}
        displayLabel={(option) => `Invoice #${option.invoiceId}` || ''}
        onInputKeyUp={(e) => {
          const { value } = e.target;
          if (searchTimer.current) clearTimeout(searchTimer.current);
          searchTimer.current = setTimeout(() => {
            onFilterChange(value);
          }, 700);
        }}
        onChange={(event, newValue) => {
          onStateChanged('invoicesIds', newValue && newValue.map((item) => item.invoiceId));
          onSelectedChanged('invoicesIds', newValue);
          setTotalAmountPaid(newValue && newValue.map((item) => item.amountPaid));
        }}
      />
    </div>
    <div className='dialog-item'>
      <Inputs
        min={0}
        type='number'
       // withNumberFormat
        labelValue='net-amount'
        idRef='managementFeeRef'
        value={state.netAmount || ''}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        onInputChanged={(event) => onStateChanged('netAmount', +event.target.value)}
      />
    </div>
    {state.paymentModeId === PaymentModeId.bankTransfer && (
      <div className='dialog-item'>
        <Inputs
          min={0}
          type='number'
          labelValue='bank-transfer-no'
          translationPath={translationPath}
          idRef='managementFeePercentageRef'
          value={state.bankTransferNo || ''}
          parentTranslationPath={parentTranslationPath}
          onInputChanged={(event) => onStateChanged('bankTransferNo', event.target.value)}
        />
      </div>
    )}
    {state.paymentModeId === PaymentModeId.cheque && (
      <div className='dialog-item'>
        <Inputs
          min={0}
          type='number'
          labelValue='cheque-no'
          translationPath={translationPath}
          idRef='managementFeePercentageRef'
          value={state.chequeNo || ''}
          parentTranslationPath={parentTranslationPath}
          onInputChanged={(event) => onStateChanged('chequeNo', event.target.value)}
        />
      </div>
    )}
    {state.paymentModeId === PaymentModeId.creditCard && (
      <div className='dialog-item'>
        <Inputs
          min={0}
          type='number'
          labelValue='credit-card-no'
          translationPath={translationPath}
          idRef='managementFeePercentageRef'
          value={state.creditCardNo || ''}
          parentTranslationPath={parentTranslationPath}
          onInputChanged={(event) => onStateChanged('creditCardNo', event.target.value)}
        />
      </div>
    )}
    {state.paymentModeId === PaymentModeId.draft && (
      <div className='dialog-item'>
        <Inputs
          min={0}
          type='number'
          labelValue='draft-no'
          translationPath={translationPath}
          idRef='managementFeePercentageRef'
          value={state.draftNo || ''}
          parentTranslationPath={parentTranslationPath}
          onInputChanged={(event) => onStateChanged('draftNo', event.target.value)}
        />
      </div>
    )}
    {state.paymentModeId === PaymentModeId.depositBond && (
      <div className='dialog-item'>
        <Inputs
          min={0}
          type='number'
          labelValue='bond-details'
          translationPath={translationPath}
          idRef='managementFeePercentageRef'
          value={state.bondDetails || ''}
          parentTranslationPath={parentTranslationPath}
          onInputChanged={(event) => onStateChanged('bondDetails', event.target.value)}
        />
      </div>
    )}
    {state.paymentModeId === PaymentModeId.bankDeposit && (
      <div className='dialog-item'>
        <Inputs
          min={0}
          type='number'
          labelValue='deposit-no'
          translationPath={translationPath}
          idRef='managementFeePercentageRef'
          value={state.depositNo || ''}
          parentTranslationPath={parentTranslationPath}
          onInputChanged={(event) => onStateChanged('bankTransferNo', event.target.value)}
        />
      </div>
    )}
    {state.paymentModeId !== PaymentModeId.cash && state.paymentModeId !== null && (
      <>
        <div className='dialog-item'>
          <AutocompleteComponent
            multiple={false}
            labelValue='bank'
            withoutSearchButton
            data={data.bankId || []}
            idRef='propertyManagersRef'
            isLoading={loadings.bankId}
            selectedValues={selected.bankId}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            displayLabel={(option) => option.lookupItemName || ''}
            onChange={(event, newValue) => {
              onStateChanged('bankId', newValue && newValue.lookupItemId);
              onSelectedChanged('bankId', newValue);
            }}
          />
        </div>
        <div className='dialog-item'>
          <Inputs
            labelValue='branch'
            value={state.branch || ''}
            translationPath={translationPath}
            idRef='managementFeePercentageRef'
            parentTranslationPath={parentTranslationPath}
            onInputChanged={(event) => onStateChanged('branch', event.target.value)}
          />
        </div>
      </>
    )}
    <div className='dialog-item'>
      <AutocompleteComponent
        multiple={false}
        withoutSearchButton
        labelValue='contact-type'
        idRef='propertyManagersRef'
        translationPath={translationPath}
        data={data.receiptContactTypeId || []}
        isLoading={loadings.receiptContactTypeId}
        parentTranslationPath={parentTranslationPath}
        selectedValues={selected.receiptContactTypeId}
        displayLabel={(option) => option.lookupItemName || ''}
        onChange={(event, newValue) => {
          onStateChanged('receiptContactTypeId', newValue && newValue.lookupItemId);
          onSelectedChanged('receiptContactTypeId', newValue);
        }}
      />
    </div>
    <div className='dialog-item'>
      <DatePickerComponent
        labelValue='date'
        value={state.date}
        idRef='statusDateRef'
        placeholder='DD/MM/YYYY'
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        onDateChanged={(newValue) =>
          onStateChanged('date', (newValue && moment(newValue).format()) || null)}
      />
    </div>
    <div className='dialog-item w-100'>
      <Inputs
        rows={4}
        multiline
        labelValue='remarks'
        value={state.remarks || ''}
        translationPath={translationPath}
        idRef='managementFeePercentageRef'
        parentTranslationPath={parentTranslationPath}
        onInputChanged={(event) => onStateChanged('remarks', event.target.value)}
      />
    </div>
  </div>
);
InvoicesManagementDialogFields.propTypes = {
  translationPath: PropTypes.string,
  loadings: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string,
  onStateChanged: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  onSelectedChanged: PropTypes.func.isRequired,
  setTotalAmountPaid: PropTypes.func.isRequired,
  onPaymentModeChange: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  searchTimer: PropTypes.instanceOf(Object).isRequired,
};
InvoicesManagementDialogFields.defaultProps = {
  translationPath: '',
  parentTranslationPath: '',
};
