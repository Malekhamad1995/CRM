import React, {
  useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';
import { Object } from 'core-js';
import { CreateInvoice, EditInvoice, lookupItemsGetId } from '../../../../../../Services';
import {
  Banks,
  PaymentType,
  PaymentMode,
  ContactTypes,
} from '../../../../../../assets/json/StaticLookupsIds.json';
import {
  AutocompleteComponent,
  DatePickerComponent,
  DialogComponent,
  Inputs,
  RadiosGroupComponent,
  Spinner,
} from '../../../../../../Components';
import {
  floatHandler,
  getErrorByName,
  GetParams,
  showError,
  showSuccess,
} from '../../../../../../Helper';
import { PaymentModesEnum, UnitsOperationTypeEnum } from '../../../../../../Enums';

export const InvoiceManagementDialog = ({
  currentOperationType,
  effectedByNumber,
  effectedByName,
  totalInvoicesLength,
  activeItem,
  isOpen,
  reloadData,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState({
    paymentType: null,
    paymentMode: null,
    contactType: null,
    bank: null,
  });
  const [loadings, setLoadings] = useState({
    paymentTypes: false,
    paymentModes: false,
    contactTypes: false,
    banks: false,
  });
  // const [filter] = useState({
  //   pageIndex: 1,
  //   pageSize: 10,
  // });
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [state, setState] = useReducer(reducer, {
    unitId: null,
    paymentNo: totalInvoicesLength + 1,
    amountExTax: 0,
    paymentTypeId: null,
    paymentModeId: null,
    invoiceContactTypeId: null,
    tax: 0,
    taxPercentage: 0,
    amountDue: 0,
    amountDuePercentage: 0,
    remarks: null,
    dueOn: null,
    invoiceStatus: false,
    depositSlipNumber: null,
    chequeNo: null,
    bankId: null,
    branch: null,
    bondDetails: null,
    draftNo: null,
    creditCardNo: null,
    bankTransferNo: null,
    depositNo: null,
  });
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [contactTypes, setContactTypes] = useState([]);
  const [banks, setBanks] = useState([]);
  const schema = Joi.object({
    paymentTypeId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}payment-type-is-required`),
      }),
    paymentModeId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}payment-mode-is-required`),
      }),
    amountDue: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}amount-due-is-required`),
      }),
    dueOn: Joi.any()
      .custom((value, helpers) => {
        if (!value) return helpers.error('state.dateRequired');
        return value;
      })
      .messages({
        'state.dateRequired': t(`${translationPath}due-on-is-required`),
      }),
    invoiceContactTypeId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}contact-type-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const getAllPaymentTypes = useCallback(async () => {
    setLoadings((items) => ({ ...items, paymentTypes: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: PaymentType,
    });
    if (!(res && res.status && res.status !== 200)) setPaymentTypes(res || []);
    else setPaymentTypes([]);
    setLoadings((items) => ({ ...items, paymentTypes: false }));
  }, []);
  const getAllBanks = useCallback(async () => {
    setLoadings((items) => ({ ...items, banks: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: Banks,
    });
    if (!(res && res.status && res.status !== 200)) setBanks(res || []);
    else setBanks([]);
    setLoadings((items) => ({ ...items, banks: false }));
  }, []);
  const getAllPaymentModes = useCallback(async () => {
    setLoadings((items) => ({ ...items, paymentModes: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: PaymentMode,
    });
    if (!(res && res.status && res.status !== 200)) setPaymentModes(res || []);
    else setPaymentModes([]);
    setLoadings((items) => ({ ...items, paymentModes: false }));
  }, []);
  const getAllContactTypes = useCallback(async () => {
    setLoadings((items) => ({ ...items, contactTypes: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: ContactTypes,
      lookupParentId: currentOperationType,
    });
    if (!(res && res.status && res.status !== 200)) setContactTypes(res || []);
    else setContactTypes([]);
    setLoadings((items) => ({ ...items, contactTypes: false }));
  }, [currentOperationType]);

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    const res =
      (activeItem && activeItem.invoiceId && (await EditInvoice(activeItem.invoiceId, state))) ||
      (await CreateInvoice(state));
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      if (activeItem && activeItem.invoiceId)
        showSuccess(t`${translationPath}invoice-updated-successfully`);
      else showSuccess(t`${translationPath}invoice-created-successfully`);
      reloadData({
        ...state,
        ...selected,
        invoiceId: (res && res.invoiceId) || null,
        paymentNo: (res && res.paymentNo) || null,
      });
    } else if (activeItem && activeItem.invoiceId) showError(t(`${translationPath}invoice-update-failed`));
    else showError(t`${translationPath}invoice-create-failed`);
  };
  const clearEffectedFieldsByPaymentMode = (newValue) => {
    if (
      !(
        newValue === PaymentModesEnum.Cheque.key ||
        newValue === PaymentModesEnum.BankTransfer.key ||
        newValue === PaymentModesEnum.BankDeposit.key ||
        newValue === PaymentModesEnum.Draft.key ||
        newValue === PaymentModesEnum.CreditCard.key
      )
    ) {
      if (state.bankId) {
        setState({ id: 'bankId', value: null });
        setSelected((items) => ({ ...items, bank: null }));
      }
      if (state.branch) setState({ id: 'branch', value: null });
    }
    if (state.bondDetails && newValue !== PaymentModesEnum.DepositBond.key)
      setState({ id: 'bondDetails', value: null });
    if (state.draftNo && newValue !== PaymentModesEnum.Draft.key)
      setState({ id: 'draftNo', value: null });
    if (state.bankTransferNo && newValue !== PaymentModesEnum.BankTransfer.key)
      setState({ id: 'bankTransferNo', value: null });
    if (state.depositNo && newValue !== PaymentModesEnum.BankDeposit.key)
      setState({ id: 'depositNo', value: null });
    if (state.depositSlipNumber && newValue !== PaymentModesEnum.Cash.key)
      setState({ id: 'depositSlipNumber', value: null });
  };

  useEffect(() => {
    getAllPaymentTypes();
    getAllPaymentModes();
    getAllContactTypes();
    getAllBanks();
  }, [getAllBanks, getAllContactTypes, getAllPaymentModes, getAllPaymentTypes]);
  useEffect(() => {
    const unitId = GetParams('id');
    if (unitId) setState({ id: 'unitId', value: unitId });
    else if (isOpenChanged) isOpenChanged();
  }, [isOpenChanged]);

  useEffect(() => {
    if (activeItem === undefined || activeItem === null) return;
    const currntState = {
      paymentNo: activeItem.paymentNo,
      amountExTax: activeItem.amountExTax,
      paymentTypeId: activeItem.paymentTypeId,
      paymentModeId: activeItem.paymentModeId,
      invoiceContactTypeId: activeItem.invoiceContactTypeId,
      tax: activeItem.tax,
      taxPercentage: activeItem.taxPercentage,
      amountDue: activeItem.amountDue,
      amountDuePercentage: activeItem.amountDuePercentage,
      remarks: activeItem.remarks,
      dueOn: activeItem.dueOn,
      invoiceStatus: activeItem.invoiceStatus,
      depositSlipNumber: activeItem.depositSlipNumber,
      chequeNo: activeItem.chequeNo,
      bankId: activeItem.bankId,
      branch: activeItem.branch,
      bondDetails: activeItem.bondDetails,
      draftNo: activeItem.draftNo,
      creditCardNo: activeItem.creditCardNo,
      bankTransferNo: activeItem.bankTransferNo,
      depositNo: activeItem.depositNo,
    };
    setState({ id: 'edit', value: currntState });
    setSelected({
      ...selected,
      paymentType: activeItem.paymentType,
      paymentMode: activeItem.paymentMode,
      contactType: activeItem.contactType,
      bank: activeItem.bank
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem]);
  return (
    <DialogComponent
      titleText={(activeItem && 'edit-invoice') || 'add-invoice'}
      saveText={(activeItem && 'edit-invoice') || 'add-invoice'}
      dialogContent={(
        <div className='invoice-management-dialog view-wrapper'>
          <Spinner isActive={isLoading} isAbsolute />
          <div className='d-flex-v-center-h-end'>
            <span>{t(`${translationPath}${effectedByName}`)}</span>
            <span>:</span>
            <span className='px-1'>{effectedByNumber}</span>
          </div>
          <div className='form-item'>
            <Inputs
              idRef='paymentNoRef'
              labelValue='payment-number'
              value={state.paymentNo || ''}
              isWithError
              isSubmitted={isSubmitted}
              isDisabled
              helperText={getErrorByName(schema, 'paymentNo').message}
              error={getErrorByName(schema, 'paymentNo').error}
              onInputChanged={(event) => setState({ id: 'paymentNo', value: event.target.value })}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
          </div>
          <div className='form-item'>
            <Inputs
              idRef='amountExTaxRef'
              labelValue='amount-ex-tax'
              value={state.amountExTax || 0}
              helperText={getErrorByName(schema, 'amountExTax').message}
              error={getErrorByName(schema, 'amountExTax').error}
              endAdornment={<span className='px-2'>AED</span>}
              type='number'
              min={0}
              isWithError
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                let value = +floatHandler(event.target.value, 3);
                if (value > effectedByNumber)
                  value = +effectedByNumber;
                const amountDue = +(value + state.tax);
                const amountDuePercentage = +(amountDue / effectedByNumber) * 100;
                const taxPercentageValue = value ? ((state.tax) / value) * 100 : 0;

                setState({
                  id: 'edit',
                  value: {
                    ...state,
                    amountExTax: value,
                    amountDue,
                    amountDuePercentage,
                    taxPercentage: +taxPercentageValue

                  },
                });
                // setState({ id: 'amountExTax', value });
              }}
            />
          </div>

          <div className='form-item'>
            <AutocompleteComponent
              idRef='paymentTypeIdRef'
              labelValue='payment-type'
              selectedValues={selected.paymentType}
              multiple={false}
              data={paymentTypes}
              displayLabel={(option) => option.lookupItemName || ''}
              withoutSearchButton
              helperText={getErrorByName(schema, 'paymentTypeId').message}
              error={getErrorByName(schema, 'paymentTypeId').error}
              isWithError
              isLoading={loadings.paymentTypes}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onChange={(event, newValue) => {
                setSelected((items) => ({ ...items, paymentType: newValue }));
                setState({
                  id: 'paymentTypeId',
                  value: (newValue && newValue.lookupItemId) || null,
                });
              }}
            />
          </div>
          <div className='form-item'>
            <Inputs
              idRef='taxRef'
              labelValue='tax'
              // labelClasses="has-inside-label"
              value={state.tax || 0}
              helperText={getErrorByName(schema, 'tax').message}
              error={getErrorByName(schema, 'tax').error}
              endAdornment={(
                <div className='d-flex-v-center'>
                  <span className='px-2'>AED</span>
                  <Inputs
                    idRef='taxPercentageRef'
                    // labelValue='of-selling-price'
                    value={state.taxPercentage || 0}
                    helperText={getErrorByName(schema, 'taxPercentage').message}
                    error={getErrorByName(schema, 'taxPercentage').error}
                    endAdornment={<span className='px-2'>%</span>}
                    type='number'
                    // labelClasses="inside-input-label"
                    wrapperClasses='mb-0'
                    min={0}
                    max={100}
                    isWithError
                    isSubmitted={isSubmitted}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    onInputChanged={(event) => {
                      let value = +floatHandler(event.target.value, 3);
                      if (value > 100) value = 100;
                      const taxValue = (value / 100) * state.amountExTax;
                      const amountDueValue = state.amountExTax + taxValue;
                      const amountDuePercentageValue = effectedByNumber ? (amountDueValue / effectedByNumber) * 100 : 0;

                      setState({
                        id: 'edit',
                        value: {
                          ...state,
                          taxPercentage: +value,
                          tax: taxValue,
                          amountDue: amountDueValue,
                          amountDuePercentage: amountDuePercentageValue

                        },
                      });
                    }}
                  />
                </div>
              )}
              type='number'
              min={0}
              max={effectedByNumber || 0}
              isWithError
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                let value = +floatHandler(event.target.value, 3);
                const effectedByValue = +(effectedByNumber || 0);
                if (value > effectedByValue) value = +effectedByValue;
                const effectedValue = +floatHandler((value / effectedByValue) * 100, 3);
                const amountDueValue = +(+value + state.amountExTax);
                const amountDuePercentageValue = +(+(amountDueValue / effectedByNumber) * 100);

                setState({
                  id: 'edit',
                  value: {
                    ...state,
                    tax: value,
                    taxPercentage: state.amountExTax ? (+value / state.amountExTax) * 100 : 0,
                    amountDue: amountDueValue,
                    amountDuePercentage: amountDuePercentageValue,
                  },
                });
              }}
            />
          </div>
          <div className='form-item'>
            <AutocompleteComponent
              idRef='paymentModeIdRef'
              labelValue='payment-mode'
              selectedValues={selected.paymentMode}
              multiple={false}
              data={paymentModes}
              displayLabel={(option) => option.lookupItemName || ''}
              withoutSearchButton
              helperText={getErrorByName(schema, 'paymentModeId').message}
              error={getErrorByName(schema, 'paymentModeId').error}
              isWithError
              isLoading={loadings.paymentModes}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onChange={(event, newValue) => {
                setSelected((items) => ({ ...items, paymentMode: newValue }));
                setState({
                  id: 'paymentModeId',
                  value: (newValue && newValue.lookupItemId) || null,
                });
                clearEffectedFieldsByPaymentMode(newValue && newValue.lookupItemId);
              }}
            />
          </div>
          <div className='form-item'>
            <Inputs
              idRef='amountDueRef'
              labelValue='amount-due'
              isDisabled
              // labelClasses="has-inside-label"
              value={state.amountDue || 0}
              helperText={getErrorByName(schema, 'amountDue').message}
              error={getErrorByName(schema, 'amountDue').error}
              endAdornment={(
                <div className='d-flex-v-center'>
                  <span className='px-2'>AED</span>
                  <Inputs
                    idRef='amountDuePercentageRef'
                    // labelValue='of-selling-price'
                    isDisabled
                    value={state.amountDuePercentage || 0}
                    helperText={getErrorByName(schema, 'amountDuePercentage').message}
                    error={getErrorByName(schema, 'amountDuePercentage').error}
                    endAdornment={<span className='px-2'>%</span>}
                    type='number'
                    // labelClasses="inside-input-label"
                    wrapperClasses='mb-0'
                    min={0}
                    max={100}
                    isWithError
                    isSubmitted={isSubmitted}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    onInputChanged={(event) => {
                      let value = floatHandler(event.target.value, 3);
                      if (value > 100) value = 100;
                      const effectedValue = floatHandler(
                        (+(effectedByNumber || 0) / 100) * value,
                        3
                      );
                      setState({
                        id: 'edit',
                        value: {
                          ...state,
                          amountDuePercentage: value,
                          amountDue: effectedValue,
                        },
                      });
                    }}
                  />
                </div>
              )}
              type='number'
              min={0}
              max={effectedByNumber || 0}
              isWithError
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                let value = floatHandler(event.target.value, 3);
                const effectedByValue = +(effectedByNumber || 0);
                if (value > effectedByValue) value = effectedByValue;
                const effectedValue = floatHandler((value / effectedByValue) * 100, 3);
                setState({
                  id: 'edit',
                  value: {
                    ...state,
                    amountDue: value,
                    amountDuePercentage: effectedValue,
                  },
                });
              }}
            />
          </div>
          <div className='form-item'>
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
          <div className='form-item'>
            <DatePickerComponent
              idRef='dueOnRef'
              labelValue='due-on'
              placeholder='DD/MM/YYYY'
              value={state.dueOn}
              helperText={getErrorByName(schema, 'dueOn').message}
              error={getErrorByName(schema, 'dueOn').error}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onDateChanged={(newValue) => {
                setState({ id: 'dueOn', value: newValue });
              }}
            />
          </div>
          <div className='form-item'>
            <AutocompleteComponent
              idRef='invoiceContactTypeIdRef'
              labelValue='contact-type'
              selectedValues={selected.contactType}
              multiple={false}
              data={contactTypes}
              displayLabel={(option) => option.lookupItemName || ''}
              withoutSearchButton
              helperText={getErrorByName(schema, 'invoiceContactTypeId').message}
              error={getErrorByName(schema, 'invoiceContactTypeId').error}
              isLoading={loadings.contactTypes}
              isWithError
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onChange={(event, newValue) => {
                setSelected((items) => ({ ...items, contactType: newValue }));
                setState({
                  id: 'invoiceContactTypeId',
                  value: (newValue && newValue.lookupItemId) || null,
                });
              }}
            />
          </div>
          <div className='form-item'>
            <RadiosGroupComponent
              idRef='invoiceStatusRef'
              labelValue='invoice-status'
              data={[
                {
                  key: true,
                  value: 'paid',
                },
                {
                  key: false,
                  value: 'unpaid',
                },
              ]}
              value={state.invoiceStatus}
              parentTranslationPath={parentTranslationPath}
              translationPathForData={translationPath}
              translationPath={translationPath}
              labelInput='value'
              valueInput='key'
              onSelectedRadioChanged={(e, newValue) =>
                setState({ id: 'invoiceStatus', value: newValue === 'true' })}
            />
          </div>
          {state.paymentModeId === PaymentModesEnum.Cheque.key && (
            <div className='form-item'>
              <Inputs
                idRef='chequeNoRef'
                labelValue='cheque-no'
                value={state.chequeNo || ''}
                helperText={getErrorByName(schema, 'chequeNo').message}
                error={getErrorByName(schema, 'chequeNo').error}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  setState({ id: 'chequeNo', value: event.target.value });
                }}
              />
            </div>
          )}
          {(state.paymentModeId === PaymentModesEnum.Cheque.key ||
            state.paymentModeId === PaymentModesEnum.BankTransfer.key ||
            state.paymentModeId === PaymentModesEnum.BankDeposit.key ||
            state.paymentModeId === PaymentModesEnum.Draft.key ||
            state.paymentModeId === PaymentModesEnum.CreditCard.key) && (
              <>
                <div className='form-item'>
                  <AutocompleteComponent
                    idRef='bankIdRef'
                    labelValue='bank'
                    selectedValues={selected.bank}
                    multiple={false}
                    data={banks}
                    displayLabel={(option) => option.lookupItemName || ''}
                    withoutSearchButton
                    helperText={getErrorByName(schema, 'bankId').message}
                    error={getErrorByName(schema, 'bankId').error}
                    isLoading={loadings.banks}
                    isWithError
                    isSubmitted={isSubmitted}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    onChange={(event, newValue) => {
                      setSelected((items) => ({ ...items, bank: newValue }));
                      setState({
                        id: 'bankId',
                        value: (newValue && newValue.lookupItemId) || null,
                      });
                    }}
                  />
                </div>
                <div className='form-item'>
                  <Inputs
                    idRef='branchRef'
                    labelValue='branch'
                    value={state.branch || ''}
                    helperText={getErrorByName(schema, 'branch').message}
                    error={getErrorByName(schema, 'branch').error}
                    isWithError
                    isSubmitted={isSubmitted}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    onInputChanged={(event) => {
                      setState({ id: 'branch', value: event.target.value });
                    }}
                  />
                </div>
              </>
            )}
          {state.paymentModeId === PaymentModesEnum.DepositBond.key && (
            <div className='form-item'>
              <Inputs
                idRef='bondDetailsRef'
                labelValue='bond-details'
                value={state.bondDetails || ''}
                helperText={getErrorByName(schema, 'bondDetails').message}
                error={getErrorByName(schema, 'bondDetails').error}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  setState({ id: 'bondDetails', value: event.target.value });
                }}
              />
            </div>
          )}
          {state.paymentModeId === PaymentModesEnum.Draft.key && (
            <div className='form-item'>
              <Inputs
                idRef='draftNoRef'
                labelValue='draft-no'
                value={state.draftNo || ''}
                helperText={getErrorByName(schema, 'draftNo').message}
                error={getErrorByName(schema, 'draftNo').error}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  setState({ id: 'draftNo', value: event.target.value });
                }}
              />
            </div>
          )}
          {state.paymentModeId === PaymentModesEnum.CreditCard.key && (
            <div className='form-item'>
              <Inputs
                idRef='creditCardNoRef'
                labelValue='credit-card-no'
                value={state.creditCardNo || ''}
                helperText={getErrorByName(schema, 'creditCardNo').message}
                error={getErrorByName(schema, 'creditCardNo').error}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  setState({ id: 'creditCardNo', value: event.target.value });
                }}
              />
            </div>
          )}
          {state.paymentModeId === PaymentModesEnum.BankTransfer.key && (
            <div className='form-item'>
              <Inputs
                idRef='bankTransferNoRef'
                labelValue='bank-transfer-no'
                value={state.bankTransferNo || ''}
                helperText={getErrorByName(schema, 'bankTransferNo').message}
                error={getErrorByName(schema, 'bankTransferNo').error}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  setState({ id: 'bankTransferNo', value: event.target.value });
                }}
              />
            </div>
          )}
          {state.paymentModeId === PaymentModesEnum.BankDeposit.key && (
            <div className='form-item'>
              <Inputs
                idRef='depositNoRef'
                labelValue='deposit-no'
                value={state.depositNo || ''}
                helperText={getErrorByName(schema, 'depositNo').message}
                error={getErrorByName(schema, 'depositNo').error}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  setState({ id: 'depositNo', value: event.target.value });
                }}
              />
            </div>
          )}
          {state.paymentModeId === PaymentModesEnum.Cash.key && (
            <>
              <div className='form-title-wrapper'>
                <span className='form-title'>{t(`${translationPath}extra-information`)}</span>
              </div>
              <div className='form-item'>
                <Inputs
                  idRef='depositSlipNumberRef'
                  labelValue='deposit-slip-number'
                  value={state.depositSlipNumber || ''}
                  helperText={getErrorByName(schema, 'depositSlipNumber').message}
                  error={getErrorByName(schema, 'depositSlipNumber').error}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onInputChanged={(event) => {
                    setState({ id: 'depositSlipNumber', value: event.target.value });
                  }}
                />
              </div>
            </>
          )}
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

InvoiceManagementDialog.propTypes = {
  currentOperationType: PropTypes.oneOf(
    Object.values(UnitsOperationTypeEnum).map((item) => item.key)
  ).isRequired,
  effectedByNumber: PropTypes.number.isRequired,
  effectedByName: PropTypes.string.isRequired,
  totalInvoicesLength: PropTypes.number.isRequired,
  activeItem: PropTypes.instanceOf(Object),
  reloadData: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
InvoiceManagementDialog.defaultProps = {
  activeItem: null,
};
