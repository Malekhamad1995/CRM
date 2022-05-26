import React from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../Components';

export const AmountperComponent = ({
  parentTranslationPath,
  translationPath,
  amount,
  setamount,
  helperText ,
  error,
 isSubmitted
}) => (
  <div>
    <Inputs
    withNumberFormat
      idRef='problemsOrRemarksRef'
      labelValue='Amountp'
      type='number'
      value={amount}
      isSubmitted={isSubmitted}
      helperText={helperText}
      error={error}
      isWithError
      endAdornment={<span className='mdi mdi-percent' />}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onInputChanged={(event) => {
        let value = event.target?event.target.value:0;
        if(value>100) value = 100;
        setamount(value);

      }}
    />
  </div>
);

AmountperComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setamount: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
};
