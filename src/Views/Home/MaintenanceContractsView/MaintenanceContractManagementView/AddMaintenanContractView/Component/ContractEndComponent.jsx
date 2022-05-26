import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePickerComponent } from '../../../../../../Components';

export const ContractEndComponent = ({
  parentTranslationPath,
  translationPath,
  endDate,
  setendDate,
  helperText ,
  error,
  isSubmitted
  
}) => (
  <div>
    <div className='d-flex'>
      <DatePickerComponent
        idRef='curredonDateRef'
        labelValue='endDate'
        placeholder='DD/MM/YYYY'
        value={endDate}
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onDateChanged={(newValue) => {
          setendDate((newValue && moment(newValue).format()) || null);
        }}
      />
    </div>
  </div>
);
ContractEndComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  setendDate: PropTypes.string.isRequired,
};
