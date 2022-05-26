import React, { useState } from 'react';
import Joi from 'joi';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';
import { GetApplicationUserForgotPasswordOptions } from '../../../../Services/LoginService';
import defaultLogo from '../../../../assets/images/defaults/logo-crm.svg';
import { getErrorByName, GlobalHistory, languageChange } from '../../../../Helper';
import { config } from '../../../../config/config';
import { Inputs, SelectComponet } from '../../../../Components';

const translationPath = '';
const IdentityVerificationView = () => {
  const [accountIdentity, setAccountIdentity] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation('LoginView');
  const schema = Joi.object({
    accountIdentity: Joi.string()
      .required()
      .messages({
        'string.empty': t`${translationPath}identity-is-required`,
      }),
  })
    .options({
      abortEarly: false,
    })
    .validate({ accountIdentity });

  const handleForgetPasswordSubmit = async (event) => {
    event.preventDefault();
    const options = await GetApplicationUserForgotPasswordOptions(
      accountIdentity,
      config.applicationId,
      config.organizationsId
    );
    if (options) {
      GlobalHistory.push(
        `/account/ResetPasswordOptionsView?email=${options.email}?phone=${options.phone}?userId=${options.userId}`
      );
      setIsSubmitted(true);
    }
  };
  return (
    <>
      <div className='login-wrapper'>
        <div className='login-content-wrapper'>
          <div className='text-section-wrapper'>
            <div className='text-section-content'>
              <span className='texts-header primary-bold'>{t(`${translationPath}welcome-to`)}</span>
              <span className='texts-header primary-bold'>
                PSI
                {' '}
                {t(`${translationPath}company`)}
              </span>
              <span className='texts c-black-dark fz-30px'>
                {t(`${translationPath}recv-password`)}
              </span>
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
              <form noValidate className='form-wrapper' onSubmit={handleForgetPasswordSubmit}>
                <div className='forget-password-text'>
                  <p className='forget-password'>
                    {t(`${translationPath}please-enter-your-identity`)}
                  </p>
                </div>
                <Inputs
                  helperText={getErrorByName(schema, 'accountIdentity').message}
                  error={getErrorByName(schema, 'accountIdentity').error}
                  isWithError
                  isSubmitted={isSubmitted}
                  label={t(`${translationPath}identity`)}
                  inputPlaceholder={t(`${translationPath}ex-desc`)}
                  name='identity'
                  idRef='accountIdentity'
                  fieldClasses='inputs theme-underline mb-4'
                  value={accountIdentity}
                  onInputChanged={(e) => setAccountIdentity(e.target.value)}
                  wrapperClasses='theme-underline'
                />
                <div className='d-flex-v-center-h-between '>
                  <Button
                    onClick={() => GlobalHistory.push('/account/login')}
                    className='btns cancel-forget-passwrod'
                  >
                    {t(`${translationPath}cancel`)}
                  </Button>
                  <Button className='btns submit-forget-password' type='submit'>
                    {t(`${translationPath}submit`)}
                  </Button>
                </div>
              </form>
              <div className='curve-edge' />
              <div className='curve-edge-reverced' />
            </div>
          </div>
        </div>
        {' '}
        <div className='light-shadow' />

      </div>
    </>
  );
};
export { IdentityVerificationView };
