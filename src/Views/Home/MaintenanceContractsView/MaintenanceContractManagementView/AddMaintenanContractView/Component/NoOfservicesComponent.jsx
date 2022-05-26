import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { NumberOfServices } from '../../../../../../Enums/NumberOfServices.Enum';

export const NoOfservicesComponent = ({
  parentTranslationPath,
  translationPath,
  setnumberOfServices,
  state,
  helperText ,
  error , 
  isSubmitted
}) => {
  const [selected, setSelected] = useState({});
  const { t } = useTranslation(parentTranslationPath);
  useEffect(() => {
    setSelected(
      Object.values(NumberOfServices).findIndex((element) => element.value === state) !== -1 &&
        Object.values(NumberOfServices).find((element) => element.value === state).name
    );
  }, [state]);

  return (
    <div>
      <AutocompleteComponent
        idRef='MaintenanceCompanyRef'
        labelValue='NoOfservices'
        selectedValues={{ name: selected, value: state }}
        multiple={false}
        data={Object.values(NumberOfServices)}
        displayLabel={(option) => t(`${option.name || ''}`)}
        getOptionSelected={(option) => option.name === selected}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}numberOfServicesselect`)}
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        isWithError
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setnumberOfServices((newValue && +newValue.value) || '');
        }}
      />
    </div>
  );
};
NoOfservicesComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setnumberOfServices: PropTypes.number.isRequired,
  state: PropTypes.number.isRequired,
};
