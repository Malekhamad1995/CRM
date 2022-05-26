import React, {
 useCallback, useEffect, useReducer, useRef
} from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../Components';
import {
  CommunityTypeIdEnum,
  UnitTypes,
  UnitViewsTypeIdEnum,
  PaymentModeId,
  TableFilterOperatorsEnum,
} from '../../../../../Enums';
import { GetAdvanceSearchProperties, GetLeads, lookupItemsGetId } from '../../../../../Services';
import { UntZeroMatchingFieldsLeftSection } from './UntZeroMatchingFieldsLeftSection';
import { UntZeroMatchingFieldsRightSection } from './UntZeroMatchingFieldsRightSection';

export const UntZeroMatchingFields = ({
  state,
  schema,
  setState,
  selected,
  setSelected,
  isSubmitted,
  translationPath,
  parentTranslationPath,
}) => {
  const searchTimer = useRef(null);
  const reducer = useCallback((itemState, action) => {
    if (action.id !== 'edit') return { ...itemState, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [loadings, setLoadings] = useReducer(reducer, {
    relatedLeadNumberId: false,
    community: false,
    property: false,
    unitType: false,
    unitViews: false,
    paymentMethod: false,
  });
  const [data, setData] = useReducer(reducer, {
    relatedLeadNumberId: [],
    community: [],
    property: [],
    unitType: [],
    unitViews: [],
    paymentMethod: [],
  });
  const getAllLeads = useCallback(async (value) => {
    setLoadings({ id: 'relatedLeadNumberId', value: true });
    const res = await GetLeads({ pageIndex: 0, pageSize: 25, search: value });
    if (!(res && res.status && res.status !== 200))
      setData({ id: 'relatedLeadNumberId', value: res.result });
    else setData({ id: 'relatedLeadNumberId', value: [] });
    setLoadings({ id: 'relatedLeadNumberId', value: false });
  }, []);
  const getAllProperty = useCallback(async ({ lookup = '', search = '' }) => {
    setLoadings({ id: 'property', value: true });
    const res = await GetAdvanceSearchProperties(
      { pageIndex: 0, pageSize: 25 },
      {
        criteria: {
          property_name: [{ searchType: TableFilterOperatorsEnum.contains.key, value: search }],
          'community.lookupItemName': [{ searchType: TableFilterOperatorsEnum.contains.key, value: lookup }],
        },
      }
    );
    if (!(res && res.status && res.status !== 200)) setData({ id: 'property', value: res.result });
    else setData({ id: 'property', value: [] });
    setLoadings({ id: 'property', value: false });
  }, []);
  const getAllCommunity = useCallback(async () => {
    setLoadings({ id: 'community', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: CommunityTypeIdEnum.lookupTypeId });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'community', value: res });
    else setData({ id: 'community', value: [] });
    setLoadings({ id: 'community', value: false });
  }, []);
  const getAllUnitType = useCallback(async () => {
    setLoadings({ id: 'unitType', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: UnitTypes.lookupTypeId });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'unitType', value: res });
    else setData({ id: 'unitType', value: [] });
    setLoadings({ id: 'unitType', value: false });
  }, []);
  const getAllUnitViews = useCallback(async () => {
    setLoadings({ id: 'unitViews', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: UnitViewsTypeIdEnum.lookupTypeId });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'unitViews', value: res });
    else setData({ id: 'unitViews', value: [] });
    setLoadings({ id: 'unitViews', value: false });
  }, []);
  const getAllPaymentModes = useCallback(async () => {
    setLoadings({ id: 'paymentMethod', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: PaymentModeId.lookupTypeId });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'paymentMethod', value: res });
    else setData({ id: 'paymentMethod', value: [] });
    setLoadings({ id: 'paymentMethod', value: false });
  }, []);
  useEffect(() => {
    getAllLeads();
  }, [getAllLeads]);
  useEffect(() => {
    getAllCommunity();
  }, [getAllCommunity]);
  useEffect(() => {
    getAllUnitType();
  }, [getAllUnitType]);
  useEffect(() => {
    getAllUnitViews();
  }, [getAllUnitViews]);
  useEffect(() => {
    getAllPaymentModes();
  }, [getAllPaymentModes]);
  useEffect(() => {
    if (selected.community && selected.community.lookupItemName)
      getAllProperty({ lookup: selected.community.lookupItemName });
  }, [getAllProperty, selected.community]);
  return (
    <>
      <div className='form-wrapper d-flex w-100'>
        <UntZeroMatchingFieldsLeftSection
          data={data}
          state={state}
          schema={schema}
          loadings={loadings}
          selected={selected}
          setState={setState}
          searchTimer={searchTimer}
          setSelected={setSelected}
          getAllLeads={getAllLeads}
          isSubmitted={isSubmitted}
          getAllProperty={getAllProperty}
        />
        <UntZeroMatchingFieldsRightSection
          data={data}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
      <div className='form-item px-5'>
        <Inputs
          multiline
          rows={4}
          idRef='firstNameRef'
          labelValue='extra-requirements'
          value={selected.extraRequirements || ''}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          onInputChanged={(event) =>
            setSelected({ id: 'extraRequirements', value: event.target.value })}
        />
      </div>
    </>
  );
};
UntZeroMatchingFields.propTypes = {
  setState: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  translationPath: PropTypes.string.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
