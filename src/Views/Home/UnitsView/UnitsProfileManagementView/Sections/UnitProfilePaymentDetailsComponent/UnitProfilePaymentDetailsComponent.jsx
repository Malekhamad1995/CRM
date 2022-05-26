import React, {
 useEffect, useState, useCallback, useRef
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import {
  AutocompleteComponent,
  Inputs,
  RadiosGroupComponent,
  Spinner,
  TabsComponent,
} from '../../../../../../Components';
import {
  bottomBoxComponentUpdate,
  GetParams,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../Helper';
import { UnitProfilePaymentDetailsComponentTabsData } from './UnitProfilePaymentDetailsComponentTabsData';
import {
  GetUnitLeaseDetails,
  UpdateUnitLeaseDetails,
  lookupItemsGet,
} from '../../../../../../Services';
import { PaymentDetailsEnum } from '../../../../../../Enums';

export const UnitProfilePaymentDetailsComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeTab, setActiveTab] = useState(0);
  const [banksData, setBanksData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimer = useRef(null);
  const defaultState = {
    // unitLeaseDetailsId: 0,
    unitId: +GetParams('id'),
    rentForSquareFeetPerYear: 0,
    rentPerYear: 0,
    rentForSquareFeetPerMonth: 0,
    rentPerMonth: 0,
    securityDeposit: 0,
    securityDepositPercentage: 0,
    commission: 0,
    commissionPercentage: 0,
    agencyFeeLandlord: 0,
    agencyFeeLandlordPercentage: 0,
    priceOnApplication: true,
    splitCommission: true,
    noOfCheques: 0,
    otherPayment: 0,
    securityDepositPayableTo: '',
    commissionPayableTo: '',
    rentPayableTo: '',
    bankId: 0,
    bankAccountNo: '',
    purchasePrice: 0,
    comments: '',
    agencyFeeFivePercentValueAddedTax: 0,
    chillerDeposit: 0,
    managementFee: 0,
    managementFeePercentage: 0,
  };
  const [state, setState] = useState(defaultState);
  const GetSpecificationById = useCallback(async () => {
    setIsLoading(true);
    const result = await GetUnitLeaseDetails(+GetParams('id'));
    if (!(result && result.status && result.status !== 200)) setState(result);
    else setState(defaultState);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPaymentBanks = useCallback(async (pageIndex, pageSize, searchedItem) => {
    const result = await lookupItemsGet({
      pageIndex,
      pageSize,
      lookupTypeName: PaymentDetailsEnum.lookupTypeName,
      searchedItem,
    });
    if (!(result && result.status && result.status !== 200)) setBanksData(result);
    else setBanksData([]);
  }, []);

  const searchHandler = (event) => {
    const { value } = event.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      getPaymentBanks(1, 10, value);
    }, 500);
  };

  useEffect(() => {
    GetSpecificationById();
  }, [GetSpecificationById]);
  useEffect(() => {
    getPaymentBanks(1, 10);
  }, [getPaymentBanks]);

  const cancelHandler = () => {
    setState(defaultState);
    GlobalHistory.goBack();
  };
  const saveHandler = async () => {
    const result = await UpdateUnitLeaseDetails(state);
    if (!(result && result.status && result.status !== 200))
      showSuccess(t(`${translationPath}payment-details-saved-successfully`));
    else showError(t(`${translationPath}payment-details-save-failed`));
  };

  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
          <span>{t('Shared:save')}</span>
        </ButtonBase>
      </div>
    );
  });
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );

  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };

  return (
    <div className='properties-information-wrapper childs-wrapper b-0 unit-profile-payment-details-component-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <TabsComponent
        data={UnitProfilePaymentDetailsComponentTabsData}
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
                idRef='rentForSquareFeetPerYearRef'
                labelValue='rent-sq-ft-year'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.rentForSquareFeetPerYear}
                onInputChanged={(event) =>
                  setState({ ...state, rentForSquareFeetPerYear: +event.target.value })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='rentPerYearRef'
                labelValue='rent-year'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.rentPerYear}
                onInputChanged={(event) => setState({ ...state, rentPerYear: +event.target.value })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='rentForSquareFeetPerMonthRef'
                labelValue='rent-sq-ft-month'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.rentForSquareFeetPerMonth}
                onInputChanged={(event) =>
                  setState({ ...state, rentForSquareFeetPerMonth: +event.target.value })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='rentPerMonthRef'
                labelValue='rent-month'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.rentPerMonth}
                onInputChanged={(event) =>
                  setState({ ...state, rentPerMonth: +event.target.value })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='securityDepositRef'
                labelValue='security-deposit'
                labelClasses='has-inside-label'
                value={state.securityDeposit || 0}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='premiumPercentageOfBasePriceRef'
                      value={state.securityDepositPercentage || 0}
                      endAdornment={<span className='px-2'>%</span>}
                      type='number'
                      labelClasses='inside-input-label'
                      wrapperClasses='mb-0'
                      min={0}
                      max={100}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      onInputChanged={(event) =>
                        setState({ ...state, securityDepositPercentage: +event.target.value })}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.basePrice || 0)}
                isWithError
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) =>
                  setState({ ...state, securityDeposit: +event.target.value })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='commissionRef'
                labelValue='commission'
                labelClasses='has-inside-label'
                value={state.commission || 0}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='premiumPercentageOfBasePriceRef'
                      value={state.commissionPercentage || 0}
                      endAdornment={<span className='px-2'>%</span>}
                      type='number'
                      labelClasses='inside-input-label'
                      wrapperClasses='mb-0'
                      min={0}
                      max={100}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      onInputChanged={(event) =>
                        setState({ ...state, commissionPercentage: +event.target.value })}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.basePrice || 0)}
                isWithError
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  setState({ ...state, commission: +event.target.value });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='agencyFeeLandlordRef'
                labelValue='agency-fee-landlord'
                labelClasses='has-inside-label'
                value={state.agencyFeeLandlord || 0}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <span className='px-2'>AED</span>
                    <Inputs
                      idRef='agencyFeeLandlordPercentageRef'
                      labelValue='of-selling-price'
                      value={state.agencyFeeLandlordPercentage || 0}
                      endAdornment={<span className='px-2'>%</span>}
                      type='number'
                      labelClasses='inside-input-label'
                      wrapperClasses='mb-0'
                      min={0}
                      max={100}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      onInputChanged={(event) => {
                        setState({ ...state, agencyFeeLandlordPercentage: +event.target.value });
                      }}
                    />
                  </div>
                )}
                type='number'
                min={0}
                max={+(state.basePrice || 0)}
                isWithError
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onInputChanged={(event) => {
                  setState({ ...state, agencyFeeLandlord: +event.target.value });
                }}
              />
            </div>
            <div className='form-item radio-item'>
              <RadiosGroupComponent
                idRef='isPriceOnApplicationRef'
                labelValue='price-on-application'
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
                onSelectedRadioChanged={(e, newValue) => {
                  setState({ ...state, priceOnApplication: newValue === 'true' });
                }}
              />
            </div>
            <div className='form-item radio-item'>
              <RadiosGroupComponent
                idRef='splitCommissionRef'
                labelValue='split-commission'
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
                value={state.splitCommission}
                parentTranslationPath={parentTranslationPath}
                translationPathForData={translationPath}
                translationPath={translationPath}
                labelInput='value'
                valueInput='key'
                onSelectedRadioChanged={(e, newValue) => {
                  setState({ ...state, splitCommission: newValue === 'true' });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='noOfChequesRef'
                labelValue='no-of-cheques'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.noOfCheques}
                onInputChanged={(event) => setState({ ...state, noOfCheques: +event.target.value })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='otherPaymentRef'
                labelValue='other'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.otherPayment}
                onInputChanged={(event) =>
                  setState({ ...state, otherPayment: +event.target.value })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='securityDepositPayableToRef'
                labelValue='security-deposit-payable-to'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                value={state.securityDepositPayableTo}
                onInputChanged={(event) =>
                  setState({ ...state, securityDepositPayableTo: event.target.value })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='commissionPayableToRef'
                labelValue='commission-payable-to'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                value={state.commissionPayableTo}
                onInputChanged={(event) =>
                  setState({ ...state, commissionPayableTo: event.target.value })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='rentPayableToRef'
                labelValue='rent-payable-to'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                value={state.rentPayableTo}
                onInputChanged={(event) =>
                  setState({ ...state, rentPayableTo: event.target.value })}
              />
            </div>
            <div className='form-item'>
              <AutocompleteComponent
                idRef='closeReasonRef'
                labelValue='bank'
                inputPlaceholder='bank'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                multiple={false}
                value={state.bankId || 0}
                selectedValues={
                  state.bankId &&
                  banksData &&
                  banksData.result &&
                  banksData.result.find((item) => item.lookupItemId === state.bankId)
                }
                data={(banksData && banksData.result) || []}
                displayLabel={(option) => (option.lookupItemName && option.lookupItemName) || ''}
                withoutSearchButton
                onChange={(event, newValue) => {
                  setState({ ...state, bankId: newValue && newValue.lookupItemId });
                }}
                onInputKeyUp={(event) => searchHandler(event)}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='bankAccountNoRef'
                labelValue='bank-account-no'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.bankAccountNo}
                onInputChanged={(event) =>
                  setState({ ...state, bankAccountNo: event.target.value })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='purchasePriceRef'
                labelValue='purchase-price'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.purchasePrice}
                onInputChanged={(event) =>
                  setState({ ...state, purchasePrice: +event.target.value })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='commentsRef'
                labelValue='comments'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                value={state.comments}
                onInputChanged={(event) => setState({ ...state, comments: event.target.value })}
              />
            </div>
          </div>
        )}
        {activeTab === 1 && (
          <div className='tab-item-wrapper '>
            <div className='form-item'>
              <Inputs
                idRef='agencyFeeFivePercentValueAddedTaxRef'
                labelValue='agency-fee-vat-5%'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.agencyFeeFivePercentValueAddedTax}
                onInputChanged={(event) =>
                  setState({ ...state, agencyFeeFivePercentValueAddedTax: +event.target.value })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='chillerDepositRef'
                labelValue='chiller-deposit'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.chillerDeposit}
                onInputChanged={(event) =>
                  setState({ ...state, chillerDeposit: +event.target.value })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='managementFeeRef'
                labelValue='management-fee'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.managementFee}
                onInputChanged={(event) =>
                  setState({ ...state, managementFee: +event.target.value })}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='managementFeePercentageRef'
                labelValue='management-fee%'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.managementFeePercentage}
                onInputChanged={(event) =>
                  setState({ ...state, managementFeePercentage: +event.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

UnitProfilePaymentDetailsComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
