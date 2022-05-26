import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
// import { useTranslation } from 'react-i18next';
import { Inputs, RadiosGroupComponent, TabsComponent } from '../../../../../../../Components';
import { floatHandler, getErrorByName } from '../../../../../../../Helper';
import { UnitProfileSaleDetailsComponentTabsData } from '../../../../UnitsProfileManagementView/Sections/UnitProfileSaleDetailsComponent/PropertiesProfileSpecificationTabsData';

export const DetailsSaleRelatedComponent = ({
  state,
  schema,
  isSubmitted,
  onStateChanged,
  parentTranslationPath,
  translationPath,
}) => {
  // const { t } = useTranslation(parentTranslationPath);
  const [activeTab, setActiveTab] = useState(0);
  const effectedFieldsBySellingPriceRecalculate = useCallback(
    (effectorNewValue = 0) => {
      const admRegistrationFees = floatHandler(
        (+effectorNewValue / 100) * state.admRegistrationFeesPercentageOfSellingPrice,
        3
      );
      const agencyFeeBuyer = floatHandler(
        (+effectorNewValue / 100) * state.agencyFeeBuyerPercentageOfSellingPrice,
        3
      );
      const transferFeeCompletedAndPaidProp = floatHandler(
        (+effectorNewValue / 100) * state.transferFeeCompletedAndPaidPropOfSellingPrice,
        3
      );
      const downPayment = floatHandler(
        (+effectorNewValue / 100) * state.downPaymentPercentageOfSellingPrice,
        3
      );
      const downPaymentForPlanOne = floatHandler(
        (+effectorNewValue / 100) * state.downPaymentForPlanOnePercentageOfSellingPrice,
        3
      );
      const monthlyInstallment = floatHandler(
        (+effectorNewValue / 100) * state.monthlyInstallmentPercentageOfSellingPrice,
        3
      );
      const handoverPaymentForPlanOne = floatHandler(
        (+effectorNewValue / 100) * state.handoverPaymentForPlanOnePercentageOfSellingPrice,
        3
      );
      const downPaymentForPlanTwo = floatHandler(
        (+effectorNewValue / 100) * state.downPaymentForPlanTwoPercentageOfSellingPrice,
        3
      );
      const handoverPaymentForPlanTwo = floatHandler(
        (+effectorNewValue / 100) * state.handoverPaymentForPlanTwoPercentageOfSellingPrice,
        3
      );
      const transferFeeSeller = floatHandler(
        (+effectorNewValue / 100) * state.transferFeeSellerPercentageOfSellingPrice,
        3
      );
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
      };
    },
    [state]
  );
  const effectedFieldsByBasePriceRecalculate = (effectorNewValue = 0) => {
    // if (effectorName === 'basePrice') {
    const premium = floatHandler((effectorNewValue / 100) * state.premiumPercentageOfBasePrice, 3);
    const agencyFees = floatHandler(
      ((+premium + +effectorNewValue) / 100) * state.agencyFeeSellerPercentageOfBasePriceAndPremium,
      3
    );
    const discount = floatHandler(
      (effectorNewValue / 100) * state.discountPercentageOfBasePrice,
      3
    );
    const sellingPrice = +effectorNewValue + +premium - +discount;
    const transferFeeBuyer = floatHandler(
      (effectorNewValue / 100) * state.transferFeeBuyerPercentageOfBasePrice,
      3
    );
    const sellerHasPaid = floatHandler(
      (effectorNewValue / 100) * state.sellerHasPaidPercentageOfBasePrice,
      3
    );
    onStateChanged({
      id: 'edit',
      value: {
        ...state,
        basePrice: effectorNewValue,
        premium,
        agencyFees,
        discount,
        sellingPrice,
        ...effectedFieldsBySellingPriceRecalculate(sellingPrice),
        transferFeeBuyer,
        sellerHasPaid,
      },
    });
  };
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  const effectedFieldsByPremiumOrPerRecalculate = (effectorName, effectorNewValue = 0) => {
    let { premium } = state;
    let { premiumPercentageOfBasePrice } = state;
    if (effectorName === 'premiumPercentageOfBasePrice') {
      premiumPercentageOfBasePrice = effectorNewValue;
      premium = floatHandler((+(state.basePrice || 0) / 100) * premiumPercentageOfBasePrice, 3);
    } else {
      premium = effectorNewValue;
      premiumPercentageOfBasePrice = floatHandler((premium / +(state.basePrice || 0)) * 100, 3);
    }

    const agencyFees = floatHandler(
      ((+premium + +state.basePrice) / 100) * state.agencyFeeSellerPercentageOfBasePriceAndPremium,
      3
    );
    //   const discount = floatHandler((effectorNewValue / 100)
    // * state.discountPercentageOfBasePrice, 3);
    const sellingPrice = +state.basePrice + +premium - +state.discount;
    onStateChanged({
      id: 'edit',
      value: {
        ...state,
        premium,
        premiumPercentageOfBasePrice,
        agencyFees,
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
      discount = floatHandler((+state.basePrice / 100) * discountPercentageOfBasePrice, 3);
    } else {
      discount = effectorNewValue;
      discountPercentageOfBasePrice = floatHandler((discount / +state.basePrice) * 100, 3);
    }
    const sellingPrice = +state.basePrice + +state.premium - +discount;
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
  return (
    <div className='details-sale-related-wrapper childs-wrapper'>
      <TabsComponent
        data={UnitProfileSaleDetailsComponentTabsData}
        labelInput='tab'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-curved'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
      />
      <div className='tabs-content-wrapper w-100 px-2 pt-3'>
        {activeTab === 0 && (
          <>
            <div className='form-item'>
              <Inputs
                idRef='basePriceRef'
                labelValue='base-price'
                value={state.basePrice !== null ? state.basePrice : ''}
                helperText={getErrorByName(schema, 'basePrice').message}
                error={getErrorByName(schema, 'basePrice').error}
                endAdornment={<span className='px-2'>AED</span>}
                type='number'
                min={0}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  const value = floatHandler(event.target.value, 3);
                  effectedFieldsByBasePriceRecalculate(value);
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='premiumRef'
                labelValue='premium'
                labelClasses='has-inside-label'
                value={state.premium || 0}
                helperText={getErrorByName(schema, 'premium').message}
                error={getErrorByName(schema, 'premium').error}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='premiumPercentageOfBasePriceRef'
                      labelValue='of-base-price'
                      value={state.premiumPercentageOfBasePrice || 0}
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
                      onInputChanged={(event) => {
                        let value = floatHandler(event.target.value, 3);
                        if (value > 100) value = 100;
                        effectedFieldsByPremiumOrPerRecalculate(
                          'premiumPercentageOfBasePrice',
                          value
                        );
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.basePrice || 0)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let value = floatHandler(event.target.value, 3);
                  if (value > +(state.basePrice || 0)) value = +(state.basePrice || 0);
                  effectedFieldsByPremiumOrPerRecalculate('premium', value);
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='agencyFeesRef'
                labelValue='agency-fees-sale-description'
                labelClasses='has-inside-label'
                value={state.agencyFees || 0}
                helperText={getErrorByName(schema, 'agencyFees').message}
                error={getErrorByName(schema, 'agencyFees').error}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='agencyFeeSellerPercentageOfBasePriceAndPremiumRef'
                      labelValue='of-base-price-premium'
                      value={state.agencyFeeSellerPercentageOfBasePriceAndPremium || 0}
                      helperText={
                        getErrorByName(schema, 'agencyFeeSellerPercentageOfBasePriceAndPremium')
                          .message
                      }
                      error={
                        getErrorByName(schema, 'agencyFeeSellerPercentageOfBasePriceAndPremium')
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
                      onInputChanged={(event) => {
                        let value = floatHandler(event.target.value, 3);
                        if (value > 100) value = 100;
                        const effectedValue = floatHandler(
                          ((+(state.premium || 0) + +(state.basePrice || 0)) / 100) * value,
                          3
                        );
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            agencyFeeSellerPercentageOfBasePriceAndPremium: +(value || 0),
                            agencyFees: effectedValue,
                          },
                        });
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.premium || 0) + +(state.basePrice || 0)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let value = floatHandler(event.target.value, 3);
                  const total = +(state.premium || 0) + +(state.basePrice || 0);
                  if (value > total) value = total;
                  const effectedValue = floatHandler((value / total) * 100, 3);
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      agencyFees: value,
                      agencyFeeSellerPercentageOfBasePriceAndPremium: +(effectedValue || 0),
                    },
                  });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='discountRef'
                labelValue='discount'
                labelClasses='has-inside-label'
                value={state.discount || 0}
                helperText={getErrorByName(schema, 'discount').message}
                error={getErrorByName(schema, 'discount').error}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='discountPercentageOfBasePriceRef'
                      labelValue='of-base-price'
                      value={state.discountPercentageOfBasePrice || 0}
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
                      onInputChanged={(event) => {
                        let value = floatHandler(event.target.value, 3);
                        if (value > 100) value = 100;
                        effectedFieldsByDiscountOrPerRecalculate(
                          'discountPercentageOfBasePrice',
                          value
                        );
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.basePrice || 0)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let value = floatHandler(event.target.value, 3);
                  const total = +(state.basePrice || 0);
                  if (value > total) value = total;
                  effectedFieldsByDiscountOrPerRecalculate('discount', value);
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
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
            <div className='form-item'>
              <Inputs
                idRef='admRegistrationFeesRef'
                labelValue='municipal-registration-fees'
                labelClasses='has-inside-label'
                value={state.admRegistrationFees || 0}
                helperText={getErrorByName(schema, 'admRegistrationFees').message}
                error={getErrorByName(schema, 'admRegistrationFees').error}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='admRegistrationFeesPercentageOfSellingPriceRef'
                      labelValue='of-selling-price'
                      value={state.admRegistrationFeesPercentageOfSellingPrice || 0}
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
                      onInputChanged={(event) => {
                        let value = floatHandler(event.target.value, 3);
                        if (value > 100) value = 100;
                        const effectedValue = floatHandler(
                          (+(state.sellingPrice || 0) / 100) * value,
                          3
                        );
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            admRegistrationFeesPercentageOfSellingPrice: value,
                            admRegistrationFees: effectedValue,
                          },
                        });
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let value = floatHandler(event.target.value, 3);
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (value > effectedByValue) value = effectedByValue;
                  const effectedValue = floatHandler((value / effectedByValue) * 100, 3);
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      admRegistrationFees: value,
                      admRegistrationFeesPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='agencyFeeBuyerRef'
                labelValue='agency-fees-buyer-description'
                labelClasses='has-inside-label'
                value={state.agencyFeeBuyer || 0}
                helperText={getErrorByName(schema, 'agencyFeeBuyer').message}
                error={getErrorByName(schema, 'agencyFeeBuyer').error}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='agencyFeeBuyerPercentageOfSellingPriceRef'
                      labelValue='of-selling-price'
                      value={state.agencyFeeBuyerPercentageOfSellingPrice || 0}
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
                      onInputChanged={(event) => {
                        let value = floatHandler(event.target.value, 3);
                        if (value > 100) value = 100;
                        const effectedValue = floatHandler(
                          (+(state.sellingPrice || 0) / 100) * value,
                          3
                        );
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            agencyFeeBuyerPercentageOfSellingPrice: value,
                            agencyFeeBuyer: effectedValue,
                          },
                        });
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let value = floatHandler(event.target.value, 3);
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (value > effectedByValue) value = effectedByValue;
                  const effectedValue = floatHandler((value / effectedByValue) * 100, 3);
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      agencyFeeBuyer: value,
                      agencyFeeBuyerPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='transferFeeSellerRef'
                labelValue='transfer-fees-buyer-description'
                labelClasses='has-inside-label'
                value={state.transferFeeSeller || 0}
                helperText={getErrorByName(schema, 'transferFeeSeller').message}
                error={getErrorByName(schema, 'transferFeeSeller').error}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='transferFeeSellerPercentageOfSellingPriceRef'
                      labelValue='of-base-price'
                      value={state.transferFeeSellerPercentageOfSellingPrice || 0}
                      helperText={
                        getErrorByName(schema, 'transferFeeSellerPercentageOfSellingPrice').message
                      }
                      error={
                        getErrorByName(schema, 'transferFeeSellerPercentageOfSellingPrice').error
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
                      onInputChanged={(event) => {
                        let value = floatHandler(event.target.value, 3);
                        if (value > 100) value = 100;
                        const effectedValue = floatHandler(
                          (+(state.sellingPrice || 0) / 100) * value,
                          3
                        );
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            transferFeeSellerPercentageOfSellingPrice: value,
                            transferFeeSeller: effectedValue,
                          },
                        });
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let value = floatHandler(event.target.value, 3);
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (value > effectedByValue) value = effectedByValue;
                  const effectedValue = floatHandler((value / effectedByValue) * 100, 3);
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      transferFeeSeller: value,
                      transferFeeSellerPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='transferFeeBuyerRef'
                labelValue='transfer-fees-buyer-description'
                labelClasses='has-inside-label'
                value={state.transferFeeBuyer || 0}
                helperText={getErrorByName(schema, 'transferFeeBuyer').message}
                error={getErrorByName(schema, 'transferFeeBuyer').error}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='transferFeeBuyerPercentageOfBasePriceRef'
                      labelValue='of-base-price'
                      value={state.transferFeeBuyerPercentageOfBasePrice || 0}
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
                      onInputChanged={(event) => {
                        let value = floatHandler(event.target.value, 3);
                        if (value > 100) value = 100;
                        const effectedValue = floatHandler(
                          (+(state.basePrice || 0) / 100) * value,
                          3
                        );
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            transferFeeBuyerPercentageOfBasePrice: value,
                            transferFeeBuyer: effectedValue,
                          },
                        });
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.basePrice || 0)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let value = floatHandler(event.target.value, 3);
                  const effectedByValue = +(state.basePrice || 0);
                  if (value > effectedByValue) value = effectedByValue;
                  const effectedValue = floatHandler((value / effectedByValue) * 100, 3);
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      transferFeeBuyer: value,
                      transferFeeBuyerPercentageOfBasePrice: effectedValue,
                    },
                  });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='transferFeesForCompletedPaidPropRef'
                labelValue='transfer-fees-completed-properties-description'
                labelClasses='has-inside-label'
                value={state.transferFeeCompletedAndPaidProp || 0}
                helperText={getErrorByName(schema, 'transferFeeCompletedAndPaidProp').message}
                error={getErrorByName(schema, 'transferFeeCompletedAndPaidProp').error}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='transferFeeCompletedAndPaidPropOfSellingPriceRef'
                      labelValue='of-selling-price'
                      value={state.transferFeeCompletedAndPaidPropOfSellingPrice || 0}
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
                      onInputChanged={(event) => {
                        let value = floatHandler(event.target.value, 3);
                        if (value > 100) value = 100;
                        const effectedValue = floatHandler(
                          (+(state.sellingPrice || 0) / 100) * value,
                          3
                        );
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            transferFeeCompletedAndPaidPropOfSellingPrice: value,
                            transferFeeCompletedAndPaidProp: effectedValue,
                          },
                        });
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let value = floatHandler(event.target.value, 3);
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (value > effectedByValue) value = effectedByValue;
                  const effectedValue = floatHandler((value / effectedByValue) * 100, 3);
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      transferFeeCompletedAndPaidProp: value,
                      transferFeeCompletedAndPaidPropOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='sellerHasPaidRef'
                labelValue='seller-has-paid'
                labelClasses='has-inside-label'
                value={state.sellerHasPaid || 0}
                helperText={getErrorByName(schema, 'sellerHasPaid').message}
                error={getErrorByName(schema, 'sellerHasPaid').error}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='sellerHasPaidPercentageOfBasePriceRef'
                      labelValue='of-base-price'
                      value={state.sellerHasPaidPercentageOfBasePrice || 0}
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
                      onInputChanged={(event) => {
                        let value = floatHandler(event.target.value, 3);
                        if (value > 100) value = 100;
                        const effectedValue = floatHandler(
                          (+(state.basePrice || 0) / 100) * value,
                          3
                        );
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            sellerHasPaidPercentageOfBasePrice: value,
                            sellerHasPaid: effectedValue,
                          },
                        });
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.basePrice || 0)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let value = floatHandler(event.target.value, 3);
                  const effectedByValue = +(state.basePrice || 0);
                  if (value > effectedByValue) value = effectedByValue;
                  const effectedValue = floatHandler((value / effectedByValue) * 100, 3);
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      sellerHasPaid: value,
                      sellerHasPaidPercentageOfBasePrice: effectedValue,
                    },
                  });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='amountDueToDeveloperRef'
                labelValue='amount-due-to-developer'
                value={state.amountDueToDeveloper || 0}
                helperText={getErrorByName(schema, 'amountDueToDeveloper').message}
                error={getErrorByName(schema, 'amountDueToDeveloper').error}
                endAdornment={<span className='px-2'>AED</span>}
                type='number'
                min={0}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  const value = floatHandler(event.target.value, 3);
                  onStateChanged({ id: 'amountDueToDeveloper', value });
                }}
              />
            </div>
          </>
        )}
        {activeTab === 1 && (
          <>
            <div className='form-item'>
              <Inputs
                idRef='downPaymentRef'
                labelValue='down-payment'
                labelClasses='has-inside-label'
                value={state.downPayment || 0}
                helperText={getErrorByName(schema, 'downPayment').message}
                error={getErrorByName(schema, 'downPayment').error}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='downPaymentPercentageOfSellingPriceRef'
                      labelValue='of-selling-price'
                      value={state.downPaymentPercentageOfSellingPrice || 0}
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
                      onInputChanged={(event) => {
                        let value = floatHandler(event.target.value, 3);
                        if (value > 100) value = 100;
                        const effectedValue = floatHandler(
                          (+(state.sellingPrice || 0) / 100) * value,
                          3
                        );
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            downPaymentPercentageOfSellingPrice: value,
                            downPayment: effectedValue,
                          },
                        });
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let value = floatHandler(event.target.value, 3);
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (value > effectedByValue) value = effectedByValue;
                  const effectedValue = floatHandler((value / effectedByValue) * 100, 3);
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      downPayment: value,
                      downPaymentPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='loanTermByYearsRef'
                labelValue='loan-term-years'
                value={state.loanTermByYears || 0}
                helperText={getErrorByName(schema, 'loanTermByYears').message}
                error={getErrorByName(schema, 'loanTermByYears').error}
                type='number'
                min={0}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  const value = floatHandler(event.target.value, 3);
                  onStateChanged({ id: 'loanTermByYears', value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='interestRateRef'
                labelValue='interest-rate-%'
                value={state.interestRate || 0}
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
                  let value = floatHandler(event.target.value, 3);
                  if (value > 100) value = 100;
                  onStateChanged({ id: 'interestRate', value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='mortgagePerMonthRef'
                labelValue='mortgage-per-month'
                value={state.mortgagePerMonth || 0}
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
                  const value = floatHandler(event.target.value, 3);
                  onStateChanged({ id: 'mortgagePerMonth', value });
                }}
              />
            </div>
          </>
        )}
        {/* <div className="form-title-wrapper">
        <span className="form-title">{t(`${translationPath}for-finance-team-use-only`)}</span>
      </div> */}

        {/* <div className="form-title-wrapper">
        <span className="form-title">{t(`${translationPath}payment-plan-1`)}</span>
      </div> */}
        {activeTab === 2 && (
          <>
            <div className='form-item'>
              <Inputs
                idRef='downPaymentForPlanOneRef'
                labelValue='down-payment-plan-1'
                labelClasses='has-inside-label'
                value={state.downPaymentForPlanOne || 0}
                helperText={getErrorByName(schema, 'downPaymentForPlanOne').message}
                error={getErrorByName(schema, 'downPaymentForPlanOne').error}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='downPaymentForPlanOnePercentageOfSellingPriceRef'
                      labelValue='of-selling-price'
                      value={state.downPaymentForPlanOnePercentageOfSellingPrice || 0}
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
                      onInputChanged={(event) => {
                        let value = floatHandler(event.target.value, 3);
                        if (value > 100) value = 100;
                        const effectedValue = floatHandler(
                          (+(state.sellingPrice || 0) / 100) * value,
                          3
                        );
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            downPaymentForPlanOnePercentageOfSellingPrice: value,
                            downPaymentForPlanOne: effectedValue,
                          },
                        });
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let value = floatHandler(event.target.value, 3);
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (value > effectedByValue) value = effectedByValue;
                  const effectedValue = floatHandler((value / effectedByValue) * 100, 3);
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      downPaymentForPlanOne: value,
                      downPaymentForPlanOnePercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='monthlyInstallmentRef'
                labelValue='monthly-installment'
                labelClasses='has-inside-label'
                value={state.monthlyInstallment || 0}
                helperText={getErrorByName(schema, 'monthlyInstallment').message}
                error={getErrorByName(schema, 'monthlyInstallment').error}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='monthlyInstallmentPercentageOfSellingPriceRef'
                      labelValue='of-selling-price'
                      value={state.monthlyInstallmentPercentageOfSellingPrice || 0}
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
                      onInputChanged={(event) => {
                        let value = floatHandler(event.target.value, 3);
                        if (value > 100) value = 100;
                        const effectedValue = floatHandler(
                          (+(state.sellingPrice || 0) / 100) * value,
                          3
                        );
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            monthlyInstallmentPercentageOfSellingPrice: value,
                            monthlyInstallment: effectedValue,
                          },
                        });
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let value = floatHandler(event.target.value, 3);
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (value > effectedByValue) value = effectedByValue;
                  const effectedValue = floatHandler((value / effectedByValue) * 100, 3);
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      monthlyInstallment: value,
                      monthlyInstallmentPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='handoverPaymentForPlanOneRef'
                labelValue='handover-payment-plan-1'
                labelClasses='has-inside-label'
                value={state.handoverPaymentForPlanOne || 0}
                helperText={getErrorByName(schema, 'handoverPaymentForPlanOne').message}
                error={getErrorByName(schema, 'handoverPaymentForPlanOne').error}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='handoverPaymentForPlanOnePercentageOfSellingPriceRef'
                      labelValue='of-selling-price'
                      value={state.handoverPaymentForPlanOnePercentageOfSellingPrice || 0}
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
                      onInputChanged={(event) => {
                        let value = floatHandler(event.target.value, 3);
                        if (value > 100) value = 100;
                        const effectedValue = floatHandler(
                          (+(state.sellingPrice || 0) / 100) * value,
                          3
                        );
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            handoverPaymentForPlanOnePercentageOfSellingPrice: value,
                            handoverPaymentForPlanOne: effectedValue,
                          },
                        });
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let value = floatHandler(event.target.value, 3);
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (value > effectedByValue) value = effectedByValue;
                  const effectedValue = floatHandler((value / effectedByValue) * 100, 3);
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      handoverPaymentForPlanOne: value,
                      handoverPaymentForPlanOnePercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
            </div>
          </>
        )}

        {/* <div className="form-title-wrapper">
        <span className="form-title">{t(`${translationPath}payment-plan-2`)}</span>
      </div> */}
        {activeTab === 3 && (
          <>
            <div className='form-item'>
              <Inputs
                idRef='downPaymentForPlanTwoRef'
                labelValue='down-payment-plan-2'
                labelClasses='has-inside-label'
                value={state.downPaymentForPlanTwo || 0}
                helperText={getErrorByName(schema, 'downPaymentForPlanTwo').message}
                error={getErrorByName(schema, 'downPaymentForPlanTwo').error}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='downPaymentForPlanTwoPercentageOfSellingPriceRef'
                      labelValue='of-selling-price'
                      value={state.downPaymentForPlanTwoPercentageOfSellingPrice || 0}
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
                      onInputChanged={(event) => {
                        let value = floatHandler(event.target.value, 3);
                        if (value > 100) value = 100;
                        const effectedValue = floatHandler(
                          (+(state.sellingPrice || 0) / 100) * value,
                          3
                        );
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            downPaymentForPlanTwoPercentageOfSellingPrice: value,
                            downPaymentForPlanTwo: effectedValue,
                          },
                        });
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let value = floatHandler(event.target.value, 3);
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (value > effectedByValue) value = effectedByValue;
                  const effectedValue = floatHandler((value / effectedByValue) * 100, 3);
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      downPaymentForPlanTwo: value,
                      downPaymentForPlanTwoPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='handoverPaymentForPlanTwoRef'
                labelValue='handover-payment-plan-2'
                labelClasses='has-inside-label'
                value={state.handoverPaymentForPlanTwo || 0}
                helperText={getErrorByName(schema, 'handoverPaymentForPlanTwo').message}
                error={getErrorByName(schema, 'handoverPaymentForPlanTwo').error}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='handoverPaymentForPlanTwoPercentageOfSellingPriceRef'
                      labelValue='of-selling-price'
                      value={state.handoverPaymentForPlanTwoPercentageOfSellingPrice || 0}
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
                      onInputChanged={(event) => {
                        let value = floatHandler(event.target.value, 3);
                        if (value > 100) value = 100;
                        const effectedValue = floatHandler(
                          (+(state.sellingPrice || 0) / 100) * value,
                          3
                        );
                        onStateChanged({
                          id: 'edit',
                          value: {
                            ...state,
                            handoverPaymentForPlanTwoPercentageOfSellingPrice: value,
                            handoverPaymentForPlanTwo: effectedValue,
                          },
                        });
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  let value = floatHandler(event.target.value, 3);
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (value > effectedByValue) value = effectedByValue;
                  const effectedValue = floatHandler((value / effectedByValue) * 100, 3);
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      handoverPaymentForPlanTwo: value,
                      handoverPaymentForPlanTwoPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
            </div>
            <div className='form-item'>
              <RadiosGroupComponent
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
                value={state.isPriceOnApplication}
                parentTranslationPath={parentTranslationPath}
                translationPathForData={translationPath}
                translationPath={translationPath}
                labelInput='value'
                valueInput='key'
                onSelectedRadioChanged={(e, newValue) =>
                  onStateChanged({ id: 'isPriceOnApplication', value: newValue === 'true' })}
              />
            </div>
            <div className='form-item'>
              <RadiosGroupComponent
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
                value={state.isNegotiable}
                parentTranslationPath={parentTranslationPath}
                translationPathForData={translationPath}
                translationPath={translationPath}
                labelInput='value'
                valueInput='key'
                onSelectedRadioChanged={(e, newValue) =>
                  onStateChanged({ id: 'isNegotiable', value: newValue === 'true' })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='sellingPricePerSQFTRef'
                labelValue='selling-price-per-sq-ft'
                value={state.sellingPricePerSQFT || 0}
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
                  const value = floatHandler(event.target.value, 3);
                  onStateChanged({ id: 'sellingPricePerSQFT', value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='originalPricePerSQFTRef'
                labelValue='original-price-per-sq-ft'
                value={state.originalPricePerSQFT || 0}
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
                  const value = floatHandler(event.target.value, 3);
                  onStateChanged({ id: 'originalPricePerSQFT', value });
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

DetailsSaleRelatedComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
