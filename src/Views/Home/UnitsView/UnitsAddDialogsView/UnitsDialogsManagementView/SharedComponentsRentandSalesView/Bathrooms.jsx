import React from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../../../../../../Components';

export const Bathrooms = ({
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
      idRef='BathroomsRef'
      labelValue='Bathrooms'
      value={value}
      isSubmitted={isSubmitted}
      helperText={helperText}
      type='string'
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

Bathrooms.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isSubmitted: PropTypes.string.isRequired,
  setvalue: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
