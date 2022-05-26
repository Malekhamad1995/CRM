import React, {
  useState, useEffect, useCallback, useReducer
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { ButtonBase } from '@material-ui/core';
import {
  Inputs, RadiosGroupComponent, Spinner, TabsComponent
} from '../../../../../../Components';
import {
  bottomBoxComponentUpdate,
  getErrorByName,
  GetParams,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../Helper';
import { UnitProfileSaleDetailsComponentTabsData } from './PropertiesProfileSpecificationTabsData';
import { UnitsOperationTypeEnum, UnitsStatusEnum } from '../../../../../../Enums';
import { GetUnitSaleDetails, UpdateUnitSaleDetails } from '../../../../../../Services';
import { PermissionsComponent } from '../../../../../../Components/PermissionsComponent/PermissionsComponent';
import { UnitsSalesPermissions } from '../../../../../../Permissions';

export const UnitProfileSaleDetailsComponent = ({
  parentTranslationPath,
  translationPath,
  isReadOnly,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeTab, setActiveTab] = useState(0);
  const [unitSaleDetailsIdVal, setunitSaleDetailsIdVal] = useState(0);
  const [unitParams, setUnitParams] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const getSaleRelatedStatusesInit = () => ({
    addAgencyFeeToSellingPriceForSeller: false,
    admRegistrationFees: 0,
    admRegistrationFeesPercentageOfSellingPrice: 0,
    agencyFeeBuyer: 0,
    agencyFeeBuyerPercentageOfSellingPrice: 0,
    agencyFeeSeller: 0,
    agencyFeeSellerPercentageOfBasePriceAndPremium: 0,
    amountDueToDeveloper: 0,
    basePrice: 0,
    discount: 0,
    discountPercentageOfBasePrice: 0,
    downPayment: 0,
    downPaymentForPlanOne: 0,
    downPaymentForPlanOnePercentageOfSellingPrice: 0,
    downPaymentForPlanTwo: 0,
    downPaymentForPlanTwoPercentageOfSellingPrice: 0,
    downPaymentPercentageOfSellingPrice: 0,
    handoverPaymentForPlanOne: 0,
    handoverPaymentForPlanOnePercentageOfSellingPrice: 0,
    handoverPaymentForPlanTwo: 0,
    handoverPaymentForPlanTwoPercentageOfSellingPrice: 0,
    interestRate: 0,
    loanTermByYears: 0,
    monthlyInstallment: 0,
    monthlyInstallmentPercentageOfSellingPrice: 0,
    mortgagePerMonth: 0,
    negotiable: false,
    originalPricePerSquareFeet: 0,
    premium: 0,
    premiumPercentageOfBasePrice: 0,
    priceOnApplication: false,
    sellerHasPaid: 0,
    sellerHasPaidPercentageOfBasePrice: 0,
    sellingPrice: 0,
    sellingPricePerSquareFeet: 0,
    transferFeeBuyer: 0,
    transferFeeBuyerPercentageOfBasePrice: 0,
    transferFeeCompletedAndPaidProp: 0,
    transferFeeCompletedAndPaidPropOfSellingPrice: 0,
    transferFeeSeller: 0,
    transferFeeSellerPercentageOfSellingPrice: 0,
    unitId: +GetParams('id') || 0,
    unitSaleDetailsId: unitSaleDetailsIdVal,
  });

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
    return {};
  }, [getIsSaleRelated]);

  const [state, setState] = useReducer(reducer, {});
  const getSaleRelatedSchema = () => ({});
  const getRentRelatedSchema = () => ({});

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

  const cancelHandler = useCallback(() => {
    if (!unitParams.id)
      GlobalHistory.push(`/home/units-sales/unit-profile-edit?formType=1&id=${unitParams.id}`);
    else GlobalHistory.push('/home/units-sales/view');
  }, [unitParams]);

  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    const res = await UpdateUnitSaleDetails(state);
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      const result = await GetUnitSaleDetails(unitParams.id);
      onStateChanged({
        id: 'edit',
        value: result,
      });
      showSuccess(t`${translationPath}unit-sale-details-update-successfully`);
    } else showError(t`${translationPath}unit-sale-details-update-Failed`);
  }, [schema.error, state, t, translationPath, unitParams]);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        {!isReadOnly && (
          <PermissionsComponent
            permissionsList={Object.values(UnitsSalesPermissions)}
            permissionsId={UnitsSalesPermissions.EditSalesDetailsForUnit.permissionsId}
          >
            <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
              <span>{t('Shared:save')}</span>
            </ButtonBase>
          </PermissionsComponent>
        )}
      </div>
    );
  });

  const effectedFieldsBySellingPriceRecalculate = useCallback(
    (effectorNewValue = 0) => {
      const admRegistrationFees =
        (effectorNewValue / 100) * state.admRegistrationFeesPercentageOfSellingPrice;

      const agencyFeeBuyer =
        (effectorNewValue / 100) * state.agencyFeeBuyerPercentageOfSellingPrice;

      const transferFeeCompletedAndPaidProp =
       state.transferFeeCompletedAndPaidPropOfSellingPrice ? (effectorNewValue / 100) * (state.transferFeeCompletedAndPaidPropOfSellingPrice) : 0;
      const downPayment =
        (effectorNewValue / 100) * state.downPaymentPercentageOfSellingPrice;

      const downPaymentForPlanOne =
        (effectorNewValue / 100) * state.downPaymentForPlanOnePercentageOfSellingPrice;

      const monthlyInstallment =
        (effectorNewValue / 100) * state.monthlyInstallmentPercentageOfSellingPrice;

      const handoverPaymentForPlanOne =
        (effectorNewValue / 100) * state.handoverPaymentForPlanOnePercentageOfSellingPrice;

      const downPaymentForPlanTwo =
        (effectorNewValue / 100) * state.downPaymentForPlanTwoPercentageOfSellingPrice;

      const handoverPaymentForPlanTwo =
        (effectorNewValue / 100) * state.handoverPaymentForPlanTwoPercentageOfSellingPrice;

      const transferFeeSeller =
        (effectorNewValue / 100) * state.transferFeeSellerPercentageOfSellingPrice;

        const sellerHasPaid =
        (effectorNewValue / 100) * state.sellerHasPaidPercentageOfBasePrice;

        const amountDueToDeveloper = effectorNewValue - sellerHasPaid ; 

      return {
        admRegistrationFees,
        agencyFeeBuyer,
        transferFeeCompletedAndPaidProp,
        downPayment,
        downPaymentForPlanOne,
        monthlyInstallment,
        handoverPaymentForPlanOne,
        downPaymentForPlanTwo,
        handoverPaymentForPlanTwo,
        transferFeeSeller,
        amountDueToDeveloper, 
        sellerHasPaid,
      };
    },
    [state]
  );
  const effectedFieldsByBasePriceRecalculate = (effectorNewValue = 0) => {
    const premium = (effectorNewValue / 100) * state.premiumPercentageOfBasePrice;
    const agencyFeeSeller =
      (effectorNewValue / 100) * state.agencyFeeSellerPercentageOfBasePriceAndPremium;
    const discount =
      (effectorNewValue / 100) * state.discountPercentageOfBasePrice;
    const sellingPrice = effectorNewValue + premium - discount;
    const transferFeeBuyer = (
      (effectorNewValue / 100) * state.transferFeeBuyerPercentageOfBasePrice);
    // const sellerHasPaid = (
    //   (effectorNewValue / 100) * state.sellerHasPaidPercentageOfBasePrice);

      if (!effectorNewValue) {
        const unitSaleDetails = getSaleRelatedStatusesInit();
        onStateChanged({
          id: 'edit',
          value: {
            ...unitSaleDetails

          },
        });
      } else {
        onStateChanged({
          id: 'edit',
          value: {
            ...state,
            basePrice: effectorNewValue,
            premium,
            agencyFeeSeller,
            discount,
            sellingPrice,
            ...effectedFieldsBySellingPriceRecalculate(sellingPrice),
            transferFeeBuyer,
          },
        });
      }
  };
  const effectedFieldsByPremiumOrPerRecalculate = (effectorName, effectorNewValue = 0) => {
    let { premium } = state;
    let { premiumPercentageOfBasePrice } = state;
    if (effectorName === 'premiumPercentageOfBasePrice') {
      premiumPercentageOfBasePrice = effectorNewValue;
      premium = (((state.basePrice || 0) / 100) * premiumPercentageOfBasePrice);
    } else {
      premium = effectorNewValue;
      premiumPercentageOfBasePrice = (premium / (state.basePrice || 0)) * 100;
    }

    const sellingPrice = state.basePrice + premium - state.discount;
    onStateChanged({
      id: 'edit',
      value: {
        ...state,
        premium,
        premiumPercentageOfBasePrice,
        sellingPrice,
        ...effectedFieldsBySellingPriceRecalculate(sellingPrice),
      },
    });
  };
  const effectedFieldsByDiscountOrPerRecalculate = (effectorName, effectorNewValue = 0) => {
    let { discount } = state;
    let { discountPercentageOfBasePrice } = state;
    if (effectorName === 'discountPercentageOfBasePrice') {
      discountPercentageOfBasePrice = effectorNewValue;
      discount = (state.basePrice / 100) * discountPercentageOfBasePrice;
    } else {
      discount = effectorNewValue;
      discountPercentageOfBasePrice = (discount / state.basePrice) * 100;
    }
    const sellingPrice = state.basePrice + state.premium - discount;
    onStateChanged({
      id: 'edit',
      value: {
        ...state,
        discount,
        discountPercentageOfBasePrice,
        sellingPrice,
        ...effectedFieldsBySellingPriceRecalculate(sellingPrice),
      },
    });
  };

  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };

  const getUnitSaleDetails = useCallback(async () => {
    if (unitParams && unitParams.id) {
      const result = await GetUnitSaleDetails(unitParams.id);
      setunitSaleDetailsIdVal(result.unitSaleDetailsId || null);
      onStateChanged({
        id: 'edit',
        value: result,
      });
    }
  }, [unitParams]);

  useEffect(() => {
    getUnitSaleDetails();
  }, [getUnitSaleDetails]);

  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );
  useEffect(() => {
    setState({ id: 'edit', value: getStateInit() });
  }, [getStateInit, unitParams]);

  useEffect(() => {
    const id = GetParams('id');
    if (id) {
      setUnitParams({
        id: +id,
      });
    }
  }, []);

  return (
    <div className='properties-information-wrapper childs-wrapper b-0 unit-profile-sale-details-component-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <TabsComponent
        data={UnitProfileSaleDetailsComponentTabsData}
        labelInput='tab'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-curved'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
      />
      <div className='tabs-content-wrapper'>
        {activeTab === 0 && (
          <div className='tab-item-wrapper '>

            <div className='form-item'>
              <Inputs
                isDisabled={isReadOnly}
                idRef='basePriceRef'
                labelValue='base-price'
                value={state.basePrice}
                helperText={getErrorByName(schema, 'basePrice').message}
                error={getErrorByName(schema, 'basePrice').error}
                endAdornment={<span className='px-2'>AED</span>}
                type='number'
                min={0}
                withNumberFormat
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  if (Number.isNaN(value))
                  value = 0;
                  effectedFieldsByBasePriceRecalculate(value);
                }}
              //   onKeyUp={(e) => {
              //     const basePrice = e && e.target && e.target.value ? (e.target.value) : 0;
              //     const fixed = (basePrice && basePrice.replace(/,/g, ''));
              //     const editBasePrice = fixed ? parseFloat(fixed) : 0;
              //      effectedFieldsByBasePriceRecalculate(editBasePrice);
              //  }}
                
              />
            </div>

            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput
                isDisabled={isReadOnly}
                withNumberFormat
                idRef='premiumRef'
                labelValue='premium'
                labelClasses='has-inside-label'
                value={state.premium}
                helperText={getErrorByName(schema, 'premium').message}
                error={getErrorByName(schema, 'premium').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.basePrice)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                  if (parsedValue > (state.basePrice)) parsedValue = (state.basePrice);
                  effectedFieldsByPremiumOrPerRecalculate('premium', parsedValue);
                }}
              />

              <div className='input-container'>
                <Inputs
                  isAttachedInput
                  isDisabled={isReadOnly}
                  withNumberFormat
                  idRef='premiumPercentageOfBasePriceRef'
                  labelValue='of-base-price'
                  value={state.premiumPercentageOfBasePrice}
                  helperText={getErrorByName(schema, 'premiumPercentageOfBasePrice').message}
                  error={getErrorByName(schema, 'premiumPercentageOfBasePrice').error}
                  endAdornment={<span className='px-2'>%</span>}
                  type='number'
                  labelClasses='inside-input-label'
                  wrapperClasses='mb-0'
                  min={0}
                  max={100}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onKeyUp={(e) => {
                        const value = e && e.target && e.target.value ? (e.target.value) : 0;
                        if (Number.isNaN(value))
                        value = 0;
                        const fixed = (value && value.replace(/,/g, ''));
                        let parsedValue = fixed ? parseFloat(fixed) : 0;

                        if (parsedValue > 100) parsedValue = 100;
                        effectedFieldsByPremiumOrPerRecalculate(
                          'premiumPercentageOfBasePrice',
                          parsedValue
                        );
                      }}
                />
              </div>
            </div>

            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput
                withNumberFormat
                isDisabled={isReadOnly}
                idRef='agencyFeesRef'
                labelValue='agency-fees-sale-description'
                labelClasses='has-inside-label'
                value={state.agencyFeeSeller}
                helperText={getErrorByName(schema, 'agencyFees').message}
                error={getErrorByName(schema, 'agencyFees').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.basePrice)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                  if (parsedValue > state.basePrice) parsedValue = state.basePrice;
                  const effectedValue = state.basePrice ? ((parsedValue / state.basePrice) * 100) : 0;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      agencyFeeSeller: state.basePrice ? parsedValue : 0,
                      agencyFeeSellerPercentageOfBasePriceAndPremium: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>

                <Inputs
                  isAttachedInput
                  withNumberFormat
                  isDisabled={isReadOnly}
                  idRef='agencyFeeSellerPercentageOfBasePriceAndPremiumRef'
                  labelValue='of-base-price'
                  type='number'
                  value={state.agencyFeeSellerPercentageOfBasePriceAndPremium}
                  helperText={
                        getErrorByName(schema, 'agencyFeeSellerPercentageOfBasePriceAndPremium')
                          .message
                      }
                  error={
                        getErrorByName(schema, 'agencyFeeSellerPercentageOfBasePriceAndPremium')
                          .error
                      }
                  endAdornment={<span className='px-2'>%</span>}
                  labelClasses='inside-input-label'
                  wrapperClasses='mb-0'
                  min={0}
                  max={100}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onKeyUp={(e) => {
                        const value = e && e.target && e.target.value ? (e.target.value) : 0;
                        if (Number.isNaN(value))
                        value = 0;
                        const fixed = (value && value.replace(/,/g, ''));
                        let parsedValue = fixed ? parseFloat(fixed) : 0;

                        if (parsedValue > 100) parsedValue = 100;
                        const effectedValue = state.basePrice ? (state.basePrice / 100) * parsedValue : 0;

                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            agencyFeeSellerPercentageOfBasePriceAndPremium: state.basePrice ? parsedValue : 0,
                            agencyFeeSeller: effectedValue,
                          },
                        });
                      }}
                />
              </div>
            </div>

            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput
                withNumberFormat
                isDisabled={isReadOnly}
                idRef='discountRef'
                labelValue='discount'
                labelClasses='has-inside-label'
                value={state.discount}
                helperText={getErrorByName(schema, 'discount').message}
                error={getErrorByName(schema, 'discount').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.basePrice)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                    const total = state.basePrice;
                    if (parsedValue > total) parsedValue = total;
                    effectedFieldsByDiscountOrPerRecalculate('discount', parsedValue);
                }}
              />
              <div className='input-container'>
                <Inputs
                  isAttachedInput
                  withNumberFormat
                  isDisabled={isReadOnly}
                  idRef='discountPercentageOfBasePriceRef'
                  labelValue='of-base-price'
                  value={state.discountPercentageOfBasePrice}
                  helperText={getErrorByName(schema, 'discountPercentageOfBasePrice').message}
                  error={getErrorByName(schema, 'discountPercentageOfBasePrice').error}
                  endAdornment={<span className='px-2'>%</span>}
                  type='number'
                  labelClasses='inside-input-label'
                  wrapperClasses='mb-0'
                  min={0}
                  max={100}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onKeyUp={(e) => {
                        const value = e && e.target && e.target.value ? (e.target.value) : 0;
                        if (Number.isNaN(value))
                        value = 0;
                        const fixed = (value && value.replace(/,/g, ''));
                        let parsedValue = fixed ? parseFloat(fixed) : 0;

                          if (parsedValue > 100) parsedValue = 100;
                          effectedFieldsByDiscountOrPerRecalculate(
                            'discountPercentageOfBasePrice',
                            parsedValue
                          );
                        }}
                />
              </div>
            </div>

            <div className='form-item'>
              <Inputs
                withNumberFormat
                idRef='sellingPriceRef'
                labelValue='selling-price'
                value={state.sellingPrice || 0}
                helperText={getErrorByName(schema, 'sellingPrice').message}
                error={getErrorByName(schema, 'sellingPrice').error}
                endAdornment={<span className='px-2'>AED</span>}
                type='number'
                min={0}
                isDisabled
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </div>
            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput
                isDisabled={isReadOnly}
                withNumberFormat
                idRef='admRegistrationFeesRef'
                labelValue='municipal-registration-fees'
                labelClasses='has-inside-label'
                value={state.admRegistrationFees}
                helperText={getErrorByName(schema, 'admRegistrationFees').message}
                error={getErrorByName(schema, 'admRegistrationFees').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.sellingPrice)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                  const effectedByValue = (state.sellingPrice);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = effectedByValue ? (parsedValue / effectedByValue) * 100 : 0;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      admRegistrationFees: parsedValue,
                      admRegistrationFeesPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />

              <div className='input-container'>
                <Inputs
                  isAttachedInput
                  withNumberFormat
                  isDisabled={isReadOnly}
                  idRef='admRegistrationFeesPercentageOfSellingPriceRef'
                  labelValue='of-selling-price'
                  value={state.admRegistrationFeesPercentageOfSellingPrice}
                  helperText={
                        getErrorByName(schema, 'admRegistrationFeesPercentageOfSellingPrice')
                          .message
                      }
                  error={
                        getErrorByName(schema, 'admRegistrationFeesPercentageOfSellingPrice').error
                      }
                  endAdornment={<span className='px-2'>%</span>}
                  type='number'
                  labelClasses='inside-input-label'
                  wrapperClasses='mb-0'
                  min={0}
                  max={100}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onKeyUp={(e) => {
                        const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                        if (parsedValue > 100) parsedValue = 100;
                        const effectedValue = state.sellingPrice ? (((state.sellingPrice) / 100) * parsedValue) : 0;
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            admRegistrationFeesPercentageOfSellingPrice: parsedValue,
                            admRegistrationFees: effectedValue,
                          },
                        });
                      }}
                />
              </div>
            </div>

            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput
                withNumberFormat
                isDisabled={isReadOnly}
                idRef='agencyFeeBuyerRef'
                labelValue='agency-fees-buyer-description'
                labelClasses='has-inside-label'
                value={state.agencyFeeBuyer}
                helperText={getErrorByName(schema, 'agencyFeeBuyer').message}
                error={getErrorByName(schema, 'agencyFeeBuyer').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.sellingPrice)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                  const effectedByValue = (state.sellingPrice);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = effectedByValue ? ((parsedValue / effectedByValue) * 100) : 0;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      agencyFeeBuyer: parsedValue,
                      agencyFeeBuyerPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>
                <Inputs
                  isAttachedInput
                  isDisabled={isReadOnly}
                  withNumberFormat
                  idRef='agencyFeeBuyerPercentageOfSellingPriceRef'
                  labelValue='of-selling-price'
                  value={state.agencyFeeBuyerPercentageOfSellingPrice}
                  helperText={
                        getErrorByName(schema, 'agencyFeeBuyerPercentageOfSellingPrice').message
                      }
                  error={getErrorByName(schema, 'agencyFeeBuyerPercentageOfSellingPrice').error}
                  endAdornment={<span className='px-2'>%</span>}
                  type='number'
                  labelClasses='inside-input-label'
                  wrapperClasses='mb-0'
                  min={0}
                  max={100}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onKeyUp={(e) => {
                        const value = e && e.target && e.target.value ? (e.target.value) : 0;
                        if (Number.isNaN(value))
                        value = 0;
                        const fixed = (value && value.replace(/,/g, ''));
                        let parsedValue = fixed ? parseFloat(fixed) : 0;

                        if (parsedValue > 100) parsedValue = 100;
                        const effectedValue = (
                          ((state.sellingPrice) / 100) * parsedValue);
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            agencyFeeBuyerPercentageOfSellingPrice: parsedValue,
                            agencyFeeBuyer: effectedValue,
                          },
                        });
                      }}
                />
              </div>
            </div>

            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput
                isDisabled={isReadOnly}
                withNumberFormat
                idRef='transferFeeSellerRef'
                labelValue='transfer-fees-seller-description'
                labelClasses='has-inside-label'
                value={state.transferFeeSeller}
                helperText={getErrorByName(schema, 'transferFeeSeller').message}
                error={getErrorByName(schema, 'transferFeeSeller').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.sellingPrice)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                  const effectedByValue = state.sellingPrice;
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = effectedByValue ? ((parsedValue / effectedByValue) * 100) : 0;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      transferFeeSeller: parsedValue,
                      transferFeeSellerPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>

                <Inputs
                  isAttachedInput
                  isDisabled={isReadOnly}
                  withNumberFormat
                  idRef='transferFeeSellerPercentageOfBasePriceRef'
                  labelValue='of-selling-price'
                  value={state.transferFeeSellerPercentageOfSellingPrice}
                  helperText={
                        getErrorByName(schema, 'transferFeeSellerPercentageOfBasePrice').message
                      }
                  error={getErrorByName(schema, 'transferFeeSellerPercentageOfBasePrice').error}
                  endAdornment={<span className='px-2'>%</span>}
                  type='number'
                  labelClasses='inside-input-label'
                  wrapperClasses='mb-0'
                  min={0}
                  max={100}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onKeyUp={(e) => {
                        const value = e && e.target && e.target.value ? (e.target.value) : 0;
                        if (Number.isNaN(value))
                        value = 0;
                        const fixed = (value && value.replace(/,/g, ''));
                        let parsedValue = fixed ? parseFloat(fixed) : 0;

                        if (parsedValue > 100) parsedValue = 100;
                        const effectedValue =
                          ((state.sellingPrice) / 100) * parsedValue;

                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            transferFeeSellerPercentageOfSellingPrice: parsedValue,
                            transferFeeSeller: effectedValue,
                          },
                        });
                      }}
                />
              </div>
            </div>
            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput
                isDisabled={isReadOnly}
                withNumberFormat
                idRef='transferFeeBuyerRef'
                labelValue='transfer-fees-buyer-description'
                labelClasses='has-inside-label'
                value={state.transferFeeBuyer}
                helperText={getErrorByName(schema, 'transferFeeBuyer').message}
                error={getErrorByName(schema, 'transferFeeBuyer').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.basePrice)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                  const effectedByValue = state.basePrice;
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = effectedByValue ? (parsedValue / effectedByValue) * 100 : 0;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      transferFeeBuyer: parsedValue,
                      transferFeeBuyerPercentageOfBasePrice: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>
                <Inputs
                  isAttachedInput
                  withNumberFormat
                  isDisabled={isReadOnly}
                  idRef='transferFeeBuyerPercentageOfBasePriceRef'
                  labelValue='of-base-price'
                  value={state.transferFeeBuyerPercentageOfBasePrice}
                  helperText={
                        getErrorByName(schema, 'transferFeeBuyerPercentageOfBasePrice').message
                      }
                  error={getErrorByName(schema, 'transferFeeBuyerPercentageOfBasePrice').error}
                  endAdornment={<span className='px-2'>%</span>}
                  type='number'
                  labelClasses='inside-input-label'
                  wrapperClasses='mb-0'
                  min={0}
                  max={100}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onKeyUp={(e) => {
                   const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                        if (parsedValue > 100) parsedValue = 100;
                        const effectedValue =
                          ((state.basePrice) / 100) * parsedValue;

                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            transferFeeBuyerPercentageOfBasePrice: parsedValue,
                            transferFeeBuyer: effectedValue,
                          },
                        });
                      }}
                />
              </div>
            </div>
            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput
                isDisabled={isReadOnly}
                withNumberFormat
                idRef='transferFeesForCompletedPaidPropRef'
                labelValue='transfer-fees-completed-properties-description'
                labelClasses='has-inside-label'
                value={state.transferFeeCompletedAndPaidProp}
                helperText={getErrorByName(schema, 'transferFeesForCompletedPaidProp').message}
                error={getErrorByName(schema, 'transferFeesForCompletedPaidProp').error}
                endAdornment={(
                  <span className='px-2 innner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.sellingPrice)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                  const effectedByValue = (state.sellingPrice);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = effectedByValue ? (parsedValue / effectedByValue) * 100 : 0;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      transferFeeCompletedAndPaidProp: parsedValue,
                      transferFeeCompletedAndPaidPropOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>

                <Inputs
                  isAttachedInput
                  isDisabled={isReadOnly}
                  withNumberFormat
                  idRef='transferFeeCompletedAndPaidPropOfSellingPriceRef'
                  labelValue='of-selling-price'
                  value={state.transferFeeCompletedAndPaidPropOfSellingPrice}
                  helperText={
                        getErrorByName(schema, 'transferFeeCompletedAndPaidPropOfSellingPrice')
                          .message
                      }
                  error={
                        getErrorByName(schema, 'transferFeeCompletedAndPaidPropOfSellingPrice')
                          .error
                      }
                  endAdornment={<span className='px-2'>%</span>}
                  type='number'
                  labelClasses='inside-input-label'
                  wrapperClasses='mb-0'
                  min={0}
                  max={100}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onKeyUp={(e) => {
                        const value = e && e.target && e.target.value ? (e.target.value) : 0;
                        if (Number.isNaN(value))
                        value = 0;
                        const fixed = (value && value.replace(/,/g, ''));
                        let parsedValue = fixed ? parseFloat(fixed) : 0;

                        if (parsedValue > 100) parsedValue = 100;
                        const effectedValue =
                          ((state.sellingPrice) / 100) * parsedValue;

                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            transferFeeCompletedAndPaidPropOfSellingPrice: parsedValue,
                            transferFeeCompletedAndPaidProp: effectedValue,
                          },
                        });
                      }}
                />
              </div>
            </div>
            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput
                isDisabled={isReadOnly}
                idRef='sellerHasPaidRef'
                labelValue='seller-has-paid'
                withNumberFormat
                labelClasses='has-inside-label'
                value={state.sellerHasPaid}
                helperText={getErrorByName(schema, 'sellerHasPaid').message}
                error={getErrorByName(schema, 'sellerHasPaid').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.basePrice)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                  const effectedByValue = (state.sellingPrice);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = state.sellingPrice ? ((parsedValue / effectedByValue) * 100) : 0;
                  const   amountDueToDeveloper  = state.sellingPrice - parsedValue  ; 

                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      sellerHasPaid: state.sellingPrice ? parsedValue : 0,
                      sellerHasPaidPercentageOfBasePrice: effectedValue,
                      amountDueToDeveloper,
                    },
                  });
                }}
              />
              <div className='input-container'>
                <Inputs
                  isAttachedInput
                  isDisabled={isReadOnly}
                  withNumberFormat
                  idRef='sellerHasPaidPercentageOfBasePriceRef'
                  labelValue='of-selling-price'
                  value={state.sellerHasPaidPercentageOfBasePrice}
                  helperText={
                        getErrorByName(schema, 'sellerHasPaidPercentageOfBasePrice').message
                      }
                  error={getErrorByName(schema, 'sellerHasPaidPercentageOfBasePrice').error}
                  endAdornment={<span className='px-2'>%</span>}
                  type='number'
                  labelClasses='inside-input-label'
                  wrapperClasses='mb-0'
                  min={0}
                  max={100}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onKeyUp={(e) => {
                        const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;
                   if (parsedValue > 100) parsedValue = 100;
                        const effectedValue = state.sellingPrice ? (((state.sellingPrice) / 100) * parsedValue) : 0;
                    const   amountDueToDeveloper  = state.sellingPrice - effectedValue  ;
                    onStateChanged({
                      id: 'edit',
                    value: {
                      ...state,
                      sellerHasPaidPercentageOfBasePrice: parsedValue,
                      sellerHasPaid: effectedValue,
                      amountDueToDeveloper , 
                          },
                        });
                      }}
                />
              </div>
            </div>
            <div className='form-item'>
              <Inputs
                isDisabled
                withNumberFormat
                idRef='amountDueToDeveloperRef'
                labelValue='amount-due-to-developer'
                value={state.amountDueToDeveloper}
                helperText={getErrorByName(schema, 'amountDueToDeveloper').message}
                error={getErrorByName(schema, 'amountDueToDeveloper').error}
                endAdornment={<span className='px-2'>AED</span>}
                type='number'
                min={0}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                // onInputChanged={(event) => {
                //   let { value } = event.target;
                //   if (Number.isNaN(value))
                //   value = 0;
                //   if (value > state.basePrice)
                //   value = state.basePrice;

                //   onStateChanged({ id: 'amountDueToDeveloper', value });
                // }}
              />
            </div>
          </div>
        )}
        {activeTab === 1 && (
          <div className='tab-item-wrapper '>
            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput
                withNumberFormat
                isDisabled={isReadOnly}
                idRef='downPaymentRef'
                labelValue='down-payment'
                labelClasses='has-inside-label'
                value={state.downPayment}
                helperText={getErrorByName(schema, 'downPayment').message}
                error={getErrorByName(schema, 'downPayment').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.sellingPrice)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                  const effectedByValue = (state.sellingPrice);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = effectedByValue ? ((parsedValue / effectedByValue) * 100) : 0;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      downPayment: parsedValue,
                      downPaymentPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>
                <Inputs
                  isAttachedInput
                  withNumberFormat
                  isDisabled={isReadOnly}
                  idRef='downPaymentPercentageOfSellingPriceRef'
                  labelValue='of-selling-price'
                  value={state.downPaymentPercentageOfSellingPrice}
                  helperText={
                        getErrorByName(schema, 'downPaymentPercentageOfSellingPrice').message
                      }
                  error={getErrorByName(schema, 'downPaymentPercentageOfSellingPrice').error}
                  endAdornment={<span className='px-2'>%</span>}
                  type='number'
                  labelClasses='inside-input-label'
                  wrapperClasses='mb-0'
                  min={0}
                  max={100}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onKeyUp={(e) => {
                        const value = e && e.target && e.target.value ? (e.target.value) : 0;
                        if (Number.isNaN(value))
                        value = 0;
                        const fixed = (value && value.replace(/,/g, ''));
                        let parsedValue = fixed ? parseFloat(fixed) : 0;

                        if (parsedValue > 100) parsedValue = 100;
                        const effectedValue = state.sellingPrice ? (((state.sellingPrice) / 100) * parsedValue) : 0;
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            downPaymentPercentageOfSellingPrice: parsedValue,
                            downPayment: effectedValue,
                          },
                        });
                      }}
                />
              </div>
            </div>
            <div className='form-item'>
              <Inputs
                isDisabled={isReadOnly}
                idRef='loanTermByYearsRef'
                labelValue='loan-term-years'
                withNumberFormat
                value={state.loanTermByYears}
                helperText={getErrorByName(schema, 'loanTermByYears').message}
                error={getErrorByName(schema, 'loanTermByYears').error}
                type='number'
                min={0}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  if (Number.isNaN(value))
                    value = 0;
                  onStateChanged({ id: 'loanTermByYears', value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                isDisabled={isReadOnly}
                withNumberFormat
                idRef='interestRateRef'
                labelValue='interest-rate-%'
                value={state.interestRate}
                helperText={getErrorByName(schema, 'interestRate').message}
                error={getErrorByName(schema, 'interestRate').error}
                endAdornment={<span className='px-2'>%</span>}
                type='number'
                min={0}
                max={100}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  if (Number.isNaN(value))
                    value = 0;
                  if (value > 100) value = 100;
                  onStateChanged({ id: 'interestRate', value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                withNumberFormat
                isDisabled={isReadOnly}
                idRef='mortgagePerMonthRef'
                labelValue='mortgage-per-month'
                value={state.mortgagePerMonth}
                helperText={getErrorByName(schema, 'mortgagePerMonth').message}
                error={getErrorByName(schema, 'mortgagePerMonth').error}
                endAdornment={<span className='px-2'>AED</span>}
                type='number'
                min={0}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let { value } = event.target.value;
                  if (Number.isNaN(value))
                    value = 0;
                  onStateChanged({ id: 'mortgagePerMonth', value });
                }}
              />
            </div>
          </div>
        )}
        {activeTab === 2 && (
          <div className='tab-item-wrapper '>
            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput
                isDisabled={isReadOnly}
                withNumberFormat
                idRef='downPaymentForPlanOneRef'
                labelValue='down-payment-plan-1'
                labelClasses='has-inside-label'
                value={state.downPaymentForPlanOne}
                helperText={getErrorByName(schema, 'downPaymentForPlanOne').message}
                error={getErrorByName(schema, 'downPaymentForPlanOne').error}
                endAdornment={(
                  <span className='px-2'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.sellingPrice)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;
                  const effectedByValue = (state.sellingPrice);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = effectedByValue ? ((parsedValue / effectedByValue) * 100) : 0;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      downPaymentForPlanOne: state.sellingPrice ? parsedValue : 0,
                      downPaymentForPlanOnePercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>
                <Inputs
                  isAttachedInput
                  withNumberFormat
                  isDisabled={isReadOnly}
                  idRef='downPaymentForPlanOnePercentageOfSellingPriceRef'
                  labelValue='of-selling-price'
                  value={state.downPaymentForPlanOnePercentageOfSellingPrice}
                  helperText={
                        getErrorByName(schema, 'downPaymentForPlanOnePercentageOfSellingPrice')
                          .message
                      }
                  error={
                        getErrorByName(schema, 'downPaymentForPlanOnePercentageOfSellingPrice')
                          .error
                      }
                  endAdornment={<span className='px-2'>%</span>}
                  type='number'
                  labelClasses='inside-input-label'
                  wrapperClasses='mb-0'
                  min={0}
                  max={100}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onKeyUp={(e) => {
                        const value = e && e.target && e.target.value ? (e.target.value) : 0;
                        if (Number.isNaN(value))
                        value = 0;
                        const fixed = (value && value.replace(/,/g, ''));
                        let parsedValue = fixed ? parseFloat(fixed) : 0;

                        if (parsedValue > 100) parsedValue = 100;
                        const effectedValue = state.sellingPrice ? (((state.sellingPrice) / 100) * parsedValue) : 0;
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            downPaymentForPlanOnePercentageOfSellingPrice: state.sellingPrice ? parsedValue : 0,
                            downPaymentForPlanOne: effectedValue,
                          },
                        });
                      }}
                />
              </div>
            </div>

            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput
                withNumberFormat
                isDisabled={isReadOnly}
                idRef='monthlyInstallmentRef'
                labelValue='monthly-installment'
                labelClasses='has-inside-label'
                value={state.monthlyInstallment}
                helperText={getErrorByName(schema, 'monthlyInstallment').message}
                error={getErrorByName(schema, 'monthlyInstallment').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.sellingPrice)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
               const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                  const effectedByValue = (state.sellingPrice);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = effectedByValue ? (parsedValue / effectedByValue) * 100 : 0;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      monthlyInstallment: effectedByValue ? parsedValue : 0,
                      monthlyInstallmentPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>

                <Inputs
                  isAttachedInput
                  withNumberFormat
                  isDisabled={isReadOnly}
                  idRef='monthlyInstallmentPercentageOfSellingPriceRef'
                  labelValue='of-selling-price'
                  value={state.monthlyInstallmentPercentageOfSellingPrice}
                  helperText={
                        getErrorByName(schema, 'monthlyInstallmentPercentageOfSellingPrice').message
                      }
                  error={
                        getErrorByName(schema, 'monthlyInstallmentPercentageOfSellingPrice').error
                      }
                  endAdornment={<span className='px-2'>%</span>}
                  type='number'
                  labelClasses='inside-input-label'
                  wrapperClasses='mb-0'
                  min={0}
                  max={100}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onKeyUp={(e) => {
               const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                        if (parsedValue > 100) parsedValue = 100;
                        const effectedValue = state.sellingPrice ? ((state.sellingPrice / 100) * parsedValue) : 0;
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            monthlyInstallmentPercentageOfSellingPrice: state.sellingPrice ? parsedValue : 0,
                            monthlyInstallment: effectedValue,
                          },
                        });
                      }}
                />
              </div>
            </div>
            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput
                isDisabled={isReadOnly}
                withNumberFormat
                idRef='handoverPaymentForPlanOneRef'
                labelValue='handover-payment-plan-1'
                labelClasses='has-inside-label'
                value={state.handoverPaymentForPlanOne}
                helperText={getErrorByName(schema, 'handoverPaymentForPlanOne').message}
                error={getErrorByName(schema, 'handoverPaymentForPlanOne').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.sellingPrice)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;
                  const effectedByValue = state.sellingPrice;
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = state.sellingPrice ? (parsedValue / effectedByValue) * 100 : 0;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      handoverPaymentForPlanOne: state.sellingPrice ? parsedValue : 0,
                      handoverPaymentForPlanOnePercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>

                <Inputs
                  isAttachedInput
                  withNumberFormat
                  isDisabled={isReadOnly}
                  idRef='handoverPaymentForPlanOnePercentageOfSellingPriceRef'
                  labelValue='of-selling-price'
                  value={state.handoverPaymentForPlanOnePercentageOfSellingPrice}
                  helperText={
                        getErrorByName(schema, 'handoverPaymentForPlanOnePercentageOfSellingPrice')
                          .message
                      }
                  error={
                        getErrorByName(schema, 'handoverPaymentForPlanOnePercentageOfSellingPrice')
                          .error
                      }
                  endAdornment={<span className='px-2'>%</span>}
                  type='number'
                  labelClasses='inside-input-label'
                  wrapperClasses='mb-0'
                  min={0}
                  max={100}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onKeyUp={(e) => {
                        const value = e && e.target && e.target.value ? (e.target.value) : 0;
                        if (Number.isNaN(value))
                        value = 0;
                        const fixed = (value && value.replace(/,/g, ''));
                        let parsedValue = fixed ? parseFloat(fixed) : 0;

                        if (parsedValue > 100) parsedValue = 100;
                        const effectedValue = state.sellingPrice ? ((state.sellingPrice) / 100) * parsedValue : 0;
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            handoverPaymentForPlanOnePercentageOfSellingPrice: state.sellingPrice ? parsedValue : 0,
                            handoverPaymentForPlanOne: state.sellingPrice ? effectedValue : 0,
                          },
                        });
                      }}
                />
              </div>
            </div>
          </div>
        )}
        {activeTab === 3 && (
          <div className='tab-item-wrapper '>
            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput
                withNumberFormat
                isDisabled={isReadOnly}
                idRef='downPaymentForPlanTwoRef'
                labelValue='down-payment-plan-2'
                labelClasses='has-inside-label'
                value={state.downPaymentForPlanTwo}
                helperText={getErrorByName(schema, 'downPaymentForPlanTwo').message}
                error={getErrorByName(schema, 'downPaymentForPlanTwo').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.sellingPrice)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                  const effectedByValue = (state.sellingPrice);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = state.sellingPrice ? ((parsedValue / effectedByValue) * 100) : 0;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      downPaymentForPlanTwo: state.sellingPrice ? parsedValue : 0,
                      downPaymentForPlanTwoPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>
                <Inputs
                  isAttachedInput
                  withNumberFormat
                  isDisabled={isReadOnly}
                  idRef='downPaymentForPlanTwoPercentageOfSellingPriceRef'
                  labelValue='of-selling-price'
                  value={state.downPaymentForPlanTwoPercentageOfSellingPrice}
                  helperText={
                        getErrorByName(schema, 'downPaymentForPlanTwoPercentageOfSellingPrice')
                          .message
                      }
                  error={
                        getErrorByName(schema, 'downPaymentForPlanTwoPercentageOfSellingPrice')
                          .error
                      }
                  endAdornment={<span className='px-2'>%</span>}
                  type='number'
                  labelClasses='inside-input-label'
                  wrapperClasses='mb-0'
                  min={0}
                  max={100}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onKeyUp={(e) => {
                        const value = e && e.target && e.target.value ? (e.target.value) : 0;
                        if (Number.isNaN(value))
                        value = 0;
                        const fixed = (value && value.replace(/,/g, ''));
                        let parsedValue = fixed ? parseFloat(fixed) : 0;

                        if (parsedValue > 100) parsedValue = 100;
                        const effectedValue = state.sellingPrice ? ((state.sellingPrice) / 100) * parsedValue : 0;

                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            downPaymentForPlanTwoPercentageOfSellingPrice: state.sellingPrice ? parsedValue : 0,
                            downPaymentForPlanTwo: effectedValue,
                          },
                        });
                      }}
                />
              </div>
            </div>
            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput
                isDisabled={isReadOnly}
                idRef='handoverPaymentForPlanTwoRef'
                labelValue='handover-payment-plan-2'
                withNumberFormat
                labelClasses='has-inside-label'
                value={state.handoverPaymentForPlanTwo}
                helperText={getErrorByName(schema, 'handoverPaymentForPlanTwo').message}
                error={getErrorByName(schema, 'handoverPaymentForPlanTwo').error}
                endAdornment={(
                  <span className='px-2'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.sellingPrice)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                  const effectedByValue = (state.sellingPrice);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = state.sellingPrice ? ((parsedValue / effectedByValue) * 100) : 0;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      handoverPaymentForPlanTwo: state.sellingPrice ? parsedValue : 0,
                      handoverPaymentForPlanTwoPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>
                <Inputs
                  isAttachedInput
                  isDisabled={isReadOnly}
                  withNumberFormat
                  idRef='handoverPaymentForPlanTwoPercentageOfSellingPriceRef'
                  labelValue='of-selling-price'
                  value={state.handoverPaymentForPlanTwoPercentageOfSellingPrice}
                  helperText={
                        getErrorByName(schema, 'handoverPaymentForPlanTwoPercentageOfSellingPrice')
                          .message
                      }
                  error={
                        getErrorByName(schema, 'handoverPaymentForPlanTwoPercentageOfSellingPrice')
                          .error
                      }
                  endAdornment={<span className='px-2'>%</span>}
                  type='number'
                  labelClasses='inside-input-label'
                  wrapperClasses='mb-0'
                  min={0}
                  max={100}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onKeyUp={(e) => {
                   const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  if (Number.isNaN(value))
                  value = 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedValue = fixed ? parseFloat(fixed) : 0;

                        if (parsedValue > 100) parsedValue = 100;
                        const effectedValue = state.sellingPrice ? ((state.sellingPrice) / 100) * parsedValue : 0;
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            handoverPaymentForPlanTwoPercentageOfSellingPrice: state.sellingPrice ? parsedValue : 0,
                            handoverPaymentForPlanTwo: effectedValue,
                          },
                        });
                      }}
                />
              </div>
            </div>
            <div className='form-item radio-item'>
              <RadiosGroupComponent
                isDisabled={isReadOnly}
                idRef='isPriceOnApplicationRef'
                labelValue='is-price-on-application'
                data={[
                  {
                    key: true,
                    value: 'yes',
                  },
                  {
                    key: false,
                    value: 'no',
                  },
                ]}
                value={state.priceOnApplication}
                parentTranslationPath={parentTranslationPath}
                translationPathForData={translationPath}
                translationPath={translationPath}
                labelInput='value'
                valueInput='key'
                onSelectedRadioChanged={(e, newValue) =>
                  onStateChanged({ id: 'priceOnApplication', value: newValue === 'true' })}
              />
            </div>
            <div className='form-item radio-item'>
              <RadiosGroupComponent
                isDisabled={isReadOnly}
                idRef='isNegotiableRef'
                labelValue='is-negotiable'
                data={[
                  {
                    key: true,
                    value: 'yes',
                  },
                  {
                    key: false,
                    value: 'no',
                  },
                ]}
                value={state.negotiable}
                parentTranslationPath={parentTranslationPath}
                translationPathForData={translationPath}
                translationPath={translationPath}
                labelInput='value'
                valueInput='key'
                onSelectedRadioChanged={(e, newValue) =>
                  onStateChanged({ id: 'negotiable', value: newValue === 'true' })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                withNumberFormat
                isDisabled={isReadOnly}
                idRef='sellingPricePerSQFTRef'
                labelValue='selling-price-per-sq-ft'
                value={state.sellingPricePerSquareFeet}
                helperText={getErrorByName(schema, 'sellingPricePerSQFT').message}
                error={getErrorByName(schema, 'sellingPricePerSQFT').error}
                endAdornment={<span className='px-2'>AED</span>}
                type='number'
                min={0}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  if (Number.isNaN(value))
                    value = 0;
                  onStateChanged({ id: 'sellingPricePerSquareFeet', value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                isDisabled={isReadOnly}
                withNumberFormat
                idRef='originalPricePerSQFTRef'
                labelValue='original-price-per-sq-ft'
                value={state.originalPricePerSquareFeet}
                helperText={getErrorByName(schema, 'originalPricePerSQFT').message}
                error={getErrorByName(schema, 'originalPricePerSQFT').error}
                endAdornment={<span className='px-2'>AED</span>}
                type='number'
                min={0}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let { value } = event.target;
                  if (Number.isNaN(value))
                    value = 0;
                  onStateChanged({ id: 'originalPricePerSquareFeet', value });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

UnitProfileSaleDetailsComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  isReadOnly: PropTypes.bool,
};

UnitProfileSaleDetailsComponent.defaultProps = {
  isReadOnly: false,
};
