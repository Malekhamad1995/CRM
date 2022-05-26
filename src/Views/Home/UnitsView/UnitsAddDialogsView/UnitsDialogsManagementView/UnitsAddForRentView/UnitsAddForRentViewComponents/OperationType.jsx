import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../../Components';

export const OperationType = ({
  parentTranslationPath,
  translationPath,
  setViewType,
  helperText,
  error,
  isSubmitted,
}) => {
  const { t } = useTranslation(parentTranslationPath || '');
  const [selected, setSelected] = useState({});

  useEffect(() => {
    setSelected({ value: 2, name: 'For Rent' });
  }, []);
  return (
    <div className='AutocompleteComponentBedrooms'>
      <AutocompleteComponent
        idRef='OperationTypeRef'
        labelValue='OperationType'
        multiple={false}
        data={[
          { value: 1, name: 'For Sale' },
          { value: 2, name: 'For Rent' },
        ]}
        displayLabel={(option) => t(`${option.name || ''}`)}
        selectedValues={selected}
        getOptionSelected={(option) => option.name === selected}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}OperationType`)}
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        isWithError
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setViewType((newValue && +newValue.value) || '');
        }}
      />
    </div>
  );
};
OperationType.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isSubmitted: PropTypes.string.isRequired,
  setViewType: PropTypes.number.isRequired,
};
