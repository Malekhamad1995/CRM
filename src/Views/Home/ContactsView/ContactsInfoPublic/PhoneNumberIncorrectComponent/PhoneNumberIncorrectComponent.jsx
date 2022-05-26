import React from 'react';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PhoneNumberIncorrect from '../../../../../assets/images/defaults/PhoneNumberIncorrect.png';
import './PhoneNumberIncorrectComponent.scss';
import { GlobalHistory } from '../../../../../Helper';

export const PhoneNumberIncorrectComponent = ({ change }) => {
  const { t } = useTranslation('Shared');
  const translationPath = 'PhoneNumberIncorrectView.';

  return (
    <div container className='phone-number-incorrect-result'>
      <div className='ACTION-wraper'>
        <div className='no-result-text'>
          <h3 className='phone-number-incorrect-result-subtitle'>
            {t(`${translationPath}Error-in-mobile-number-or-not-exist`)}
          </h3>
        </div>
        <div className='no-result-text'>
          <Button
            className='MuiButtonBase-root btns theme-solid mx-2'
            onClick={() => GlobalHistory.push('/account/login')}
          >
            <span>{t(`${translationPath}Open-CRM`)}</span>
          </Button>
        </div>
      </div>
      <div className='img-1'>
        <img
          src={PhoneNumberIncorrect}
          alt={t(`${translationPath}No-Result-Found`)}
          className='phone-number-incorrect-img'
        />
      </div>
    </div>
  );
};
