import React from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../../Components';
import { getErrorByName } from '../../../../../../../Helper';
import { TokenTableComponent } from '../TokenTableComponent/TokenTableComponent';

export const SMSTemplateComponent = ({
  state,
  onStateChanged,
  isSubmitted,
  schema,
  parentTranslationPath,
  translationPath,
}) => (
  <div className='sms-template-wrapper childs-wrapper'>
    <div className='w-100 mb-3'>
      <Inputs
        idRef='templateSMSRef'
        labelValue='sms-text'
        value={state.templateText || ''}
        helperText={getErrorByName(schema, 'templateText').message}
        error={getErrorByName(schema, 'templateText').error}
        isWithError
        multiline
        rows={6}
        isSubmitted={isSubmitted}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onInputChanged={(event) => {
          onStateChanged({ id: 'templateText', value: event.target.value });
        }}
      />
    </div>
    <TokenTableComponent
      state={state}
      onStateChanged={onStateChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  </div>
);

SMSTemplateComponent.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  schema: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
