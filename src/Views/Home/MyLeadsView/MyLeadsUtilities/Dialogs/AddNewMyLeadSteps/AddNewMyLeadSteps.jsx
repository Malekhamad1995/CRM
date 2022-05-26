import React from 'react';
import PropTypes from 'prop-types';
import {
  MyLeadContactDetailsStep,
  MyLeadUnitDetailsStep,
  MyLeadLeadDetailsStep,
} from './MyLeadsSteps';

export const AddNewMyLeadSteps = ({
  state,
  schema,
  selected,
  formType,
  activeStep,
  isQuickAdd,
  isSubmitted,
  onStateChangeHandler,
  onSelectedChangeHandler,
}) => (
  <div className='pt-3'>
    {activeStep === 0 && (
      <MyLeadContactDetailsStep
        state={state}
        schema={schema}
        selected={selected}
        isQuickAdd={isQuickAdd}
        isSubmitted={isSubmitted}
        onStateChangeHandler={onStateChangeHandler}
        onSelectedChangeHandler={onSelectedChangeHandler}
      />
    )}
    {activeStep === 1 && (
      <MyLeadUnitDetailsStep
        state={state}
        schema={schema}
        selected={selected}
        formType={formType}
        isSubmitted={isSubmitted}
        onStateChangeHandler={onStateChangeHandler}
        onSelectedChangeHandler={onSelectedChangeHandler}
      />
    )}
    {activeStep === 2 && (
      <MyLeadLeadDetailsStep
        state={state}
        schema={schema}
        selected={selected}
        isSubmitted={isSubmitted}
        onStateChangeHandler={onStateChangeHandler}
        onSelectedChangeHandler={onSelectedChangeHandler}
      />
    )}
  </div>
);
AddNewMyLeadSteps.propTypes = {
  formType: PropTypes.number.isRequired,
  isQuickAdd: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  activeStep: PropTypes.number.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  onStateChangeHandler: PropTypes.func.isRequired,
  selected: PropTypes.instanceOf(Object).isRequired,
  onSelectedChangeHandler: PropTypes.func.isRequired,
};
