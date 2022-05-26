import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { RadiosGroupComponent, Spinner, SelectComponet } from '../../../../Components';
import {
  GlobalHistory,
  languageChange,
  GetParams,
} from '../../../../Helper';

import defaultLogo from '../../../../assets/images/defaults/logo-crm.svg';
import { ApplicationUserForgotPassword } from '../../../../Services/LoginService';
import { config } from '../../../../config/config';

const translationPath = '';

const ResetPasswordOptionsView = (props) => {
  const [radioValue, setRadioValue] = useState('1');
  const [emailOptions, setEmailOptions] = useState();
  const [phoneOptions, setPhoneOptions] = useState();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState();

  const { t } = useTranslation('LoginView');
  useEffect(() => {
    setEmailOptions(GetParams('email').split('?')[0]);
    setPhoneOptions(GetParams('email').split('?phone=')[1].split('?userId=')[0]);
    setUserId(GetParams('email').split('?userId=')[1]);
  }, [props.match]);

  const handleOptionsSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const options = await ApplicationUserForgotPassword({
      userId,
      identity: radioValue === '1' ? emailOptions : phoneOptions,
      organizationsId: config.organizationsId,
      applicationsId: config.applicationId,
    });
    if (options) {
 GlobalHistory.push(
        `/account/VerificationCodeView?identityVerificationId=${
          options.identityVerificationId
        }?email=${emailOptions}?phone=${phoneOptions}?isEmail=${radioValue === '1'}`
        );
}
    setLoading(false);
  };
  return (
    <>
      <div className='login-wrapper'>
        <Spinner isActive={loading} />
        <div className='login-content-wrapper'>
          <div className='text-section-wrapper'>
            <div className='text-section-content'>
              <span className='texts-header primary-bold'>{t(`${translationPath}welcome-to`)}</span>
              <span className='texts-header primary-bold'>
                PSI
                {' '}
                {t(`${translationPath}company`)}
              </span>
              <span className='texts c-black-dark fz-30px'>{t(`${translationPath}few-steps`)}</span>
            </div>
          </div>
          <div className='box-section-wrapper'>
            <div className='box-content'>
              <div className='d-flex-v-center-h-between'>
                <div className='logo-wrapper'>
                  <img
                    src={defaultLogo}
                    className='logo'
                    alt={t(`${translationPath}company-logo`)}
                  />
                </div>
                <div className='px-2'>
                  <SelectComponet
                    data={i18next.languages}
                    value={i18next.language}
                    onSelectChanged={languageChange}
                    themeClass='theme-underline'
                  />
                </div>
              </div>
              <form noValidate className='form-wrapper' onSubmit={handleOptionsSubmit}>
                <div className='forget-password-text'>
                  <p className='rest-password'>
                    {t(`${translationPath}we-need-to-verify-your-identity`)}
                  </p>
                  <div className='desc-text '>
                    {t(`${translationPath}don’t-worry-everything-will-be-fixed-soon`)}
                  </div>
                </div>
                <div className='forget-password-radio'>
                  <RadiosGroupComponent
                    data={[
                      { value: '1', label: emailOptions },
                      { value: '0', label: phoneOptions },
                    ]}
                    idRef='Actions'
                    onSelectedRadioChanged={(e) => setRadioValue(e.target.value)}
                    value={radioValue}
                    name='Active'
                    labelInput='label'
                    valueInput='value'
                  />
                </div>
                <div className='d-flex-v-center-h-between contral-bbtvlad'>
                  <Button
                    onClick={() => GlobalHistory.push('/account/login')}
                    className='btns cancel-forget-passwrod'
                  >
                    {t(`${translationPath}cancel`)}
                  </Button>
                  <Button className='btns submit-forget-password' type='submit'>
                    {t(`${translationPath}send-code`)}
                  </Button>
                </div>
              </form>
              <div className='curve-edge' />
              <div className='curve-edge-reverced' />
            </div>
          </div>
          <div className='light-shadow' />
        </div>
      </div>
    </>
  );
};
export { ResetPasswordOptionsView };
