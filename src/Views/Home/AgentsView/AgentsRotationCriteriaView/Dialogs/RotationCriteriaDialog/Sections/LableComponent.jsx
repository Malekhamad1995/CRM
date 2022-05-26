import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Inputs } from '../../../../../../../Components';
import { getErrorByName } from '../../../../../../../Helper';

export const LabelComponent = ({
  parentTranslationPath,
  translationPath,
  onStateChanged,
  isSubmitted,
  schema,
  state,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <>
      <div className='dialog-content-item'>
        <Inputs
          labelClasses='Requierd-Color'
          idRef='labelRef'
          labelValue={t(`${translationPath}RotationLabel`)}
          value={state.label || ''}
          isSubmitted={isSubmitted}
          isWithError
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          helperText={getErrorByName(schema, 'label').message}
          error={getErrorByName(schema, 'label').error}
          onInputChanged={(event) => {
            onStateChanged({ id: 'label', value: event.target.value });
          }}
        />
      </div>
    </>
  );
};

LabelComponent.propTypes = {
  schema: PropTypes.instanceOf(Object).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
};
