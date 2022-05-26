import React, {
  useEffect, useState, useCallback, useRef
} from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import Joi from 'joi';
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
  NumbersWithoutCommas
} from '../../../../../../Helper';
import { UnitProfilePaymentDetailsComponentTabsData } from './UnitProfilePaymentDetailsComponentTabsData';
import {
  GetUnitLeaseDetails,
  UpdateUnitLeaseDetails,
  lookupItemsGet,
} from '../../../../../../Services';
import { PaymentDetailsEnum } from '../../../../../../Enums';
import { PermissionsComponent } from '../../../../../../Components/PermissionsComponent/PermissionsComponent';
import { UnitsLeasePermissions } from '../../../../../../Permissions/Lease/UnitsLeasePermissions';
import { UnitPermissions } from '../../../../../../Permissions';

export const UnitProfilePaymentDetailsComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [banksData, setBanksData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];
  const isPropertyManagementView = (pathName === 'units-property-management/unit-profile-edit');
  const [builtupAreaSqft, setBuiltupAreaSqft] = useState(null);
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
  
  const schema = Joi.object({
    chillerDeposit: Joi.any()
    .required()
    .messages({
      'any.empty': t(`${translationPath}chiller-deposit-is-required`),
    }),
    commission: Joi.any()
    .required()
    .messages({
      'any.empty': t(`${translationPath}commission-is-required`),
      'any.min': t(`${translationPath}commission-must-be-greater-than`),
      
      }),
    rentPerYear: Joi.any()
    .required()
    .messages({
      'any.empty': t(`${translationPath}rentPerYear-is-required`),
      'any.min': t(`${translationPath}rentPerYear-must-be-greater-than`),
      
    }),
    securityDeposit: Joi.any()
    .required()
    .messages({
      'any.empty': t(`${translationPath}securityDeposit-is-required`),
      'any.min': t(`${translationPath}securityDeposit-must-be-greater-than`),
      
    }),
    rentForSquareFeetPerYear:
    Joi.any()
    .required()
    .messages({
      'any.empty': t(`${translationPath}rentForSquareFeetPerYear-is-required`),
      'any.min': t(`${translationPath}rentForSquareFeetPerYear-must-be-greater-than`),
      
    }),
    
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
    
    const GetSpecificationById = useCallback(async () => {
      setIsLoading(true);
      const result = await GetUnitLeaseDetails(+GetParams('id'));
      //source
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
  const saveHandler = useCallback(async () => {
    setIsLoading(true);
      const result = await UpdateUnitLeaseDetails(state);
      if (!(result && result.status && result.status !== 200)) {
        showSuccess(t(`${translationPath}payment-details-saved-successfully`));
        GetSpecificationById();
      } else showError(t(`${translationPath}payment-details-save-failed`));
    setIsLoading(false);
  });

  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <PermissionsComponent
          permissionsList={!isPropertyManagementView ? Object.values(UnitsLeasePermissions) : Object.values(UnitPermissions)}
          permissionsId={!isPropertyManagementView ? UnitsLeasePermissions.EditPaymentDetailsForUnit.permissionsId : UnitPermissions.EditPaymentDetailsForUnit.permissionsId}
          >
          <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
            <span>{t('Shared:save')}</span>
          </ButtonBase>
        </PermissionsComponent>
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
    
    useEffect(() => {
      const unitDetails = localStorage.getItem('unitModelRelatedData');
      if (unitDetails) {
        const unitDetailsJson = JSON.parse(unitDetails);
        setBuiltupAreaSqft(unitDetailsJson.builtup_area_sqft);
      }
    }, []);
  
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
                idRef='rentPerYearRef'
                labelValue='rent-year'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                withNumberFormat
                min={0}
                value={state.rentPerYear}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  const rentPerYear = fixed ? parseFloat(fixed) : 0;
                  setState({
                    ...state,
                    rentPerYear,
                    rentForSquareFeetPerYear: builtupAreaSqft ? (rentPerYear) / builtupAreaSqft : 0,
                    rentPerMonth: (rentPerYear / 12),
                    rentForSquareFeetPerMonth: builtupAreaSqft ? (rentPerYear / builtupAreaSqft) / 12 : 0,
                    commissionPercentage: rentPerYear !== 0 && state.commission ? ((state.commission) / rentPerYear) * 100 : 0,
                    securityDepositPercentage: rentPerYear !== 0 && state.securityDeposit ? ((state.securityDeposit) / rentPerYear) * 100 : 0,
                    agencyFeeLandlordPercentage: rentPerYear !== 0 && state.agencyFeeLandlord ? ((state.agencyFeeLandlord) / rentPerYear) * 100 : 0,
                    managementFeePercentage: rentPerYear !== 0 && state.managementFee ? ((state.managementFee) / rentPerYear) * 100 : 0,
                    agencyFeeFivePercentValueAddedTax: rentPerYear ? rentPerYear * 0.05 : 0,
                  });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='rentForSquareFeetPerYearRef'
                labelValue='rent-sq-ft-year'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={1}
                value={state.rentForSquareFeetPerYear}
                withNumberFormat
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  const rentForSquareFeetPerYear = fixed ? parseFloat(fixed) : 0;
                  setState({
                    ...state,
                    rentForSquareFeetPerYear,
                    rentForSquareFeetPerMonth: rentForSquareFeetPerYear / 12,
                    rentPerYear: builtupAreaSqft ? builtupAreaSqft * rentForSquareFeetPerYear : 0,
                    rentPerMonth: builtupAreaSqft ? (builtupAreaSqft * rentForSquareFeetPerYear) / 12 : 0,
                    commissionPercentage: builtupAreaSqft && state.commission ? (state.commission / (builtupAreaSqft * rentForSquareFeetPerYear)) * 100 : 0,
                    securityDepositPercentage: builtupAreaSqft && state.securityDeposit ? (state.securityDeposit / (builtupAreaSqft * rentForSquareFeetPerYear)) * 100 : 0,
                    agencyFeeLandlordPercentage: builtupAreaSqft && state.agencyFeeLandlord ? (state.agencyFeeLandlord / (builtupAreaSqft * rentForSquareFeetPerYear)) * 100 : 0,
                    managementFeePercentage: builtupAreaSqft && state.managementFee ? (state.managementFee / (builtupAreaSqft * rentForSquareFeetPerYear)) * 100 : 0,
                    agencyFeeFivePercentValueAddedTax: builtupAreaSqft ? ((builtupAreaSqft * rentForSquareFeetPerYear) * 0.05) : 0,
                });
              }}

            
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
                isDisabled
                withNumberFormat
                value={state.rentForSquareFeetPerMonth}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='rentPerMonthRef'
                labelValue='rent-month'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                withNumberFormat
                min={0}
                value={state.rentPerMonth}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  const rentPerMonth = fixed ? parseFloat(fixed) : 0;
                  const rentPerYear = rentPerMonth * 12;
                  setState({
                    ...state,
                    rentPerYear,
                    rentPerMonth,
                    rentForSquareFeetPerYear: builtupAreaSqft ? (rentPerYear) / builtupAreaSqft : 0,
                    rentForSquareFeetPerMonth: builtupAreaSqft ? (rentPerYear / builtupAreaSqft) / 12 : 0,
                    commissionPercentage: rentPerYear && state.commission ? ((state.commission) / rentPerYear) * 100 : 0,
                    securityDepositPercentage: rentPerYear && state.securityDeposit ? ((state.securityDeposit) / rentPerYear) * 100 : 0,
                    agencyFeeLandlordPercentage: rentPerYear && state.agencyFeeLandlord ? ((state.agencyFeeLandlord) / rentPerYear) * 100 : 0,
                    managementFeePercentage: rentPerYear && state.managementFee ? ((state.managementFee) / rentPerYear) * 100 : 0,
                    agencyFeeFivePercentValueAddedTax: rentPerYear ? (rentPerYear) * 0.05 : 0,
                  });
                }}
              />
            </div>
            
            <div className='form-item form-item-wrapper'>
              <Inputs
                isAttachedInput={true}
                idRef='securityDepositRef'
                labelValue='security-deposit'
                labelClasses='has-inside-label'
                value={state.securityDeposit}
                withNumberFormat

                endAdornment={(
                  <span className='px-2 inner-span'>AED</span>
                  )}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedSecurityDeposit = fixed? parseFloat(fixed):0;

                  const { rentPerYear } = state;
                  if (parsedSecurityDeposit > rentPerYear)
                     parsedSecurityDeposit = rentPerYear;

                  
                  setState({
                    ...state,
                    securityDeposit: state.rentPerYear ? parsedSecurityDeposit : 0,
                    securityDepositPercentage: state.rentPerYear? (parsedSecurityDeposit / state.rentPerYear) * 100 : 0,
                  });
                }}

              />
              <div className='input-container'>
                    <Inputs
                      isAttachedInput={true}                    
                      idRef='securityDepositPercentageRef'
                      value={state.securityDepositPercentage}
                      withNumberFormat
                      endAdornment={<span className='px-2'>%</span>}
                      type='number'
                      labelClasses='inside-input-label'
                      wrapperClasses='mb-0'
                      min={0}
                      max={100}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}

                      onKeyUp={(e) => {
                        const value = e && e.target && e.target.value ? (e.target.value) : 0;
                        const fixed = (value && value.replace(/,/g, ''));
                        let parsedSecurityDepositPercentage = fixed? parseFloat(fixed):0;

                        if (parsedSecurityDepositPercentage > 100)
                        parsedSecurityDepositPercentage = 100;


                        setState({
                          ...state,
                          securityDepositPercentage: state.rentPerYear ? parsedSecurityDepositPercentage : 0,
                          securityDeposit: state.rentPerYear ? (parsedSecurityDepositPercentage * state.rentPerYear) / 100 : 0,
                        });
                      }}
                    />
                  </div>
            </div>
            
            <div className='form-item form-item-wrapper'>
              <Inputs
              isAttachedInput={true}
                idRef='commissionRef'
                withNumberFormat
                labelValue='commission'
                labelClasses='has-inside-label'
                value={state.commission}
                /*value={state.commission}*/
                endAdornment={(
                    <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={1}
                max={(state.rentPerYear)}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedCommission = fixed? parseFloat(fixed):0;

                  const { rentPerYear } = state;
                  if (parsedCommission > rentPerYear)
                     parsedCommission = rentPerYear;
                     setState({
                    ...state,
                    commission: parsedCommission,
                    commissionPercentage: rentPerYear ? ((parsedCommission) / rentPerYear) * 100 : 0,
                  });
                }}
              />

               <div className='input-container'>
               <Inputs
                      isAttachedInput={true}
                      idRef='commissionPercentageRef'
                      withNumberFormat
                      value={state.commissionPercentage}
                      endAdornment={<span className='px-2'>%</span>}
                      type='number'
                      labelClasses='inside-input-label'
                      wrapperClasses='mb-0'
                      min={0}
                      max={100}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      onKeyUp={(e) => {
                        const value = e && e.target && e.target.value ? (e.target.value) : 0;
                        const fixed = (value && value.replace(/,/g, ''));
                        let parsedCommissionPercentage = fixed? parseFloat(fixed):0;

                        if (parsedCommissionPercentage > 100)
                        parsedCommissionPercentage = 100;

                        const { rentPerYear } = state;
                        if (parsedCommissionPercentage > 100)
                        parsedCommissionPercentage = 100;
                        setState({
                          ...state,
                          commissionPercentage: rentPerYear ? parsedCommissionPercentage : 0,
                          commission: rentPerYear ? (parsedCommissionPercentage / 100) * rentPerYear : 0,
                        });
                      }}
                    />
              </div>
            </div>

            <div className='form-item form-item-wrapper'>
              <Inputs
              isAttachedInput={true}
                withNumberFormat
                idRef='agencyFeeLandlordRef'
                labelValue='agency-fee-landlord'
                labelClasses='has-inside-label'
                value={state.agencyFeeLandlord}
                endAdornment={(
                    <span className='px-2 inner-span'>AED</span>
                )}
                type='number'
                min={0}
                max={(state.rentPerYear)}
                isWithError
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let parsedAgencyFeeLandlord = fixed? parseFloat(fixed):0;

                  const { rentPerYear } = state;
                  if (parsedAgencyFeeLandlord > rentPerYear)
                     parsedAgencyFeeLandlord = rentPerYear;
                  setState({
                    ...state,
                    agencyFeeLandlord: parsedAgencyFeeLandlord,
                    agencyFeeLandlordPercentage: rentPerYear ? ((parsedAgencyFeeLandlord) / rentPerYear) * 100 : 0,

                  });
                }}
              />

              <div className='input-container'>
              <Inputs
              isAttachedInput={true}
                      idRef='agencyFeeLandlordPercentageRef'
                      withNumberFormat
                      labelValue='rent-year'
                      value={state.agencyFeeLandlordPercentage}
                      endAdornment={<span className='px-2'>%</span>}
                      type='number'
                      labelClasses='inside-input-label'
                      wrapperClasses='mb-0'
                      min={0}
                      max={100}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      onKeyUp={(e) => {
                        const value = e && e.target && e.target.value ? (e.target.value) : 0;
                        const fixed = (value && value.replace(/,/g, ''));
                        let parsedAgencyFeeLandlordPercentage = fixed? parseFloat(fixed):0;
                        
                        const { rentPerYear } = state;
                        if (parsedAgencyFeeLandlordPercentage > 100)
                           parsedAgencyFeeLandlordPercentage = 100;

                        setState({
                          ...state,
                          agencyFeeLandlordPercentage: parsedAgencyFeeLandlordPercentage,
                          agencyFeeLandlord: rentPerYear ? (parsedAgencyFeeLandlordPercentage / 100) * rentPerYear : 0,
                        });
                      }}
                    />
              </div>
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
                idRef='isPriceOnApplicationRef'
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
                withNumberFormat
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.otherPayment}
                onInputChanged={(event) => {
                  const value = !Number.isNaN(event.target.value) ? event.target.value : 0;
                  setState({ ...state, otherPayment: value });
                }}
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
                idRef='bankIdRef'
                labelValue='bank'
                inputPlaceholder='bank'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                multiple={false}
                value={state.bankId}
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
                withNumberFormat
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.purchasePrice}
                onInputChanged={(event) => {
                  setState({ ...state, purchasePrice: (!Number.isNaN(event.target.value) ? event.target.value : 0) });
                }}

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
                isDisabled
                withNumberFormat
                value={state.agencyFeeFivePercentValueAddedTax}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='chillerDepositRef'
                labelValue='chiller-deposit'
                withNumberFormat
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                value={state.chillerDeposit}
                onInputChanged={(event) => {
                  let chillerDeposit = state.rentPerYear && !Number.isNaN(event.target.value) ? event.target.value : 0;
                  if (chillerDeposit > state.rentPerYear)
                    chillerDeposit = state.rentPerYear;
                  setState({ ...state, chillerDeposit });
                }}

              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='managementFeeRef'
                labelValue='management-fee'
                translationPath={translationPath}
                withNumberFormat
                parentTranslationPath={parentTranslationPath}
                type='number'
                min={0}
                value={state.managementFee}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let managementFee = fixed ? parseFloat(fixed) : 0;
                  const { rentPerYear } = state;
                  if (managementFee > rentPerYear)
                  managementFee = rentPerYear;
                  setState({
                    ...state,
                    managementFee,
                    managementFeePercentage: managementFee && rentPerYear ? (((managementFee) / rentPerYear) * 100) : 0,
                  });
                }}
              />
            </div>
            <div className='form-item'>
              <Inputs
                idRef='managementFeePercentageRef'
                labelValue='management-fee%'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type='number'
                withNumberFormat
                min={0}
                max={100}
                value={state.managementFeePercentage}
                onKeyUp={(e) => {
                  const value = e && e.target && e.target.value ? (e.target.value) : 0;
                  const fixed = (value && value.replace(/,/g, ''));
                  let managementFeePercentage = fixed ? parseFloat(fixed) : 0;
                  const { rentPerYear } = state;
                  if (managementFeePercentage > 100)
                  managementFeePercentage = 100;
                  setState({
                    ...state,
                    managementFee: rentPerYear ? (managementFeePercentage / 100) * rentPerYear : 0,
                    managementFeePercentage: rentPerYear ? managementFeePercentage : 0
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
