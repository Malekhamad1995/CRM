import React, {
  useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import {
  DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import {
  AutocompleteComponent,
  DatePickerComponent,
  Inputs,
  SelectComponet,
  Spinner,
} from '../../../../../../../../Components';
import {
  GetParams, showError, showSuccess, getErrorByName
} from '../../../../../../../../Helper';
import {
  lookupItemsGet,
  CreateUnitPaymentPlan,
  UpdateUnitPaymentPlan,
  GetAllUnitPaymentPlanByUnitId,
} from '../../../../../../../../Services';
import { PaymentPlanType, AmountNatureType, FrequencyType } from '../../../../../../../../Enums';

export const PaymentPlanManagementDialog = ({
  activeItem,
  onSave,
  parentTranslationPath,
  translationPath,
  open,
  close,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const searchTimer = useRef(null);

  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [filter] = useState({
    unitId: +GetParams('id'),
    pageSize: 50,
    pageIndex: 0,
  });
  const [loadings, setLoadings] = useReducer(reducer, {
    activityAssignments: false,
    activityTypes: false,
    paymentPlan: false,
  });
  const [selected, setSelected] = useReducer(reducer, {
    paymentType: null,
    amountNatureType: null,
    adjustmentType: 0,
    paymentPlan: null,
  });
  const [data, setData] = useReducer(reducer, {
    paymentType: [],
    activityTypes: [],
    paymentPlan: [],
  });
  const [state, setState] = useReducer(reducer, {
    paymentTypeId: '',
    amountNatureType: '',
    installmentAmountOrRate: 0,
    frequencyType: 1,
    frequencyValue: null,
    frequencyDateValue: new Date(),
    adjustmentType: null,
    adjustmentPaymentPlanId: null,
    description: '',
    unitId: +GetParams('id'),
  });
  const schema = Joi.object({
    paymentTypeId: Joi.number()
      .required()
      .messages({
        'number.base': t`${translationPath}paymentType-is-required`,
        'number.empty': t`${translationPath}paymentType-is-required`,
      }),
    amountNatureType: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}amountNatureType-is-required`),
        'number.empty': t`${translationPath}amountNatureType-is-required`,

      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const getAllPaymentType = useCallback(async () => {
    setLoadings({ id: 'paymentType', value: true });
    const res = await lookupItemsGet({
      pageIndex: 1,
      pageSize: 50,
      lookupTypeName: PaymentPlanType.value,
    });
    if (!(res && res.status && res.status !== 200)) {
      setData({
        id: 'paymentType',
        value: (res && res.result) || [],
      });
    } else {
      setData({
        id: 'paymentType',
        value: [],
      });
    }
    setLoadings({ id: 'paymentType', value: false });
  }, []);

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
        activeItem.unitPaymentPlanId &&
        (await UpdateUnitPaymentPlan(activeItem.unitPaymentPlanId, state))) ||
      (await CreateUnitPaymentPlan({
        ...state,
        frequencyValue: +state.frequencyType === 2 ? null : +state.frequencyValue,
        frequencyDateValue: +state.frequencyType !== 2 ? null : +state.frequencyDateValue,
      }));
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      if (activeItem && activeItem.unitPaymentPlanId)
        showSuccess(t`${translationPath}payment-plan-updated-successfully`);
      else showSuccess(t`${translationPath}payment-plan-created-successfully`);
      if (onSave) onSave();
    } else if (activeItem && activeItem.unitPaymentPlanId)
      showError(t(`${translationPath}payment-plan-update-failed`));
    else showError(t`${translationPath}payment-plan-create-failed`);
  };
  useEffect(() => {
    getAllPaymentType();
  }, [getAllPaymentType]);
  useEffect(() => {
    if (activeItem) {
      setState({
        id: 'edit',
        value: {
          paymentTypeId: activeItem.paymentTypeId,
          amountNatureType: activeItem.amountNatureType,
          installmentAmountOrRate: activeItem.installmentAmountOrRate,
          frequencyType: activeItem.frequencyType,
          frequencyValue: activeItem.frequencyValue,
          frequencyDateValue: activeItem.frequencyDateValue,
          adjustmentType: activeItem.adjustmentType,
          adjustmentPaymentPlanId: activeItem.adjustmentPaymentPlanId,
          description: activeItem.description,
          unitId: +GetParams('id'),
        },
      });
    }
  }, [activeItem]);
  useEffect(() => {
    if (activeItem) {
      setSelected({
        id: 'edit',
        value: {
          paymentType: {
            lookupItemId: activeItem.paymentType,
            lookupItemName: activeItem.paymentTypeName,
          },
          amountNatureType: Object.values(AmountNatureType).filter(
            (item) => item.key === activeItem.amountNatureType
          )[0],
          adjustmentType: activeItem.adjustmentType,
          paymentPlan: {
            installmentNo:
              data.paymentPlan &&
              data.paymentPlan.result &&
              data.paymentPlan.result[0] &&
              activeItem.adjustmentPaymentPlanId &&
              data.paymentPlan.result.filter(
                (item) => item.unitPaymentPlanId === activeItem.adjustmentPaymentPlanId
              )[0].installmentNo,
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem, data]);
  const getAllPaymentTypes = useCallback(async () => {
    setLoadings({ id: 'paymentPlan', value: true });
    const res = await GetAllUnitPaymentPlanByUnitId(filter);
    if (!(res && res.status && res.status !== 200)) {
      setData({
        id: 'paymentPlan',
        value: { result: (res && res.result) || [], totalCount: (res && res.totalCount) || 0 },
      });
    } else {
      setData({
        id: 'paymentPlan',
        value: { result: [], totalCount: 0 },
      });
    }
    setLoadings({ id: 'paymentPlan', value: false });
  }, [filter]);

  useEffect(() => {
    if (activeItem) getAllPaymentTypes();
  }, [activeItem, getAllPaymentTypes]);
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          close();
        }}
        className='activities-management-dialog-wrapper'
      >
        <Spinner isActive={isLoading} isAbsolute />
        <form noValidate onSubmit={saveHandler}>
          <DialogTitle id='alert-dialog-slide-title'>
            {t(
              `${translationPath}${(activeItem && 'edit-payment-plan') || 'add-new-payment-plan'}`
            )}
          </DialogTitle>
          <DialogContent>
            <div className='dialog-content-wrapper'>
              <div className='dialog-content-item'>
                <AutocompleteComponent
                  idRef='assignAgentIdRef'
                  labelValue='payment-type'
                  labelClasses='Requierd-Color'
                  selectedValues={selected.paymentType}
                  multiple={false}
                  data={data.paymentType}
                  displayLabel={(option) => option.lookupItemName || ''}
                  renderOption={(option) => option.lookupItemName || ''}
                  getOptionSelected={(option) => option.lookupItemId === state.paymentTypeId}
                  withoutSearchButton
                  isLoading={loadings.paymentType}
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onChange={(event, newValue) => {
                    setSelected({ id: 'paymentType', value: newValue });
                    setState({
                      id: 'paymentTypeId',
                      value: (newValue && newValue.lookupItemId) || null,
                    });
                  }}
                  helperText={
                    getErrorByName(schema, 'paymentTypeId').message
                  }
                  error={getErrorByName(schema, 'paymentTypeId').error}
                  isWithError

                />
              </div>
              <div className='dialog-content-item'>
                <SelectComponet
                  labelValue='frequency'
                  data={Object.values(FrequencyType)}
                  value={state.frequencyType}
                  valueInput='key'
                  textInput='value'
                  onSelectChanged={(value) => setState({ id: 'frequencyType', value })}
                  idRef='activeFormTypeRef'
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  translationPathForData={translationPath}
                />
              </div>
              <div className='dialog-content-item'>
                <AutocompleteComponent
                  idRef='activityTypeIdRef'
                  labelClasses='Requierd-Color'
                  labelValue='amount-nature'
                  selectedValues={selected.amountNatureType}
                  multiple={false}
                  data={Object.values(AmountNatureType)}
                  displayLabel={(option) => option.value || ''}
                  getOptionSelected={(option) => option.key === state.amountNatureType}
                  withoutSearchButton
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onChange={(event, newValue) => {
                    setSelected({ id: 'amountNatureType', value: newValue });
                    setState({
                      id: 'amountNatureType',
                      value: (newValue && newValue.key) || null,
                    });
                  }}
                  isSubmitted={isSubmitted}
                  helperText={
                    getErrorByName(schema, 'amountNatureType').message
                  }
                  error={getErrorByName(schema, 'amountNatureType').error}
                  isWithError
                />
              </div>
              {state.frequencyType === 2 ? (
                <div className='dialog-content-item'>
                  <DatePickerComponent
                    idRef='activityDateRef'
                    labelValue='date'
                    placeholder='DD/MM/YYYY'
                    value={state.frequencyDateValue}
                    isSubmitted={isSubmitted}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    onDateChanged={(newValue) => {
                      setState({ id: 'frequencyDateValue', value: newValue });
                    }}
                  />
                </div>
              ) : (
                <div className='dialog-content-item'>
                  <Inputs
                    idRef='commentsRef'
                    labelValue={
                      (state.frequencyType === 1 && 'month') ||
                      (state.frequencyType === 3 && 'day') ||
                      (state.frequencyType === 4 && 'completed') ||
                      (state.frequencyType === 5 && 'N/A')
                    }
                    value={state.frequencyValue || (state.frequencyType === 5 && 'N/A') || ''}
                    isWithError
                    isSubmitted={isSubmitted}
                    parentTranslationPath={parentTranslationPath}
                    isDisabled={state.frequencyType === 5}
                    translationPath={translationPath}
                    type={state.frequencyType === 5 ? '' : 'number'}
                    onInputChanged={(event) => {
                      setState({ id: 'frequencyValue', value: event.target.value });
                    }}
                  />
                </div>
              )}
              <div className='dialog-content-item'>
                <Inputs
                  idRef='subjectRef'
                  labelValue='installment-rate'
                  value={state.installmentAmountOrRate || ''}
                  type='number'
                  min={0}
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onInputChanged={(event) => {
                    setState({ id: 'installmentAmountOrRate', value: +event.target.value });
                  }}
                />
              </div>
              {activeItem && (
                <div className='dialog-content-item'>
                  <AutocompleteComponent
                    idRef='RelatedToRef'
                    labelValue='adjustment'
                    selectedValues={selected.paymentPlan && selected.paymentPlan}
                    multiple={false}
                    data={
                      (data.paymentPlan &&
                        data.paymentPlan.result &&
                        data.paymentPlan.result.filter(
                          (item) => item.unitPaymentPlanId !== activeItem.unitPaymentPlanId
                        )) ||
                      []
                    }
                    displayLabel={
                      ((option) =>
                        option.installmentNo &&
                        `${t(`${translationPath}installment`)} # ${option.installmentNo}`) || ''
                    }
                    renderOption={
                      ((option) =>
                        option.installmentNo &&
                        `${t(`${translationPath}installment`)} # ${option.installmentNo}`) || ''
                    }
                    withoutSearchButton
                    isLoading={loadings.paymentPlan}
                    inputStartAdornment={(
                      <SelectComponet
                        data={[
                          {
                            key: 1,
                            value: 'plus',
                          },
                          {
                            key: 2,
                            value: 'minus',
                          },
                        ]}
                        emptyItem={{
                          value: 0,
                          text: 'select',
                          isDisabled: false,
                          isHiddenOnOpen: true,
                        }}
                        value={selected.adjustmentType}
                        valueInput='key'
                        textInput='value'
                        onSelectChanged={(value) => {
                          setSelected(
                            { id: 'adjustmentType', value },
                            setState({
                              id: 'adjustmentType',
                              value: value || null,
                            })
                          );
                        }}
                        wrapperClasses='over-input-select w-auto'
                        idRef='relatedToTypeRef'
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        translationPathForData={translationPath}
                      />
                    )}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    onChange={(event, newValue) => {
                      setSelected({
                        id: 'paymentPlan',
                        value: newValue,
                      });
                      setState({
                        id: 'adjustmentPaymentPlanId',
                        value: (newValue && newValue.unitPaymentPlanId) || null,
                      });
                    }}
                  />
                </div>
              )}
              <div className='dialog-content-item w-100'>
                <Inputs
                  idRef='commentsRef'
                  labelValue='description'
                  value={state.description || ''}
                  multiline
                  rows={4}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onInputChanged={(event) => {
                    setState({ id: 'description', value: event.target.value });
                  }}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <ButtonBase onClick={() => close()} className='btns theme-solid bg-cancel'>
              {t(`${translationPath}cancel`)}
            </ButtonBase>
            <ButtonBase className='btns theme-solid' type='submit'>
              {t(`${translationPath}${(activeItem && 'edit-payment-plan') || 'add-payment-plan'}`)}
            </ButtonBase>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
PaymentPlanManagementDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
PaymentPlanManagementDialog.defaultProps = {
  activeItem: null,
  parentTranslationPath: '',
  translationPath: '',
};
