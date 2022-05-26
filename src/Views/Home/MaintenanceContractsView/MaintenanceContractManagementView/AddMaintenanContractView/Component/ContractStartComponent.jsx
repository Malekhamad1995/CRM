import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePickerComponent } from '../../../../../../Components';

export const ContractStartComponent = ({
  parentTranslationPath,
  translationPath,
  startDate,
  setstartDate,
  helperText,
  error,
  isSubmitted
}) => (
  <div>
    <div className='d-flex'>
      <DatePickerComponent
        idRef='curredonDateRef'
        labelValue='startDate'
        placeholder='DD/MM/YYYY'
        value={startDate}
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onDateChanged={(newValue) => {
          setstartDate((newValue && moment(newValue).format()) || null);
        }}
      />
    </div>
  </div>
);
ContractStartComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  setstartDate: PropTypes.string.isRequired,
};
