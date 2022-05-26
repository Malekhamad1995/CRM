import React, { useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { lookupItemsGetId } from '../../../../../../../../Services';
import { LeadRatingEnum, LeadsStatusEnum, LeadCloseReasonsEnum } from '../../../../../../../../Enums';
import { MyLeadLeadDetailsFields } from './MyLeadLeadDetailsStepFields';

export const MyLeadLeadDetailsStep = ({
  state,
  schema,
  selected,
  formType,
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
    leadStatus: [],
    leadRating: [],
    MediaDetail: [],
    mediaName: [],
    closeLeadResoun: []
  });
  const [loadings, setLoadings] = useReducer(reducer, {
    leadStatus: false,
    leadRating: false,
    MediaDetail: false,
    mediaName: [],
    closeLeadResoun: false,
  });
  const getAllLeadStatuses = useCallback(async () => {
    setLoadings({ id: 'leadStatus', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: LeadsStatusEnum.lookupTypeId });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'leadStatus', value: res });
    else setData({ id: 'leadStatus', value: [] });
    setLoadings({ id: 'leadStatus', value: false });
  }, []);
  const getAllLeadCloseResoun = useCallback(async () => {
    setLoadings({ id: 'closeLeadResoun', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: LeadCloseReasonsEnum.lookupTypeId });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'closeLeadResoun', value: res });
    else setData({ id: 'closeLeadResoun', value: [] });
    setLoadings({ id: 'closeLeadResoun', value: false });
  }, []);

  const getAllRatings = useCallback(async () => {
    setLoadings({ id: 'leadRating', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: LeadRatingEnum.lookupTypeId });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'leadRating', value: res });
    else setData({ id: 'leadRating', value: [] });
    setLoadings({ id: 'leadRating', value: false });
  }, []);
  const getAllMediaDetail = useCallback(async () => {
    setLoadings({ id: 'MediaDetail', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: 35 });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'MediaDetail', value: res });
    else setData({ id: 'MediaDetail', value: [] });
    setLoadings({ id: 'MediaDetail', value: false });
  }, []);

  const getAllmediaName = useCallback(async () => {
    setLoadings({ id: 'mediaName', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: 8 });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'mediaName', value: res });
    else setData({ id: 'mediaName', value: [] });
    setLoadings({ id: 'mediaName', value: false });
  }, []);

  useEffect(() => {
    if (state.leadStatusId === undefined || state.leadStatusId === null) return;
    if (state.leadStatusId === 458)
      getAllLeadCloseResoun();
    else {
      setData({ id: 'closeLeadResoun', value: [] });
      setLoadings({ id: 'closeLeadResoun', value: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.leadStatusId]);

  useEffect(() => {
    getAllLeadStatuses();
    getAllRatings();
    getAllMediaDetail();
    getAllmediaName();
  }, [getAllMediaDetail, getAllLeadStatuses, getAllRatings, getAllmediaName]);
  return (
    <div className='add-new-lead-dialog-content-wrapper'>
      <MyLeadLeadDetailsFields
        labelClasses='Requierd-Color'
        data={data}
        state={state}
        schema={schema}
        selected={selected}
        formType={formType}
        loadings={loadings}
        isSubmitted={isSubmitted}
        onStateChangeHandler={onStateChangeHandler}
        onSelectedChangeHandler={onSelectedChangeHandler}
      />
    </div>
  );
};
MyLeadLeadDetailsStep.propTypes = {
  formType: PropTypes.number.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onStateChangeHandler: PropTypes.func.isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  onSelectedChangeHandler: PropTypes.func.isRequired,
};
