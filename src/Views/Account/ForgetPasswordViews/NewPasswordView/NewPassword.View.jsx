import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTranslate,
  showError,
  GlobalHistory,
  getErrorByName,
  languageChange,
  GetParams,
} from '../../../../Helper';
import { Inputs, SelectComponet, Spinner } from '../../../../Components';
import defaultLogo from '../../../../assets/images/defaults/logo-crm.svg';
import { ApplicationUserResetPassword } from '../../../../Services/LoginService';

import { LOGIN_FAIL, LOGIN_SUCCESS } from '../../../../store/login/Actions';

const translationPath = '';
const NewPasswordView = (props) => {
  const [identityVerificationId, setIdentityVerificationId] = useState();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('LoginView');
  useEffect(() => {
    setIdentityVerificationId(GetParams('identityVerificationId').split('?')[0]);
  }, [props.match]);

  const schema = Joi.object({
    newPassword: Joi.string()
      .required()
      .messages({
        'string.empty': t(`${translationPath}password-is-required`),
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': t(`${translationPath}re-enter-password-is-required`),
      }),
  })
    .options({
      abortEarly: false,
    })
    .validate({ newPassword, confirmPassword });

  useEffect(() => {
    if (loginResponse && loginResponse.loginResponse && loginResponse.loginResponse.token) {
      localStorage.setItem('session', JSON.stringify(loginResponse.loginResponse));
      GlobalHistory.push('/home');
    }
  }, [loginResponse]);

  const handleResetPassword = async (event) => {
    setLoading(true);
    event.preventDefault();
    if (schema.error) {
      showError(getTranslate()('shared.please-fix-all-errors'));
      return;
    }
    const options = await ApplicationUserResetPassword({
      identityVerificationId: +identityVerificationId,
      newPassword,
    });
    if (options) {
      setIsSubmitted(true);
      dispatch(LOGIN_SUCCESS({ loginResponse: options }));
    }
    setLoading(false);
    dispatch(LOGIN_FAIL({ loginResponse: options }));
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
              <span className='texts c-black-dark fz-30px'>
                {t(`${translationPath}last-step`)}
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
              <form noValidate className='form-wrapper' onSubmit={handleResetPassword}>
                <div className='forget-password-text'>
                  <p className='new-password'>{t(`${translationPath}new-password`)}</p>
                </div>
                <div className='desc-text-newpassword'>
                  {t(`${translationPath}make-sure-to-not-enter-a-strong-password`)}
                </div>
                <div className='View-new-password'>
                  <Inputs
                    helperText={getErrorByName(schema, 'newPassword').message}
                    error={getErrorByName(schema, 'newPassword').error}
                    isWithError
                    isSubmitted={isSubmitted}
                    type='password'
                    fieldClasses='inputs theme-underline mb-4'
                    label={t(`${translationPath}new-password`)}
                    name='Code'
                    idRef='newPassword'
                    wrapperClasses='theme-underline'
                    value={newPassword}
                    onInputChanged={(e) => setNewPassword(e.target.value)}
                  />
                  <Inputs
                    helperText={getErrorByName(schema, 'confirmPassword').message}
                    error={getErrorByName(schema, 'confirmPassword').error}
                    isWithError
                    isSubmitted={isSubmitted}
                    type='password'
                    fieldClasses='inputs theme-underline mb-4'
                    label={t(`${translationPath}re-enter-new-password`)}
                    name='Code'
                    idRef='confirmPassword'
                    wrapperClasses='theme-underline'
                    value={confirmPassword}
                    onInputChanged={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                </div>
                <div className='d-flex-v-center-h-between '>
                  <Button
                    onClick={() => GlobalHistory.push('/account/login')}
                    className='btns cancel-forget-passwrod'
                  >
                    {t(`${translationPath}cancel`)}
                  </Button>
                  <Button className='btns submit-forget-password' type='submit'>
                    {t(`${translationPath}login`)}
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

export { NewPasswordView };
