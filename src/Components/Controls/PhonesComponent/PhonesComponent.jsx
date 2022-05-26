import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

export const PhonesComponent = ({
  isValid,
  country,
  onInputChanged,
  idRef,
  isRequired,
  isDisabled,
  value,
  wrapperClasses,
  inputClasses,
  labelClasses,
  translationPath,
  parentTranslationPath,
  labelValue,
  buttonOptions,
  errorClasses,
  inputPlaceholder,
  onInputBlur,
  error,
  helperText,
  isSubmitted,
  isLoading,
  afterIconClasses,
  themeClass,
  onKeyDown,
   onKeyUp,

}) => {
  const [isBlurOrChanged, setIsBlurOrChanged] = useState(false);
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className={`phones-wrapper ${wrapperClasses} ${themeClass}`}>
      {labelValue && (
        <label
          htmlFor={idRef}
          className={`label-wrapper ${labelClasses}${isDisabled ? ' disabled' : ''}`}
        >
          {t(`${translationPath}${labelValue}`)}
        </label>
      )}
      <div className='phone-input-wrapper'>
        <PhoneInput
          specialLabel={false}
          isValid={isValid}
          country={country}
          inputProps={{
            required: isRequired,
            id: idRef,
            autoComplete: 'new-password',
            onKeyDown,
            onKeyUp
          }}
          containerClass={`${
            (helperText && error && (isSubmitted || isBlurOrChanged) && ' phone-error') || ''
          }`}
          disabled={isDisabled}
          value={value}
          inputClass={`phone-input ${inputClasses}`}
          onBlur={(event) => {
            setIsBlurOrChanged(true);
            if (onInputBlur) onInputBlur(event);
          }}
          onChange={(newValue, newCountry, event) => {
            setIsBlurOrChanged(true);
            if (newValue && !newValue.startsWith(newCountry.dialCode)) {
              if (onInputChanged) onInputChanged(newCountry.dialCode + newValue, newCountry, event);
              return;
            }
            if (onInputChanged) onInputChanged(newValue, newCountry, event);
          }}

          enableSearch
          searchPlaceholder={t('shared:search')}
          localization={i18next.language}
          placeholder={
            (inputPlaceholder && t(`${translationPath}${inputPlaceholder}`)) || undefined
          }
        />
        {isLoading && <span className='mdi mdi-refresh mdi-spin loader' />}
        {afterIconClasses && <span className={`mx-2 ${afterIconClasses}`} />}
        {buttonOptions && (
          <Button
            className={`ml-2-reversed ${buttonOptions.className}`}
            onClick={buttonOptions.onActionClicked}
            disabled={buttonOptions.isDisabled}
            required={buttonOptions.isRequired}
          >
            <span className={buttonOptions.iconClasses} />
          </Button>
        )}
      </div>
      {helperText && error && (isSubmitted || isBlurOrChanged) && (
        <div className={`error-wrapper ${errorClasses}`}>{helperText}</div>
      )}
    </div>
  );
};

PhonesComponent.propTypes = {
  value: PropTypes.oneOfType([PropTypes.any]),
  onInputChanged: PropTypes.func,
  isValid: PropTypes.func,
  idRef: PropTypes.string.isRequired,
  wrapperClasses: PropTypes.string,
  inputClasses: PropTypes.string,
  labelClasses: PropTypes.string,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  labelValue: PropTypes.string,
  country: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  errorClasses: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  onInputBlur: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  isSubmitted: PropTypes.bool,
  isLoading: PropTypes.bool,
  themeClass: PropTypes.oneOf(['theme-default']),
  afterIconClasses: PropTypes.string,
  buttonOptions: PropTypes.shape({
    className: PropTypes.string,
    iconClasses: PropTypes.string,
    onActionClicked: PropTypes.func,
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
  }),
};
PhonesComponent.defaultProps = {
  value: undefined,
  onInputChanged: undefined,
  isValid: undefined,
  country: 'ae',
  isRequired: false,
  isDisabled: false,
  translationPath: '',
  parentTranslationPath: '',
  labelValue: null,
  buttonOptions: null,
  wrapperClasses: '',
  inputClasses: 'inputs theme-form-builder',
  labelClasses: '',
  errorClasses: '',
  themeClass: 'theme-default',
  inputPlaceholder: undefined,
  onInputBlur: undefined,
  error: false,
  helperText: undefined,
  isSubmitted: false,
  isLoading: false,
  afterIconClasses: '',
};
