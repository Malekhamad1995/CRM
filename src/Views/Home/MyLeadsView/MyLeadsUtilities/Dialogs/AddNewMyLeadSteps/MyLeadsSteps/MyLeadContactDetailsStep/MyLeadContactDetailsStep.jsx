import React, {
  useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import { lookupItemsGetId } from '../../../../../../../../Services';
import {
  LanguageEnum, NationalityEnum, SalutationEnum, AgentRoleEnum
} from '../../../../../../../../Enums';
import { MyLeadContactDetailsFields } from './MyLeadContactDetailsFields';
import { OrganizationUserSearch } from '../../../../../../../../Services/userServices';

export const MyLeadContactDetailsStep = ({
  state,
  schema,
  setState,
  selected,
  isQuickAdd,
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
    salutation: [],
    nationality: [],
    language: [],
    users: [],
  });
  const [loadings, setLoadings] = useReducer(reducer, {
    salutation: false,
    nationality: false,
    language: false,
    users: false,
  });
  const [filter, setfilter] = useState({
    pageSize: 100,
    pageIndex: 1,
    name: '',
  });
  const getAllSalutation = useCallback(async () => {
    setLoadings({ id: 'salutation', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: SalutationEnum.lookupTypeId });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'salutation', value: res });
    else setData({ id: 'salutation', value: [] });
    setLoadings({ id: 'salutation', value: false });
  }, []);
  const getAllLanguages = useCallback(async () => {
    setLoadings({ id: 'language', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: LanguageEnum.lookupTypeId });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'language', value: res });
    else setData({ id: 'language', value: [] });
    setLoadings({ id: 'language', value: false });
  }, []);
  const getAllNationalities = useCallback(async () => {
    setLoadings({ id: 'nationality', value: true });
    const res = await lookupItemsGetId({ lookupTypeId: NationalityEnum.lookupTypeId });
    if (!(res && res.status && res.status !== 200))
      setData({ id: 'nationality', value: res && res });
    else setData({ id: 'nationality', value: [] });
    setLoadings({ id: 'nationality', value: false });
  }, []);

  const getUsersAPI = useCallback(async (userTypeId, searchItem) => {
    setLoadings({ id: 'users', value: true });
    const res = await OrganizationUserSearch({ ...filter, userTypeId, name: searchItem || null });
    setData({ id: 'users', value: res && res.result });
    setLoadings({ id: 'users', value: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });
  useEffect(() => {
    getAllLanguages();
    getAllSalutation();
    getAllNationalities();
  }, [getAllLanguages, getAllNationalities, getAllSalutation]);

  useEffect(() => {
    if (state.leadClassId) {
      const userTypeId = Object.values(AgentRoleEnum && AgentRoleEnum).find((a) => a.key === state.leadClassId).value;
      getUsersAPI(userTypeId);
    }
  }, [state.leadClassId]);

  return (
    <div className='add-new-lead-dialog-content-wrapper'>
      <MyLeadContactDetailsFields
        labelClasses='Requierd-Color'
        data={data}
        state={state}
        schema={schema}
        setNumber={(event) => {
          setState({ id: 'mobileNumbers', value: event || null });
        }}
        onSearchUsers={(search) => {
          const userTypeId = Object.values(AgentRoleEnum && AgentRoleEnum).find((a) => a.key === state.leadClassId).value;
          getUsersAPI(userTypeId, search);
        }}
        setFilter={(e) => setfilter((item) => ({ ...item, name: e }))}
        selected={selected}
        loadings={loadings}
        isQuickAdd={isQuickAdd}
        isSubmitted={isSubmitted}
        onStateChangeHandler={onStateChangeHandler}
        onSelectedChangeHandler={onSelectedChangeHandler}
      />
    </div>
  );
};
MyLeadContactDetailsStep.propTypes = {
  setState: PropTypes.func.isRequired,
  isQuickAdd: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onStateChangeHandler: PropTypes.func.isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  onSelectedChangeHandler: PropTypes.func.isRequired,
};
