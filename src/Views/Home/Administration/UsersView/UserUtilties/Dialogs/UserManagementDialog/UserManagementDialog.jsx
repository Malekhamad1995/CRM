import React, {
 useReducer, useState, useEffect, useRef, useCallback
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Joi from 'joi';
import {
  DialogComponent,
  Inputs,
  ProgressComponet,
  PhonesComponent,
  AutocompleteComponent,
  Spinner,
  UploaderComponentCircular,
} from '../../../../../../../Components';

import { DefaultImagesEnum } from '../../../../../../../Enums';
import { getErrorByName, showError, showSuccess } from '../../../../../../../Helper';
import {
  emailExpression,
  phoneExpression,
  strongStringRegex,
  mediumStringRegex,
} from '../../../../../../../Utils/Expressions';
import {
  lookupItemsGetId,
  CreateOrganizationUser,
  EditOrganizationUserProfile,
  CheckExistUserName,
  CheckExistPhone,
  CheckExistEmail,
} from '../../../../../../../Services';
import Lookups from '../../../../../../../assets/json/StaticLookupsIds.json';
// import { LoginActions } from '../../../../../../../Stores/Actions';

const translationPath = 'Administration.Users.UsersManagementDialog.';

const UserManagementDialog = ({
  activeUserItem,
  isOpen,
  isOpenChanged,
  reloadData,
  UpdateAction,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('UsersView');
  const reducer = (state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    if (action.id === 'edit') {
      return {
        ...action.value,
      };
    }
  };
  const [isLoadingFields, setIsLoadingFields] = useState({
    username: false,
    email: false,
    phoneNumber: false,
  });
  const [isExistUsername, setIsExistUsername] = useState(null);
  const [isExistEmail, setIsExistEmail] = useState(null);
  const [isExistPhoneNumber, setIsExistPhoneNumber] = useState(null);
  const usernameExistTimer = useRef(null);
  const emailExistTimer = useRef(null);
  const phoneNumberExistTimer = useRef(null);
  const [state, setState] = useReducer(reducer, {
    firstName: '',
    secondName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    profileImg: null,
    whatsAppNumber: '',
    nationality: null,
  });
  const [countries, setCountries] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const schema = Joi.object({
    firstName: Joi.string()
      .required()
      .messages({
        'string.empty': t`${translationPath}first-name-is-required`,
      }),
    // secondName: Joi.string()
    //   .required()
    //   .messages({
    //     'string.empty': t`${translationPath}second-name-is-required`,
    //   }),
    lastName: Joi.string()
      .required()
      .messages({
        'string.empty': t`${translationPath}last-name-is-required`,
      }),
    userName:
      ((!activeUserItem || !activeUserItem.id) &&
        Joi.string()
          .required()
          .custom(
            (value, helpers) =>
              (isExistUsername && isExistUsername.isExist && helpers.error('any.invalid')) || value,
            t`${translationPath}username-is-already-exist`
          )
          .messages({
            'any.invalid': t`${translationPath}username-is-already-exist`,
            'string.empty': t`${translationPath}username-is-required`,
          })) ||
      Joi.any(),
    email:
      ((!activeUserItem || !activeUserItem.id) &&
        Joi.string()
          .required()
          .regex(emailExpression)
          .custom(
            (value, helpers) =>
              (isExistEmail && isExistEmail.isExist && helpers.error('any.invalid')) || value,
            t`${translationPath}email-is-already-exist`
          )
          .messages({
            'any.invalid': t`${translationPath}email-is-already-exist`,
            'string.empty': t`${translationPath}email-is-required`,
            'string.pattern.base': t`${translationPath}invalid-email`,
          })) ||
      Joi.any(),
    password:
      ((!activeUserItem || !activeUserItem.id) &&
        Joi.string()
          .required()
          .messages({
            'string.empty': t`${translationPath}password-is-required`,
          })) ||
      Joi.any(),
    confirmPassword:
      ((!activeUserItem || !activeUserItem.id) &&
        Joi.string()
          .required()
          .regex(new RegExp(`^${state.password}$`))
          .messages({
            'string.empty': t`${translationPath}confirm-password-is-required`,
            'string.pattern.base': t`${translationPath}password-not-matched`,
          })) ||
      Joi.any(),
    phoneNumber:
      ((!activeUserItem || !activeUserItem.id) &&
        Joi.string()
          .required()
          .regex(phoneExpression)
          .custom(
            (value, helpers) =>
              (isExistPhoneNumber && isExistPhoneNumber.isExist && helpers.error('any.invalid')) ||
              value,
            t`${translationPath}mobile-number-is-already-exist`
          )
          .messages({
            'any.invalid': t`${translationPath}mobile-number-is-already-exist`,
            'string.empty': t`${translationPath}mobile-number-is-required`,
            'string.pattern.base': 'shared.invalid-mobile-number',
          })) ||
      Joi.any(),
    whatsAppNumber:
      ((!activeUserItem || !activeUserItem.id) &&
        Joi.string()
          .required()
          .regex(phoneExpression)
          .messages({
            'string.empty': t`${translationPath}whatsapp-number-is-required`,
            'string.pattern.base': 'shared.invalid-whatsapp-number',
          })) ||
      Joi.any(),
    nationality: Joi.object()
      .required()
      .messages({
        // 'any.required':  (`${translationPath}nationality-is-required`),
        'object.base': t`${translationPath}nationality-is-required`,
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const getNationalities = async () => {
    setIsLoading(true);
    const res = await lookupItemsGetId({ lookupTypeId: Lookups.Country });
    if (!(res && res.status && res.status !== 200)) setCountries(res || []);
    else setCountries([]);
    setIsLoading(false);
  };

  const getIsExistUserName = useCallback(async () => {
    setIsLoadingFields((items) => ({ ...items, username: true }));
    const response = await CheckExistUserName(state.userName);
    setIsLoadingFields((items) => ({ ...items, username: false }));
    setIsExistUsername(response);
  }, [state.userName]);
  const getIsExistPhoneNumber = useCallback(async () => {
    setIsLoadingFields((items) => ({ ...items, phoneNumber: true }));
    const response = await CheckExistPhone(state.phoneNumber);
    setIsLoadingFields((items) => ({ ...items, phoneNumber: false }));
    setIsExistPhoneNumber(response);
  }, [state.phoneNumber]);
  const getIsExistEmail = useCallback(async () => {
    setIsLoadingFields((items) => ({ ...items, email: true }));
    const response = await CheckExistEmail(state.email);
    setIsLoadingFields((items) => ({ ...items, email: false }));
    setIsExistEmail(response);
  }, [state.email]);

  const getExistUsernameValidation = useCallback(() => {
    if (usernameExistTimer.current) clearTimeout(usernameExistTimer.current);
    usernameExistTimer.current = setTimeout(() => {
      getIsExistUserName();
    }, 500);
  }, [getIsExistUserName]);

  const getExistEmailValidation = useCallback(() => {
    if (emailExistTimer.current) clearTimeout(emailExistTimer.current);
    emailExistTimer.current = setTimeout(() => {
      getIsExistEmail();
    }, 500);
  }, [getIsExistEmail]);

  const getExistPhoneNumberValidation = useCallback(() => {
    if (phoneNumberExistTimer.current) clearTimeout(phoneNumberExistTimer.current);
    phoneNumberExistTimer.current = setTimeout(() => {
      getIsExistPhoneNumber();
    }, 500);
  }, [getIsExistPhoneNumber]);

  useEffect(() => {
    if (state.userName !== '') getExistUsernameValidation();
  }, [getExistUsernameValidation, state.userName]);

  useEffect(() => {
    if (state.email && state.email !== '' && state.email.match(emailExpression))
      getExistEmailValidation();
  }, [getExistEmailValidation, state.email]);

  useEffect(() => {
    if (state.phoneNumber && state.phoneNumber !== '' && state.phoneNumber.match(phoneExpression))
      getExistPhoneNumberValidation();
  }, [getExistPhoneNumberValidation, state.phoneNumber]);

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (schema.error) {
      showError('shared.please-fix-all-errors');
      return;
    }
    setIsLoading(true);
    const saveDto = {
      ...state,
      phoneNumber:
        (state.phoneNumber && !state.phoneNumber.startsWith('+') && `+${state.phoneNumber}`) ||
        state.phoneNumber ||
        '',
      whatsAppNumber:
        (state.whatsAppNumber &&
          !state.whatsAppNumber.startsWith('+') &&
          `+${state.whatsAppNumber}`) ||
        (state.whatsAppNumber &&
          state.whatsAppNumber.match(phoneExpression) &&
          state.whatsAppNumber) ||
        '',
      nationalityId: state.nationality.lookupItemId,
    };
    const res =
      (activeUserItem &&
        activeUserItem.id &&
        (await EditOrganizationUserProfile(activeUserItem.id, saveDto))) ||
      (await CreateOrganizationUser(saveDto));
    setIsLoading(false);
    if (res) {
      if (activeUserItem && activeUserItem.id)
        showSuccess(t`${translationPath}user-updated-successfully`);
      else showSuccess(t`${translationPath}user-created-successfully`);
      reloadData();
    } else if (activeUserItem && activeUserItem.id)
      showError(t`${translationPath}user-update-failed`);
    else showError(t`${translationPath}user-create-failed`);
    if (JSON.parse(localStorage.getItem('session')).userId === activeUserItem.id) {
      const updatedState = JSON.parse(localStorage.getItem('session'));
      const update = { ...updatedState, profileImg: state.profileImg };
      localStorage.setItem('session', JSON.stringify(update));
      UpdateAction(update);
    }
  };
  useEffect(() => {
    getNationalities();
  }, []);
  useEffect(() => {
    if (activeUserItem && activeUserItem.id) {
      setState({
        id: 'edit',
        value: {
          ...activeUserItem,
          nationality:
            (activeUserItem.nationalityId &&
              countries.find(
                (item) => activeUserItem && item.lookupItemId === activeUserItem.nationalityId
              )) ||
            null,
          password: '',
          confirmPassword: '',
          whatsAppNumber: activeUserItem.whatsAppNumber || '',
          phoneNumber: activeUserItem.phoneNumber || '',
        },
      });
    }
  }, [activeUserItem, countries]);
  useEffect(
    () => () => {
      if (usernameExistTimer.current) clearTimeout(usernameExistTimer.current);
      if (emailExistTimer.current) clearTimeout(emailExistTimer.current);
      if (phoneNumberExistTimer.current) clearTimeout(phoneNumberExistTimer.current);
    },
    []
  );
  return (
    <DialogComponent
      titleText={(activeUserItem && 'edit-user') || 'add-new-user'}
      saveText={(activeUserItem && 'edit-user') || 'add-user'}
      dialogContent={(
        <div className='user-management-dialog view-wrapper'>
          <Spinner isActive={isLoading} />
          <div className='d-flex-v-center-h-end w-100'>
            <UploaderComponentCircular
              idRef='profileImgRef'
              circleDefaultImage={DefaultImagesEnum.man.defaultImg}
              initUploadedFiles={
                (state &&
                  state.profileImg && [{ uuid: state.profileImg, fileName: 'user-image' }]) ||
                []
              }
              uploadedChanged={(files) =>
                setState({ id: 'profileImg', value: (files.length > 0 && files[0].uuid) || null })}
            />
          </div>
          <div className='form-item'>
            <Inputs
              inputPlaceholder='FirstName'
              labelValue='FirstName'
              idRef='firstNameRef'
              value={state.firstName}
              isWithError
              isSubmitted={isSubmitted}
              helperText={getErrorByName(schema, 'firstName').message}
              error={getErrorByName(schema, 'firstName').error}
              onInputChanged={(event) => setState({ id: 'firstName', value: event.target.value })}
              translationPath={translationPath}
            />
          </div>
          <div className='form-item'>
            <Inputs
              inputPlaceholder='SecondName'
              labelValue='SecondName'
              idRef='secondNameRef'
              value={state.secondName}
              isWithError
              isSubmitted={isSubmitted}
              helperText={getErrorByName(schema, 'secondName').message}
              error={getErrorByName(schema, 'secondName').error}
              onInputChanged={(event) => setState({ id: 'secondName', value: event.target.value })}
              translationPath={translationPath}
            />
          </div>
          <div className='form-item'>
            <Inputs
              inputPlaceholder='LastName'
              labelValue='LastName'
              idRef='lastNameRef'
              value={state.lastName}
              isWithError
              isSubmitted={isSubmitted}
              helperText={getErrorByName(schema, 'lastName').message}
              error={getErrorByName(schema, 'lastName').error}
              onInputChanged={(event) => setState({ id: 'lastName', value: event.target.value })}
              translationPath={translationPath}
            />
          </div>
          <div className='form-item'>
            <AutocompleteComponent
              idRef='nationalityRef'
              labelValue='nationality'
              inputPlaceholder='nationality'
              translationPath={translationPath}
              selectedValues={state.nationality}
              data={countries}
              chipsLabel={(option) => (option.lookupItemName && option.lookupItemName) || ''}
              displayLabel={(option) => (option.lookupItemName && option.lookupItemName) || ''}
              multiple={false}
              withoutSearchButton
              helperText={getErrorByName(schema, 'nationality').message}
              error={getErrorByName(schema, 'nationality').error}
              isWithError
              isSubmitted={isSubmitted}
              onChange={(event, newValue) => {
                setState({ id: 'nationality', value: newValue });
              }}
            />
          </div>
          <div className='form-item'>
            <PhonesComponent
              country='ae'
              idRef='whatsappNumberRef'
              labelValue='whatsapp'
              translationPath={translationPath}
              value={state.whatsAppNumber}
              helperText={getErrorByName(schema, 'whatsAppNumber').message}
              error={getErrorByName(schema, 'whatsAppNumber').error}
              inputPlaceholder='whatsapp'
              isSubmitted={isSubmitted}
              onInputChanged={(value) => setState({ id: 'whatsAppNumber', value })}
            />
          </div>
          {!activeUserItem && (
            <>
              <div className='form-item'>
                <Inputs
                  inputPlaceholder='Username'
                  labelValue='Username'
                  idRef='usernameRef'
                  value={state.userName}
                  isWithError
                  isSubmitted={isSubmitted}
                  isLoading={isLoadingFields.username}
                  withLoader
                  helperText={getErrorByName(schema, 'userName').message}
                  error={getErrorByName(schema, 'userName').error}
                  onInputChanged={(event) =>
                    setState({ id: 'userName', value: event.target.value })}
                  translationPath={translationPath}
                />
              </div>
              <div className='form-item'>
                <PhonesComponent
                  country='ae'
                  idRef='phoneNumberRef'
                  labelValue='Mobile'
                  translationPath={translationPath}
                  value={state.phoneNumber}
                  helperText={getErrorByName(schema, 'phoneNumber').message}
                  error={getErrorByName(schema, 'phoneNumber').error}
                  inputPlaceholder='Mobile'
                  isSubmitted={isSubmitted}
                  isLoading={isLoadingFields.phoneNumber}
                  onInputChanged={(value) => setState({ id: 'phoneNumber', value })}
                />
              </div>
              <div className='form-item'>
                <Inputs
                  inputPlaceholder='Email'
                  labelValue='Email'
                  idRef='emailRef'
                  value={state.email}
                  isWithError
                  isSubmitted={isSubmitted}
                  helperText={getErrorByName(schema, 'email').message}
                  error={getErrorByName(schema, 'email').error}
                  isLoading={isLoadingFields.email}
                  withLoader
                  onInputChanged={(event) => setState({ id: 'email', value: event.target.value })}
                  translationPath={translationPath}
                />
              </div>
              <div className='form-item'>
                <Inputs
                  inputPlaceholder='Password'
                  labelValue='Password'
                  idRef='passwordRef'
                  value={state.password}
                  DisabledPaste
                  DisabledCopy
                  type='password'
                  isWithError
                  isSubmitted={isSubmitted}
                  helperText={getErrorByName(schema, 'password').message}
                  error={getErrorByName(schema, 'password').error}
                  onInputChanged={(event) =>
                    setState({ id: 'password', value: event.target.value })}
                  translationPath={translationPath}
                />
              </div>
              <div className='form-item'>
                <Inputs
                  inputPlaceholder='confirm-password'
                  labelValue='confirm-password'
                  idRef='confirmPasswordRef'
                  DisabledPaste
                  DisabledCopy
                  value={state.confirmPassword}
                  type='password'
                  isWithError
                  isSubmitted={isSubmitted}
                  helperText={getErrorByName(schema, 'confirmPassword').message}
                  error={getErrorByName(schema, 'confirmPassword').error}
                  onInputChanged={(event) =>
                    setState({ id: 'confirmPassword', value: event.target.value })}
                  translationPath={translationPath}
                />
                <div className='w-100 pb-130px'>
                  <ProgressComponet
                    inSameLine
                    value={
                      (state.password.match(strongStringRegex) && 100) ||
                      (state.password.match(mediumStringRegex) && 50) ||
                      (state.password !== '' && 25) ||
                      0
                    }
                    isTextColored
                    progressText={
                      (state.password.match(strongStringRegex) &&
                        `${translationPath}strong-password`) ||
                      (state.password.match(mediumStringRegex) &&
                        `${translationPath}medium-password`) ||
                      (state.password !== '' && `${translationPath}weak-password`) ||
                      `${translationPath}password-is-blank`
                    }
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
      // saveClasses='btns theme-solid bg-danger w-100 mb-0 mx-0 br-0'
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      translationPath={translationPath}
    />
  );
};

UserManagementDialog.propTypes = {
  activeUserItem: PropTypes.instanceOf(Object),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  UpdateAction: PropTypes.func.isRequired,
};
UserManagementDialog.defaultProps = {
  activeUserItem: undefined,
};

const mapStateToProps = (state) => {
  const {
    LoginReducer: { loginResponse },
  } = state;
  return {
    loginResponse,
  };
};

const mapDispatchToProps = (dispatch) => ({
  UpdateAction: bindActionCreators(
    // /LoginActions.update,
    dispatch
  ),
});

const store = connect(mapStateToProps, mapDispatchToProps)(UserManagementDialog);

export { store as UserManagementDialog };
