import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AutocompleteComponent } from '../../../../../../Components';
import { TermOfPayment } from '../../../../../../Enums/TermOfPayment.Enum';

export const TermsofpaymentComponent = ({
  parentTranslationPath,
  translationPath,
  setTermsofpayment,
  state,
  helperText ,
  error , 
  isSubmitted
}) => {
  const [selected, setSelected] = useState({});
  const { t } = useTranslation(parentTranslationPath);
  useEffect(() => {
    setSelected(
      Object.values(TermOfPayment).findIndex((element) => element.value === state) !== -1 &&
        Object.values(TermOfPayment).find((element) => element.value === state).name
    );
  }, [state]);

  return (
    <div>
      <AutocompleteComponent
        idRef='TermsofpaymentRef'
        labelValue='Termsofpayment'
        selectedValues={{ name: selected, value: state }}
        getOptionSelected={(option) => option.name === selected}
        multiple={false}
        data={Object.values(TermOfPayment)}
        displayLabel={(option) => t(`${option.name || ''}`)}
        withoutSearchButton
        inputPlaceholder={t(`${translationPath}termOfPaymentselect`)}
        isSubmitted={isSubmitted}
        helperText={helperText}
        error={error}
        isWithError
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onChange={(event, newValue) => {
          setTermsofpayment((newValue && +newValue.value) || '');
        }}
      />
    </div>
  );
};
TermsofpaymentComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setTermsofpayment: PropTypes.number.isRequired,
  state: PropTypes.number.isRequired,
};
