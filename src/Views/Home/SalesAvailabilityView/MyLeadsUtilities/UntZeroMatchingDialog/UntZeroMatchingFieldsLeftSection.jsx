import React from 'react';
import PropTypes from 'prop-types';
import {
  Inputs,
  SelectComponet,
  AutocompleteComponent,
  DataFileAutocompleteComponent,
} from '../../../../../Components';
import { UnitForEnum, UnitLocationEnum } from '../../../../../Enums';
// import { getErrorByName } from '../../../../../Helper';

const parentTranslationPath = 'SalesAvailabilityView';
const translationPath = '';
export const UntZeroMatchingFieldsLeftSection = ({
  data,
  state,
  // schema,
  loadings,
  selected,
  setState,
  searchTimer,
  setSelected,
  getAllLeads,
  // isSubmitted,
  getAllProperty,
}) => (
  <div className='form-wrapper px-5 w-50'>
    <div className='form-item mb-3'>
      <DataFileAutocompleteComponent
        idRef='contactPersonRef'
        labelValue='lead'
        multiple={false}
        selectedValues={selected.relatedLeadNumberId}
        data={(data.relatedLeadNumberId && data.relatedLeadNumberId) || []}
        displayLabel={(option) =>
          `${option.leadId || ''} - ${option.lead.leadClass} - ${
            option.lead.company_name ||
            (option.lead.contact_name && option.lead.contact_name.name) ||
            ''
          }`}
        withoutSearchButton
        renderFor='lead'
        isLoading={loadings.relatedLeadNumberId}
        // isWithError
        // isSubmitted={isSubmitted}
        // error={getErrorByName(schema, 'relatedLeadNumberId').error}
        // helperText={getErrorByName(schema, 'relatedLeadNumberId').message}
        onInputKeyUp={(e) => {
          const { value } = e.target;
          if (searchTimer.current) clearTimeout(searchTimer.current);
          searchTimer.current = setTimeout(() => {
            getAllLeads(value);
          }, 700);
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setSelected({
            id: 'relatedLeadNumberId',
            value: (newValue && newValue) || null,
          });
          setState({
            id: 'relatedLeadNumberId',
            value: (newValue && newValue.leadId) || null,
          });
        }}
      />
    </div>
    <div className='form-item mb-3'>
      <SelectComponet
        data={UnitForEnum}
        textInput='value'
        labelValue='unit-for'
        idRef='relatedToTypeRef'
        onSelectChanged={(newValue) =>
          setSelected({
            id: 'unitFor',
            value: newValue,
          })}
        value={state.communicationType}
        translationPath={translationPath}
        wrapperClasses='over-input-select w-100'
        translationPathForData={translationPath}
        parentTranslationPath={parentTranslationPath}
      />
    </div>
    <div className='form-item mb-3'>
      <AutocompleteComponent
        idRef='activityTypeIdRef'
        labelValue='community'
        selectedValues={selected.community}
        multiple={false}
        data={data.community}
        displayLabel={(option) => option.lookupItemName || ''}
        groupBy={(option) => option.categoryName || ''}
        getOptionSelected={(option) => option.lookupItemId === selected.community.lookupItemId}
        withoutSearchButton
        isLoading={loadings.community}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => setSelected({ id: 'community', value: newValue })}
      />
    </div>
    <div className='form-item mb-3'>
      <DataFileAutocompleteComponent
        idRef='contactPersonRef'
        labelValue='property'
        isDisabled={!selected.community}
        multiple={false}
        displayLabel={(option) =>
          `${`${option.property.property_name || ''} - ${
            (option.property.city && option.property.city.lookupItemName) || ''
          }`}`}
        selectedValues={selected.property}
        data={(data.property && data.property) || []}
        withoutSearchButton
        renderFor='property'
        isLoading={loadings.property}
        onInputKeyUp={(e) => {
          const { value } = e.target;
          if (searchTimer.current) clearTimeout(searchTimer.current);
          searchTimer.current = setTimeout(() => {
            getAllProperty({ search: value });
          }, 700);
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) =>
          setSelected({
            id: 'property',
            value: newValue,
          })}
      />
    </div>
    <div className='form-item mb-3'>
      <AutocompleteComponent
        idRef='activityTypeIdRef'
        labelValue='unit-type'
        selectedValues={selected.unitType}
        multiple={false}
        data={data.unitType}
        displayLabel={(option) => option.lookupItemName || ''}
        groupBy={(option) => option.categoryName || ''}
        getOptionSelected={(option) => option.lookupItemId === selected.unitType.lookupItemId}
        withoutSearchButton
        isLoading={loadings.unitType}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => setSelected({ id: 'unitType', value: newValue })}
      />
    </div>
    <div className='form-item mb-3'>
      <Inputs
        idRef='firstNameRef'
        labelValue='unit-model'
        value={selected.unitModel || ''}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        onInputChanged={(event) => setSelected({ id: 'unitModel', value: event.target.value })}
      />
    </div>
    <div className='form-item mb-3'>
      <SelectComponet
        data={UnitLocationEnum}
        textInput='value'
        labelValue='unit-location'
        idRef='relatedToTypeRef'
        valueInput='value'
        onSelectChanged={(newValue) =>
          setSelected({
            id: 'unitLocation',
            value: newValue || null,
          })}
        value={selected.unitLocation}
        translationPath={translationPath}
        wrapperClasses='over-input-select w-100'
        translationPathForData={translationPath}
        parentTranslationPath={parentTranslationPath}
      />
    </div>
  </div>
);
UntZeroMatchingFieldsLeftSection.propTypes = {
  setState: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired,
  // isSubmitted: PropTypes.bool.isRequired,
  getAllLeads: PropTypes.func.isRequired,
  getAllProperty: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  // schema: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  loadings: PropTypes.instanceOf(Object).isRequired,
  searchTimer: PropTypes.instanceOf(Object).isRequired,
};
