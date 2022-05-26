import React from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../../Components';

export const Unit = ({
  parentTranslationPath,
  translationPath,
  value,
  setvalue,
  helperText,
  error,
  isSubmitted,
}) => (
  <div>
    <Inputs
      idRef='UnitRef'
      labelValue='Unit'
      value={value}
      isSubmitted={isSubmitted}
      helperText={helperText}
      error={error}
      isWithError
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      onInputChanged={(event) => {
        setvalue(event.target.value);
      }}
    />
  </div>
);

Unit.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isSubmitted: PropTypes.string.isRequired,
  setvalue: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
