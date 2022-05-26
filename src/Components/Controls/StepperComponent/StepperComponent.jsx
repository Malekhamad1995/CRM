import React from 'react';
import PropTypes from 'prop-types';
import {
 Stepper, StepLabel, Step, StepButton
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ProgressCircularComponent } from '../ProgressCircularComponent/ProgressCircularComponent';
import { getBgProgressColor } from '../../../Helper';

export const StepperComponent = ({
  activeStep,
  steps,
  onStepperClick,
  wrapperClasses,
  stepClasses,
  stepLabelClasses,
  stepButtonClasses,
  progressTextClasses,
  progressValueInput,
  labelInput,
  completed,
  completedAll,
  hasError,
  isValidateOnlyActiveIndex,
  isSubmitted,
  isDisabledAll,
  isDisabled,
  parentTranslationPath,
  translationPath,
  dynamicComponentProps,
  componentInput,
  withDynamicComponents,
}) => {
  const { t } = useTranslation([parentTranslationPath]);
  return (
    <>
      <Stepper
        alternativeLabel
        nonLinear
        activeStep={activeStep}
        onClick={onStepperClick}
        className={`stepper-wrapper ${wrapperClasses}`}
      >
        {steps &&
          steps.map((item, index) => (
            <Step
              className={`step-wrapper ${stepClasses}${
                (hasError &&
                  !completedAll &&
                  (!completed || !completed(index, item)) &&
                  isSubmitted &&
                  (!isValidateOnlyActiveIndex || activeStep === index) &&
                  ' has-error-step') ||
                ''
              }`}
              key={`${item[labelInput]}${index + 1}`}
            >
              {progressValueInput && (
                <ProgressCircularComponent
                  value={item[progressValueInput]}
                  position='absolute'
                  themeClasses='theme-gradient'
                  left='50%'
                  bottom={-1}
                />
              )}
              {!onStepperClick && (
                <StepLabel className={stepLabelClasses}>
                  {item[labelInput]}
                  {progressValueInput && (
                    <span
                      className={`${progressTextClasses} ${
                        getBgProgressColor(item[progressValueInput]).textColor
                      }`}
                    >
                      {`${item[progressValueInput]}%`}
                    </span>
                  )}
                </StepLabel>
              )}
              {onStepperClick && (
                <StepButton
                  className={`step-button-wrapper ${stepButtonClasses}`}
                  completed={completedAll || (completed && completed(index, item)) || undefined}
                  onClick={onStepperClick(index)}
                  disabled={isDisabledAll || (isDisabled && isDisabled(index, item))}
                >
                  {(labelInput || !Array.isArray(item) || !typeof item === 'object') && (
                    <span>
                      {(labelInput &&
                        ((translationPath !== undefined &&
                          t(`${translationPath}${item[labelInput]}`)) ||
                          item[labelInput])) ||
                        (translationPath !== undefined && t(`${translationPath}${item}`)) ||
                        item}
                    </span>
                  )}
                </StepButton>
              )}
            </Step>
          ))}
      </Stepper>
      {(dynamicComponentProps || withDynamicComponents) &&
        steps &&
        steps.map((item, index) => {
          const Component = item[componentInput];
          return (
            activeStep === index &&
            ((Component && item.props && (
              <Component
                key={`dynamicComponentRef${index + 1}`}
                {...dynamicComponentProps}
                {...item.props}
              />
            )) ||
              (Component && (
                <Component key={`dynamicComponentRef${index + 1}`} {...dynamicComponentProps} />
              )) ||
              null)
          );
        })}
    </>
  );
};

StepperComponent.propTypes = {
  activeStep: PropTypes.number.isRequired,
  labelInput: PropTypes.string.isRequired,
  steps: PropTypes.instanceOf(Array).isRequired,
  dynamicComponentProps: PropTypes.instanceOf(Object),
  completedAll: PropTypes.bool,
  isValidateOnlyActiveIndex: PropTypes.bool,
  isDisabledAll: PropTypes.bool,
  isDisabled: PropTypes.func,
  hasError: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  completed: PropTypes.func,
  onStepperClick: PropTypes.func,
  wrapperClasses: PropTypes.string,
  stepClasses: PropTypes.string,
  stepLabelClasses: PropTypes.string,
  stepButtonClasses: PropTypes.string,
  progressTextClasses: PropTypes.string,
  progressValueInput: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  componentInput: PropTypes.string,
  withDynamicComponents: PropTypes.bool,
};
StepperComponent.defaultProps = {
  onStepperClick: undefined,
  progressValueInput: undefined,
  dynamicComponentProps: undefined,
  completedAll: undefined,
  completed: undefined,
  isDisabled: undefined,
  isDisabledAll: false,
  isSubmitted: false,
  hasError: false,
  isValidateOnlyActiveIndex: false,
  wrapperClasses: '',
  stepClasses: '',
  stepLabelClasses: 'step-label-wrapper',
  stepButtonClasses: '',
  progressTextClasses: 'step-progress-text-wrapper',
  parentTranslationPath: '',
  translationPath: undefined,
  componentInput: 'component',
  withDynamicComponents: undefined,
};
