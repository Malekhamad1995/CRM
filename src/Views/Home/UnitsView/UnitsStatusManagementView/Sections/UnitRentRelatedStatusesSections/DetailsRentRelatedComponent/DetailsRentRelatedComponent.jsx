import React, {
  useCallback, useEffect, useRef, useState, useReducer
} from 'react';
import PropTypes from 'prop-types';
import {
  AutocompleteComponent,
  DatePickerComponent,
  Inputs,
  RadiosGroupComponent,
  Spinner,
} from '../../../../../../../Components';
import { LeasingType, PeriodOfStay } from '../../../../../../../assets/json/StaticLookupsIds.json';
import { floatHandler, getErrorByName } from '../../../../../../../Helper';
import {
  ActiveOrganizationUser,
  lookupItemsGetId,
  OrganizationUserSearch,
  GetLeaseTransactionDetails,
  GetLeaseDetails
} from '../../../../../../../Services';

export const DetailsRentRelatedComponent = ({
  // state,
  selected,
  onSelectedChanged,
  schema,
  unitTransactionId,
  isSubmitted,
  onStateChanged,
  parentTranslationPath,
  translationPath,
  isReadOnly,
}) => {
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [state, setState] = useReducer(reducer, {});
  const searchTimer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadings, setLoadings] = useState({
    users: false,
    periodsOfStay: false,
  });
  const [users, setUsers] = useState([]);
  const [periodsOfStay, setPeriodsOfStay] = useState([]);
  const [unitDetails, setUnitDetails] = useState(null);
  const [leasingTypes, setLeasingTypes] = useState([]);
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const getAllUsers = useCallback(
    async (value) => {
      setLoadings((items) => ({ ...items, users: true }));
      const res = await OrganizationUserSearch({
        ...filter,
        userName: value,
userStatusId: 2,
      });
      if (!(res && res.status && res.status !== 200)) setUsers((res && res.result) || []);
      else setUsers([]);
      setLoadings((items) => ({ ...items, users: false }));
    },
    [filter]
  );
  const getAllLeasingTypes = useCallback(async () => {
    setLoadings((items) => ({ ...items, leasingTypes: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: LeasingType,
    });
    if (!(res && res.status && res.status !== 200)) setLeasingTypes(res || []);
    else setLeasingTypes([]);
    setLoadings((items) => ({ ...items, leasingTypes: false }));
  }, []);
  const getAllPeriodsOfStay = useCallback(async () => {
    setLoadings((items) => ({ ...items, periodsOfStay: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: PeriodOfStay,
    });
    if (!(res && res.status && res.status !== 200)) setPeriodsOfStay(res || []);
    else setPeriodsOfStay([]);
    setLoadings((items) => ({ ...items, periodsOfStay: false }));
  }, []);
  // const getUserById = useCallback(async (id) => {
  //   setIsLoading(true);
  //   const res = await ActiveOrganizationUser(id);
  //   setIsLoading(false);
  //   if (!(res && res.status && res.status !== 200)) return res;
  //   return null;
  // }, []);
  const getLeaseTransactionDetails = useCallback(async () => {
    setIsLoading(true);
   const leaseTransactionDetailsId = localStorage.getItem('leaseTransactionDetailsId');
    const res = await GetLeaseDetails(unitTransactionId);
    if (!(res && res.status && res.status !== 200)) {
      setState({
        id: 'edit',
        value: res
      });
    } else setUnitDetails(null);
    setIsLoading(false);
  }, []);
  // const getEditInit = useCallback(async () => {
  //   if (state.contractIssuedById && !selected.user && users.length > 0) {
  //     const transactedByIndex = users.findIndex((item) => item.id === state.contractIssuedById);
  //     if (transactedByIndex !== -1) selected.user = users[transactedByIndex];
  //     else {
  //       const res = await getUserById(state.contractIssuedById);
  //       if (res) {
  //         selected.user = res;

  //         setUsers((items) => {
  //           items.push(res);
  //           return [...items];
  //         });
  //       }
  //     }
  //     if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
  //   }
  //   if (state.leasingTypeId && !selected.leasingType && leasingTypes.length > 0) {
  //     const leasingTypeIndex = leasingTypes.findIndex(
  //       (item) => item.lookupItemId === state.leasingTypeId
  //     );
  //     if (leasingTypeIndex !== -1) {
  //       selected.leasingType = leasingTypes[leasingTypeIndex];
  //       if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
  //     }
  //   }
  //   if (state.periodOfStayId && !selected.periodOfStay && periodsOfStay.length > 0) {
  //     const periodOfStayIndex = periodsOfStay.findIndex(
  //       (item) => item.lookupItemId === state.periodOfStayId
  //     );
  //     if (periodOfStayIndex !== -1) {
  //       selected.periodOfStay = periodsOfStay[periodOfStayIndex];
  //       if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
  //     }
  //   }
  // }, [
  //   getUserById,
  //   leasingTypes,
  //   onSelectedChanged,
  //   periodsOfStay,
  //   selected,
  //   state.contractIssuedById,
  //   state.leasingTypeId,
  //   state.periodOfStayId,
  //   users,
  // ]);
  useEffect(() => {
    getAllUsers();
    getAllLeasingTypes();
    getAllPeriodsOfStay();
    getLeaseTransactionDetails();
  }, [getAllUsers, getAllLeasingTypes, getAllPeriodsOfStay, getLeaseTransactionDetails]);
  // useEffect(() => {
  //   if (unitTransactionId) getEditInit();
  // }, [getEditInit, unitTransactionId]);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  return (
    <div className='details-rent-related-wrapper childs-wrapper p-relative agent-info-sale-related-component-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='form-item'>
        <Inputs
          isDisabled={isReadOnly}
          idRef='rentPerYearRef'
          labelValue='rent-per-year'
          value={state && state.rentPerYear}
          helperText={getErrorByName(schema, 'rentPerYear').message}
          error={getErrorByName(schema, 'rentPerYear').error}
          endAdornment={<span className='px-2'>AED</span>}
          type='number'
          min={0}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            const value = floatHandler(event.target.value, 3);
            onStateChanged({ id: 'rentPerYear', value });
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          isDisabled={isReadOnly}
          idRef='contractRentRef'
          labelValue='contract-rent'
          value={(state && state.contractRent) || 0}
          helperText={getErrorByName(schema, 'contractRent').message}
          error={getErrorByName(schema, 'contractRent').error}
          endAdornment={<span className='px-2'>AED</span>}
          type='number'
          min={0}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            const value = floatHandler(event.target.value, 3);
            onStateChanged({ id: 'contractRent', value });
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          isDisabled={isReadOnly}
          idRef='securityDepositRef'
          labelValue='security-deposit'
          value={(state && state.securityDeposit) || 0}
          helperText={getErrorByName(schema, 'securityDeposit').message}
          error={getErrorByName(schema, 'securityDeposit').error}
          endAdornment={<span className='px-2'>AED</span>}
          type='number'
          min={0}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            const value = floatHandler(event.target.value, 3);
            onStateChanged({ id: 'securityDeposit', value });
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          isDisabled={isReadOnly}
          idRef='renewalFeeRef'
          labelValue='renewal-fee'
          value={(state && state.renewalFee) || 0}
          helperText={getErrorByName(schema, 'renewalFee').message}
          error={getErrorByName(schema, 'renewalFee').error}
          endAdornment={<span className='px-2'>AED</span>}
          type='number'
          min={0}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            const value = floatHandler(event.target.value, 3);
            onStateChanged({ id: 'renewalFee', value });
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          isDisabled={isReadOnly}
          idRef='agencyFeeSellerRef'
          labelValue='agency-fee'
          value={(state && state.agencyFee) || 0}
          helperText={getErrorByName(schema, 'agencyFeeSeller').message}
          error={getErrorByName(schema, 'agencyFeeSeller').error}
          endAdornment={<span className='px-2'>AED</span>}
          type='number'
          min={0}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            const value = floatHandler(event.target.value, 3);
            onStateChanged({ id: 'agencyFee', value });
          }}
        />
      </div>
      <div className='form-item'>
        <RadiosGroupComponent
          isDisabled={isReadOnly}
          idRef='tenancyContractIssuedRef'
          labelValue='is-tenancy-contract-issued'
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
          value={(state && state.tenancyContractIssued)}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
          translationPath={translationPath}
          labelInput='value'
          valueInput='key'
          onSelectedRadioChanged={(e, newValue) =>
            onStateChanged({ id: 'tenancyContractIssued', value: newValue === 'true' })}
        />
      </div>
      <div className='form-item'>
        <DatePickerComponent
          isDisabled={isReadOnly}
          idRef='contractIssuedDateRef'
          labelValue='contract-issued-date'
          placeholder='DD/MM/YYYY'
          value={(state && state.contractIssuedDate)}
          helperText={getErrorByName(schema, 'contractIssuedDate').message}
          error={getErrorByName(schema, 'contractIssuedDate').error}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onDateChanged={(newValue) => {
            onStateChanged({ id: 'contractIssuedDate', value: newValue });
          }}
        />
      </div>
      <div className='form-item'>
        <DatePickerComponent
          isDisabled={isReadOnly}
          idRef='transactionEntryDateRef'
          labelValue='transactionEntryDate'
          placeholder='DD/MM/YYYY'
          value={(state && state.transactionEntryDate)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onDateChanged={(newValue) => {
            onStateChanged({ id: 'transactionEntryDate', value: newValue });
          }}
        />
      </div>
      <div className='form-item'>
        <DatePickerComponent
          isDisabled={isReadOnly}
          idRef='startDateRef'
          labelValue='startDate'
          placeholder='DD/MM/YYYY'
          value={(state && state.startDate)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onDateChanged={(newValue) => {
            onStateChanged({ id: 'contractIssuedDate', value: newValue });
          }}
        />
      </div>
      <div className='form-item'>
        <DatePickerComponent
          isDisabled={isReadOnly}
          idRef='endDateRef'
          labelValue='endDate'
          placeholder='DD/MM/YYYY'
          value={(state && state.endDate)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onDateChanged={(newValue) => {
            onStateChanged({ id: 'endDate', value: newValue });
          }}
        />
      </div>

      <div className='form-item'>
        {/* <AutocompleteComponent
          isDisabled={isReadOnly}
          idRef='contractIssuedByIdRef'
          labelValue='contract-issued-by'
          selectedValues={selected.user}
          multiple={false}
          data={users}
          displayLabel={(option) => option.fullName || ''}
          renderOption={(option) =>
            ((option.userName || option.fullName) && `${option.fullName} (${option.userName})`) ||
            ''}
          getOptionSelected={(option) => option.id === state.contractIssuedById}
          withoutSearchButton
          helperText={getErrorByName(schema, 'contractIssuedById').message}
          error={getErrorByName(schema, 'contractIssuedById').error}
          isLoading={loadings.users}
          onInputKeyUp={(e) => {
            const { value } = e.target;
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => {
              getAllUsers(value);
            }, 700);
          }}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'user', value: newValue });
            onStateChanged({
              id: 'contractIssuedById',
              value: (newValue && newValue.id) || null,
            });
          }}
        /> */}
        <Inputs
          isDisabled={isReadOnly}
          idRef='contractIssuedByIdRef'
          labelValue='contract-issued-by'
          value={(state && state.contractIssuedBy) || ''}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'contractIssuedBy', value: event.target.value });
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          isDisabled={isReadOnly}
          idRef='receiptNoRef'
          labelValue='receipt-number-description'
          value={(state && state.receiptNo) || ''}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'receiptNo', value: event.target.value });
          }}
        />
      </div>
      <div className='form-item'>
        <RadiosGroupComponent
          isDisabled={isReadOnly}
          idRef='paymentToExternalAgencyRef'
          labelValue='is-payment-to-external-agency'
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
          value={(state && state.paymentToExternalAgency)}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
          translationPath={translationPath}
          labelInput='value'
          valueInput='key'
          onSelectedRadioChanged={(e, newValue) =>
            onStateChanged({ id: 'paymentToExternalAgency', value: newValue === 'true' })}
        />
      </div>
      <div className='form-item'>
        {/* <AutocompleteComponent
          isDisabled={isReadOnly}
          idRef='leasingTypeIdRef'
          labelValue='leasing-type'
          selectedValues={selected.leasingType}
          multiple={false}
          data={leasingTypes}
          displayLabel={(option) => option.lookupItemName || ''}
          withoutSearchButton
          helperText={getErrorByName(schema, 'leasingTypeId').message}
          error={getErrorByName(schema, 'leasingTypeId').error}
          isWithError
          isLoading={loadings.leasingTypes}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'leasingType', value: newValue });
            onStateChanged({
              id: 'leasingTypeId',
              value: (newValue && newValue.lookupItemId) || null,
            });
          }}
        /> */}
        <Inputs
          isDisabled={isReadOnly}
          idRef='leasingTypeIdRef'
          labelValue='leasing-type'
          value={(state && state.leasingType) || ''}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'leasingType', value: event.target.value });
          }}
        />
      </div>
      <div className='form-item'>
        {/* <AutocompleteComponent
          isDisabled={isReadOnly}
          idRef='periodOfStayIdRef'
          labelValue='period-of-stay-months'
          selectedValues={selected.periodOfStay}
          multiple={false}
          data={periodsOfStay}
          displayLabel={(option) => option.lookupItemName || ''}
          getOptionSelected={(option) => option.lookupItemId === state.periodOfStayId}
          withoutSearchButton
          helperText={getErrorByName(schema, 'periodOfStayId').message}
          error={getErrorByName(schema, 'periodOfStayId').error}
          isWithError
          isLoading={loadings.periodsOfStay}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'periodOfStay', value: newValue });
            onStateChanged({
              id: 'periodOfStayId',
              value: (newValue && newValue.lookupItemId) || null,
            });
          }}
        /> */}
        <Inputs
          isDisabled={isReadOnly}
          idRef='periodOfStayIdRef'
          labelValue='period-of-stay-months'
          value={(state && state.periodOfStay) || ''}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'periodOfStay', value: event.target.value });
          }}
        />

      </div>
      <div className='form-item'>
        <RadiosGroupComponent
          isDisabled={isReadOnly}
          idRef='contractRenewableRef'
          labelValue='is-contract-renewable'
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
          value={state.contractRenewable}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
          translationPath={translationPath}
          labelInput='value'
          valueInput='key'
          onSelectedRadioChanged={(e, newValue) =>
            onStateChanged({ id: 'contractRenewable', value: newValue === 'true' })}
        />
      </div>
      <div className='form-item'>
        <RadiosGroupComponent
          isDisabled={isReadOnly}
          idRef='printContractOnRef'
          labelValue='print-contract-on'
          data={[
            {
              key: true,
              value: 'tenant',
            },
            {
              key: false,
              value: 'company',
            },
          ]}
          value={(state && state.printContractOn)}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
          translationPath={translationPath}
          labelInput='value'
          valueInput='key'
          onSelectedRadioChanged={(e, newValue) =>
            onStateChanged({ id: 'printContractOn', value: newValue === 'true' })}
        />
      </div>
    </div>
  );
};

DetailsRentRelatedComponent.propTypes = {
  selected: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  unitTransactionId: PropTypes.number,
  onStateChanged: PropTypes.func.isRequired,
  onSelectedChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
DetailsRentRelatedComponent.defaultProps = {
  isReadOnly: false,
  unitTransactionId: undefined,
};
