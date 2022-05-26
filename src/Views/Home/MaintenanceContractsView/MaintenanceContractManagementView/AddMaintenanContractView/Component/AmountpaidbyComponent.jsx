import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { AmountPaidBy } from '../../../../../../Enums/AmountPaidBy.Enum';

export const AmountpaidbyComponent = ({
  parentTranslationPath,
  translationPath,
  amountPaidBy,
  setamountPaidBy,
  helperText ,
  error , 
  isSubmitted
  

}) => {
  const [selected, setSelected] = useState({});
  const { t } = useTranslation(parentTranslationPath);

  useEffect(() => {
    setSelected(
      Object.values(AmountPaidBy).findIndex((element) => element.value === amountPaidBy) !== -1 &&
        Object.values(AmountPaidBy).find((element) => element.value === amountPaidBy).name
    );
  }, [amountPaidBy]);
  return (
    <div>
      <AutocompleteComponent
        idRef='MaintenanceCompanyRef'
        labelValue='Amountpaidby'
        multiple={false}
        data={Object.values(AmountPaidBy)}
        displayLabel={(option) => t(`${option.name || ''}`)}
        selectedValues={{ name: selected, value: amountPaidBy }}
        getOptionSelected={(option) => option.name === selected}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}amountPaidByselect`)}
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        isWithError
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setamountPaidBy((newValue && +newValue.value) || '');
        }}
      />
    </div>
  );
};
AmountpaidbyComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  amountPaidBy: PropTypes.number.isRequired,
  setamountPaidBy: PropTypes.string.isRequired,
};
