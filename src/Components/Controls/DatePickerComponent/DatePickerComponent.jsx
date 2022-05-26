import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { useLocalStorage } from '../../../Hooks';

export const DatePickerComponent = ({
  value,
  inputVariant,
  label,
  idRef,
  isRequired,
  isDisabled,
  format = 'DD/MM/YYYY',
  helperText,
  maxDate,
  minDate,
  wrapperClasses = '',
  dialogClasses = '',
  inputClasses = '',
  onDateChanged,
  locale,
  labelClasses = '',
  translationPath = '',
  parentTranslationPath = '',
  labelValue,
  placeholder,
  autoOk,
  clearable,
  error,
  startAdornment,
  startAdornmentIcon = 'mdi mdi-chevron-down',
  endAdornment,
  endAdornmentIcon,
  isSubmitted,
  isTimePicker,
  buttonOptions,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [language] = useLocalStorage('localization', {
    currentLanguage: 'en',
    isRtl: false,
  });
  const [isBlurOrChanged, setIsBlurOrChanged] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onDateChangedHandler = (newValue) => {
    setIsBlurOrChanged(true);
    if (onDateChanged) onDateChanged(newValue);
  };

  return (
    // <MuiPickersUtilsProvider
    //   libInstance={moment}
    //   className={wrapperClasses}
    //   utils={MomentUtils}
    //   locale={locale}
    // >
    //   {labelValue && (
    //     <label htmlFor={idRef} className={labelClasses}>
    //       {t(`${translationPath}${labelValue}`)}
    //     </label>
    //   )}
    //   <div className="d-flex">
    //     <KeyboardDatePicker
    //       required={isRequired}
    //       id={idRef}
    //       label={(label && t(`${translationPath}${label}`)) || undefined}
    //       format={format}
    //       value={value}
    //       className={inputClasses}
    //       disabled={isDisabled}
    //       autoOk={autoOk}
    //       //   InputLabelProps={{  }}
    //       invalidDateMessage={
    //         (helperText && t(`${translationPath}${helperText}`)) || undefined
    //       }
    //       open={isOpen}
    //       maxDate={maxData}
    //       minDate={minDate}
    //       clearable={clearable}
    //       inputVariant={inputVariant}
    //       onOpen={() => setIsOpen(true)}
    //       onClose={() => setIsOpen(false)}
    //       DialogProps={{
    //         className: dialogClasses,
    //       }}
    //       onChange={onDateChanged}
    //     />
    //     {buttonOptions && (
    //       <Button
    //         className={`ml-2-reversed ${buttonOptions.className}`}
    //         onClick={() => {
    //           setIsOpen(true);
    //         }}
    //         disabled={buttonOptions.isDisabled}
    //         required={buttonOptions.isRequired}
    //       >
    //         <span className={buttonOptions.iconClasses} />
    //       </Button>
    //     )}
    //   </div>
    // </MuiPickersUtilsProvider>
    <MuiPickersUtilsProvider
      libInstance={moment}
      utils={MomentUtils}
      locale={locale || language.currentLanguage}
    >
      <div className={`date-picker-wrapper ${wrapperClasses}${(isOpen && ' is-open') || ''}`}>
        {labelValue && (
          <label
            htmlFor={idRef}
            className={`label-wrapper ${labelClasses}${isDisabled ? ' disabled' : ''}`}
          >
            {t(`${translationPath}${labelValue}`)}
          </label>
        )}
        <div className='d-flex w-100'>
          {!isTimePicker && (
            <KeyboardDatePicker
              required={isRequired}
              id={idRef}
              label={(label && t(`${translationPath}${label}`)) || undefined}
              placeholder={(placeholder && t(`${translationPath}${placeholder}`)) || undefined}
              format={format}
              value={value}
              className={`date-picker-input-wrapper ${inputClasses}`}
              disabled={isDisabled}
              autoOk={autoOk}
              //   InputLabelProps={{  }}
              InputProps={{
                startAdornment: startAdornment || (
                  <span className={`${startAdornmentIcon} start-adorment-icon`} />
                ),
                endAdornment: endAdornment || (
                  <span className={`${endAdornmentIcon} end-adorment-icon`} />
                ),
              }}
              helperText={
                (helperText &&
                  (isSubmitted || isBlurOrChanged) &&
                  t(`${translationPath}${helperText}`)) ||
                undefined
              }
              // invalidDateMessage={

              // }
              open={isOpen}
              maxDate={maxDate}
              minDate={minDate}
              clearable={clearable}
              inputVariant={inputVariant}
              onOpen={() => setIsOpen(true)}
              onClose={() => {
                setIsBlurOrChanged(true);
                setIsOpen(false);
              }}
              error={error}
              DialogProps={{
                className: `date-picker-dialog-wrapper ${dialogClasses}`,
              }}
              onBlur={() => setIsBlurOrChanged(true)}
              onChange={onDateChangedHandler}
            />
          )}
          {isTimePicker && (
            <KeyboardTimePicker
              required={isRequired}
              id={idRef}
              label={(label && t(`${translationPath}${label}`)) || undefined}
              value={value}
              error={error}
              placeholder={
                (placeholder && parentTranslationPath && t(`${translationPath}${placeholder}`)) ||
                placeholder ||
                undefined
              }
              className={`date-picker-input-wrapper ${inputClasses}`}
              disabled={isDisabled}
              autoOk={autoOk}
              helperText={
                (helperText &&
                  (isSubmitted || isBlurOrChanged) &&
                  t(`${translationPath}${helperText}`)) ||
                undefined
              }
              keyboardIcon={<span className='mdi mdi-clock-time-four-outline' />}
              InputProps={{
                startAdornment: startAdornment || (
                  <span className={`${startAdornmentIcon} start-adorment-icon`} />
                ),
                endAdornment: endAdornment || (
                  <span className={`${endAdornmentIcon} end-adorment-icon`} />
                ),
              }}
              open={isOpen}
              maxDate={maxDate}
              minDate={minDate}
              clearable={clearable}
              inputVariant={inputVariant}
              onOpen={() => setIsOpen(true)}
              onClose={() => {
                setIsBlurOrChanged(true);
                setIsOpen(false);
              }}
              onClick={() => setIsOpen(true)}
              onKeyPress={(event) => (event.key === 'Enter' && setIsOpen(true)) || undefined}
              DialogProps={{
                className: dialogClasses,
              }}
              onBlur={() => setIsBlurOrChanged(true)}
              onChange={onDateChangedHandler}
            />
          )}
          {buttonOptions && (
            <ButtonBase
              className={`ml-2-reversed mt-1 ${buttonOptions.className}`}
              onClick={buttonOptions.onActionClicked}
              disabled={buttonOptions.isDisabled}
            >
              <span className={buttonOptions.iconClasses} />
            </ButtonBase>
          )}
        </div>
      </div>
    </MuiPickersUtilsProvider>
  );
};

DatePickerComponent.propTypes = {
  value: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.string]),
  onDateChanged: PropTypes.func.isRequired,
  maxDate: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.string]),
  minDate: PropTypes.oneOfType([PropTypes.instanceOf(moment), PropTypes.string]),
  inputVariant: PropTypes.oneOf(['standard', 'filled', 'outlined']),
  label: PropTypes.string,
  idRef: PropTypes.string,
  format: PropTypes.string,
  helperText: PropTypes.string,
  wrapperClasses: PropTypes.string,
  inputClasses: PropTypes.string,
  labelClasses: PropTypes.string,
  dialogClasses: PropTypes.string,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  labelValue: PropTypes.string,
  placeholder: PropTypes.string,
  locale: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  autoOk: PropTypes.bool,
  clearable: PropTypes.bool,
  error: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  isTimePicker: PropTypes.bool,
  startAdornment: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  startAdornmentIcon: PropTypes.string,
  endAdornment: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  endAdornmentIcon: PropTypes.string,
  buttonOptions: PropTypes.shape({
    className: PropTypes.string,
    iconClasses: PropTypes.string,
    onActionClicked: PropTypes.func,
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
  }),
};
DatePickerComponent.defaultProps = {
  value: undefined,
  inputVariant: undefined,
  label: undefined,
  idRef: 'datePickerRef',
  isRequired: undefined,
  isDisabled: undefined,
  format: 'DD/MM/YYYY',
  helperText: undefined,
  maxDate: undefined,
  minDate: undefined,
  wrapperClasses: '',
  dialogClasses: '',
  inputClasses: '',
  locale: undefined,
  labelClasses: '',
  translationPath: '',
  parentTranslationPath: '',
  labelValue: undefined,
  placeholder: undefined,
  autoOk: undefined,
  clearable: undefined,
  error: undefined,
  isSubmitted: undefined,
  startAdornment: undefined,
  startAdornmentIcon: 'mdi mdi-callendar',
  endAdornment: undefined,
  endAdornmentIcon: undefined,
  isTimePicker: false,
  buttonOptions: undefined,
  // buttonOptions: {
  //   className: 'btns-icon theme-solid bg-blue-lighter',
  //   iconClasses: 'icons i-calendar',
  //   isDisabled: false,
  //   isRequired: false,
  // },
};
