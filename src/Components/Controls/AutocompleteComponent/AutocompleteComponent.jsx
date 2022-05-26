import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import { Button } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import { Inputs } from '../Inputs/Inputs';

function AutocompleteComponent({
  onChange,
  data,
  displayLabel,
  defaultValue,
  isLoading,
  selectedValues,
  inputValue,
  onInputChange,
  disabledOptions,
  chipsLabel,
  chipsDisabled,
  translationPath,
  parentTranslationPath,
  labelValue,
  inputPlaceholder,
  idRef,
  wrapperClasses,
  autocompleteClasses,
  variant,
  multiple,
  isDisabled,
  searchClicked,
  isRequired,
  inputClasses,
  labelClasses,
  inputWrapperClasses,
  helperText,
  error,
  inputLabel,
  renderOption,
  withLoader,
  withoutSearchButton,
  buttonOptions,
  disableClearable,
  renderTags,
  isWithError,
  isSubmitted,
  paddingReverse,
  inputStartAdornment,
  beforeIconClasses,
  afterIconClasses,
  overInputIcon,
  themeClass,
  autocompleteThemeClass,
  inputThemeClass,
  popperClasses,
  popperThemeClasses,
  withBackdrop,
  dropdownIcon,
  dropdownCloseIcon,
  getOptionSelected,
  onInputKeyUp,
  onTextKeyDown,
  onTextKeyUp,
  tagValues,
  filterOptions,
  groupBy,
  inputEndAdornment,
  autoComplete,
  textValue,
  hideDeleteMark
}) {
  return (
    <div
      className={`autocomplete-wrapper ${wrapperClasses} ${themeClass || autocompleteThemeClass || ''
        }${(multiple && ' is-multiple') || ''}`}
    >
      {!withoutSearchButton && (
        <Button className='btns-icon theme-transparent mx-2' onClick={searchClicked}>
          <span className='mdi mdi-magnify' />
        </Button>
      )}
      <Autocomplete
        multiple={multiple}
        disableClearable={disableClearable}
        autoComplete={autoComplete}
        id={idRef}
        className={`autocomplete ${autocompleteClasses}`}
        options={data}
        classes={{
          popper: `autocomplete-popper-wrapper ${popperClasses} ${themeClass || popperThemeClasses || ''
            }${(withBackdrop && ' with-backdrop') || ''}`,
        }}
        groupBy={groupBy}
        onKeyUp={onInputKeyUp}
        getOptionLabel={displayLabel}
        renderOption={renderOption}
        defaultValue={defaultValue}
        getOptionSelected={getOptionSelected}
        loading={isLoading}
        value={selectedValues}
        inputValue={inputValue}
        onInputChange={onInputChange}
        onChange={onChange}
        getOptionDisabled={disabledOptions}
        disabled={isDisabled}
        filterOptions={filterOptions}
        closeIcon={<span className={`${dropdownCloseIcon} dropdown-close-icon-wrapper`} />}
        popupIcon={<span className={`${dropdownIcon} dropdown-icon-wrapper`} />}
        renderTags={
          renderTags ||
          ((tagValue, getTagProps) =>
            (tagValues || tagValue).map((option, index) => (
              (!(hideDeleteMark) && (
                <Chip
                  className='autocomplete-chip'
                  label={chipsLabel && chipsLabel(option, index)}
                  {...getTagProps({ index })}
                  disabled={chipsDisabled(option, index)}
                  onDelete={hideDeleteMark}
                />
              )) || (
                <Chip
                  className='autocomplete-chip'
                  label={chipsLabel && chipsLabel(option, index)}
                  {...getTagProps({ index })}
                  disabled={chipsDisabled(option, index)}
                />
              )
            )))
        }
        renderInput={(params) => (
          <Inputs
            idRef={idRef}
            autoComplete={autoComplete}
            label={inputLabel}
            labelValue={labelValue}
            labelClasses={labelClasses}
            autoCompleteParams={params}
            value={textValue}
            inputPlaceholder={inputPlaceholder}
            variant={variant}
            isWithError={isWithError}
            isSubmitted={isSubmitted}
            paddingReverse={paddingReverse}
            isRequired={isRequired}
            wrapperClasses={inputWrapperClasses}

            fieldClasses={inputClasses}
            startAdornment={inputStartAdornment}
            endAdornment={inputEndAdornment}
            beforeIconClasses={beforeIconClasses}
            afterIconClasses={afterIconClasses}
            overInputIcon={overInputIcon}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            buttonOptions={buttonOptions}
            themeClass={themeClass || inputThemeClass}
            onKeyDown={onTextKeyDown}
            onKeyUp={onTextKeyUp}
            isLoading={isLoading}
            withLoader={withLoader}
            error={error}
            helperText={helperText}
          />
        )}
      />
    </div>
  );
}
AutocompleteComponent.propTypes = {
  autoComplete: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  displayLabel: PropTypes.func.isRequired,
  tagValues: PropTypes.instanceOf(Array),
  disableClearable: PropTypes.bool,
  chipsLabel: PropTypes.func,
  renderTags: PropTypes.func,
  getOptionSelected: PropTypes.func,
  groupBy: PropTypes.func,
  renderOption: PropTypes.func,
  searchClicked: PropTypes.func,
  onInputKeyUp: PropTypes.func,
  onTextKeyDown: PropTypes.func,
  onTextKeyUp: PropTypes.func,
  textValue: PropTypes.string,
  selectedValues: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
  defaultValue: PropTypes.instanceOf(Array),
  isLoading: PropTypes.bool,
  multiple: PropTypes.bool,
  inputValue: PropTypes.string,
  onInputChange: PropTypes.func,
  filterOptions: PropTypes.func,
  disabledOptions: PropTypes.func,
  chipsDisabled: PropTypes.func,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  labelValue: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  idRef: PropTypes.string,
  wrapperClasses: PropTypes.string,
  autocompleteClasses: PropTypes.string,
  variant: PropTypes.string,
  inputWrapperClasses: PropTypes.string,
  inputClasses: PropTypes.string,
  labelClasses: PropTypes.string,
  helperText: PropTypes.string,
  inputLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  error: PropTypes.bool,
  withLoader: PropTypes.bool,
  withoutSearchButton: PropTypes.bool,
  isWithError: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  paddingReverse: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  inputStartAdornment: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  inputEndAdornment: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  beforeIconClasses: PropTypes.string,
  afterIconClasses: PropTypes.string,
  overInputIcon: PropTypes.string,
  themeClass: PropTypes.string,
  autocompleteThemeClass: PropTypes.string,
  inputThemeClass: PropTypes.string,
  popperClasses: PropTypes.string,
  hideDeleteMark: PropTypes.bool,
  popperThemeClasses: PropTypes.string,
  dropdownIcon: PropTypes.string,
  dropdownCloseIcon: PropTypes.string,
  withBackdrop: PropTypes.bool,
  buttonOptions: PropTypes.shape({
    className: PropTypes.string,
    iconClasses: PropTypes.string,
    onActionClicked: PropTypes.func,
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
  }),
};
AutocompleteComponent.defaultProps = {
  autoComplete: 'new-password',
  defaultValue: undefined,
  selectedValues: undefined,
  tagValues: undefined,
  isLoading: false,
  inputValue: undefined,
  getOptionSelected: undefined,
  onInputChange: undefined,
  groupBy: undefined,
  renderOption: undefined,
  renderTags: undefined,
  searchClicked: undefined,
  disabledOptions: undefined,
  chipsDisabled: () => false,
  parentTranslationPath: '',
  translationPath: '',
  labelValue: null,
  inputPlaceholder: null,
  idRef: 'autocompleteRef',
  wrapperClasses: '',
  autocompleteClasses: '',
  variant: 'standard',
  inputWrapperClasses: undefined,
  dropdownIcon: 'mdi mdi-chevron-down',
  dropdownCloseIcon: 'mdi mdi-close',
  inputClasses: undefined,
  labelClasses: undefined,
  withoutSearchButton: false,
  popperClasses: '',
  popperThemeClasses: undefined,
  onInputKeyUp: undefined,
  withBackdrop: false,
  chipsLabel: undefined,
  helperText: null,
  inputLabel: null,
  multiple: true,
  isDisabled: false,
  isRequired: false,
  error: false,
  withLoader: true,
  buttonOptions: null,
  disableClearable: false,
  isWithError: false,
  isSubmitted: false,
  hideDeleteMark: true,
  paddingReverse: undefined,
  inputStartAdornment: undefined,
  inputEndAdornment: undefined,
  beforeIconClasses: undefined,
  afterIconClasses: undefined,
  overInputIcon: undefined,
  themeClass: undefined,
  autocompleteThemeClass: undefined,
  inputThemeClass: undefined,
  filterOptions: undefined,
};
export { AutocompleteComponent };
