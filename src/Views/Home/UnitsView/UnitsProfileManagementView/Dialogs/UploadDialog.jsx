import React, { useReducer } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { StepperComponent, UploaderComponent } from '../../../../../Components';

const translationPath = 'dialogs.uploadDialog.';
export const UploadDialog = (props) => {
    const { t } = useTranslation(['FormBuilder', 'Shared']);
    const reducer = (state, action) => ({ ...state, [action.id]: action.value });
    const [state, setState] = useReducer(reducer, props.initialState);
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed] = React.useState({});
    const totalSteps = () => props.initialState.selected.length;

    const completedSteps = () => Object.keys(completed).length;

    const isLastStep = () => activeStep === totalSteps() - 1;

    const allStepsCompleted = () => completedSteps() === totalSteps();

    const handleNext = () => {
        // It's the last step, but not all steps have been completed,
        // find the first step that has been completed
        const newActiveStep =
            isLastStep() && !allStepsCompleted() ?
                props.initialState.selected.findIndex((step, i) => !(i in completed)) :
                activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    return (
      <Dialog className='dialog' open={props.open} fullWidth maxWidth='md'>
        <DialogTitle>{t(`${translationPath}upload-attachments`)}</DialogTitle>
        <DialogContent>
          <div className='w-100 mb-2'>
            <StepperComponent
              steps={props.initialState.selected}
              labelInput='lookupItemName'
              onStepperClick={(index) => {
                            handleStep(index);
                        }}
              activeStep={activeStep}
            />
          </div>
          {props.initialState.selected.map(
                    (label, index) =>
                        props.initialState.selected[activeStep].lookupItemName === label.lookupItemName && (
                        <UploaderComponent
                          key={`importFileRef${index + 1}`}
                          multiple
                          isOpenGallery
                          idRef='importFileRef'
                          viewUploadedFilesCount
                          initUploadedFiles={state[label.lookupItemName] || []}
                          uploadedChanged={(files) => {
                                    setState({ id: label.lookupItemName, value: files });
                                }}
                                openGallery = {props.openGallery}
                        />
                        )
                )}
        </DialogContent>
        <DialogActions>
          {activeStep !== 0 && (
            <Button onClick={() => handleBack()} className='btns theme-solid bg-warning'>
              <span className='mdi mdi-chevron-double-left' />
              {t('Shared:back')}
            </Button>
                )}
          {!isLastStep() && (
            <Button
                        // disabled= }
              onClick={() => handleNext()}
              className='btns theme-solid bg-secondary'
            >
              {t('Shared:next')}
              <span className='mdi mdi-chevron-double-right' />
            </Button>
                )}
          <Button
            className='btns theme-solid bg-cancel'
            onClick={() => {
                        Object.keys(state).map((el) => el !== 'selected' && setState({ id: el, value: [] }));
                        props.closeDialog();
                    }}
          >
            {t('Shared:cancel')}
          </Button>
          {isLastStep() && (
            <Button
              className='btns theme-solid'
              onClick={(event) => {
                            event.preventDefault();
                            props.onChange(state);
                            props.closeDialog();
                        }}
            >
              {t('Shared:save')}
            </Button>
                )}
        </DialogActions>
      </Dialog>
    );
};
