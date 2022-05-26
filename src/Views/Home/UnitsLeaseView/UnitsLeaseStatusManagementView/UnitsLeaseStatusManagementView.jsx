import { ButtonBase } from '@material-ui/core';
import Joi from 'joi';
import React, {
  useEffect, useReducer, useState, useCallback
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Spinner, StepperComponent } from '../../../../Components';

import { UnitsOperationTypeEnum, UnitsStatusEnum } from '../../../../Enums';
import {
  bottomBoxComponentUpdate,
  getErrorByName,
  GetParams,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../Helper';
import {
  SetUnitAsReserveOrSale,
  SetUnitAsReserveOrLease,
  unitDetailsGet,
  GetReservedUnitTransactionDataForSaleByUnitId,
  GetReservedUnitTransactionDataForLeaseByUnitId,
} from '../../../../Services';
import { UnitMapper } from '../UnitLeaseMapper';
import { UnitsSaleRelatedSteps, UnitsRentRelatedSteps } from './StepsData';

const parentTranslationPath = 'UnitsStatusManagementView';
const translationPath = '';
export const UnitsLeaseStatusManagementView = () => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [unitParams, setUnitParams] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [unitData, setUnitData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [unitTransactionId, setUnitTransactionId] = useState(null);
  const loginResponse = useSelector((state) => state.login && state.login.loginResponse);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);

  const [selected, setSelected] = useReducer(reducer, {
    agent: null,
    referral: null,
    reservationType: null,
    transactedBy: null,
    externalAgency: null,
    rentFreePeriod: null,
    tableContacts: [],
    invoices: [],
    user: null,
    leasingType: null,
    periodOfStay: null,
  });
  const [state, setState] = useReducer(reducer, {});

  const getUnitById = useCallback(async () => {
    setIsLoading(true);
    const res = await unitDetailsGet({ id: unitParams.id });
    if (!(res && res.status && res.status !== 200)) setUnitData(UnitMapper(res));
    else setUnitData(null);
    setIsLoading(false);
  }, [unitParams]);

  const getSaleRelatedStatusesInit = useCallback(
    () => ({
      agentId: loginResponse && loginResponse.userId,
      contractRatified: false,
      titleDeedTransferred: false,
      deedTransferDate: null,
      referralId: null,
      contractRatifiedDate: null,
      mortgage: false,
      referralPercentage: 0,
      contractRefNo: null,
      financeComp: null,
      transactionEntryDate: null,
      reservationTypeId: null,
      paymentToExternalAgency: false,
      externalAgencyId: null,
      transactedById: null,
      observations: null,
      closingDate: null,
      commission: 0,
      // start contact
      contacts: [],
      // start details
      basePrice: 0,
      premium: 0,
      // Per is a sort for percentage & need to manual calculate on init
      premiumPercentageOfBasePrice: 0,
      agencyFeeSeller: 0,
      agencyFeeSellerPercentageOfBasePriceAndPremium: 0,
      discount: 0,
      discountPercentageOfBasePrice: 0,
      sellingPrice: 0,
      admRegistrationFees: 0,
      admRegistrationFeesPercentageOfSellingPrice: 0,
      agencyFeeBuyer: 0,
      agencyFeeBuyerPercentageOfSellingPrice: 0,
      transferFeeBuyer: 0,
      transferFeeBuyerPercentageOfBasePrice: 0,
      transferFeeSeller: 0,
      transferFeeSellerPercentageOfSellingPrice: 0,
      transferFeeCompletedAndPaidProp: 0,
      transferFeeCompletedAndPaidPropOfSellingPrice: 0,
      sellerHasPaid: 0,
      sellerHasPaidPercentageOfBasePrice: 0,
      amountDueToDeveloper: 0,
      downPayment: 0,
      downPaymentPercentageOfSellingPrice: 0,
      loanTermByYears: 0,
      interestRate: 0,
      mortgagePerMonth: 0,
      downPaymentForPlanOne: 0,
      downPaymentForPlanOnePercentageOfSellingPrice: 0,
      monthlyInstallment: 0,
      monthlyInstallmentPercentageOfSellingPrice: 0,
      handoverPaymentForPlanOne: 0,
      handoverPaymentForPlanOnePercentageOfSellingPrice: 0,
      downPaymentForPlanTwo: 0,
      downPaymentForPlanTwoPercentageOfSellingPrice: 0,
      handoverPaymentForPlanTwo: 0,
      handoverPaymentForPlanTwoPercentageOfSellingPrice: 0,
      isPriceOnApplication: true,
      isNegotiable: true,
      sellingPricePerSQFT: 0,
      originalPricePerSQFT: 0,
      // Invoices
      invoicesIds: [],
      // Summery
      note: null,
    }),
    [loginResponse]
  );
  const getRentRelatedStatusesInit = useCallback(
    () => ({
      agentId: null,
      contractSigned: false,
      premises: null,
      referralId: null,
      contractDate: null,
      referralPercentage: 0,
      startDate: null,
      endDate: null,
      contractRefNo: null,
      reservationTypeId: null,
      rentFreePeriodId: null,
      transactionEntryDate: null,
      observations: null,
      occupantsAdults: 0,
      occupantsChildren: 0,
      transactedById: null,
      commission: 0,
      // start contact
      contacts: [],
      // start details
      rentPerYear: '',
      contractRent: 0,
      securityDeposit: 0,
      renewalFee: 0,
      agencyFee: 0,
      tenancyContractIssued: false,
      contractIssuedDate: null,
      contractIssuedById: null,
      receiptNo: null,
      paymentToExternalAgency: false,
      externalAgencyId: null,
      leasingTypeId: null,
      periodOfStayId: null,
      contractRenewable: false,
      printContractOn: false,
      // Invoices
      invoicesIds: [],
      // Summery
      note: null,
    }),
    [loginResponse]
  );
  const getReservedUnitTransactionDataForSaleByUnitId = useCallback(async () => {
    setIsLoading(true);
    const res = await GetReservedUnitTransactionDataForSaleByUnitId(unitParams.id);
    if (res.unitId) {
      setState({
        id: 'edit',
        value: {
          ...res.saleTransactionDetails,
          note: res.note,
          invoicesIds: res.invoicesIds,
          contacts: res.unitTransactionContacts,
        },
      });
      setUnitTransactionId(res.unitTransactionId);
    }
    setIsLoading(false);
  }, [unitParams]);
  const getReservedUnitTransactionDataForLeaseByUnitId = useCallback(async () => {
    setIsLoading(true);
    const res = await GetReservedUnitTransactionDataForLeaseByUnitId(unitParams.id);
    localStorage.setItem('leaseTransactionDetails', (JSON.stringify(res.leaseTransactionDetails)));
    const leaseTransactionDetails = res ? res.leaseTransactionDetails : null;
    if (leaseTransactionDetails) {
      leaseTransactionDetails.transactedById = leaseTransactionDetails.transactedById === '00000000-0000-0000-0000-000000000000' ? null : leaseTransactionDetails.transactedById;
      leaseTransactionDetails.contractIssuedById = leaseTransactionDetails.contractIssuedById === '00000000-0000-0000-0000-000000000000' ? null : leaseTransactionDetails.contractIssuedById;
      leaseTransactionDetails.leasingTypeId = leaseTransactionDetails.leasingTypeId === 0 ? null : leaseTransactionDetails.leasingTypeId;
      leaseTransactionDetails.reservationTypeId = leaseTransactionDetails.reservationTypeId === 0 ? null : leaseTransactionDetails.reservationTypeId;
    }
    // if (res.unitId) {
    setState({
      id: 'edit',
      value: {
        ...leaseTransactionDetails,
        note: res.note,
        invoicesIds: res.invoicesIds,
        contacts: res.unitTransactionContacts,

      },
    });

    setUnitTransactionId(res.unitTransactionId);
    // }
    setIsLoading(false);
  }, [unitParams]);

  const getIsSaleRelated = useCallback(() => {
    if (
      unitParams &&
      unitParams.status &&
      Object.values(UnitsStatusEnum).findIndex(
        (item) =>
          item.key === unitParams.status &&
          (!item.effectedOperationType ||
            item.effectedOperationType === UnitsOperationTypeEnum.sale.key)
      ) !== -1
    )
      return true;
    return false;
  }, [unitParams]);
  const getIsRentRelated = useCallback(() => {
    if (
      unitParams &&
      unitParams.status &&
      Object.values(UnitsStatusEnum).findIndex(
        (item) =>
          item.key === unitParams.status &&
          (!item.effectedOperationType ||
            item.effectedOperationType === UnitsOperationTypeEnum.rent.key)
      ) !== -1
    )
      return true;
    return false;
  }, [unitParams]);
  const getStateInit = useCallback(() => {
    if (getIsSaleRelated()) return getSaleRelatedStatusesInit();
    if (getIsRentRelated()) return getRentRelatedStatusesInit();
    return {};
  }, [getIsRentRelated, getIsSaleRelated, getRentRelatedStatusesInit, getSaleRelatedStatusesInit]);
  const getSaleRelatedSchema = () => ({
    agentId: Joi.string()
      .required()
      .messages({
        'any.required': t(`${translationPath}agent-is-required`),
        'string.base': t(`${translationPath}agent-is-required`),
        'string.empty': t(`${translationPath}agent-is-required`),
      }),
    contractRatifiedDate: Joi.any()
      .custom((value, helpers) => {
        if (!value && state.contractRatified) return helpers.error('state.dateRequired');
        return value;
      })
      .messages({
        'state.dateRequired': t(`${translationPath}contract-ratified-date-is-required`),
      }),
    transactionEntryDate: Joi.any()
      .custom((value, helpers) => {
        if (!value) return helpers.error('state.dateRequired');
        return value;
      })
      .messages({
        'state.dateRequired': t(`${translationPath}transaction-entry-date-is-required`),
      }),
      reservationTypeId: Joi.number()
      .required()
      .messages({
        'number.required': t(`${translationPath}reservation-type-is-required`),
        'number.base': t(`${translationPath}reservation-type-is-required`),
        'number.empty': t(`${translationPath}reservation-type-is-required`),

      }),
    transactedById: Joi.string()
      .required()
      .messages({
        'any.required': t(`${translationPath}transacted-by-is-required`),
        'string.base': t(`${translationPath}transacted-by-is-required`),
        'string.empty': t(`${translationPath}transacted-by-is-required`),
      }),
    financeComp: Joi.string()
      .required()
      .messages({
        'any.required': t(`${translationPath}finance-comp-is-required`),
        'string.base': t(`${translationPath}finance-comp-is-required`),
        'string.empty': t(`${translationPath}finance-comp-is-required`),
      }),
    basePrice: Joi.number()
      .required()
      .messages({
        'any.required': t(`${translationPath}base-price-is-required`),
        'number.base': t(`${translationPath}base-price-is-required`),
      }),
    contacts: Joi.array()
      .min(1)
      .required()
      .messages({
        'array.min': t(`${translationPath}please-select-at-least-one-contact`),
      }),
  });
  const getRentRelatedSchema = () => ({
    agentId: Joi.string()
      .required()
      .messages({
        'any.required': t(`${translationPath}agent-is-required`),
        'string.base': t(`${translationPath}agent-is-required`),
        'string.empty': t(`${translationPath}agent-is-required`),
      }),
    contractIssuedById: Joi.string()
      .required()
      .messages({
        'any.required': t(`${translationPath}contract-issued-by-is-required`),
        'string.base': t(`${translationPath}contract-issued-by-is-required`),
        'string.empty': t(`${translationPath}contract-issued-by-is-required`),
      }),
    contractDate: Joi.any()
      .custom((value, helpers) => {
        if (!value && state.contractSigned) return helpers.error('state.dateRequired');
        return value;
      })
      .messages({
        'state.dateRequired': t(`${translationPath}contract-date-is-required`),
      }),
    startDate: Joi.any()
      .custom((value, helpers) => {
        if (!value) return helpers.error('state.dateRequired');
        return value;
      })
      .messages({
        'state.dateRequired': t(`${translationPath}start-date-is-required`),
      }),
    endDate: Joi.any()
      .custom((value, helpers) => {
        if (!value) return helpers.error('state.dateRequired');
        return value;
      })
      .messages({
        'state.dateRequired': t(`${translationPath}end-date-is-required`),
      }),
    transactionEntryDate: Joi.any()
      .custom((value, helpers) => {
        if (!value) return helpers.error('state.dateRequired');
        return value;
      })
      .messages({
        'state.dateRequired': t(`${translationPath}transaction-entry-date-is-required`),
      }),
    reservationTypeId: Joi.number()
      .required()
      .messages({
        'number.required': t(`${translationPath}reservation-type-is-required`),
        'number.base': t(`${translationPath}reservation-type-is-required`),
        'number.empty': t(`${translationPath}reservation-type-is-required`),

      }),
    transactedById: Joi.string()
      .required()
      .messages({
        'any.required': t(`${translationPath}transacted-by-is-required`),
        'string.base': t(`${translationPath}transacted-by-is-required`),
        'string.empty': t(`${translationPath}transacted-by-is-required`),
      }),

    rentPerYear: Joi.number().min(1)
      .required()
      .messages({
        'number.min': t(`${translationPath}rent-per-year-is-required`),
        'number.empty': t(`${translationPath}rent-per-year-is-required`),
        'number.required': t(`${translationPath}rent-per-year-is-required`),
        'number.base': t(`${translationPath}rent-per-year-is-required`),
      }),
    leasingTypeId: Joi.number()
      .required()
      .messages({
        'any.required': t(`${translationPath}leasing-type-is-required`),
        'number.base': t(`${translationPath}leasing-type-is-required`),
      }),
    contacts: Joi.array()
      .min(1)
      .required()
      .messages({
        'array.min': t(`${translationPath}please-select-at-one-contact`),
      }),
  });
  const getStatusesSchema = () => {
    if (getIsSaleRelated()) return getSaleRelatedSchema();
    if (getIsRentRelated()) return getRentRelatedSchema();
    return {};
  };

  const schema = Joi.object(getStatusesSchema())
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const stepClickedHandler = useCallback(
    (newStepIndex) => () => {
      setActiveStep(newStepIndex);
    },
    []
  );
  const isCompletedHandler = useCallback(
    (stepIndex) => {
      if (stepIndex === 0) {
        if (
          getErrorByName(schema, 'agentId').error ||
          getErrorByName(schema, 'contractRatifiedDate').error ||
          getErrorByName(schema, 'transactionEntryDate').error ||
          getErrorByName(schema, 'reservationTypeId').error ||
          getErrorByName(schema, 'transactedById').error ||
          getErrorByName(schema, 'contractDate').error ||
          getErrorByName(schema, 'financeComp').error ||
          getErrorByName(schema, 'startDate').error ||
          getErrorByName(schema, 'endDate').error
        )
          return false;
      } else if (stepIndex === 1) {
        if (getErrorByName(schema, 'contacts').error) return false;
      } else if (stepIndex === 2) {
        if (
          getErrorByName(schema, 'basePrice').error ||
          getErrorByName(schema, 'rentPerYear').error ||
          getErrorByName(schema, 'leasingTypeId').error ||
          getErrorByName(schema, 'contractIssuedById').error
        )
          return false;
      }
      return true;
    },
    [schema]
  );
  const isDisabledHandler = useCallback(
    (stepIndex) => {
      let isDisabled = false;
      for (let index = 0; index < stepIndex; index += 1) {
        isDisabled = !isCompletedHandler(index);
        if (isDisabled) break;
      }
      if (!isDisabled) isDisabled = !isCompletedHandler(activeStep);
      return isDisabled;
    },
    [activeStep, isCompletedHandler]
  );
  const backHandler = () => {
    setActiveStep((item) => item - 1);
  };

  const nextHandler = useCallback(() => {
    if (!isDisabledHandler(activeStep)) {
      setIsSubmitted(false);
      setActiveStep((item) => item + 1);
    } else setIsSubmitted(true);
    if (activeStep === 1 && getErrorByName(schema, 'contacts').error)
      showError(getErrorByName(schema, 'contacts').message);
  }, [activeStep, isDisabledHandler, schema]);
  const cancelHandler = useCallback(() => {
    if (unitParams.id && unitParams.from && +unitParams.from === 2)
      GlobalHistory.push(`/home/units-lease/unit-profile-edit?formType=1&id=${unitParams.id}`);
    else GlobalHistory.push('/home/units-lease/view');
  }, [unitParams]);

  const onStateChangedHandler = (newValue) => {
    setState(newValue);
  };
  const onSelectedChangedHandler = (newValue) => {
    setSelected(newValue);
  };
  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    if (!getIsSaleRelated() && !getIsRentRelated()) {
      cancelHandler();
      return;
    }
    setIsLoading(true);

    const res =
      (getIsSaleRelated() &&
        (await SetUnitAsReserveOrSale({
          unitId: unitParams.id,
          status: unitParams.status,
          saleTransactionDetails: state,
          note: state.note,
          unitTransactionContacts: state.contacts,
          invoicesIds: state.invoicesIds,
          rowVersion: (unitParams && unitParams.rowVersion && unitParams.rowVersion !== 'null') ? unitParams.rowVersion : null,
        }))) ||
      (getIsRentRelated() &&
        (await SetUnitAsReserveOrLease({
          unitId: unitParams.id,
          status: unitParams.status,
          leaseTransactionDetails: state,
          note: state.note,
          unitTransactionContacts: state.contacts,
          invoicesIds: state.invoicesIds,
          rowVersion: (unitParams && unitParams.rowVersion && unitParams.rowVersion !== 'null') ? unitParams.rowVersion : null,
        })));
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t`${translationPath}unit-status-updated-successfully`);
      // cancelHandler();
      localStorage.removeItem('leaseTransactionDetails');
    } else showError(t`${translationPath}unit-status-update-failed`);
  }, [cancelHandler, getIsRentRelated, getIsSaleRelated, schema.error, state, t, unitParams]);

  useEffect(() => {
    if (unitParams) {
      bottomBoxComponentUpdate(
        <div className='bottom-box-two-sections'>
          <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
            <span className='mdi mdi-chevron-left' />
            <span className='px-2 c-warning'>{t(`${translationPath}cancel`)}</span>
            <span>
              {t(
                `${translationPath}and-back-to${(unitParams.id &&
                  unitParams.from &&
                  +unitParams.from === 2 &&
                  '-unit-profile-edit') ||
                '-unit'
                }`
              )}
            </span>
          </ButtonBase>
          <div className='d-flex-v-center flex-wrap'>
            <ButtonBase
              className='btns theme-transparent mb-2'
              disabled={activeStep === 0}
              onClick={backHandler}
            >
              <span>{t('Shared:back')}</span>
            </ButtonBase>
            {!(
              activeStep ===
              ((getIsSaleRelated() && UnitsSaleRelatedSteps.length - 1) ||
                getIsRentRelated() && UnitsRentRelatedSteps.length - 1)
            ) && (
            <ButtonBase className='btns theme-solid mb-2' onClick={nextHandler}>
              <span>{t('Shared:next')}</span>
            </ButtonBase>
              )}
            {activeStep ===
              ((getIsSaleRelated() && UnitsSaleRelatedSteps.length - 1) ||
                getIsRentRelated() && UnitsRentRelatedSteps.length - 1) && (
                <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
                  <span>{t('Shared:save')}</span>
                </ButtonBase>
              )}
          </div>
        </div>
      );
    }
  }, [activeStep, cancelHandler, getIsSaleRelated, nextHandler, saveHandler, t, unitParams]);
  useEffect(() => {
    if (unitParams && unitParams.id) getUnitById();
  }, [getUnitById, unitParams]);
  useEffect(() => {
    if (unitParams && unitParams.id) {
      if (unitParams.status === UnitsStatusEnum.Leased.key)
        getReservedUnitTransactionDataForLeaseByUnitId();

      else if (unitParams.status === UnitsStatusEnum.Sale.key)
        getReservedUnitTransactionDataForSaleByUnitId();
    }
  }, [
    getReservedUnitTransactionDataForLeaseByUnitId,
    getReservedUnitTransactionDataForSaleByUnitId,
    unitParams,
  ]);
  useEffect(() => {
    if (unitParams && unitParams.id) setState({ id: 'edit', value: getStateInit() });
  }, [getStateInit, unitParams]);
  useEffect(() => {
    const status = GetParams('status');
    const id = GetParams('id');
    const from = GetParams('from');
    const rowVersion = GetParams('rowVersion');
    if (status && id && from) {
      setUnitParams({
        status: +status,
        id: +id,
        from: +from,
        rowVersion,
      });
    } else if (id && from && +from === 2)
      GlobalHistory.push(`/home/units-lease/unit-profile-edit?formType=1&id=${id}`);
    else GlobalHistory.push('/home/units-lease/view');
  }, []);
  return (
    <div className='units-status-management-wrapper view-wrapper'>
      <Spinner isActive={isLoading} />
      <StepperComponent
        steps={
          (getIsSaleRelated() && UnitsSaleRelatedSteps) ||
          (getIsRentRelated() && UnitsRentRelatedSteps) ||
          []
        }
        onStepperClick={stepClickedHandler}
        completed={isCompletedHandler}
        isDisabled={isDisabledHandler}
        labelInput='label'
        hasError={schema.error !== undefined}
        isSubmitted={isSubmitted}
        activeStep={activeStep}
        isValidateOnlyActiveIndex
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        dynamicComponentProps={{
          state,
          selected,
          unitData,
          unitTransactionId,
          schema,
          onStateChanged: onStateChangedHandler,
          onSelectedChanged: onSelectedChangedHandler,
          isSubmitted,
          parentTranslationPath,
          translationPath,
        }}
      />
      {/* <form noValidate className='units-status-steps-wapper'>
        {activeStep === 0 && getIsSaleRelated() && (
          <AgentInfoSaleRelatedComponent
            state={state}
            schema={schema}
            onStateChanged={onStateChangedHandler}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
      </form> */}
    </div>
  );
};
