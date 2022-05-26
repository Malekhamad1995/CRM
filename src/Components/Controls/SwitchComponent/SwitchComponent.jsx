import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import { useTranslation } from 'react-i18next';

export const SwitchComponent = ({
  isChecked,
  onChangeHandler,
  parentTranslationPath,
  translationPath,
  wrapperClasses,
  themeClass,
  switchLabelClasses,
  switchClasses,
  labelValue,
  idRef,
  labelClasses,
  isDisabled,
  switchLabelRef,
  label,
  switchControlWrapperRef,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <FormControl
      ref={switchControlWrapperRef}
      className={`switch-control-wrapper ${wrapperClasses} ${themeClass || ''}`}
    >
      {labelValue && (
        <label
          htmlFor={idRef}
          className={`label-wrapper ${labelClasses}${isDisabled ? ' disabled' : ''}`}
        >
          {t(`${translationPath}${labelValue}`)}
        </label>
      )}
      <FormControlLabel
        id={idRef}
        ref={switchLabelRef}
        className={`switch-control-label-wrapper ${switchLabelClasses}`}
        control={(
          <Switch
            className={`switch-control ${switchClasses}`}
            checked={isChecked}
            onChange={onChangeHandler}
          />
        )}
        label={(label && t(`${translationPath}${label}`)) || undefined}
        disabled={isDisabled}
      />
    </FormControl>
  );
};

SwitchComponent.propTypes = {
  isChecked: PropTypes.bool,
  onChangeHandler: PropTypes.func,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  wrapperClasses: PropTypes.string,
  themeClass: PropTypes.oneOf(['theme-default', 'theme-line']),
  switchLabelClasses: PropTypes.string,
  switchClasses: PropTypes.string,
  labelValue: PropTypes.string,
  idRef: PropTypes.string,
  labelClasses: PropTypes.string,
  isDisabled: PropTypes.bool,
  switchLabelRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  switchControlWrapperRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  label: PropTypes.string,
};
SwitchComponent.defaultProps = {
  isChecked: undefined,
  onChangeHandler: undefined,
  parentTranslationPath: '',
  translationPath: '',
  wrapperClasses: '',
  themeClass: 'theme-default',
  switchLabelClasses: '',
  switchClasses: '',
  labelValue: undefined,
  idRef: 'switchRef',
  labelClasses: '',
  isDisabled: false,
  switchLabelRef: undefined,
  switchControlWrapperRef: undefined,
  label: undefined,
};
