import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePickerComponent } from '../../../../../../Components';

export const ContractdateComponent = ({
  parentTranslationPath,
  translationPath,
  contractDate,
  setcontractDate,
  helperText ,
  error , 
  isSubmitted
}) => (
  <div>
    <div className='d-flex'>
      <DatePickerComponent
        idRef='curredonDateRef'
        labelValue='Contractdate'
        placeholder='DD/MM/YYYY'
        value={contractDate}
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onDateChanged={(newValue) => {
          setcontractDate((newValue && moment(newValue).format()) || null);
        }}
      />
    </div>
  </div>
);
ContractdateComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setcontractDate: PropTypes.string.isRequired,
  contractDate: PropTypes.string.isRequired,
};
