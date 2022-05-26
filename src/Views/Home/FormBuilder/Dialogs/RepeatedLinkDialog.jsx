/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useReducer, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { Inputs, DialogComponent, StepperComponent } from '../../../../Components';

export const RepeatedLinkDialog = (props) => {
  const reducer = (state, action) => ({ ...state, [action.id]: action.value });
  const [state, setState] = useReducer(reducer, props.initialState);
  const [linkListItem, setLinkListItem] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const { t } = useTranslation('Shared');
  const [completed] = useState({});
  const regex = new RegExp('^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?');
  const validateUrl = (value) =>
    regex.test(
      value
    );

  const totalSteps = () =>
    (props.initialState && props.initialState.selected && props.initialState.selected.length) || 0;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
  const handleStep = (step) => () => setActiveStep(step);
  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted() ?
        props.initialState.selected.findIndex((step, i) => !(i in completed)) :
        activeStep + 1;
    setActiveStep(newActiveStep);
  };
  useEffect(() => {
    if (props.initialState && props.initialState.selected) {
      setLinkListItem((items) => {
        props.initialState.selected.map((item, index) => {
          if (state && state[item.lookupItemName]) {
            items[item.lookupItemName] =
              state && state[item.lookupItemName].map((el, i) => `${item.lookupItemName}-${i}`);
          } else items[item.lookupItemName] = [`${item.lookupItemName}-${index}`];
        });
        return { ...items };
      });
    }
  }, [props.initialState, state]);
  useEffect(() => {
    if (props.initialState && props.initialState.selected)
      setState({ id: 'selected', value: props.initialState.selected });
  }, [props.initialState]);
  const getLinkItem = (item) => (
    <>
      {props.initialState.selected.map(
        (label, itemIndex) =>
          props.initialState.selected[activeStep].lookupItemName === label.lookupItemName &&
          ((linkListItem && linkListItem[label.lookupItemName]) || []).map((el, i) => (
            <Inputs
              key={`linkKey${(itemIndex + 1) * (i + 1)}`}
              idRef={item.data.id || `linkRef${(itemIndex + 1) * (i + 1)}`}
              isDisabled={item.data.isReadonly}
              labelValue={`${i + 1}- ${props.label} - ${label.lookupItemName}`}
              value={'' || (state && state[label.lookupItemName] && state[label.lookupItemName][i])}
              onInputChanged={(e) => {
                if (!state[label.lookupItemName]) state[label.lookupItemName] = [];
                const { value } = e.target;
                if (validateUrl(value)) {
                  state[label.lookupItemName][i] = value;
                  setState({ id: label.lookupItemName, value: state[label.lookupItemName] });
                }
              }}
              buttonOptions={
                (!item.data.isReadonly && {
                  className: `btns-icon theme-solid ${state &&
                    state[label.lookupItemName] &&
                    i === linkListItem[label.lookupItemName].length - 1 ?
                    'bg-blue-lighter' :
                    'bg-danger'
                    }`,
                  iconClasses:
                    state &&
                      state[label.lookupItemName] &&
                      i === linkListItem[label.lookupItemName].length - 1 ?
                      'mdi mdi-plus' :
                      'mdi mdi-minus',
                  isDisabled: !(
                    state &&
                    state[label.lookupItemName] &&
                    state[label.lookupItemName][i] &&
                    validateUrl(state[label.lookupItemName][i])
                  ),
                  isRequired: false,
                  onActionClicked:
                    state &&
                      state[label.lookupItemName] &&
                      i === linkListItem[label.lookupItemName].length - 1 ?
                      () =>
                        setLinkListItem((items) => {
                          items[label.lookupItemName].push(`${label.lookupItemName}-${i + 1}`);
                          return { ...items };
                        }) :
                      () => {
                        setLinkListItem((items) => {
                          const index = items[label.lookupItemName].findIndex(
                            (f) => f === linkListItem[label.lookupItemName][i]
                          );
                          if (index !== -1) {
                            items[label.lookupItemName].splice(index, 1);
                            state[label.lookupItemName].splice(index, 1);
                            setState({
                              id: label.lookupItemName,
                              value: state[label.lookupItemName],
                            });
                          }
                          return { ...items };
                        });
                      },
                }) ||
                undefined
              }
            />
          ))
      )}
    </>
  );

  return (
    <DialogComponent
      titleText={props.label}
      maxWidth='sm'
      wrapperClasses='external-links-wrapper'
      dialogContent={(
        <div className='d-flex-column-center'>
          <StepperComponent
            activeStep={activeStep}
            labelInput='lookupItemName'
            steps={props.initialState.selected}
            onStepperClick={(index) => handleStep(index)}
          />
          {getLinkItem(props.item)}
          <div className='repeated-actions'>
            {activeStep !== 0 && (
              <ButtonBase className='btns theme-solid bg-cancel' onClick={handleBack}>
                <span className='mdi mdi-chevron-double-left' />
                <span>{t('back')}</span>
              </ButtonBase>
            )}
            {!isLastStep() &&
              activeStep !== props.initialState.selected.length - 1 &&
              props.initialState.selected.length > 1 && (
                <ButtonBase className='btns theme-solid' onClick={handleNext}>
                  <span>{t('next')}</span>
                  <span className='mdi mdi-chevron-double-right' />
                </ButtonBase>
              )}
            {isLastStep() && (
              <ButtonBase
                onClick={() => {
                  const localState = {};
                  Object.entries(state).map((item) => {
                    localState[item[0]] =
                      (item[0] !== 'selected' &&
                        item[1].filter(
                          (element, filterIndex) => item[1].indexOf(element) === filterIndex
                        )) ||
                      item[1];
                  });
                  if (
                    Object.entries(localState).some(
                      (item) => item[0] !== 'selected' && item[1].length > 0
                    )
                  ) {
                    delete localState.undefined;
                    props.onChange(localState);
                    props.closeDialog();
                    setActiveStep(0);
                  }
                }}
                className='btns theme-solid'
              >
                <span>{t('save')}</span>
              </ButtonBase>
            )}
          </div>
        </div>
      )}
      isOpen={props.open}
      onCloseClicked={() => {
        delete state.undefined;
        props.closeDialog();
        setActiveStep(0);
      }}
    />
  );
};
