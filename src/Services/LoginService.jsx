import { config } from '../config/config';
import {
  GlobalTranslate, showError, LogoutAction, HttpServices
} from '../Helper';

const ApplicationLogin = async (payload) => {
  try {
    const result = await HttpServices.post(
      `${config.server_address}/Identity/Account/ApplicationLogin`,
      payload
    );
    return result;
  } catch (e) {
    if (e.response && e.response.data) throw e.response.data;
    else throw e;
  }
};

const RefreshToken = async (payload) => {
  try {
    const result = await HttpServices.post(
      `${config.server_address}/Identity/Account/RefreshToken`,
      payload
    );
    return result;
  } catch (e) {
    LogoutAction()();
    return undefined;
  }
};

const GetApplicationUserForgotPasswordOptions = async (identity, applicationId, organizationId) => {
  const result = await HttpServices.get(
    `${config.server_address}/Identity/Account/GetApplicationUserForgotPasswordOptions/${identity}/${applicationId}/${organizationId}`
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('LoginView:the-identity-could-not-be-found'));
      return undefined;
    });
  return result;
};

const ApplicationUserForgotPassword = async (payload) => {
  const result = await HttpServices.post(
    `${config.server_address}/Identity/Account/ApplicationUserForgotPassword/`,
    payload
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('LoginView:retriving-data'));
      return undefined;
    });
  return result;
};


const VerifyApplicationUserCode = async (payload) => {
  const result = await HttpServices.post(
    `${config.server_address}/Identity/Account/VerifyApplicationUserCode/`,
    payload
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('LoginView:wrong-verification-code'));
      return undefined;
    });
  return result;
};


const ApplicationUserResetPassword = async (payload) => {
  const result = await HttpServices.post(
    `${config.server_address}/Identity/Account/ApplicationUserResetPassword/`,
    payload
  )
    .then((data) => data)
    .catch((error) => {
      showError(GlobalTranslate.t('LoginView:wrong-ResetPassword'));
      return undefined;
    });
  return result;
};


const ChangePasswordAPI = async (body) => {
  const result = await HttpServices.put(
    `${config.server_address}/Identity/Account/ChangePassword/`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const ChangePasswordUserIDAPI = async (body) => {
  const result = await HttpServices.put(
    `${config.server_address}/Identity/Account/AdminChangePassword`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export {
  ApplicationLogin,
  RefreshToken,
  ChangePasswordAPI,
  GetApplicationUserForgotPasswordOptions,
  ApplicationUserForgotPassword,
  VerifyApplicationUserCode,
  ApplicationUserResetPassword,
  ChangePasswordUserIDAPI,
};
