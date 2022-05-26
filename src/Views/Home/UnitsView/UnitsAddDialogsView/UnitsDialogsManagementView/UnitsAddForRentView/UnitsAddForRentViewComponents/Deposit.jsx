import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Inputs } from '../../../../../../../Components';

export const Deposit = ({
  parentTranslationPath,
  translationPath,
  // value,
  setvalue,
  helperText,
  error,
  isSubmitted,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [AgencyfeeNUM, setAgencyfeeNUM] = useState('');
  const [ViewTypePer, setViewTypePer] = useState('');
  useEffect(() => {
    if (AgencyfeeNUM !== '') setvalue(AgencyfeeNUM);
    else setvalue(ViewTypePer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AgencyfeeNUM, ViewTypePer]);
  return (
    <div className='form-item-v3'>
      <div className='Agencyfee-form'>
        <Inputs
          idRef='DepositRef'
          labelValue='Deposit'
          value={AgencyfeeNUM}
          isSubmitted={isSubmitted}
          helperText={helperText}
          type='number'
          error={error}
          isWithError
          endAdornment={<span>{t(`${translationPath}AED`)}</span>}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            setAgencyfeeNUM(event.target.value);
            setViewTypePer('');
          }}
        />
      </div>
      <div className=''>
        <Inputs
          idRef='DepositORRef'
          labelValue='OR'
          endAdornment={<span>%</span>}
          value={ViewTypePer}
          isSubmitted={isSubmitted}
          helperText={helperText}
          type='number'
          error={error}
          isWithError
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onInputChanged={(event) => {
            setViewTypePer(event.target.value);
            setAgencyfeeNUM('');
          }}
        />
      </div>
    </div>
  );
};

Deposit.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  isSubmitted: PropTypes.string.isRequired,
  setvalue: PropTypes.func.isRequired,
  // value: PropTypes.string.isRequired,
};
