import { ButtonBase } from '@material-ui/core';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PropTypes } from 'prop-types';
import Joi from 'joi';
import {
  Inputs, ProgressComponet, Spinner
} from '../../../Components';
import { getErrorByName, showError, showSuccess } from '../../../Helper';
import { ChangePasswordAPI } from '../../../Services';
import { mediumStringRegex, strongStringRegex } from '../../../Utils';

export const ChangePasswordView = ({ onCancelClicked }) => {
  const [state, setState] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [Passwords, setPasswords] = useState({
    ViewOldPassword: '',
    ViewNewassword: '',
    ViewconfirmPassword: ''
  });
  const { t } = useTranslation('HeaderView');
  const translationPath = 'userMenuView.';


  const schema = Joi.object({
    oldPassword:
      Joi.string()
        .required()
        .messages({
          'string.empty': t(`${translationPath}password-is-required`),
        }) ||
      Joi.any(),
    newPassword:
      Joi.string()
        .required()
        .messages({
          'string.empty': t(`${translationPath}password-is-required`),
        }) ||
      Joi.any(),
    confirmPassword:
      Joi.string()
        .required()
        .regex(new RegExp(`^${state.newPassword}$`))
        .messages({
          'string.empty': t(`${translationPath}confirm-password-is-required`),
          'string.pattern.base': t(`${translationPath}password-not-matched`),
        }) ||
      Joi.any(),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ChangePassword = useCallback(async () => {
    setIsLoading(true);
    const res = await ChangePasswordAPI(state);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t(`${translationPath}Change-Password-successfully`));
      setIsLoading(false);
      onCancelClicked();
    } else {
      showError(t(`${translationPath}invalid-password`));
      setIsLoading(false);
    }
  });
  const onClickedold = () => {
    setPasswords({ ...Passwords, ViewOldPassword: !Passwords.ViewOldPassword });
  };
  const onClickednew = () => {
    setPasswords({ ...Passwords, ViewNewassword: !Passwords.ViewNewassword });
  };
  const onClickedViewconfirmPassword = () => {
    setPasswords({ ...Passwords, ViewconfirmPassword: !Passwords.ViewconfirmPassword });
  };
  return (
    <div className='px-2 view-ChangePassword'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='w-100'>
        <Inputs
          inputPlaceholder={t(`${translationPath}InputsPassword`)}
          labelValue={t(`${translationPath}old-Password`)}
          idRef='oldpasswordRef'
          labelClasses='Requierd-Color'
          value={state.oldPassword}
          isWithError
          helperText={getErrorByName(schema, 'oldPassword').message}
          error={getErrorByName(schema, 'oldPassword').error}
          type={!Passwords.ViewOldPassword ? 'password' : ''}
          endAdornment={(
            <ButtonBase onClick={onClickedold} className='p-2'>
              {!Passwords.ViewOldPassword ? <span className='mdi mdi-eye-outline' /> : <span className='mdi mdi-eye-off-outline' />}
            </ButtonBase>

          )}
          onInputChanged={(e) => setState({ ...state, oldPassword: e.target.value })}
        />
      </div>
      <div className='w-100'>
        <Inputs
          inputPlaceholder={t(`${translationPath}InputsPassword`)}
          labelValue={t(`${translationPath}new-Password`)}
          labelClasses='Requierd-Color'
          idRef='newpasswordRef'
          value={state.newPassword}
          DisabledPaste
          DisabledCopy
          isWithError
          helperText={getErrorByName(schema, 'newPassword').message}
          error={getErrorByName(schema, 'newPassword').error}
          endAdornment={(
            <ButtonBase onClick={onClickednew} className='p-2'>
              {!Passwords.ViewNewassword ? <span className='mdi mdi-eye-outline' /> : <span className='mdi mdi-eye-off-outline' />}
            </ButtonBase>
          )}
          type={!Passwords.ViewNewassword ? 'password' : ''}
          onInputChanged={(e) => setState({ ...state, newPassword: e.target.value })}
        />
      </div>
      <div className='form-item'>
        <Inputs
          idRef='confirmPasswordRef'
          labelClasses='Requierd-Color'
          inputPlaceholder={t(`${translationPath}confirm-password`)}
          labelValue={t(`${translationPath}confirm-password-req`)}
          DisabledPaste
          DisabledCopy
          value={state.confirmPassword}
          type={!Passwords.ViewconfirmPassword ? 'password' : ''}
          endAdornment={(
            <ButtonBase onClick={onClickedViewconfirmPassword} className='p-2'>
              {!Passwords.ViewconfirmPassword ? <span className='mdi mdi-eye-outline' /> : <span className='mdi mdi-eye-off-outline' />}
            </ButtonBase>
          )}
          isWithError
          isDisabled={state.password === ''}
          helperText={getErrorByName(schema, 'confirmPassword').message}
          error={getErrorByName(schema, 'confirmPassword').error}
          onInputChanged={(e) => setState({ ...state, confirmPassword: e.target.value })}
        />
      </div>
      <div className='w-100 pb-130px mb-3'>
        <div className='w-100 pb-130px mb-3 ChangePasswordView-Page-progresses'>
          <ProgressComponet
            inSameLine
            wrapperClasses='ChangePasswordView-wrpaer'
            value={
              (state.newPassword.match(strongStringRegex) && 100) ||
              (state.newPassword.match(mediumStringRegex) && 50) ||
              (state.newPassword !== '' && 25) ||
              0
            }
            isTextColored
            themeClasses='theme-gradient'
            progressText={
              (state.newPassword.match(strongStringRegex) &&
                t(`${translationPath}strong-password`)) ||
              (state.newPassword.match(mediumStringRegex) &&
                t(`${translationPath}medium-password`)) ||
              (state.newPassword !== '' && t(`${translationPath}weak-password`)) ||
              t(`${translationPath}password-is-blank`)
            }
          />
        </div>
      </div>
      <div className='MuiDialogActions-root dialog-footer-wrapper  MuiDialogActions-spacing'>
        <div className='save-cancel-wrapper d-flex-v-center-h-end flex-wrap p-2'>
          <div className='cancel-wrapper d-inline-flex-center'>
            <ButtonBase className='cancel-btn-wrapper btns theme-transparent c-primary' onClick={onCancelClicked}>
              <span className='MuiButton-label'><span>{t(`${translationPath}Cancel`)}</span></span>
              <span className='MuiTouchRipple-root' />
            </ButtonBase>
          </div>
          <div className='save-wrapper d-inline-flex-center'>
            <ButtonBase
              className='save-btn-wrapper btns theme-solid bg-primary'
              onClick={ChangePassword}
              disabled={!!schema.error}
            >
              <span className='MuiButton-label'><span>{t(`${translationPath}Save-Change`)}</span></span>
              <span className='MuiTouchRipple-root' />
            </ButtonBase>
          </div>
        </div>
      </div>
    </div>
  );
};
ChangePasswordView.propTypes = { onCancelClicked: PropTypes.func.isRequired };
