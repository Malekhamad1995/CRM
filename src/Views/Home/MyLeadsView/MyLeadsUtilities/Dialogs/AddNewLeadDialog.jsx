import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { CreateLeadWithReferredToId } from '../../../../../Services';
import { showError, showSuccess } from '../../../../../Helper';
import { DialogComponent, Spinner, StepperComponent } from '../../../../../Components';
import { AddNewMyLeadSteps } from './AddNewMyLeadSteps/AddNewMyLeadSteps';

export const AddNewLeadDialog = ({
  state,
  schema,
  isOpen,
  selected,
  setState,
  formType,
  reloadData,
  isQuickAdd,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
  onSelectedChangeHandler,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const history = useHistory();
  const [steps] = useState([
    { key: t(`${translationPath}contact-details`), progressValue: 0 },
    { key: t(`${translationPath}unit-details`), progressValue: 0 },
    { key: t(`${translationPath}lead-details`), progressValue: 0 },
  ]);
  const onStateChangeHandler = (valueId, newValue) => {
    setState({ id: valueId, value: newValue });
  };
  const cancelHandler = () => {
    isOpenChanged();
    setActiveStep(0);
  };
  const saveHandler = async (isContinue) => {
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    const res = await CreateLeadWithReferredToId(state);
    if (!(res && res.status && res.status !== 200)) {
      reloadData();
      cancelHandler();
      if (isContinue) {
        if (state.leadClassId === 1 || state.leadClassId === 2)
          history.push(`/home/leads/edit?formType=1&id=${res.leadId}`);
        else
          history.push(`/home/leads/edit?formType=2&id=${res.leadId}`);
      }
      showSuccess(t(`${translationPath}my-lead-added-successfully`));
    } else showError(t(`${translationPath}my-lead-add-failed`));
    setIsLoading(false);
  };

  const getDisabled = (() => {
    let isDisabled = true;
    if (state.leadClassId && (state.leadClassId === 1 || state.leadClassId === 2)) {
      isDisabled = ((activeStep === 0 &&
        schema &&
        schema.error &&
        schema.error.details &&
        schema.error.details.length > 8) || (activeStep === 1 &&
          schema &&
          schema.error &&
          schema.error.details &&
          schema.error.details.length > 4));
    } else {
      isDisabled =
        ((activeStep === 0 &&
          schema &&
          schema.error &&
          schema.error.details &&
          schema.error.details.length > 7) ||
          (activeStep === 1 &&
            schema &&
            schema.error &&
            schema.error.details &&
            schema.error.details.length > 4));
    }
    return isDisabled;
  });

  return (
    <DialogComponent
      maxWidth='md'
      saveType='button'
      saveText='confirm'
      titleText='add-new-lead'
      SmothMove
      dialogContent={(
        <div className='my-leads-wrapper'>
          <Spinner isActive={isLoading} isAbsolute />
          {steps && (
            <StepperComponent
              steps={steps}
              labelInput='key'
              activeStep={activeStep}
              progressValueInput='progressValue'
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
          )}
          <AddNewMyLeadSteps
            state={state}
            schema={schema}
            selected={selected}
            formType={formType}
            isQuickAdd={isQuickAdd}
            activeStep={activeStep}
            isSubmitted={isSubmitted}
            onStateChangeHandler={onStateChangeHandler}
            onSelectedChangeHandler={onSelectedChangeHandler}
          />
          <div className='add-new-lead-dialog-actions-wrapper w-100 pb-2 pt-4'>
            <div className='action-item-next-back'>
              {activeStep > 0 && (
                <ButtonBase
                  className='btns theme-transparent mx-2'
                  onClick={() => setActiveStep(activeStep - 1)}
                >
                  <span>{t(`${translationPath}back`)}</span>
                </ButtonBase>
              )}
              {activeStep <= 1 && (
                <ButtonBase
                  disabled={
                    getDisabled()
                  }
                  className='btns theme-solid mx-2'
                  onClick={() => setActiveStep(activeStep + 1)}
                >
                  <span>{t(`${translationPath}next`)}</span>
                </ButtonBase>
              )}
              {activeStep === 2 && (
                <>
                  <ButtonBase
                    disabled={schema.error}
                    onClick={() => saveHandler(true)}
                    className='btns  theme-transparent mx-2'
                  >
                    <span>{t(`${translationPath}Save and Continue`)}</span>
                  </ButtonBase>

                  <ButtonBase
                    disabled={schema.error}
                    onClick={() => saveHandler()}
                    className='btns theme-solid mx-2'
                  >
                    <span>{t(`${translationPath}finish`)}</span>
                  </ButtonBase>
                </>
              )}
            </div>
            <div className='action-item'>
              <ButtonBase className='btns theme-transparent mx-2' onClick={cancelHandler}>
                <span>{t(`${translationPath}cancel`)}</span>
              </ButtonBase>
            </div>
          </div>
        </div>
      )}
      isOpen={isOpen}
      translationPath={translationPath}
      parentTranslationPath={parentTranslationPath}
      saveClasses='btns theme-solid bg-primary w-100 mx-2 mb-2'
    />
  );
};
AddNewLeadDialog.propTypes = {
  formType: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  setState: PropTypes.func.isRequired,
  isQuickAdd: PropTypes.bool.isRequired,
  reloadData: PropTypes.func.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  onSelectedChangeHandler: PropTypes.func.isRequired,
};
AddNewLeadDialog.defaultProps = {
  formType: null,
};
