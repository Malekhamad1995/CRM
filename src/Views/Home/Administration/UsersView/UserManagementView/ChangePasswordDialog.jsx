import React, {
  useCallback, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Joi from 'joi';
import { Spinner } from '../../../../../Components';
import {
  getErrorByName, showError, showSuccess
} from '../../../../../Helper';
import {
  mediumStringRegex,
  strongStringRegex,
} from '../../../../../Utils/Expressions';
import {
  Inputs,
  ProgressComponet,
} from '../../../../../Components/Controls';
import { AdminChangePasswordWithoutVerification } from '../../../../../Services/userServices';

const translationPath = 'UsersManagementView.';
export const ChangePasswordDialog = ({
  open,
  close,
  // onSave,
  userId,
}) => {
  const { t } = useTranslation('UsersView');
  const [isLoading, setIsLoading] = useState(false);
  const [statePassword, setStatePassword] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [Passwords, setPasswords] = useState({
    ViewNewassword: '',
    ViewconfirmPassword: ''
  });

  const schemaChangePassWord = Joi.object({
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
        .regex(new RegExp(`^${statePassword.newPassword}$`))
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
    .validate(statePassword);

  const onClickednew = () => {
    setPasswords({ ...Passwords, ViewNewassword: !Passwords.ViewNewassword });
  };
  const onClickedViewconfirmPassword = () => {
    setPasswords({ ...Passwords, ViewconfirmPassword: !Passwords.ViewconfirmPassword });
  };
  const ClickCancel = () => {
    setStatePassword({
      ...statePassword, newPassword: '', confirmPassword: '',
    });
    close();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ChangePassword = useCallback(async () => {
    setIsLoading(true);
    // eslint-disable-next-line object-shorthand
    const res = await AdminChangePasswordWithoutVerification({ newPassword: statePassword.newPassword, userId: userId });
    if (!(res && res.status && res.status !== 200)) {
      if (res === undefined) {
        showError(t(`${translationPath}No-parmation`));
        setIsLoading(false);
        close();
      } else {
      showSuccess(t(`${translationPath}Change-Password-successfully`));
      setIsLoading(false);
      ClickCancel();
      close();
    }
    } else {
      showError(t(`${translationPath}invalid-password`));
      setIsLoading(false);
    }
  });

  return (
    <div>
      <Spinner isActive={isLoading} isAbsolute />
      <Dialog
        disableBackdropClick
        open={open}
        maxWidth='sm'
        onClose={() => {
          close();
        }}
        className='dialog-wrapper'
      >
        <form noValidate>
          <DialogTitle id='alert-dialog-slide-title'>
            <div className='dialog-header'>
              {t('UsersManagementView.change-password')}
            </div>
          </DialogTitle>
          <DialogContent>
            <div className='account-dialog-section'>
              {userId && (
                <div>

                  <div className='dialog-content-wrapper'>
                    <div className='dialog-content-item'>
                      <Inputs
                        inputPlaceholder={t(`${translationPath}InputsPassword`)}
                        labelValue={t(`${translationPath}new-Password`)}
                        labelClasses='Requierd-Color'
                        idRef='newpasswordRef'
                        DisabledPaste
                        DisabledCopy
                        value={statePassword.newPassword}
                        isWithError
                        helperText={getErrorByName(schemaChangePassWord, 'newPassword').message}
                        error={getErrorByName(schemaChangePassWord, 'newPassword').error}
                        endAdornment={(
                          <ButtonBase onClick={onClickednew} className='p-2'>
                            {!Passwords.ViewNewassword ? <span className='mdi mdi-eye-outline' /> : <span className='mdi mdi-eye-off-outline' />}
                          </ButtonBase>
                        )}
                        type={!Passwords.ViewNewassword ? 'password' : ''}
                        onInputChanged={(e) => setStatePassword({ ...statePassword, newPassword: e.target.value })}
                      />

                    </div>
                    <div className='dialog-content-item'>
                      <Inputs
                        idRef='confirmPasswordRef'
                        labelClasses='Requierd-Color'
                        inputPlaceholder={t(`${translationPath}new-Passwordagean`)}
                        labelValue={t(`${translationPath}confirm-password-req`)}
                        DisabledPaste
                        DisabledCopy
                        value={statePassword.confirmPassword}
                        type={!Passwords.ViewconfirmPassword ? 'password' : ''}
                        endAdornment={(
                          <ButtonBase onClick={onClickedViewconfirmPassword} className='p-2'>
                            {!Passwords.ViewconfirmPassword ? <span className='mdi mdi-eye-outline' /> : <span className='mdi mdi-eye-off-outline' />}
                          </ButtonBase>
                        )}
                        isWithError
                        isDisabled={statePassword.password === ''}
                        helperText={getErrorByName(schemaChangePassWord, 'confirmPassword').message}
                        error={getErrorByName(schemaChangePassWord, 'confirmPassword').error}
                        onInputChanged={(e) => setStatePassword({ ...statePassword, confirmPassword: e.target.value })}
                      />
                    </div>

                    <div className='w-100'>
                      <div className='w-100 ChangePasswordView-Page-progresses'>
                        <ProgressComponet
                          inSameLine
                          wrapperClasses='ChangePasswordView-wrpaer'
                          value={
                            (statePassword.newPassword.match(strongStringRegex) && 100) ||
                            (statePassword.newPassword.match(mediumStringRegex) && 50) ||
                            (statePassword.newPassword !== '' && 25) ||
                            0
                          }
                          isTextColored
                          themeClasses='theme-gradient'
                        />
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </div>

          </DialogContent>
          <DialogActions>
            {/* <div className='w-100 pb-130px Butt-wrpaer-password'>
                <Button
                  className='btns theme-solid'
                  onClick={ClickCancel}
                >
                  {t('UsersManagementView.Cancel')}
                </Button>
                <Button
                  className='btns theme-solid'
                  onClick={ChangePassword}
                  disabled={!!schemaChangePassWord.error}
                >
                  {t('Users.Save-Change')}
                </Button>

              </div> */}

            <div className='form-builder-footer-wrapper is-dialog w-100 MuiGrid-align-items-xs-center MuiGrid-justify-xs-space-between'>
              <div className='MuiDialogActions-root dialog-footer-wrapper  MuiDialogActions-spacing'>
                <div className='save-cancel-wrapper d-flex-v-center-h-end flex-wrap p-2'>
                  <div className='cancel-wrapper d-inline-flex-center'>
                    <ButtonBase
                      className='MuiButtonBase-root MuiButton-root MuiButton-text cancel-btn-wrapper btns theme-transparent c-primary'
                      tabIndex='0'
                      onClick={ClickCancel}
                    >
                      <span className='MuiButton-label'>
                        {t('UsersManagementView.Cancel')}
                      </span>
                      <span className='MuiTouchRipple-root' />
                    </ButtonBase>
                  </div>
                  <div className='save-wrapper d-inline-flex-center'>
                    <ButtonBase
                      className='MuiButtonBase-root MuiButton-root MuiButton-text save-btn-wrapper btns theme-solid bg-primary w-100 mx-2 mb-2'
                      onClick={ChangePassword}
                      disabled={!!schemaChangePassWord.error}
                    >
                      <span className='MuiButton-label'>
                        <span>
                          {' '}
                          {t('Users.Save-Change')}
                        </span>
                      </span>
                      <span className='MuiTouchRipple-root' />
                    </ButtonBase>
                  </div>
                </div>
              </div>
            </div>

          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
ChangePasswordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};
