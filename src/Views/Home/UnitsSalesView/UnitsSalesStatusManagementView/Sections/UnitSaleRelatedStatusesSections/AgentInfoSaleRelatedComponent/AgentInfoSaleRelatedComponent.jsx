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
  DataFileAutocompleteComponent,
} from '../../../../../../../Components';
import { ReservationType } from '../../../../../../../assets/json/StaticLookupsIds.json';
import { floatHandler, getErrorByName } from '../../../../../../../Helper';
import {
  GetContacts,
  lookupItemsGetId,
  ActiveOrganizationUser,
  OrganizationUserSearch,
  contactsDetailsGet,
  GetAllContactsByClassificationIds
} from '../../../../../../../Services';
import { AgentRoleEnum } from '../../../../../../../Enums/AgentRoleEnum';

export const AgentInfoSaleRelatedComponent = ({
  state,
  selected,
  onSelectedChanged,
  schema,
  unitTransactionId,
  isSubmitted,
  onStateChanged,
  isReadOnly,
  parentTranslationPath,
  translationPath,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const searchTimer = useRef(null);
  const [loadings, setLoadings] = useState({
    agents: false,
    referrals: false,
    reservationTypes: false,
    transactedBy: false,
    externalAgencies: false,
  });
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [agents, setAgents] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [reservationTypes, setReservationTypes] = useState([]);
  const [transactedBy, setTransactedBy] = useState([]);
  const [externalAgencies, setExternalAgencies] = useState([]);
  const getAllAgents = useCallback(
    async (value, selectedValue) => {
      setLoadings((items) => ({ ...items, agents: true }));
      const res = await OrganizationUserSearch({
        ...filter,
   userTypeId: AgentRoleEnum.SaleAgent.value,

name: value,
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
  const getAllExternalAgencies = useCallback(
    async (value) => {
      setLoadings((items) => ({ ...items, externalAgencies: true }));
      const res = await GetAllContactsByClassificationIds({
 ...filter,
   userStatusId: 2,
  search: value,
  classificationIds:
        [  
        20713,
        20714
        ]
});
      if (!(res && res.status && res.status !== 200))
        setExternalAgencies((res && res.result) || []);
      else setExternalAgencies([]);
      setLoadings((items) => ({ ...items, externalAgencies: false }));
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

  const getUserById = useCallback(async (id) => {
    setIsLoading(true);
    const res = await ActiveOrganizationUser(id);
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) return res;
    return null;
  }, []);
  const contactById = useCallback(async (id) => {
    setIsLoading(true);
    const res = await contactsDetailsGet({ id });
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
        }
        onStateChanged({ id: 'referralId', value: null });
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
    if (state.externalAgencyId && !selected.externalAgency && externalAgencies.length > 0) {
      const externalAgencyIndex = externalAgencies.findIndex(
        (item) => item.contactsId === state.externalAgencyId
      );
      if (externalAgencyIndex !== -1)
        selected.externalAgency = externalAgencies[externalAgencyIndex];
      else {
        const res = await contactById(state.externalAgencyId);
        if (res) {
          selected.externalAgency = res;

          setExternalAgencies((items) => {
            items.push(res);
            return [...items];
          });
        } else onStateChanged({ id: 'externalAgencyId', value: null });
      }
      if (onSelectedChanged) onSelectedChanged({ id: 'edit', value: selected });
    }
  }, [
    agents,
    contactById,
    externalAgencies,
    getUserById,
    onSelectedChanged,
    onStateChanged,
    referrals,
    reservationTypes,
    selected,
    state.agentId,
    state.externalAgencyId,
    state.referralId,
    state.reservationTypeId,
    state.transactedById,
    transactedBy,
  ]);

  useEffect(() => {
    getAllAgents();
    getAllReferrals();
    getAllReservationTypes();
    getAllTransactedBy();
    getAllExternalAgencies();
  }, [
    getAllAgents,
    getAllExternalAgencies,
    getAllReferrals,
    getAllReservationTypes,
    getAllTransactedBy,
  ]);
  useEffect(() => {
    if (unitTransactionId) getEditInit();
  }, [getEditInit, unitTransactionId]);
  return (
    <div className='unit-status-agent-info-wapper childs-wrapper p-relative agent-info-sale-related-component-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='form-item'>
        <AutocompleteComponent
          idRef='agentIdRef'
          labelValue='agent'
          selectedValues={selected.agent}
          multiple={false}
          isDisabled={isReadOnly}
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
          idRef='contractRatifiedRef'
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
          value={state.contractRatified}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
          isDisabled={isReadOnly}
          translationPath={translationPath}
          labelInput='value'
          valueInput='key'
          onSelectedRadioChanged={(e, newValue) =>
            onStateChanged({ id: 'contractRatified', value: newValue === 'true' })}
        />
      </div>
      <div className='form-item'>
        <RadiosGroupComponent
          idRef='titleDeedTransferredRef'
          labelValue='is-transferred-deed'
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
          value={state.titleDeedTransferred}
          isDisabled={isReadOnly}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
          translationPath={translationPath}
          labelInput='value'
          valueInput='key'
          onSelectedRadioChanged={(event, newValue) =>
            onStateChanged({ id: 'titleDeedTransferred', value: newValue === 'true' })}
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
          isDisabled={isReadOnly}
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
          idRef='contractRatifiedDateRef'
          labelValue='ratified-date'
          placeholder='DD/MM/YYYY'
          value={state.contractRatifiedDate}
          isDisabled={isReadOnly}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onDateChanged={(newValue) => {
            onStateChanged({ id: 'contractRatifiedDate', value: newValue });
          }}
        />
      </div>
      <div className='form-item'>
        <RadiosGroupComponent
          idRef='mortgageRef'
          labelValue='is-mortgage'
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
          value={state.mortgage}
          isDisabled={isReadOnly}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
          translationPath={translationPath}
          labelInput='value'
          valueInput='key'
          onSelectedRadioChanged={(e, newValue) =>
            onStateChanged({ id: 'mortgage', value: newValue === 'true' })}
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
          isDisabled={isReadOnly}
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
      <div className='form-item'>
        <Inputs
          idRef='contractRefNoRef'
          labelValue='contract-ref-no'
          value={state.contractRefNo || ''}
          helperText={getErrorByName(schema, 'contractRefNo').message}
          error={getErrorByName(schema, 'contractRefNo').error}
          isWithError
          isDisabled={isReadOnly}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'contractRefNo', value: event.target.value });
          }}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='financeCompRef'
          labelValue='finance-comp'
          value={state.financeComp || ''}
          helperText={getErrorByName(schema, 'financeComp').message}
          error={getErrorByName(schema, 'financeComp').error}
          isWithError
          isDisabled={isReadOnly}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            onStateChanged({ id: 'financeComp', value: event.target.value });
          }}
        />
      </div>
      <div className='form-item'>
        <DatePickerComponent
          idRef='transactionEntryDateRef'
          labelValue='transaction-entry-date'
          placeholder='DD/MM/YYYY'
          value={state.transactionEntryDate}
          minDate={moment().format('YYYY-MM-DDTHH:mm:ss')}
          helperText={getErrorByName(schema, 'transactionEntryDate').message}
          error={getErrorByName(schema, 'transactionEntryDate').error}
          isDisabled={isReadOnly}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onDateChanged={(newValue) => {
            onStateChanged({ id: 'transactionEntryDate', value: newValue });
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
          isDisabled={isReadOnly}
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
        <RadiosGroupComponent
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
          value={state.paymentToExternalAgency}
          isDisabled={isReadOnly}
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
          translationPath={translationPath}
          labelInput='value'
          valueInput='key'
          onSelectedRadioChanged={(e, newValue) => {
            if (state.externalAgencyId) {
              onStateChanged({ id: 'externalAgencyId', value: null });
              onSelectedChanged({ id: 'externalAgency', value: null });
            }
            onStateChanged({ id: 'paymentToExternalAgency', value: newValue === 'true' });
          }}
        />
      </div>
      {state.paymentToExternalAgency && (
        <div className='form-item'>
          <DataFileAutocompleteComponent
            idRef='externalAgencyIdRef'
            labelValue='external-agency'
            selectedValues={selected.externalAgency}
            isDisabled={isReadOnly}
            multiple={false}
            data={externalAgencies}
            displayLabel={(option) =>
              (option.contact &&
                (option.contact.first_name || option.contact.last_name) &&
                `${option.contact.first_name} ${option.contact.last_name}`) ||
              option.contact.company_name ||
              ''}
            // renderOption={(option) =>
            //   (option.contact && (
            //     <div className='d-flex-column'>
            //       <div className='d-flex-v-center-h-between w-100 texts-truncate'>
            //         {(option.contact.first_name || option.contact.last_name) && (
            //           <span>{`${option.contact.first_name} ${option.contact.last_name}`}</span>
            //         )}
            //         {option.contact.company_name && <span>{option.contact.company_name}</span>}
            //       </div>
            //       <span className='c-gray-secondary'>
            //         {(option.contact.contact_type_id === 1 &&
            //           (option.contact.mobile.phone || 'N/A')) ||
            //           option.contact.landline_number.phone ||
            //           'N/A'}
            //       </span>
            //     </div>
            //   )) ||
            //   'N/A'}
            getOptionSelected={(option) => option.contactsId === state.externalAgencyId}
            withoutSearchButton
            helperText={getErrorByName(schema, 'externalAgencyId').message}
            error={getErrorByName(schema, 'externalAgencyId').error}
            isWithError
            isSubmitted={isSubmitted}
            isLoading={loadings.externalAgencies}
            onInputKeyUp={(e) => {
              const { value } = e.target;
              if (searchTimer.current) clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(() => {
                getAllExternalAgencies(value);
              }, 700);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              onSelectedChanged({ id: 'externalAgency', value: newValue });
              onStateChanged({
                id: 'externalAgencyId',
                value: (newValue && newValue.contactsId) || null,
              });
            }}
          />
        </div>
      )}
      <div className='form-item'>
        <AutocompleteComponent
          idRef='transactedByIdRef'
          labelValue='transacted-by-sale-description'
          selectedValues={selected.transactedBy}
          multiple={false}
          data={transactedBy}
          isDisabled={isReadOnly}
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
      <div className='form-item'>
        <Inputs
          idRef='observationsRef'
          labelValue='observations'
          value={state.observations || ''}
          helperText={getErrorByName(schema, 'observations').message}
          error={getErrorByName(schema, 'observations').error}
          isDisabled={isReadOnly}
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
      <div className='form-item'>
        <DatePickerComponent
          idRef='closingDateRef'
          labelValue='closing-date'
          placeholder='DD/MM/YYYY'
          value={state.closingDate}
          helperText={getErrorByName(schema, 'closingDate').message}
          error={getErrorByName(schema, 'closingDate').error}
          isDisabled={isReadOnly}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onDateChanged={(newValue) => {
            onStateChanged({ id: 'closingDate', value: newValue });
          }}
        />
      </div>
    </div>
  );
};

AgentInfoSaleRelatedComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object),
  unitTransactionId: PropTypes.number,
  onStateChanged: PropTypes.func.isRequired,
  onSelectedChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  isReadOnly: PropTypes.bool,
};
AgentInfoSaleRelatedComponent.defaultProps = {
  unitTransactionId: undefined,
  schema: undefined,
  isReadOnly: false,
  isSubmitted: false,
};
