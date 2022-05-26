import React, { useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { GetAdvanceSearchProperties, lookupItemsGetId } from '../../../../../../../../Services';
import { TableFilterOperatorsEnum, UnitTypes } from '../../../../../../../../Enums';
import { MyLeadUnitDetailsFields } from './MyLeadUnitDetailsStepFields';

export const MyLeadUnitDetailsStep = ({
  state,
  schema,
  formType,
  selected,
  isSubmitted,
  onStateChangeHandler,
  onSelectedChangeHandler,
}) => {
  const reducer = useCallback((itemsState, action) => {
    if (action.id !== 'edit') return { ...itemsState, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [data, setData] = useReducer(reducer, {
    property: [],
    unitType: [],
  });
  const [loadings, setLoadings] = useReducer(reducer, {
    property: false,
    unitType: false,
  });
  const getAllProperty = useCallback(async (search = '') => {
    setLoadings({ id: 'property', value: true });
    const res = await GetAdvanceSearchProperties(
      { pageIndex: 0, pageSize: 25 },
      {
        criteria: {
          property_name: [{ searchType: TableFilterOperatorsEnum.contains.key, value: search }],
        },
      }
    );
    if (!(res && res.status && res.status !== 200)) setData({ id: 'property', value: res.result });
    else setData({ id: 'property', value: [] });
    setLoadings({ id: 'property', value: false });
  }, []);
  const getAllUnitType = useCallback(async () => {
    setLoadings({ id: 'unitType', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: UnitTypes.lookupTypeId });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'unitType', value: res });
    else setData({ id: 'unitType', value: [] });
    setLoadings({ id: 'unitType', value: false });
  }, []);
  useEffect(() => {
    getAllProperty();
    getAllUnitType();
  }, [getAllUnitType, getAllProperty]);
  return (
    <div className='add-new-lead-dialog-content-wrapper'>
      <MyLeadUnitDetailsFields
        labelClasses='Requierd-Color'
        data={data}
        state={state}
        schema={schema}
        formType={formType}
        selected={selected}
        loadings={loadings}
        isSubmitted={isSubmitted}
        getAllProperty={getAllProperty}
        onStateChangeHandler={onStateChangeHandler}
        onSelectedChangeHandler={onSelectedChangeHandler}
      />
    </div>
  );
};
MyLeadUnitDetailsStep.propTypes = {
  formType: PropTypes.number.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onStateChangeHandler: PropTypes.func.isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  onSelectedChangeHandler: PropTypes.func.isRequired,
};
