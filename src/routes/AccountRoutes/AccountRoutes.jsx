import { LoginView } from '../../Views/Account';
import { IdentityVerificationView } from '../../Views/Account/ForgetPasswordViews/IdentityVerificationView/IdentityVerification.View';
import { NewPasswordView } from '../../Views/Account/ForgetPasswordViews/NewPasswordView/NewPassword.View';
import { ResetPasswordOptionsView } from '../../Views/Account/ForgetPasswordViews/ResetPasswordOptionsView/ResetPasswordOptions.View';
import { VerificationCodeView } from '../../Views/Account/ForgetPasswordViews/VerificationCodeView/VerificationCode.View';
import { ContactsInfoPublicView } from '../../Views/Home/ContactsView/ContactsInfoPublic/ContactsInfoPublicView';

export const AccountRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    layout: '/account',
    default: true,
    isExact: true,
    authorize: false,
    roles: [],
    showInMenu: false,
    isRoute: true,
  },
  {
    path: '/IdentityVerificationView',
    name: 'IdentityVerification',
    component: IdentityVerificationView,
    layout: '/account',
    default: true,
    authorize: false,
    roles: [],
    showInMenu: false,
    isRoute: true,
  },
  {
    path: '/ResetPasswordOptionsView',
    name: 'ResetPasswordOptions',
    component: ResetPasswordOptionsView,
    layout: '/account',
    default: true,
    authorize: false,
    roles: [],
    showInMenu: false,
    isRoute: true,
  },
  {
    path: '/VerificationCodeView',
    name: 'VerificationCode',
    component: VerificationCodeView,
    layout: '/account',
    default: true,
    authorize: false,
    roles: [],
    showInMenu: false,
    isRoute: true,
  },
  {
    path: '/NewPasswordView',
    name: 'NewPassword',
    component: NewPasswordView,
    layout: '/account',
    default: true,
    authorize: false,
    roles: [],
    showInMenu: false,
    isRoute: true,
  },
  {
    path: '/conatctinfo',
    name: 'IdentityVerification',
    component: ContactsInfoPublicView,
    layout: '/account',
    default: true,
    authorize: false,
    roles: [],
    showInMenu: false,
    isRoute: true,
  },
];
