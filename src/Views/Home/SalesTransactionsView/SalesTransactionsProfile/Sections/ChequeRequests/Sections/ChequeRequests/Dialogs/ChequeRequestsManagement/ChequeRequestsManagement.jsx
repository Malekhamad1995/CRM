import React, {
 useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import {
  DatePickerComponent,
  DialogComponent,
  Inputs,
  Spinner,
} from '../../../../../../../../../../Components';
import {
  Banks,
  ChequeType,
  ChequeStatus,
} from '../../../../../../../../../../assets/json/StaticLookupsIds.json';
import {
  UpdateUnitTransactionChequeRequest,
  CreateUnitTransactionChequeRequest,
} from '../../../../../../../../../../Services';
import {
  floatHandler,
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../../../../../Helper';
import { ChequeLookupsAutocomplete } from './Controls';
import moment from 'moment';

export const ChequeRequestsManagementDialog = ({
  unitTransactionId,
  activeItem,
  reloadData,
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selected, setSelected] = useReducer(reducer, {
    bank: null,
    chequeType: null,
    status: null,
  });
  const [state, setState] = useReducer(reducer, {
    unitTransactionId,
    bankId: null,
    branchDetails: null,
    accountName: null,
    amount: null,
    chequeNumber: null,
    chequeTypeId: null,
    statusId: null,
    date: null,
    remarks: null,
  });
  const schema = Joi.object({
    bankId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}bank-is-required`),
        'number.empty': t(`${translationPath}bank-is-required`),
      }),
    statusId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}status-is-required`),
        'number.empty': t(`${translationPath}status-is-required`),
      }),
    accountName: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}account-name-is-required`),
        'string.empty': t(`${translationPath}account-name-is-required`),
      }),
      amount: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}amount-is-required`),
        'string.empty': t(`${translationPath}amount-is-required`),
      }),
      date: Joi.date()
      .required()
      .messages({
        'date.base': t(`${translationPath}date-is-required`),
        'date.empty': t(`${translationPath}date-is-required`),
      }),

  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const onSelectedChanged = (newValue) => {
    setSelected(newValue);
  };
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;

    }
    setIsLoading(true);
    const res =
      (activeItem &&
        (await UpdateUnitTransactionChequeRequest(
          activeItem.transactionChequeRequestId,
          state
        ))) ||
      (await CreateUnitTransactionChequeRequest(state));
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      if (activeItem)
        showSuccess(t`${translationPath}cheque-request-updated-successfully`);
      else
        showSuccess(t`${translationPath}cheque-request-created-successfully`);
      reloadData();
    } else if (activeItem)
      showError(t(`${translationPath}cheque-request-update-failed`));
    else showError(t`${translationPath}cheque-request-create-failed`);
  };

  useEffect(() => {
    if (activeItem) {
      setState({
        id: 'edit',
        value: {
          unitTransactionId,
          bankId: activeItem.bankId || null,
          branchDetails: activeItem.branchDetails || null,
          accountName: activeItem.accountName || null,
          amount: activeItem.amount || null,
          chequeNumber: activeItem.chequeNumber || null,
          chequeTypeId: activeItem.chequeTypeId || null,
          date: activeItem.date || null,
          remarks: activeItem.remarks || null,
          statusId: activeItem.statusId || null,
        },
      });
    }
  }, [activeItem, unitTransactionId]);
  return (
    <DialogComponent
      titleText={(activeItem && 'edit-cheque-request') || 'add-cheque-request'}
      saveText={(activeItem && 'edit-cheque-request') || 'add-cheque-request'}
      dialogContent={(
        <div className='cheque-requests-management-dialog'>
          <Spinner isActive={isLoading} isAbsolute />
          <div className='dialog-item'>
            <ChequeLookupsAutocomplete
              idRef='bankIdRef'
              labelValue='bank'
              labelClasses='Requierd-Color'
              selectedValue={selected.bank}
              stateValue={state.bankId}
              schema={schema}
              lookupTypeId={Banks}
              isSubmitted={isSubmitted}
              stateKey='bankId'
              selectedKey='bank'
              onSelectedChanged={onSelectedChanged}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
          <div className='dialog-item'>
            <Inputs
              idRef='branchDetailsRef'
              labelValue='branch-details'
              value={state.branchDetails || ''}
              helperText={getErrorByName(schema, 'branchDetails').message}
              error={getErrorByName(schema, 'branchDetails').error}
              isWithError
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                setState({ id: 'branchDetails', value: event.target.value });
              }}
            />
          </div>
          <div className='dialog-item'>
            <Inputs
              idRef='accountNameRef'
              labelValue='account-name'
              labelClasses='Requierd-Color'
              value={state.accountName || ''}
              helperText={getErrorByName(schema, 'accountName').message}
              error={getErrorByName(schema, 'accountName').error}
              isWithError
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                setState({ id: 'accountName', value: event.target.value });
              }}
            />
          </div>
          <div className='dialog-item'>
            <Inputs
              idRef='chequeNumberRef'
              labelValue='cheque-no'
              value={state.chequeNumber || ''}
              helperText={getErrorByName(schema, 'chequeNumber').message}
              error={getErrorByName(schema, 'chequeNumber').error}
              isWithError
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                setState({ id: 'chequeNumber', value: event.target.value });
              }}
            />
          </div>
          <div className='dialog-item'>
            <Inputs
              idRef='amountRef'
              labelValue='amount'
              labelClasses='Requierd-Color'
              value={state.amount || ''}
              helperText={getErrorByName(schema, 'amount').message}
              error={getErrorByName(schema, 'amount').error}
              isWithError
              type='number'
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                const value = floatHandler(event.target.value, 3);
                setState({ id: 'amount', value });
              }}
            />
          </div>
          <div className='dialog-item'>
            <ChequeLookupsAutocomplete
              idRef='chequeTypeIdRef'
              labelValue='cheque-type'
              selectedValue={selected.chequeType}
              stateValue={state.chequeTypeId}
              schema={schema}
              lookupTypeId={ChequeType}
              isSubmitted={isSubmitted}
              stateKey='chequeTypeId'
              selectedKey='chequeType'
              onSelectedChanged={onSelectedChanged}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
          <div className='dialog-item'>
            <ChequeLookupsAutocomplete
              idRef='statusIdRef'
              labelValue='status'
              labelClasses='Requierd-Color'
              selectedValue={selected.status}
              stateValue={state.statusId}
              schema={schema}
              lookupTypeId={ChequeStatus}
              isSubmitted={isSubmitted}
              stateKey='statusId'
              selectedKey='status'
              onSelectedChanged={onSelectedChanged}
              onStateChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
          <div className='dialog-item'>
            <DatePickerComponent
              idRef='dateRef'
              labelValue='date'
              labelClasses='Requierd-Color'
              placeholder='DD/MM/YYYY'
              value={state.date}
              helperText={getErrorByName(schema, 'date').message}
              error={getErrorByName(schema, 'date').error}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onDateChanged={(newValue) => {
                setState({ id: 'date', value: (newValue && moment(newValue).format()) || null
              });
              }}
            />
          </div>
          <div className='dialog-item'>
            <Inputs
              idRef='remarksRef'
              labelValue='remarks'
              value={state.remarks || ''}
              helperText={getErrorByName(schema, 'remarks').message}
              error={getErrorByName(schema, 'remarks').error}
              isWithError
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                setState({ id: 'remarks', value: event.target.value });
              }}
            />
          </div>
        </div>
      )}
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

ChequeRequestsManagementDialog.propTypes = {
  unitTransactionId: PropTypes.number.isRequired,
  activeItem: PropTypes.instanceOf(Object),
  reloadData: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ChequeRequestsManagementDialog.defaultProps = {
  activeItem: null,
};
