import React, {
  useEffect, useState, useCallback, useReducer
} from 'react';
import {
  BulkSelectedUnitsSection,
  NewValuesSection,
  UnitFieldsSection,
  BulkAssignActions,
} from './Sections';
import { FormErrorsHandler, GlobalHistory, formItemsBuilderv3 } from '../../../Helper';
import { useLocalStorage } from '../../../Hooks';
import { GetAllFormFieldsByFormId } from '../../../Services';
import { Spinner } from '../../../Components';
import { FormsIdsEnum } from '../../../Enums';

const parentTranslationPath = 'BulkAssign';
const translationPath = '';
export const UnitsBulkAssignView = () => {
  const [bulkedUnits] = useLocalStorage('bulk-assign-ids');
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const [formFieldIds, setFormFieldIds] = useState(formFields);
  const [unitStatus, setUnitStatus] = useState({
    failure: [],
    success: [],
  });
  const [formFieldsData, setFormFieldsData] = useState([]);
  const [formData, setFormData] = useState([]);
  const [unitCards, setUnitCards] = useState(bulkedUnits);
  const [unitDetails, setUnitDetails] = useState({});
  const [errors, setErrors] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [unitInitDetails, setIntUnitDetails] = useState([]);
  useEffect(() => {
    if (bulkedUnits && bulkedUnits.length < 2)
      GlobalHistory.goBack();
  }, [bulkedUnits]);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const defaultState = {
    bulkUpdateUnits: [
      {
        unitId: 0,
        rowVersion: '',
      },
    ],
    fieldsName: [],
    updatedUnitJson: {},
  };
  const [state, setState] = useReducer(reducer, defaultState);
  useEffect(() => {
    const units = [];
    const fieldsNames = [];
    unitInitDetails.map((item) => {
      if (!unitDetails[item]) unitDetails[item] = null;
    });
    unitCards.map((item) =>
      units.push({
        unitId: item.id,
        rowVersion: item.rowVersion,
      }));
    units.map((item, index) => {
      if (unitStatus && unitStatus.success.length > 0) units.splice(index, 1);
    });
    formFieldIds.map((item) => fieldsNames.push(item.formFieldName));
    setState({ id: 'bulkUpdateUnits', value: units });
    setState({ id: 'updatedUnitJson', value: unitDetails });
    setState({ id: 'fieldsName', value: fieldsNames });
  }, [formFieldIds, unitCards, unitDetails, unitInitDetails, unitStatus]);
  const getAllFormFieldsByFormId = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAllFormFieldsByFormId(FormsIdsEnum.units.id);
    if (!(result && result.status && result.status !== 200)) {
      const listWithoutOprtionType = result && result.filter((item) => item.formFieldKey !== 'operation_type');
      setFormFields(listWithoutOprtionType || result || []);
    } else setFormFields([]);
    setIsLoading(false);
  }, []);
  const onUnitCardsChange = (value) => {
    setUnitCards(value);
  };
  useEffect(() => {
    getAllFormFieldsByFormId();
  }, [getAllFormFieldsByFormId]);
  useEffect(() => {
    setFormData(formItemsBuilderv3([], formFieldsData));
  }, [formFieldsData]);
  useEffect(() => {
    if (formData.length > 0) setErrors(FormErrorsHandler(formData, unitDetails));
  }, [unitDetails, formData]);
  return (
    <>
      <div className='px-5 units-bulk-assign-view-wrapper'>
        <Spinner isActive={isLoading} />
        <div className='bulk-section-wrapper'>
          <BulkSelectedUnitsSection
            unitCards={unitCards}
            unitStatus={unitStatus}
            bulkedUnits={bulkedUnits}
            translationPath={translationPath}
            onUnitCardsChange={onUnitCardsChange}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
        <span className='section-seperator mdi mdi-arrow-collapse-right c-gray' />
        <div className='bulk-section-wrapper'>
          <UnitFieldsSection
            formFields={formFields}
            unitDetails={unitDetails}
            formFieldIds={formFieldIds}
            setFormFieldIds={setFormFieldIds}
            translationPath={translationPath}
            setIntUnitDetails={setIntUnitDetails}
            setFormFieldsData={setFormFieldsData}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
        <span className='section-seperator mdi mdi-arrow-collapse-right c-gray' />
        <div className='bulk-section-wrapper'>
          <NewValuesSection
            errors={errors}
            formData={formData}
            setErrors={setErrors}
            isSubmitted={isSubmitted}
            unitDetails={unitDetails}
            setFormData={setFormData}
            formFieldIds={formFieldIds}
            setUnitDetails={setUnitDetails}
            translationPath={translationPath}
            setIntUnitDetails={setIntUnitDetails}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
      </div>
      <BulkAssignActions
        state={state}
        errors={errors}
        setIsLoading={setIsLoading}
        unitStatus={unitStatus}
        setUnitStatus={setUnitStatus}
        setIsSubmitted={setIsSubmitted}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
      />
    </>
  );
};
