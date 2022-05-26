import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { useTranslation } from 'react-i18next';
import { Inputs, RadiosGroupComponent, TabsComponent } from '../../../../../../../Components';
import { getErrorByName } from '../../../../../../../Helper';
import { UnitProfileSaleDetailsComponentTabsData } from '../../../../UnitsSalesProfileManagement/Sections/UnitProfileSaleDetailsComponent/PropertiesProfileSpecificationTabsData';

export const DetailsSaleRelatedComponent = ({
  state,
  schema,
  isSubmitted,
  onStateChanged,
  parentTranslationPath,
  translationPath,
}) => {
  // const { t } = useTranslation(parentTranslationPath);
  useEffect(() => {
    if (state.basePrice === 0) {
      const getSaleTransactionDetails = localStorage.getItem('saleTransactionDetails');
      if (getSaleTransactionDetails) {
        const saleTransactionDetails = JSON.parse(getSaleTransactionDetails);
        onStateChanged({
          id: 'edit',
          value: {
            ...state,
            basePrice: (saleTransactionDetails && saleTransactionDetails.basePrice ? saleTransactionDetails.basePrice : 0),
            premium: ((saleTransactionDetails && saleTransactionDetails.premium) || 0),
            sellingPrice: ((saleTransactionDetails && saleTransactionDetails.sellingPrice) || 0),
            premiumPercentageOfBasePrice: ((saleTransactionDetails && saleTransactionDetails.premiumPercentageOfBasePrice) || 0),
            agencyFeeSeller: ((saleTransactionDetails && saleTransactionDetails.premiumPercentageOfBasePrice) || 0),
            transferFeeBuyer: ((saleTransactionDetails && saleTransactionDetails.transferFeeBuyer) || 0),
            transferFeeBuyerPercentageOfBasePrice: ((saleTransactionDetails && saleTransactionDetails.transferFeeBuyerPercentageOfBasePrice) || 0),
            sellerHasPaidPercentageOfBasePrice: ((saleTransactionDetails && saleTransactionDetails.sellerHasPaidPercentageOfBasePrice) || 0),
            sellerHasPaid: ((saleTransactionDetails && saleTransactionDetails.sellerHasPaid) || 0),
            admRegistrationFees: ((saleTransactionDetails && saleTransactionDetails.admRegistrationFees) || 0),
            admRegistrationFeesPercentageOfSellingPrice: ((saleTransactionDetails && saleTransactionDetails.admRegistrationFeesPercentageOfSellingPrice) || 0),
            transferFeeSeller: ((saleTransactionDetails && saleTransactionDetails.transferFeeSeller) || 0),
            transferFeeSellerPercentageOfSellingPrice: ((saleTransactionDetails && saleTransactionDetails.transferFeeSellerPercentageOfSellingPrice) || 0),
            amountDueToDeveloper: ((saleTransactionDetails && saleTransactionDetails.amountDueToDeveloper) || 0),
            agencyFeeBuyer: ((saleTransactionDetails && saleTransactionDetails.agencyFeeBuyer) || 0),
            agencyFeeBuyerPercentageOfSellingPrice: ((saleTransactionDetails && saleTransactionDetails.agencyFeeBuyerPercentageOfSellingPrice) || 0),
            discount: ((saleTransactionDetails && saleTransactionDetails.discount) || 0),
            transferFeeCompletedAndPaidProp: ((saleTransactionDetails && saleTransactionDetails.transferFeeCompletedAndPaidProp) || 0),
            transferFeeCompletedAndPaidPropOfSellingPrice: ((saleTransactionDetails && saleTransactionDetails.transferFeeCompletedAndPaidPropOfSellingPrice) || 0),
            agencyFeeSellerPercentageOfBasePriceAndPremium: ((saleTransactionDetails && saleTransactionDetails.agencyFeeSellerPercentageOfBasePriceAndPremium) || 0),
            discountPercentageOfBasePrice: ((saleTransactionDetails && saleTransactionDetails.discountPercentageOfBasePrice) || 0)
          },
        });
      }
    }
  }, []);

  const [activeTab, setActiveTab] = useState(0);
  const effectedFieldsBySellingPriceRecalculate = useCallback(
    (effectorNewValue = 0) => {
      const admRegistrationFees =
        (+effectorNewValue / 100) * state.admRegistrationFeesPercentageOfSellingPrice;

      const agencyFeeBuyer =
        (+effectorNewValue / 100) * state.agencyFeeBuyerPercentageOfSellingPrice;

      const transferFeeCompletedAndPaidProp =
        (+effectorNewValue / 100) * state.transferFeeCompletedAndPaidPropOfSellingPrice;

      const downPayment =
        (+effectorNewValue / 100) * state.downPaymentPercentageOfSellingPrice;

      const downPaymentForPlanOne =
        (+effectorNewValue / 100) * state.downPaymentForPlanOnePercentageOfSellingPrice;

      const monthlyInstallment =
        (+effectorNewValue / 100) * state.monthlyInstallmentPercentageOfSellingPrice;

      const handoverPaymentForPlanOne =
        (+effectorNewValue / 100) * state.handoverPaymentForPlanOnePercentageOfSellingPrice;

      const downPaymentForPlanTwo =
        (+effectorNewValue / 100) * state.downPaymentForPlanTwoPercentageOfSellingPrice;

      const handoverPaymentForPlanTwo =
        (+effectorNewValue / 100) * state.handoverPaymentForPlanTwoPercentageOfSellingPrice;

      const transferFeeSeller =
        (+effectorNewValue / 100) * state.transferFeeSellerPercentageOfSellingPrice;

        const sellerHasPaid =
        (+effectorNewValue / 100) * state.sellerHasPaidPercentageOfBasePrice;

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
        sellerHasPaid , 
        amountDueToDeveloper ,
      };
    },
    [state]
  );
  const effectedFieldsByBasePriceRecalculate = (effectorNewValue = 0) => {
    // if (effectorName === 'basePrice') {
    const premium = (effectorNewValue / 100) * state.premiumPercentageOfBasePrice;
    const agencyFees =
      ((+premium + +effectorNewValue) / 100) * state.agencyFeeSellerPercentageOfBasePriceAndPremium;

    const discount =
      (effectorNewValue / 100) * state.discountPercentageOfBasePrice;

    const sellingPrice = +effectorNewValue + +premium - +discount;
    const transferFeeBuyer =
      (effectorNewValue / 100) * state.transferFeeBuyerPercentageOfBasePrice;

    
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
      premiumPercentageOfBasePrice = +effectorNewValue;
      premium = (+(state.basePrice || 0) / 100) * +premiumPercentageOfBasePrice;
    } else {
      premium = effectorNewValue;
      premiumPercentageOfBasePrice = (+premium / +(state.basePrice || 0)) * 100;
    }

    const agencyFees =
      ((+premium + +state.basePrice) / 100) * state.agencyFeeSellerPercentageOfBasePriceAndPremium;

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
      discount = (+state.basePrice / 100) * discountPercentageOfBasePrice;
    } else {
      discount = effectorNewValue;
      discountPercentageOfBasePrice = (discount / +state.basePrice) * 100;
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
                withNumberFormat
                idRef='basePriceRef'
                labelValue='base-price'
                value={state.basePrice}
                helperText={getErrorByName(schema, 'basePrice').message}
                error={getErrorByName(schema, 'basePrice').error}
                endAdornment={<span className='px-2'>AED</span>}
                type='number'
                min={0}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                // onInputChanged={(event) => {
                //   const { value } = event.target;
                //   effectedFieldsByBasePriceRecalculate(value);
                // }}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  const editValue =   fixed ? parseFloat(fixed) : 0 ;
                  effectedFieldsByBasePriceRecalculate(editValue);

                 }
                }
              />
            </div>
            <div className='form-item form-item-wrapper'>
              <Inputs
                withNumberFormat
                isAttachedInput
                idRef='premiumRef'
                labelValue='premium'
                labelClasses='has-inside-label'
                value={state.premium || 0}
                helperText={getErrorByName(schema, 'premium').message}
                error={getErrorByName(schema, 'premium').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={+(state.basePrice || 0)}
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

                  if (parsedValue > +(state.basePrice || 0)) parsedValue = +(state.basePrice || 0);
                  effectedFieldsByPremiumOrPerRecalculate('premium', parsedValue);
                }}
              />

              <div className='input-container'>
                <Inputs
                  withNumberFormat
                  isAttachedInput
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
                withNumberFormat
                isAttachedInput
                idRef='agencyFeesRef'
                labelValue='agency-fees-sale-description'
                labelClasses='has-inside-label'
                value={state.agencyFeeSeller || 0}
                helperText={getErrorByName(schema, 'agencyFees').message}
                error={getErrorByName(schema, 'agencyFees').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={+(state.premium || 0) + +(state.basePrice || 0)}
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
                  const total = +(state.premium || 0) + +(state.basePrice || 0);
                  if (parsedValue > total) parsedValue = total;
                  const effectedValue = (parsedValue / total) * 100;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      agencyFeeSeller: parsedValue,
                      agencyFeeSellerPercentageOfBasePriceAndPremium: +(effectedValue || 0),
                    },
                  });
                }}
              />
              <div className='input-container'>
                <Inputs
                  withNumberFormat
                  isAttachedInput
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
                  onKeyUp={(e) => {
                    const value = e && e.target && e.target.value ? (e.target.value) : 0;
                    if (Number.isNaN(value))
                      value = 0;
                    const fixed = (value && value.replace(/,/g, ''));
                    let parsedValue = fixed ? parseFloat(fixed) : 0;
                    if (parsedValue > 100) parsedValue = 100;
                    const effectedValue =
                      ((+(state.premium || 0) + +(state.basePrice || 0)) / 100) * parsedValue;

                    onStateChanged({
                      id: 'edit',
                      value: {
                        ...state,
                        agencyFeeSellerPercentageOfBasePriceAndPremium: +(parsedValue || 0),
                        agencyFeeSeller: effectedValue,
                      },
                    });
                  }}
                />
              </div>
            </div>
            <div className='form-item form-item-wrapper'>
              <Inputs
                withNumberFormat
                isAttachedInput
                idRef='discountRef'
                labelValue='discount'
                labelClasses='has-inside-label'
                value={state.discount || 0}
                helperText={getErrorByName(schema, 'discount').message}
                error={getErrorByName(schema, 'discount').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={+(state.basePrice || 0)}
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
                  const total = +(state.basePrice || 0);
                  if (parsedValue > total) parsedValue = total;
                  effectedFieldsByDiscountOrPerRecalculate('discount', parsedValue);
                }}
              />
              <div className='input-container'>
                <Inputs
                  withNumberFormat
                  isAttachedInput
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
                withNumberFormat
                isAttachedInput
                idRef='admRegistrationFeesRef'
                labelValue='municipal-registration-fees'
                labelClasses='has-inside-label'
                value={state.admRegistrationFees || 0}
                helperText={getErrorByName(schema, 'admRegistrationFees').message}
                error={getErrorByName(schema, 'admRegistrationFees').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
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
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = (parsedValue / effectedByValue) * 100;
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
                  withNumberFormat
                  isAttachedInput
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
                  onKeyUp={(e) => {
                    const value = e && e.target && e.target.value ? (e.target.value) : 0;
                    if (Number.isNaN(value))
                      value = 0;
                    const fixed = (value && value.replace(/,/g, ''));
                    let parsedValue = fixed ? parseFloat(fixed) : 0;
                    if (parsedValue > 100) parsedValue = 100;
                    const effectedValue =
                      (+(state.sellingPrice || 0) / 100) * parsedValue;

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
                withNumberFormat
                isAttachedInput
                idRef='agencyFeeBuyerRef'
                labelValue='agency-fees-buyer-description'
                labelClasses='has-inside-label'
                value={state.agencyFeeBuyer || 0}
                helperText={getErrorByName(schema, 'agencyFeeBuyer').message}
                error={getErrorByName(schema, 'agencyFeeBuyer').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
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
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = (parsedValue / effectedByValue) * 100;
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
                  withNumberFormat
                  isAttachedInput
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
                  onKeyUp={(e) => {
                    const value = e && e.target && e.target.value ? (e.target.value) : 0;
                    if (Number.isNaN(value))
                      value = 0;
                    const fixed = (value && value.replace(/,/g, ''));
                    let parsedValue = fixed ? parseFloat(fixed) : 0;
                    if (parsedValue > 100) parsedValue = 100;
                    const effectedValue =
                      (+(state.sellingPrice || 0) / 100) * parsedValue;
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
                withNumberFormat
                isAttachedInput
                idRef='transferFeeSellerRef'
                labelValue='transfer-fees-seller-description'
                labelClasses='has-inside-label'
                value={state.transferFeeSeller || 0}
                helperText={getErrorByName(schema, 'transferFeeSeller').message}
                error={getErrorByName(schema, 'transferFeeSeller').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
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
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = (parsedValue / effectedByValue) * 100;
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
                  withNumberFormat
                  isAttachedInput
                  idRef='transferFeeSellerPercentageOfSellingPriceRef'
                  labelValue='of-selling-price'
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
                  onKeyUp={(e) => {
                    const value = e && e.target && e.target.value ? (e.target.value) : 0;
                    if (Number.isNaN(value))
                      value = 0;
                    const fixed = (value && value.replace(/,/g, ''));
                    let parsedValue = fixed ? parseFloat(fixed) : 0;
                    if (parsedValue > 100) parsedValue = 100;
                    const effectedValue =
                      (+(state.sellingPrice || 0) / 100) * parsedValue;

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
                withNumberFormat
                isAttachedInput
                idRef='transferFeeBuyerRef'
                labelValue='transfer-fees-buyer-description'
                labelClasses='has-inside-label'
                value={state.transferFeeBuyer || 0}
                helperText={getErrorByName(schema, 'transferFeeBuyer').message}
                error={getErrorByName(schema, 'transferFeeBuyer').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={+(state.basePrice || 0)}
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
                  const effectedByValue = +(state.basePrice || 0);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = (parsedValue / effectedByValue) * 100;
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
                  withNumberFormat
                  isAttachedInput
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
                  onKeyUp={(e) => {
                    const value = e && e.target && e.target.value ? (e.target.value) : 0;
                    if (Number.isNaN(value))
                      value = 0;
                    const fixed = (value && value.replace(/,/g, ''));
                    let parsedValue = fixed ? parseFloat(fixed) : 0;
                    if (parsedValue > 100) parsedValue = 100;
                    const effectedValue =
                      (+(state.basePrice || 0) / 100) * parsedValue;
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
                withNumberFormat
                isAttachedInput
                idRef='transferFeesForCompletedPaidPropRef'
                labelValue='transfer-fees-completed-properties-description'
                labelClasses='has-inside-label'
                value={state.transferFeeCompletedAndPaidProp || 0}
                helperText={getErrorByName(schema, 'transferFeeCompletedAndPaidProp').message}
                error={getErrorByName(schema, 'transferFeeCompletedAndPaidProp').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
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
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = (parsedValue / effectedByValue) * 100;
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
                  withNumberFormat
                  isAttachedInput
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
                  onKeyUp={(e) => {
                    const value = e && e.target && e.target.value ? (e.target.value) : 0;
                    if (Number.isNaN(value))
                      value = 0;
                    const fixed = (value && value.replace(/,/g, ''));
                    let parsedValue = fixed ? parseFloat(fixed) : 0;
                    if (parsedValue > 100) parsedValue = 100;
                    const effectedValue =
                      (+(state.sellingPrice || 0) / 100) * parsedValue;
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
                withNumberFormat
                isAttachedInput
                idRef='sellerHasPaidRef'
                labelValue='seller-has-paid'
                labelClasses='has-inside-label'
                value={state.sellerHasPaid || 0}
                helperText={getErrorByName(schema, 'sellerHasPaid').message}
                error={getErrorByName(schema, 'sellerHasPaid').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
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
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = (parsedValue / effectedByValue) * 100;
                  const amountDueToDeveloper = state.sellingPrice - parsedValue ;  
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      sellerHasPaid: parsedValue,
                      sellerHasPaidPercentageOfBasePrice: effectedValue,
                      amountDueToDeveloper,

                    },
                  });
                }}
              />
              <div className='input-container'>
                <Inputs
                  withNumberFormat
                  isAttachedInput
                  idRef='sellerHasPaidPercentageOfBasePriceRef'
                  labelValue='of-selling-price'
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
                  onKeyUp={(e) => {
                    const value = e && e.target && e.target.value ? (e.target.value) : 0;
                    if (Number.isNaN(value))
                      value = 0;
                    const fixed = (value && value.replace(/,/g, ''));
                    let parsedValue = fixed ? parseFloat(fixed) : 0;
                    if (parsedValue > 100) parsedValue = 100;
                    const effectedValue =
                      (+(state.sellingPrice || 0) / 100) * parsedValue;
                      const amountDueToDeveloper = state.sellingPrice - effectedValue ;  
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
                withNumberFormat
                idRef='amountDueToDeveloperRef'
                labelValue='amount-due-to-developer'
                value={state.amountDueToDeveloper || 0}
                helperText={getErrorByName(schema, 'amountDueToDeveloper').message}
                error={getErrorByName(schema, 'amountDueToDeveloper').error}
                endAdornment={<span className='px-2'>AED</span>}
                type='number'
                isDisabled
                min={0}
                isWithError
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  const { value } = event.target;
                  onStateChanged({ id: 'amountDueToDeveloper', value });
                }}
              />
            </div>
          </>
        )}
        {activeTab === 1 && (
          <>
            <div className='form-item form-item-wrapper'>
              <Inputs
                withNumberFormat
                isAttachedInput
                idRef='downPaymentRef'
                labelValue='down-payment'
                labelClasses='has-inside-label'
                value={state.downPayment || 0}
                helperText={getErrorByName(schema, 'downPayment').message}
                error={getErrorByName(schema, 'downPayment').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
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
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = (parsedValue / effectedByValue) * 100;
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
                  withNumberFormat
                  isAttachedInput
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
                  onKeyUp={(e) => {
                    const value = e && e.target && e.target.value ? (e.target.value) : 0;
                    if (Number.isNaN(value))
                      value = 0;
                    const fixed = (value && value.replace(/,/g, ''));
                    let parsedValue = fixed ? parseFloat(fixed) : 0;
                    if (parsedValue > 100) parsedValue = 100;
                    const effectedValue =
                      (+(state.sellingPrice || 0) / 100) * parsedValue;
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
                withNumberFormat
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
                  const { value } = event.target;
                  onStateChanged({ id: 'loanTermByYears', value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                withNumberFormat
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
                  let { value } = event.target;
                  if (value > 100) value = 100;
                  onStateChanged({ id: 'interestRate', value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                withNumberFormat
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
                  const { value } = event.target;
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
            <div className='form-item form-item-wrapper'>
              <Inputs
                withNumberFormat
                isAttachedInput
                idRef='downPaymentForPlanOneRef'
                labelValue='down-payment-plan-1'
                labelClasses='has-inside-label'
                value={state.downPaymentForPlanOne || 0}
                helperText={getErrorByName(schema, 'downPaymentForPlanOne').message}
                error={getErrorByName(schema, 'downPaymentForPlanOne').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
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
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = (parsedValue / effectedByValue) * 100;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      downPaymentForPlanOne: parsedValue,
                      downPaymentForPlanOnePercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>

                <Inputs
                  withNumberFormat
                  isAttachedInput
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
                  onKeyUp={(e) => {
                    const value = e && e.target && e.target.value ? (e.target.value) : 0;
                    if (Number.isNaN(value))
                      value = 0;
                    const fixed = (value && value.replace(/,/g, ''));
                    let parsedValue = fixed ? parseFloat(fixed) : 0;
                    if (parsedValue > 100) parsedValue = 100;
                    const effectedValue =
                      (+(state.sellingPrice || 0) / 100) * parsedValue;

                    onStateChanged({
                      id: 'edit',
                      value: {
                        ...state,
                        downPaymentForPlanOnePercentageOfSellingPrice: parsedValue,
                        downPaymentForPlanOne: effectedValue,
                      },
                    });
                  }}
                />
              </div>
            </div>
            <div className='form-item form-item-wrapper'>
              <Inputs
                withNumberFormat
                isAttachedInput
                idRef='monthlyInstallmentRef'
                labelValue='monthly-installment'
                labelClasses='has-inside-label'
                value={state.monthlyInstallment || 0}
                helperText={getErrorByName(schema, 'monthlyInstallment').message}
                error={getErrorByName(schema, 'monthlyInstallment').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
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
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = (parsedValue / effectedByValue) * 100;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      monthlyInstallment: parsedValue,
                      monthlyInstallmentPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>
                <Inputs
                  withNumberFormat
                  isAttachedInput
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
                  onKeyUp={(e) => {
                    const value = e && e.target && e.target.value ? (e.target.value) : 0;
                    if (Number.isNaN(value))
                      value = 0;
                    const fixed = (value && value.replace(/,/g, ''));
                    let parsedValue = fixed ? parseFloat(fixed) : 0;
                    if (parsedValue > 100) parsedValue = 100;
                    const effectedValue =
                      (+(state.sellingPrice || 0) / 100) * parsedValue;
                    onStateChanged({
                      id: 'edit',
                      value: {
                        ...state,
                        monthlyInstallmentPercentageOfSellingPrice: parsedValue,
                        monthlyInstallment: effectedValue,
                      },
                    });
                  }}
                />
              </div>
            </div>
            <div className='form-item form-item-wrapper'>
              <Inputs
                withNumberFormat
                isAttachedInput
                idRef='handoverPaymentForPlanOneRef'
                labelValue='handover-payment-plan-1'
                labelClasses='has-inside-label'
                value={state.handoverPaymentForPlanOne || 0}
                helperText={getErrorByName(schema, 'handoverPaymentForPlanOne').message}
                error={getErrorByName(schema, 'handoverPaymentForPlanOne').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
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
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = (parsedValue / effectedByValue) * 100;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      handoverPaymentForPlanOne: parsedValue,
                      handoverPaymentForPlanOnePercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>
                <Inputs
                  withNumberFormat
                  isAttachedInput
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
                  onKeyUp={(e) => {
                    const value = e && e.target && e.target.value ? (e.target.value) : 0;
                    if (Number.isNaN(value))
                      value = 0;
                    const fixed = (value && value.replace(/,/g, ''));
                    let parsedValue = fixed ? parseFloat(fixed) : 0;
                    if (parsedValue > 100) parsedValue = 100;
                    const effectedValue =
                      (+(state.sellingPrice || 0) / 100) * parsedValue;
                    onStateChanged({
                      id: 'edit',
                      value: {
                        ...state,
                        handoverPaymentForPlanOnePercentageOfSellingPrice: parsedValue,
                        handoverPaymentForPlanOne: effectedValue,
                      },
                    });
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* <div className="form-title-wrapper">
        <span className="form-title">{t(`${translationPath}payment-plan-2`)}</span>
      </div> */}
        {activeTab === 3 && (
          <>
            <div className='form-item form-item-wrapper'>
              <Inputs
                withNumberFormat
                isAttachedInput
                idRef='downPaymentForPlanTwoRef'
                labelValue='down-payment-plan-2'
                labelClasses='has-inside-label'
                value={state.downPaymentForPlanTwo || 0}
                helperText={getErrorByName(schema, 'downPaymentForPlanTwo').message}
                error={getErrorByName(schema, 'downPaymentForPlanTwo').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
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
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = (parsedValue / effectedByValue) * 100;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      downPaymentForPlanTwo: parsedValue,
                      downPaymentForPlanTwoPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>
                <Inputs
                  withNumberFormat
                  isAttachedInput
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
                  onKeyUp={(e) => {
                    const value = e && e.target && e.target.value ? (e.target.value) : 0;
                    if (Number.isNaN(value))
                      value = 0;
                    const fixed = (value && value.replace(/,/g, ''));
                    let parsedValue = fixed ? parseFloat(fixed) : 0;
                    if (parsedValue > 100) parsedValue = 100;
                    const effectedValue =
                      (+(state.sellingPrice || 0) / 100) * parsedValue;
                    onStateChanged({
                      id: 'edit',
                      value: {
                        ...state,
                        downPaymentForPlanTwoPercentageOfSellingPrice: parsedValue,
                        downPaymentForPlanTwo: effectedValue,
                      },
                    });
                  }}
                />
              </div>
            </div>
            <div className='form-item form-item-wrapper'>
              <Inputs
                withNumberFormat
                isAttachedInput
                idRef='handoverPaymentForPlanTwoRef'
                labelValue='handover-payment-plan-2'
                labelClasses='has-inside-label'
                value={state.handoverPaymentForPlanTwo || 0}
                helperText={getErrorByName(schema, 'handoverPaymentForPlanTwo').message}
                error={getErrorByName(schema, 'handoverPaymentForPlanTwo').error}
                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={+(state.sellingPrice || 0)}
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
                  const effectedByValue = +(state.sellingPrice || 0);
                  if (parsedValue > effectedByValue) parsedValue = effectedByValue;
                  const effectedValue = (parsedValue / effectedByValue) * 100;
                  onStateChanged({
                    id: 'edit',
                    value: {
                      ...state,
                      handoverPaymentForPlanTwo: parsedValue,
                      handoverPaymentForPlanTwoPercentageOfSellingPrice: effectedValue,
                    },
                  });
                }}
              />
              <div className='input-container'>
                <Inputs
                  withNumberFormat
                  isAttachedInput
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
                  onKeyUp={(e) => {
                    const value = e && e.target && e.target.value ? (e.target.value) : 0;
                    if (Number.isNaN(value))
                      value = 0;
                    const fixed = (value && value.replace(/,/g, ''));
                    let parsedValue = fixed ? parseFloat(fixed) : 0;
                    if (parsedValue > 100) parsedValue = 100;
                    const effectedValue =
                      (+(state.sellingPrice || 0) / 100) * parsedValue;
                    onStateChanged({
                      id: 'edit',
                      value: {
                        ...state,
                        handoverPaymentForPlanTwoPercentageOfSellingPrice: parsedValue,
                        handoverPaymentForPlanTwo: effectedValue,
                      },
                    });
                  }}
                />
              </div>
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
                withNumberFormat
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
                  const { value } = event.target;
                  onStateChanged({ id: 'sellingPricePerSQFT', value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                withNumberFormat
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
                  const { value } = event.target;
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
