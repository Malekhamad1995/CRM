import React, {
  useReducer, useCallback, useEffect, useState
} from 'react';
import { PropTypes } from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  AddNewLeadDialog,
  MyLeadFieldsValidations,
} from '../../../../../../MyLeadsView/MyLeadsUtilities';

const parentTranslationPath = 'MyLeadView';
const translationPath = '';
export const LeadQuickAddDialog = ({ isOpen, close }) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [schema, setSchema] = useState({});
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);

  const reducer2 = useCallback((selected, action) => {
    if (action.id !== 'edit') return { ...selected, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);

  const defaultState = {
    leadClassId: null,
    salutationId: null,
    firstName: null,
    lastName: null,
    mobileNumbers: [],
    emailAddresses: [],
    languageId: null,
    nationalityId: null,
    cityId: null,
    districtId: null,
    communityId: null,
    propertyId: null,
    unitTypeId: null,
    numberOfBedrooms: [],
    numberOfBathrooms: [],
    priceFrom: null,
    priceTo: null,
    areaFrom: null,
    areaTo: null,
    leadStatusId: null,
    leadRatingId: null,
    mediaNameId: null,
    mediaDetailId: null,
    referredTo: null,
    isForAutoRotation: true,
    MethodOfContact: null,
    closedReasonId: null,
    ReferredBy: (loginResponse && loginResponse.userId) || null
  };

  const [state, setState] = useReducer(reducer, defaultState);
  const deafultSelected = {
    nationality: null,
    property: null,
    unitType: null,
    leadStatus: null,
    leadRating: null,
    clientSource: null,
    referredTo: null,
    closeLeadResoun: null

  };

  const [selected, setSelected] = useReducer(reducer2, deafultSelected);
  const onSelectedChangeHandler = (valueId, newValue) => {
    setSelected({ id: valueId, value: newValue });
  };

  useEffect(() => {
    setSchema(MyLeadFieldsValidations(state, translationPath, t));
  }, [state, t]);
  return (
    <AddNewLeadDialog
      isOpenChanged={() => {
        
        close();
        setState({ id: 'edit', value: defaultState });
        setSelected({ id: 'edit', value: defaultState });
      }}
      reloadData={() => {
        close();
        setState({ id: 'edit', value: defaultState });
        setSelected({ id: 'edit', value: defaultState });
      }}
      isQuickAdd
      state={state}
      schema={schema}
      isOpen={isOpen}
      selected={selected}
      setState={setState}
      translationPath={translationPath}
      parentTranslationPath={parentTranslationPath}
      onSelectedChangeHandler={onSelectedChangeHandler}
    />
  );
};
LeadQuickAddDialog.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
