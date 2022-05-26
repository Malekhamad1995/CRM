import React from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../Components';

export const AmountAEDComponent = ({
 parentTranslationPath,
  translationPath,
   amount,
  setamount , 
  helperText ,
  error , 
  isSubmitted 
}) => (
  <div>
    <Inputs
    withNumberFormat
      idRef='problemsOrRemarksRef'
      labelValue='AmountAED'
      type='number'
      isWithError
      endAdornment={<span className='px-2'>AED</span>}
      value={amount}
      isSubmitted={isSubmitted}
      helperText={helperText}
      error={error}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onInputChanged={(event) => {
        setamount(event.target.value);
      }}
    />
  </div>
);
AmountAEDComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setamount: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
};
