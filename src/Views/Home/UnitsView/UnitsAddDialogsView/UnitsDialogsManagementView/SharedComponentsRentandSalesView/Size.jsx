import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Inputs } from '../../../../../../Components';

export const Size = ({
  parentTranslationPath,
  translationPath,
  value,
  setvalue,
  helperText,
  error,
  isSubmitted,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div>
      <Inputs
        idRef='SizeRef'
        labelValue='Size'
        value={value}
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        isWithError
        type='number'
        endAdornment={<span>{t(`${translationPath}Sqft`)}</span>}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onInputChanged={(event) => {
          setvalue(+event.target.value);
        }}
      />
    </div>
  );
};

Size.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isSubmitted: PropTypes.string.isRequired,
  setvalue: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
