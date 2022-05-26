import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { VerifyApplicationUserCode } from '../../../../Services/LoginService';
import {
 GlobalHistory, languageChange, GetParams, getErrorByName
} from '../../../../Helper';
import defaultLogo from '../../../../assets/images/defaults/logo-crm.svg';
import { Inputs, SelectComponet, Spinner } from '../../../../Components';

const translationPath = '';
const VerificationCodeView = (props) => {
  const [verificationCode, setVerificationCode] = useState();
  const [identityVerificationId, setIdentityVerificationId] = useState();
  const [emailOptions, setEmailOptions] = useState();
  const [phoneOptions, setPhoneOptions] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [loading, setLoading] = useState(false);


  const { t } = useTranslation('LoginView');
  const schema = Joi.object({
    verificationCode: Joi.string()
      .required()
      .messages({
        'string.empty': t(`${translationPath}this-field-is-required`),
      }),
  })
    .options({
      abortEarly: false,
    })
    .validate({ verificationCode });

    useEffect(() => {
      setIdentityVerificationId(GetParams('identityVerificationId').split('?')[0]);
      setEmailOptions(GetParams('identityVerificationId').split('?email=')[1].split('?phone')[0]);
      setPhoneOptions(
        GetParams('identityVerificationId').split('?phone=')[1].split('?isEmail')[0]
      );
      setIsEmail(GetParams('identityVerificationId').split('?isEmail=')[1]);
    }, [props.match]);


  const handleCodeSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const options = await VerifyApplicationUserCode({
      identityVerificationId: +identityVerificationId,
      code: verificationCode,
    });
    if (options) {
      GlobalHistory.push(
        `/account/NewPasswordView?identityVerificationId=${options.identityVerificationId}`
      );
      setIsSubmitted(true);
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
              <span className='texts-header primary-bold'>{t('welcome-to')}</span>
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
              <form noValidate className='form-wrapper' onSubmit={handleCodeSubmit}>
                <div className='verifyidentitytext'>
                  {t(`${translationPath}we-need-to-verify-your-identity`)}
                </div>
                <div className='forget-password-text'>
                  <div className='desc-text'>
                    {t(`${translationPath}we-just-sent-a-code-to`)}
                    {isEmail === 'true' ? emailOptions : phoneOptions}
                    {t(`${translationPath}pleaseWrite-it-down-here-when-you-get-it`)}
                  </div>
                </div>
                <div className='VerificationCodeView'>
                  <Inputs
                    helperText={getErrorByName(schema, 'verificationCode').message}
                    error={getErrorByName(schema, 'verificationCode').error}
                    isWithError
                    isSubmitted={isSubmitted}
                    fieldClasses='inputs theme-underline mt-2'
                    label={t`${translationPath}code`}
                    name='Code'
                    idRef='verificationCode'
                    value={verificationCode}
                    onInputChanged={(e) => setVerificationCode(e.target.value)}
                    wrapperClasses='theme-underline'
                  />
                </div>
                <div className='forget-password-radio' />
                <div className='d-flex-v-center-h-between mt-2'>
                  <Button
                    onClick={() => GlobalHistory.push('/account/login')}
                    className='btns cancel-forget-passwrod '
                  >
                    {t`${translationPath}cancel`}
                  </Button>
                  <Button className='btns submit-forget-password' type='submit'>
                    {t(`${translationPath}next`)}
                  </Button>
                </div>
              </form>
              <div className='curve-edge' />
              <div className='curve-edge-reverced' />
            </div>
          </div>
        </div>
        <div className='light-shadow' />
      </div>
    </>
  );
};

export { VerificationCodeView };
