import React, {
 useCallback, useEffect, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  AutocompleteComponent,
  DatePickerComponent,
  Inputs,
  RadiosGroupComponent,
  Spinner,
} from '../../../../../../../Components';
import {
  ReservationType,
  RentFreePeriod,
} from '../../../../../../../assets/json/StaticLookupsIds.json';
import { floatHandler, getErrorByName } from '../../../../../../../Helper';
import {
  ActiveOrganizationUser,
  lookupItemsGetId,
  OrganizationUserSearch,
} from '../../../../../../../Services';
import { AgentRoleEnum } from '../../../../../../../Enums/AgentRoleEnum';

export const AgentInfoRentRelatedComponent = ({
  state,
  selected,
  onSelectedChanged,
  schema,
  unitTransactionId,
  isSubmitted,
  onStateChanged,
  parentTranslationPath,
  translationPath,
}) => {

  const searchTimer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadings, setLoadings] = useState({
    agents: false,
    referrals: false,
    reservationTypes: false,
    transactedBy: false,
    externalAgencies: false,
    rentFreePeriods: false,
  });
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [agents, setAgents] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [reservationTypes, setReservationTypes] = useState([]);
  const [transactedBy, setTransactedBy] = useState([]);
  const [rentFreePeriods, setRentFreePeriods] = useState([]);
  const getAllAgents = useCallback(
    async (value, selectedValue) => {
      setLoadings((items) => ({ ...items, agents: true }));
      const res = await OrganizationUserSearch({
        ...filter,
        name: value,
        userTypeId: AgentRoleEnum.LeaseAgent.value,
      });
      if (!(res && res.status && res.status !== 200)) {
        setAgents(
          (selectedValue &&
            ((res && res.result && [...res.result, selectedValue]) || [selectedValue])) ||
            (res && res.result) ||
            []
        );
      } else setAgents([]);
      setLoadings((items) => ({ ...items, agents: false }));
    },
    [filter]
  );
  const getAllTransactedBy = useCallback(
    async (value, selectedValue) => {
      setLoadings((items) => ({ ...items, transactedBy: true }));
      const res = await OrganizationUserSearch({
        ...filter,
        name: value,
userStatusId: 2,
      });
      if (!(res && res.status && res.status !== 200)) {
        setTransactedBy(
          (selectedValue &&
            ((res && res.result && [...res.result, selectedValue]) || [selectedValue])) ||
            (res && res.result) ||
            []
        );
      } else setTransactedBy([]);
      setLoadings((items) => ({ ...items, transactedBy: false }));
    },
    [filter]
  );
  const getAllReferrals = useCallback(
    async (value, selectedValue) => {
      setLoadings((items) => ({ ...items, referrals: true }));
      const res = await OrganizationUserSearch({
        ...filter,
        name: value,
userStatusId: 2,
      });
      if (!(res && res.status && res.status !== 200)) {
        setReferrals(
          (selectedValue &&
            ((res && res.result && [...res.result, selectedValue]) || [selectedValue])) ||
            (res && res.result) ||
            []
        );
      } else setReferrals([]);
      setLoadings((items) => ({ ...items, referrals: false }));
    },
    [filter]
  );
  const getAllReservationTypes = useCallback(async () => {
    setLoadings((items) => ({ ...items, reservationTypes: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: ReservationType,
    });
    if (!(res && res.status && res.status !== 200)) setReservationTypes(res || []);
    else setReservationTypes([]);
    setLoadings((items) => ({ ...items, reservationTypes: false }));
  }, []);
  const getAllRentFreePeriods = useCallback(async () => {
    setLoadings((items) => ({ ...items, rentFreePeriods: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: RentFreePeriod,
    });
    if (!(res && res.status && res.status !== 200)) setRentFreePeriods(res || []);
    else setRentFreePeriods([]);
    setLoadings((items) => ({ ...items, rentFreePeriods: false }));
  }, []);
  const getUserById = useCallback(async (id) => {
    setIsLoading(true);
    const res = await ActiveOrganizationUser(id);
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) return res;
    return null;
  }, []);
  const getEditInit = useCallback(async () => {
    if (state.agentId && !selected.agent && agents.length > 0) {
      const agentIndex = agents.findIndex((item) => item.id === state.agentId);
      if (agentIndex !== -1) selected.agent = agents[agentIndex];
      else {
        const res = await getUserById(state.agentId);
        if (res) {
          selected.agent = res;

          setAgents((items) => {
            items.push(res);
            return [...items];
          });
        } else onStateChanged({ id: 'agentId', value: null });
      }
      if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
    }
    if (state.referralId && !selected.referral && referrals.length > 0) {
      const referralIndex = referrals.findIndex((item) => item.id === state.referralId);
      if (referralIndex !== -1) selected.referral = referrals[referralIndex];
      else {
        const res = await getUserById(state.referralId);
        if (res) {
          selected.referral = res;

          setReferrals((items) => {
            items.push(res);
            return [...items];
          });
        } else onStateChanged({ id: 'referralId', value: null });
      }
      if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
    }
    if (state.transactedById && !selected.transactedBy && transactedBy.length > 0) {
      const transactedByIndex = transactedBy.findIndex((item) => item.id === state.transactedById);
      if (transactedByIndex !== -1) selected.transactedBy = transactedBy[transactedByIndex];
      else {
        const res = await getUserById(state.transactedById);
        if (res) {
          selected.transactedBy = res;

          setTransactedBy((items) => {
            items.push(res);
            return [...items];
          });
        } else onStateChanged({ id: 'transactedById', value: null });
      }
      if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
    }
    if (state.reservationTypeId && !selected.reservationType && reservationTypes.length > 0) {
      const reservationTypeIndex = reservationTypes.findIndex(
        (item) => item.lookupItemId === state.reservationTypeId
      );
      if (reservationTypeIndex !== -1) {
        selected.reservationType = reservationTypes[reservationTypeIndex];
        if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
      } else onStateChanged({ id: 'reservationTypeId', value: null });
    }
    if (state.rentFreePeriodId && !selected.rentFreePeriod && rentFreePeriods.length > 0) {
      const rentFreePeriodIndex = rentFreePeriods.findIndex(
        (item) => item.lookupItemId === state.rentFreePeriodId
      );
      if (rentFreePeriodIndex !== -1) {
        selected.rentFreePeriod = rentFreePeriods[rentFreePeriodIndex];
        if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
      } else onStateChanged({ id: 'rentFreePeriodId', value: null });
    }
  }, [
    agents,
    getUserById,
    onSelectedChanged,
    onStateChanged,
    referrals,
    rentFreePeriods,
    reservationTypes,
    selected,
    state.agentId,
    state.referralId,
    state.rentFreePeriodId,
    state.reservationTypeId,
    state.transactedById,
    transactedBy,
  ]);
  useEffect(() => {
    getAllAgents();
    getAllReferrals();
    getAllReservationTypes();
    getAllTransactedBy();
    getAllRentFreePeriods();
  }, [
    getAllAgents,
    getAllReferrals,
    getAllRentFreePeriods,
    getAllReservationTypes,
    getAllTransactedBy,
  ]);
  useEffect(() => {
     if (unitTransactionId)
     getEditInit();
  }, [getEditInit, unitTransactionId]);

  useEffect(() => {
    if (state.startDate > state.endDate)
      onStateChanged({ id: 'endDate', value: null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.endDate, state.startDate]);
  useEffect(() => {
    if (!state.transactionEntryDate)
      onStateChanged({ id: 'transactionEntryDate', value: (Date.now() && moment(Date.now()).format('YYYY-MM-DDTHH:mm:ss')) || null });
  }, [state]);

  return (
    <div className='unit-status-agent-info-wapper childs-wrapper p-relative'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='form-item'>
        <AutocompleteComponent
          idRef='agentIdRef'
          labelValue='agent'
          selectedValues={selected.agent}
          multiple={false}
          data={agents}
          displayLabel={(option) => option.fullName || ''}
          renderOption={(option) =>
            ((option.userName || option.fullName) && `${option.fullName} (${option.userName})`) ||
            ''}
          getOptionSelected={(option) => option.id === state.agentId}
          withoutSearchButton
          helperText={getErrorByName(schema, 'agentId').message}
          error={getErrorByName(schema, 'agentId').error}
          isLoading={loadings.agents}
          onInputKeyUp={(e) => {
            const { value } = e.target;
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => {
              getAllAgents(value, selected.agent);
            }, 700);
          }}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'agent', value: newValue });
            onStateChanged({
              id: 'agentId',
              value: (newValue && newValue.id) || null,
            });
            localStorage.setItem('AgentInformation', JSON.stringify(newValue));
          }}
        />
      </div>
      <div className='form-item'>
        <RadiosGroupComponent
          idRef='contractSignedRef'
          labelValue='is-contract-ratified'
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
          value={state.contractSigned}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
          translationPath={translationPath}
          labelInput='value'
          valueInput='key'
          onSelectedRadioChanged={(e, newValue) =>
            onStateChanged({ id: 'contractSigned', value: newValue === 'true' })}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='premisesRef'
          labelValue='premises'
          value={state.premises || ''}
          helperText={getErrorByName(schema, 'premises').message}
          error={getErrorByName(schema, 'premises').error}
          isWithError
          isSubmitted={isSubmitted}
          multiline
          rows={4}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'premises', value: event.target.value });
          }}
        />
      </div>
      <div className='form-item'>
        <AutocompleteComponent
          idRef='referralIdRef'
          labelValue='trans-description'
          selectedValues={selected.referral}
          multiple={false}
          data={referrals}
          displayLabel={(option) => option.fullName || ''}
          renderOption={(option) =>
            ((option.userName || option.fullName) && `${option.fullName} (${option.userName})`) ||
            ''}
          getOptionSelected={(option) => option.id === state.referralId}
          withoutSearchButton
          helperText={getErrorByName(schema, 'referralId').message}
          error={getErrorByName(schema, 'referralId').error}
          isLoading={loadings.referrals}
          onInputKeyUp={(e) => {
            const { value } = e.target;
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => {
              getAllReferrals(value, selected.referral);
            }, 700);
          }}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'referral', value: newValue });
            onStateChanged({
              id: 'referralId',
              value: (newValue && newValue.id) || null,
            });
          }}
        />
      </div>
      <div className='form-item'>
        <DatePickerComponent
          idRef='contractDateRef'
          labelValue='contract-date'
          placeholder='DD/MM/YYYY'
          value={state.contractDate}
          helperText={getErrorByName(schema, 'contractDate').message}
          error={getErrorByName(schema, 'contractDate').error}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onDateChanged={(newValue) => {
            onStateChanged({ id: 'contractDate', value: newValue });
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='referralPercentageRef'
          labelValue='trans-percentage-description'
          value={state.referralPercentage || 0}
          helperText={getErrorByName(schema, 'referralPercentage').message}
          error={getErrorByName(schema, 'referralPercentage').error}
          isWithError
          isSubmitted={isSubmitted}
          type='number'
          min={0}
          max={100}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            let value = floatHandler(event.target.value, 3);
            if (value > 100) value = 100;
            onStateChanged({ id: 'referralPercentage', value });
          }}
        />
      </div>
      <div className='form-item px-0'>
        <div className='form-item w-50'>
          <DatePickerComponent
            idRef='startDateRef'
            labelValue='start-date'
            placeholder='DD/MM/YYYY'
            value={state.startDate}
            helperText={getErrorByName(schema, 'startDate').message}
            error={getErrorByName(schema, 'startDate').error}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onDateChanged={(newValue) => {
              onStateChanged({ id: 'startDate', value: newValue });
            }}
          />
        </div>
        <div className='form-item w-50'>
          <DatePickerComponent
            idRef='endDateRef'
            labelValue='end-date'
            placeholder='DD/MM/YYYY'
            isDisabled={state.startDate === null}
            minDate={(state && state.startDate) || ''}
            value={state.endDate}
            helperText={getErrorByName(schema, 'endDate').message}
            error={getErrorByName(schema, 'endDate').error}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onDateChanged={(newValue) => {
              onStateChanged({ id: 'endDate', value: newValue });
            }}
          />
        </div>
      </div>
      <div className='form-item'>
        <Inputs
          idRef='contactRefNoRef'
          labelValue='contract-ref-no'
          value={state.contractRefNo || ''}
          helperText={getErrorByName(schema, 'contractRefNo').message}
          error={getErrorByName(schema, 'contractRefNo').error}
          isWithError
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'contractRefNo', value: event.target.value });
          }}
        />
      </div>
      <div className='form-item'>
        <AutocompleteComponent
          idRef='reservationTypeIdRef'
          labelValue='reservation-type'
          selectedValues={selected.reservationType}
          multiple={false}
          data={reservationTypes}
          displayLabel={(option) => option.lookupItemName || ''}
          getOptionSelected={(option) => option.lookupItemId === state.reservationTypeId}
          withoutSearchButton
          helperText={getErrorByName(schema, 'reservationTypeId').message}
          error={getErrorByName(schema, 'reservationTypeId').error}
          isWithError
          isLoading={loadings.reservationTypes}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'reservationType', value: newValue });
            onStateChanged({
              id: 'reservationTypeId',
              value: (newValue && newValue.lookupItemId) || null,
            });
          }}
        />
      </div>
      <div className='form-item'>
        <AutocompleteComponent
          idRef='rentFreePeriodIdRef'
          labelValue='rent-free-period-description'
          selectedValues={selected.rentFreePeriod}
          multiple={false}
          data={rentFreePeriods}
          displayLabel={(option) => option.lookupItemName || ''}
          getOptionSelected={(option) => option.lookupItemId === state.rentFreePeriod}
          withoutSearchButton
          helperText={getErrorByName(schema, 'rentFreePeriodId').message}
          error={getErrorByName(schema, 'rentFreePeriodId').error}
          isWithError
          isLoading={loadings.rentFreePeriods}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'rentFreePeriod', value: newValue });
            onStateChanged({
              id: 'rentFreePeriodId',
              value: (newValue && newValue.lookupItemId) || null,
            });
          }}
        />
      </div>
      <div className='form-item'>
        <DatePickerComponent
          idRef='transactionEntryDateRef'
          labelValue='transaction-entry-date'
          placeholder='DD/MM/YYYY'
          value={(state && state.transactionEntryDate)}
          helperText={getErrorByName(schema, 'transactionEntryDate').message}
          error={getErrorByName(schema, 'transactionEntryDate').error}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onDateChanged={(newValue) => {
            onStateChanged({ id: 'transactionEntryDate', value: newValue });
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='observationsRef'
          labelValue='observations'
          value={state.observations || ''}
          helperText={getErrorByName(schema, 'observations').message}
          error={getErrorByName(schema, 'observations').error}
          isWithError
          isSubmitted={isSubmitted}
          multiline
          rows={4}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'observations', value: event.target.value });
          }}
        />
      </div>
      <div className='form-item px-0'>
        <div className='px-2 w-50'>
          <Inputs
            idRef='occupantsAdultsRef'
            labelValue='number-of-adults-description'
            value={state.occupantsAdults || 0}
            helperText={getErrorByName(schema, 'occupantsAdults').message}
            error={getErrorByName(schema, 'occupantsAdults').error}
            isWithError
            isSubmitted={isSubmitted}
            type='number'
            min={0}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              const value = floatHandler(event.target.value, 3);
              onStateChanged({ id: 'occupantsAdults', value });
            }}
          />
        </div>
        <div className='px-2 w-50'>
          <Inputs
            idRef='occupantsChildrenRef'
            labelValue='number-of-children-description'
            value={state.occupantsChildren || 0}
            helperText={getErrorByName(schema, 'occupantsChildren').message}
            error={getErrorByName(schema, 'occupantsChildren').error}
            isWithError
            isSubmitted={isSubmitted}
            type='number'
            min={0}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              const value = floatHandler(event.target.value, 3);
              onStateChanged({ id: 'occupantsChildren', value });
            }}
          />
        </div>
      </div>
      <div className='form-item'>
        <AutocompleteComponent
          idRef='transactedByIdRef'
          labelValue='transacted-by-leasing-description'
          selectedValues={selected.transactedBy}
          multiple={false}
          data={transactedBy}
          displayLabel={(option) => option.fullName || ''}
          renderOption={(option) =>
            ((option.userName || option.fullName) && `${option.fullName} (${option.userName})`) ||
            ''}
          getOptionSelected={(option) => option.id === state.transactedById}
          withoutSearchButton
          helperText={getErrorByName(schema, 'transactedById').message}
          error={getErrorByName(schema, 'transactedById').error}
          isWithError
          isSubmitted={isSubmitted}
          isLoading={loadings.transactedBy}
          onInputKeyUp={(e) => {
            const { value } = e.target;
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => {
              getAllTransactedBy(value, selected.transactedBy);
            }, 700);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onChange={(event, newValue) => {
            onSelectedChanged({ id: 'transactedBy', value: newValue });
            onStateChanged({
              id: 'transactedById',
              value: (newValue && newValue.id) || null,
            });
          }}
        />
      </div>
    </div>
  );
};

AgentInfoRentRelatedComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  unitTransactionId: PropTypes.number,
  onStateChanged: PropTypes.func.isRequired,
  onSelectedChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
AgentInfoRentRelatedComponent.defaultProps = {
  unitTransactionId: undefined,
};
