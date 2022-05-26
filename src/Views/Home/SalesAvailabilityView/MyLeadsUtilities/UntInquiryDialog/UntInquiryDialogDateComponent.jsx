import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { DatePickerComponent } from '../../../../../Components';
import { getErrorByName } from '../../../../../Helper';

export const UntInquiryDialogDateComponent = ({
  state,
  schema,
  setState,
  isSubmitted,
  translationPath,
  parentTranslationPath,
}) => (
  <div className='form-item mb-3 d-flex'>
    <DatePickerComponent
      idRef='activityDateRef'
      labelValue='activity-date'
      placeholder='DD/MM/YYYY'
      value={state.activityDate}
      helperText={getErrorByName(schema, 'activityDate').message}
      error={getErrorByName(schema, 'activityDate').error}
      isSubmitted={isSubmitted}
      wrapperClasses='w-50 px-2'
      minDate={moment().format('YYYY-MM-DDTHH:mm:ss')}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onDateChanged={(newValue) =>
        setState({
          id: 'activityDate',
          value: (newValue && moment(newValue).format('YYYY-MM-DDTHH:mm:ss')) || null,
        })}
    />
    <DatePickerComponent
      idRef='activityTimeRef'
      labelValue='activity-time'
      isTimePicker
      value={state.activityDate}
      helperText={getErrorByName(schema, 'activityDate').message}
      error={getErrorByName(schema, 'activityDate').error}
      isSubmitted={isSubmitted}
      wrapperClasses='w-50 px-2'
      minDate={moment().format('YYYY-MM-DDTHH:mm:ss')}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onDateChanged={(newValue) =>
        setState({
          id: 'activityDate',
          value: (newValue && moment(newValue).format('YYYY-MM-DDTHH:mm:ss')) || null,
        })}
    />
  </div>
);
UntInquiryDialogDateComponent.propTypes = {
  setState: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  translationPath: PropTypes.string.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
