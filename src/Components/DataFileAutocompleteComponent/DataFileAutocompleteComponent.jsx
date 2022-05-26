import React from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../Controls';

export const DataFileAutocompleteComponent = ({
  idRef,
  labelValue,
  selectedValues,
  data,
  getOptionSelected,
  helperText,
  error,
  isSubmitted,
  isWithError,
  isLoading,
  onInputKeyUp,
  parentTranslationPath,
  translationPath,
  onChange,
  renderFor,
  inputStartAdornment,
  renderOption,
  displayLabel,
  isDisabled,
  labelClasses,
  buttonOptions
}) => (
  <AutocompleteComponent
    labelClasses={labelClasses}
    idRef={idRef}
    isDisabled={isDisabled}
    labelValue={labelValue}
    selectedValues={selectedValues}
    multiple={false}
    data={data}
    filterOptions={(option) => option}
    displayLabel={displayLabel}
    renderOption={
      (renderFor === 'contact' &&
        ((option) =>
          (option.contact && (
            <div className='d-flex-column'>
              <div className='d-flex-v-center-h-between w-100 texts-truncate'>
                {(option.contact.first_name || option.contact.last_name) && (
                  <span>
                    {`${option.contact.first_name || ''} ${option.contact.last_name || ''}`}
                  </span>
                )}
                {option.contact.company_name && <span>{option.contact.company_name}</span>}
              </div>
              <span className='c-gray-secondary'>
                {(option.contact.contact_type_id === 1 &&
                  ((option.contact.mobile && option.contact.mobile.phone) || '')) ||
                  (option.contact.landline_number && option.contact.landline_number.phone) ||
                  ''}
              </span>
            </div>
          )) ||
          '')) ||
      (renderFor === 'unit' &&
        ((option) => (
          <div className='d-flex-column'>
            <span>{`${option.unitModel} - ${option.unitName} - ${option.unitType}`}</span>
            <span className='c-gray-secondary'>
              {`${option.unitBedrooms} - ${option.unitRefNo}`}
            </span>
          </div>
        ))) ||
      (renderFor === 'lead' &&
        ((option) =>
          (option.lead && (
            <div className='d-flex-column'>
              <span>
                {`${option.leadId || ''} - ${option.lead.leadClass} - ${
                  option.lead.company_name ||
                  (option.lead.contact_name && option.lead.contact_name.name) ||
                  ''
                }`}
              </span>
            </div>
          )) ||
          '')) ||
      (renderFor === 'property' &&
        ((option) =>
          (option.property && (
            <span>
              {`${option.property.property_name || ''} - ${
                (option.property.city && option.property.city.lookupItemName) || ''
              }`}
            </span>
          )) ||
          '')) ||
      renderOption
    }
    getOptionSelected={getOptionSelected}
    inputStartAdornment={inputStartAdornment}
    withoutSearchButton
    helperText={helperText}
    error={error}
    isWithError={isWithError}
    isSubmitted={isSubmitted}
    isLoading={isLoading}
    onInputKeyUp={onInputKeyUp}
    parentTranslationPath={parentTranslationPath}
    translationPath={translationPath}
    onChange={onChange}
    buttonOptions={buttonOptions}
  />
);

DataFileAutocompleteComponent.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  renderFor: PropTypes.oneOf(['contact', 'lead', 'property', 'unit']),
  idRef: PropTypes.string,
  isDisabled: PropTypes.bool,
  labelValue: PropTypes.string,
  selectedValues: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
  inputStartAdornment: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  getOptionSelected: PropTypes.func,
  renderOption: PropTypes.func,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  isWithError: PropTypes.bool,
  isLoading: PropTypes.bool,
  onInputKeyUp: PropTypes.func,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  displayLabel: PropTypes.func,
  onChange: PropTypes.func,
  buttonOptions: PropTypes.shape({
    className: PropTypes.string,
    iconClasses: PropTypes.string,
    onActionClicked: PropTypes.func,
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
  }),
};
DataFileAutocompleteComponent.defaultProps = {
  idRef: 'dataFileAutocompleteRef',
  renderFor: 'contact',
  labelValue: undefined,
  selectedValues: undefined,
  getOptionSelected: undefined,
  helperText: undefined,
  isDisabled: false,
  error: false,
  isSubmitted: false,
  isLoading: false,
  onInputKeyUp: undefined,
  renderOption: undefined,
  displayLabel: undefined,
  isWithError: undefined,
  parentTranslationPath: '',
  translationPath: '',
  onChange: undefined,
  inputStartAdornment: undefined,
  buttonOptions: null
};
