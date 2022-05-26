import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const RadiosGroupComponent = ({
  idRef,
  data,
  name,
  ariaLabel,
  translationPath,
  parentTranslationPath,
  translationPathForData,
  value,
  onSelectedRadioChanged,
  key,
  isDisabledInput,
  isDisabled,
  valueInput,
  labelInput,
  wrapperClasses,
  radioClasses,
  labelValue,
  labelClasses,
  themeClass,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <FormControl
      className={`radio-groups-wrapper ${wrapperClasses} ${themeClass}`}
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
      <RadioGroup
        id={idRef}
        aria-label={ariaLabel ? t(`${translationPathForData}${ariaLabel}`) : 'Radio Group'}
        name={name}
        className='radio-group-wrapper'
        value={value}
        onChange={onSelectedRadioChanged}
      >
        {data.map((item, index) => (
          <FormControlLabel
            key={`${key}${index + 1}`}
            disabled={isDisabledInput ? item[isDisabledInput] : isDisabled}
            value={valueInput ? item[valueInput] : item}
            control={(
              <Radio
                className={`radio-wrapper ${radioClasses}`}
                checkedIcon={<span className='mdi mdi-radiobox-marked radio-icon' />}
                icon={<span className='mdi mdi-radiobox-blank radio-icon' />}

              />
            )}
            label={
              (item.component && item.component(item, index)) ||
              (translationPathForData || translationPathForData === '' ?
                (labelInput && t(`${translationPathForData}${item[labelInput]}`)) || item :
                item[labelInput])
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

RadiosGroupComponent.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  name: PropTypes.string,
  idRef: PropTypes.string,
  ariaLabel: PropTypes.string,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPathForData: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onSelectedRadioChanged: PropTypes.func,
  key: PropTypes.string,
  isDisabledInput: PropTypes.string,
  isDisabled: PropTypes.bool,
  valueInput: PropTypes.string,
  labelInput: PropTypes.string,
  wrapperClasses: PropTypes.string,
  radioClasses: PropTypes.string,
  labelValue: PropTypes.string,
  labelClasses: PropTypes.string,
  themeClass: PropTypes.oneOf(['theme-default', 'theme-line']),
};
RadiosGroupComponent.defaultProps = {
  idRef: 'radioGroupRef',
  name: undefined,
  labelValue: undefined,
  ariaLabel: null,
  translationPath: '',
  parentTranslationPath: '',
  translationPathForData: null,
  value: null,
  onSelectedRadioChanged: () => {},
  key: 'radioGroups',
  isDisabledInput: null,
  isDisabled: false,
  valueInput: null,
  labelInput: null,
  wrapperClasses: '',
  radioClasses: '',
  labelClasses: '',
  themeClass: 'theme-default',
};
export { RadiosGroupComponent };
