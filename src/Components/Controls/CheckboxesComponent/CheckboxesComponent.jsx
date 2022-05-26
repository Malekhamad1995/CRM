import React, { useCallback } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import { useTranslation } from 'react-i18next';

export const CheckboxesComponent = ({
  data,
  labelValue,
  ariaLabel,
  translationPath,
  parentTranslationPath,
  translationPathForData,
  onSelectedCheckboxChanged,
  onSelectedCheckboxClicked,
  singleChecked,
  singleIndeterminate,
  key,
  isDisabledInput,
  isDisabled,
  labelInput,
  label,
  wrapperClasses,
  checkboxClasses,
  labelClasses,
  themeClass,
  isRequired,
  idRef,
  checked,
  indeterminate,
  isRow,
  tabIndex,
  disableRipple,
  formControlLabelClasses,
  checkboxGroupClasses,
  formControlLabelClassesInput,
  checkboxClassesInput,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const onChangeHandler = useCallback(
    (item, index) => (event, checkedValue) => {
      if (onSelectedCheckboxChanged) onSelectedCheckboxChanged(item, index, checkedValue, event);
    },
    [onSelectedCheckboxChanged]
  );
  return (
    <FormControl
      required={isRequired}
      className={`checkbox-groups-wrapper ${wrapperClasses} ${themeClass || ''}`}
      component='fieldset'
    >
      {labelValue && (
        <label
          htmlFor={idRef}
          className={`label-wrapper ${labelClasses}${isDisabled ? ' disabled' : ''}`}
        >
          {t(`${translationPath}${labelValue}`)}
        </label>
      )}
      {!data && (
        <FormControlLabel
          disabled={isDisabled}
          className={`form-control-label ${formControlLabelClasses}`}
          tabIndex={tabIndex}
          control={(
            <Checkbox
              className={`checkbox-wrapper ${checkboxClasses}`}
              icon={<span className='i-unchecked' />}
              checkedIcon={<span className='mdi mdi-check' />}
              indeterminateIcon={<span className='mdi mdi-minus' />}
              checked={singleChecked}
              disableRipple={disableRipple}
              indeterminate={singleIndeterminate}
              onClick={onSelectedCheckboxClicked}
              onChange={onSelectedCheckboxChanged}
            />
          )}
          label={t(`${translationPath}${label}`)}
          id={idRef}
        />
      )}
      {data && (
        <FormGroup
          aria-label={ariaLabel ? t(`${translationPathForData}${ariaLabel}`) : 'Checkbox Group'}
          row={isRow}
          className={`checkbox-group-wrapper ${checkboxGroupClasses}`}
          id={idRef}
        >
          {data.map((item, index) => (
            <FormControlLabel
              key={`${key}${index + 1}`}
              disabled={isDisabledInput ? item[isDisabledInput] : isDisabled}
              className={`form-control-label ${formControlLabelClasses} ${
                (formControlLabelClassesInput && item[formControlLabelClassesInput]) || ''
              }`}
              onChange={onChangeHandler(item, index)}
              control={(
                <Checkbox
                  className={`checkbox-wrapper ${checkboxClasses} ${
                    (checkboxClassesInput && item[checkboxClassesInput]) || ''
                  }`}
                  icon={<span className='i-unchecked' />}
                  checkedIcon={<span className='mdi mdi-check' />}
                  indeterminateIcon={<span className='mdi mdi-minus' />}
                  checked={checked && checked(item, index)}
                  indeterminate={indeterminate && indeterminate(item, index)}
                  onChange={onChangeHandler(item, index)}
                />
              )}
              label={
                label ||
                (labelInput ?
                  ((translationPathForData || translationPathForData === '') &&
                      t(`${translationPathForData}${item[labelInput]}`)) ||
                    item[labelInput] :
                  item)
              }
            />
          ))}
        </FormGroup>
      )}
    </FormControl>
  );
};

CheckboxesComponent.propTypes = {
  data: PropTypes.instanceOf(Array),
  idRef: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
  labelValue: PropTypes.string,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPathForData: PropTypes.string,
  // value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onSelectedCheckboxChanged: PropTypes.func,
  onSelectedCheckboxClicked: PropTypes.func,
  singleChecked: PropTypes.bool,
  singleIndeterminate: PropTypes.bool,
  checked: PropTypes.func,
  indeterminate: PropTypes.func,
  key: PropTypes.string,
  isDisabledInput: PropTypes.string,
  formControlLabelClassesInput: PropTypes.string,
  checkboxClassesInput: PropTypes.string,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isRow: PropTypes.bool,
  // valueInput: PropTypes.string,
  labelInput: PropTypes.string,
  label: PropTypes.string,
  wrapperClasses: PropTypes.string,
  checkboxClasses: PropTypes.string,
  labelClasses: PropTypes.string,
  formControlLabelClasses: PropTypes.string,
  checkboxGroupClasses: PropTypes.string,
  themeClass: PropTypes.oneOf(['theme-default', 'theme-secondary']),
  tabIndex: PropTypes.number,
  disableRipple: PropTypes.bool,
};
CheckboxesComponent.defaultProps = {
  data: undefined,
  labelValue: '',
  label: '',
  ariaLabel: undefined,
  singleChecked: undefined,
  isRow: false,
  translationPath: '',
  parentTranslationPath: '',
  translationPathForData: undefined,
  // value: null,
  onSelectedCheckboxClicked: undefined,
  onSelectedCheckboxChanged: () => {},
  checked: undefined,
  indeterminate: undefined,
  key: 'checkboxGroups',
  isDisabledInput: undefined,
  formControlLabelClassesInput: undefined,
  checkboxClassesInput: undefined,
  isDisabled: false,
  isRequired: false,
  // valueInput: null,
  labelInput: null,
  wrapperClasses: '',
  checkboxClasses: '',
  labelClasses: '',
  formControlLabelClasses: '',
  checkboxGroupClasses: '',
  themeClass: 'theme-default',
  tabIndex: undefined,
  disableRipple: undefined,
  singleIndeterminate: false,
};
