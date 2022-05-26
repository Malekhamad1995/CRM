import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import moment from 'moment';
import { Button, ButtonBase, Tooltip } from '@material-ui/core';
import {
  getErrorByName,
  GetParams,
  showError,
  showinfo,
  showSuccess,
} from '../../../../../Helper';
import { GlobalHistory } from '../../../../../Helper/Middleware.Helper';
import {
  CheckExistEmail,
  CheckExistPhone,
  CheckExistUserName,
  CreateOrganizationUser,
  EditOrganizationUserProfile,
  lookupItemsGetId,
  GetAllRolesByUserId,
  OrganizationUserSearch,
  GetUserId,
} from '../../../../../Services';
import {
  GetUserTeamsInfo,
  GetAllBranches,
  ActiveOrganizationUser,
  GetApplicationUserById,
} from '../../../../../Services/userServices';
import {
  emailExpression,
  mediumStringRegex,
  phoneExpression,
  strongStringRegex,
} from '../../../../../Utils/Expressions';
import Lookups from '../../../../../assets/json/StaticLookupsIds.json';
import {
  AutocompleteComponent,
  Inputs,
  PhonesComponent,
  ProgressComponet,
  DatePickerComponent,
} from '../../../../../Components/Controls';
import {
  PermissionsComponent,
  Spinner,
  UploaderComponentCircular,
} from '../../../../../Components';
import { TeamDetails } from '../Team/TeamDetails';

import { DefaultImagesEnum } from '../../../../../Enums';
import { useTitle } from '../../../../../Hooks';
import { AssignRoleDialog } from '../UserUtilties';
import { UserLoginPermissions } from '../../../../../Permissions';
import { ChangePasswordDialog } from './ChangePasswordDialog';

const translationPath = 'UsersManagementView.';
export const UserManagementView = () => {
  const searchTimer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const reducer2 = (state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    if (action.id === 'edit') {
      return {
        ...action.value,
      };
    }
  };

  const reducer = (select, action) => {
    if (action.id !== 'edit') return { ...select, [action.id]: action.value };
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
  const { t } = useTranslation('UsersView');
  const [isExistUsername, setIsExistUsername] = useState(null);
  const [isExistEmail, setIsExistEmail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [activeUserItem, setActiveUserItem] = useState(null);
  const [userTeamList, setUserTeamList] = useState([]);
  const [UserId, setuserId] = useState(null);
  const [isExistPhoneNumber, setIsExistPhoneNumber] = useState(null);
  const usernameExistTimer = useRef(null);
  const emailExistTimer = useRef(null);
  const phoneNumberExistTimer = useRef(null);
  const userDefault = {
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
    dateOfBirth: null,
    dateOfJoining: null,
    registrationNo: null,
    jobTitleId: null,
    branchId: null,
    reportsToId: null,
  };
  const [state, setState] = useReducer(reducer, userDefault);

  const [selected, setSelected] = useReducer(reducer2, {
    reportsTo: null,
    branch: null,
    jobTitle: null,
  });
  const [countries, setCountries] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [jobTitleList, setJobTitleList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpenRole, setIsOpenRole] = useState(false);
  const [usersResult, setUsersResult] = useState(null);
  // const [statePassword, setStatePassword
  // ] = useState({
  //   oldPassword: '',
  //   newPassword: '',
  //   confirmPassword: '',
  // });
  // const [Passwords, setPasswords] = useState({
  //   ViewOldPassword: '',
  //   ViewNewassword: '',
  //   ViewconfirmPassword: ''
  // });
  useTitle(t(`${translationPath}${userId ? 'edit-user' : 'add-user'}`));

  const schema = Joi.object({
    firstName: Joi.string()
      .regex(/^.*\S*.*$/)
      .trim()
      .required()
      .messages({
        'string.empty': t(`${translationPath}first-name-is-required`),
      }),
    // secondName: Joi.string()
    //   .regex(/^.*\S*.*$/)
    //   .trim()
    //   .required()
    //   .messages({
    //     "string.empty": t(`${translationPath}second-name-is-required`),
    //   }),
    lastName: Joi.string()
      .regex(/^.*\S*.*$/)
      .trim()
      .required()
      .messages({
        'string.empty': t(`${translationPath}last-name-is-required`),
      }),
    userName:
      (!userId &&
        Joi.string()
          .regex(/^.*\S*.*$/)
          .trim()
          .required()
          .custom(
            (value, helpers) =>
              (isExistUsername &&
                isExistUsername.isExist &&
                helpers.error('any.invalid')) ||
              value,
            `${translationPath}username-is-already-exist`
          )
          .messages({
            'any.invalid': t(`${translationPath}username-is-already-exist`),
            'string.empty': t(`${translationPath}username-is-required`),
          })) ||
      Joi.any(),
    email:
      (!userId &&
        Joi.string()
          .required()
          .regex(emailExpression)
          .custom(
            (value, helpers) =>
              (isExistEmail &&
                isExistEmail.isExist &&
                helpers.error('any.invalid')) ||
              value,
            t(`${translationPath}email-is-already-exist`)
          )
          .messages({
            'any.invalid': t(`${translationPath}email-is-already-exist`),
            'string.empty': t(`${translationPath}email-is-required`),
            'string.pattern.base': t(`${translationPath}invalid-email`),
          })) ||
      Joi.any(),
    password:
      (!userId &&
        Joi.string()
          .required()
          .messages({
            'string.empty': t(`${translationPath}password-is-required`),
          })) ||
      Joi.any(),
    confirmPassword:
      (!userId &&
        Joi.string()
          .required()
          .regex(new RegExp(`^${state.password}$`))
          .messages({
            'string.empty': t(`${translationPath}confirm-password-is-required`),
            'string.pattern.base': t(`${translationPath}password-not-matched`),
          })) ||
      Joi.any(),
    phoneNumber:
      (!userId &&
        Joi.string()
          .required()
          .regex(phoneExpression)
          .custom(
            (value, helpers) =>
              (isExistPhoneNumber &&
                isExistPhoneNumber.isExist &&
                helpers.error('any.invalid')) ||
              value,
            t(`${translationPath}mobile-number-is-already-exist`)
          )
          .messages({
            'any.invalid': t(
              `${translationPath}mobile-number-is-already-exist`
            ),
            'string.empty': t(`${translationPath}mobile-number-is-required`),
            'string.pattern.base': t(`${translationPath}invalid-mobile-number`),
          })) ||
      Joi.any(),
    whatsAppNumber:
      (!userId &&
        Joi.string()
          .required()
          .regex(phoneExpression)
          .messages({
            'string.empty': t(`${translationPath}whatsapp-number-is-required`),
            'string.pattern.base': t(
              `${translationPath}invalid-whatsapp-number`
            ),
          })) ||
      Joi.any(),
    nationality: Joi.object()
      .required()
      .messages({
        // 'any.required':  (`${translationPath}nationality-is-required`),
        'object.base': t(`${translationPath}nationality-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);

  // const schemaChangePassWord = Joi.object({
  //   oldPassword:
  //     Joi.string()
  //       .required()
  //       .messages({
  //         'string.empty': t(`${translationPath}password-is-required`),
  //       }) ||
  //     Joi.any(),
  //   newPassword:
  //     Joi.string()
  //       .required()
  //       .messages({
  //         'string.empty': t(`${translationPath}password-is-required`),
  //       }) ||
  //     Joi.any(),
  //   confirmPassword:
  //     Joi.string()
  //       .required()
  //       .regex(new RegExp(`^${statePassword.newPassword}$`))
  //       .messages({
  //         'string.empty': t(`${translationPath}confirm-password-is-required`),
  //         'string.pattern.base': t(`${translationPath}password-not-matched`),
  //       }) ||
  //     Joi.any(),
  // })
  //   .options({
  //     abortEarly: false,
  //     allowUnknown: true,
  //   })
  //   .validate(statePassword);

  const getNationalities = async () => {
    setIsLoading(true);
    const res = await lookupItemsGetId({
      lookupTypeId: Lookups.Country,
    });
    if (!(res && res.status && res.status !== 200)) setCountries(res || []);
    else setCountries([]);
    setIsLoading(false);
  };
  const getBranch = async () => {
    setIsLoading(true);
    const res = await GetAllBranches();
    if (!(res && res.status && res.status !== 200)) setBranchList(res || []);
    else setBranchList([]);
    setIsLoading(false);
  };
  const getJobTitle = async () => {
    setIsLoading(true);
    const res = await lookupItemsGetId({
      lookupTypeId: Lookups.JobTitle,
    });
    if (!(res && res.status && res.status !== 200)) setJobTitleList(res || []);
    else setJobTitleList([]);
    setIsLoading(false);
  };
  const getUserById = useCallback(
    async (userId) => {
      setIsLoading(true);
      const res = await GetApplicationUserById(userId);
      setActiveUserItem(res);
      setIsLoading(false);
    },
    [userId]
  );

  const getUserTemasById = useCallback(async () => {
    setIsLoading(true);
    const res = await GetUserTeamsInfo(userId);
    if (!(res && res.status && res.status !== 200)) {
      localStorage.setItem('userTeamsList', JSON.stringify(res));
      setUserTeamList(res);
    } else setUserTeamList([]);
    setIsLoading(false);
  }, [userId]);

  const getId = useCallback(async () => {
    setIsLoading(true);
    const res = await GetUserId(userId);
    if (!(res && res.status && res.status !== 200)) {
      localStorage.setItem('userid', JSON.stringify(res));
      setuserId(res);
    } else setuserId(null);
    setIsLoading(false);
  }, [userId]);

  const getUserRolesById = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllRolesByUserId(userId, 1, 30);
    setRoles((response && response.result) || []);
    setIsLoading(false);
  }, [userId]);
  const getIsExistUserName = useCallback(async () => {
    setIsLoadingFields((items) => ({ ...items, username: true }));
    const response = await CheckExistUserName(state.userName);
    setIsLoadingFields((items) => ({ ...items, username: false }));
    setIsExistUsername(response);
  }, [state.userName]);
  const getIsExistPhoneNumber = useCallback(async () => {
    setIsLoadingFields((items) => ({ ...items, phoneNumber: true }));
    const response = await CheckExistPhone(
      (!state.phoneNumber.startsWith('+') && `+${state.phoneNumber}`) ||
        state.phoneNumber
    );
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
    if (phoneNumberExistTimer.current)
      clearTimeout(phoneNumberExistTimer.current);
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
    if (
      state.phoneNumber &&
      state.phoneNumber !== '' &&
      state.phoneNumber.match(phoneExpression)
    )
      getExistPhoneNumberValidation();
  }, [getExistPhoneNumberValidation, state.phoneNumber]);

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (schema.error) {
      showError(t(`${translationPath}shared.please-fix-all-errors`));
      return;
    }
    setIsLoading(true);
    const saveDto = {
      ...state,
      phoneNumber:
        (state.phoneNumber &&
          !state.phoneNumber.startsWith('+') &&
          `+${state.phoneNumber}`) ||
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
      reportsTo: (state.reportsToId && selected.reportsTo && selected.reportsTo.fullName) || null,
      jobTitle: (state.jobTitleId && selected.jobTitle && selected.jobTitle.lookupItemName) || null,
      branch: (state.branchId && selected.branch && selected.branch.branchName) || null,
    };
    const res =
      (userId && (await EditOrganizationUserProfile(userId, saveDto))) ||
      (await CreateOrganizationUser(saveDto));
    setIsLoading(false);
    if (res && !(res.status && res.status !== 200)) {
      if (userId) showSuccess(t(`${translationPath}user-updated-successfully`));
      else showSuccess(t(`${translationPath}user-created-successfully`));
      if (JSON.parse(localStorage.getItem('session')).userId === userId) {
        const updatedState = JSON.parse(localStorage.getItem('session'));
        const update = { ...updatedState, profileImg: state.profileImg };
        localStorage.setItem('session', JSON.stringify(update));
        //   UpdateAction(update);
        // dispatch(LoginActions.update(update));
      }
      GlobalHistory.push('/home/Users');
    } else if (userId) showError(t(`${translationPath}user-update-failed`));
    else showError(t(`${translationPath}user-create-failed`));
  };
  const manageRolesClicked = () => {
    setIsOpenRole(true);
  };

  useEffect(() => {
    const editId = GetParams('id');
    if (editId !== null) setUserId(editId);
  }, []);
  useEffect(() => {
    if (activeUserItem) {
      const jobTitle = jobTitleList.find(
        (item) => item.lookupItemId === activeUserItem.jobTitleId
      );
      setSelected({ id: 'jobTitle', value: jobTitle || null });

      const branch = branchList.find(
        (item) => item.branchId === activeUserItem.branchId
      );
      setSelected({ id: 'branch', value: branch || null });

      const reportsTo = usersResult.find(
        (item) => item.id === activeUserItem.reportsToId
      );
      setSelected({ id: 'reportsTo', value: reportsTo || null });
      setState({
        id: 'edit',
        value: {
          ...activeUserItem,
          nationality:
            (activeUserItem &&
              activeUserItem.nationalityId &&
              countries.find(
                (item) =>
                  activeUserItem &&
                  item.lookupItemId === activeUserItem.nationalityId
              )) ||
            null,
          password: '',
          confirmPassword: '',
          whatsAppNumber: activeUserItem.whatsAppNumber || '',
          phoneNumber: activeUserItem.phoneNumber || '',
        },
      });
    }
  }, [activeUserItem, countries, jobTitleList, usersResult, branchList]);
  useEffect(() => {
    if (userId) {
      getUserById(userId);
      getUserRolesById();
      getUserTemasById();
      getId();
    }
  }, [getUserById, getUserRolesById, getUserTemasById, getId, userId]);

  useEffect(
    () => () => {
      if (usernameExistTimer.current) clearTimeout(usernameExistTimer.current);
      if (emailExistTimer.current) clearTimeout(emailExistTimer.current);
      if (phoneNumberExistTimer.current)
        clearTimeout(phoneNumberExistTimer.current);
    },
    []
  );
  const getAllUsers = useCallback(async (name) => {
    setIsLoading(true);
    const res = await OrganizationUserSearch({
      name: name || '',
      pageIndex: 0,
      pageSize: 10,
    });

    if (!(res && res.status && res.status !== 200)) {
      setAllUsers({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setAllUsers({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    setUsersResult((allUsers && allUsers.result) || []);
  });
  useEffect(() => {
    getNationalities();
    getBranch();
    getJobTitle();
  }, []);
  useEffect(() => {
    if (activeUserItem && activeUserItem.reportsTo)
      getAllUsers(activeUserItem.reportsTo);
    else getAllUsers();
  }, [activeUserItem]);
  const textArea = useRef(null);

  const copyTextToClipboard = (Id) => {
    const context = textArea.current;
    if (Id && context) {
      context.value = Id;
      context.select();
      document.execCommand('copy');
      showinfo(`${t('Shared:Copy-id-successfully')}  (${Id})`);
    } else
      showinfo(`${t('Shared:Copy-id-successfully')}  (${Id})`);
  };

  return (
    <div className='user-management-view view-wrapper'>
      <Spinner isActive={isLoading} />
      <form
        noValidate
        onSubmit={saveHandler}
        className='management-form-content'
      >
        <div className='view-management-header mb-2 px-2'>
          {userId && (
            <PermissionsComponent
              permissionsList={Object.values(UserLoginPermissions)}
              permissionsId={
                UserLoginPermissions.AdminChangePassword.permissionsId
              }
            >
              <Button
                className='btns theme-solid mx-2 mb-2'
                onClick={() => setOpenChangePassword(true)}
              >
                <span className='mdi mdi-form-textbox-password   mx-1 ' />
                <span className=' mx-1 '>
                  {' '}
                  {t('UsersManagementView.change-password')}
                  {' '}
                </span>
              </Button>
            </PermissionsComponent>
          )}

          <Button type='submit' className='btns theme-solid mx-2 mb-2'>
            {(userId && (
              <span className='mdi mdi-content-save-outline   mx-1 ' />
            )) || <span className='mdi mdi-plus   mx-1 ' />}

            <span>
              {' '}
              {t(
                `${translationPath}${(userId && 'edit-user') || 'add-new-user'}`
              )}
            </span>
          </Button>
          <Button
            className='btns theme-solid bg-cancel mb-2 mx-2'
            onClick={() => {
              GlobalHistory.push('/home/Users');
              localStorage.removeItem('userTeamsList');
            }}
          >
            <span>
              {' '}
              {t(`${translationPath}cancel`)}
            </span>
          </Button>
        </div>
        <div className='body-content'>
          <div className='container'>
            <div className='information-section'>
              <div className='information-box-wrapper'>
                <div className='information-section-content'>
                  <div className='image-wrapper'>
                    <UploaderComponentCircular
                      idRef='profileImgRef'
                      circleDefaultImage={DefaultImagesEnum.man.defaultImg}
                      initUploadedFiles={
                        (state &&
                          state.profileImg && [
                            { uuid: state.profileImg, fileName: 'user-image' },
                          ]) ||
                        []
                      }
                      uploadedChanged={(files) =>
                        setState({
                          id: 'profileImg',
                          value: (files.length > 0 && files[0].uuid) || null,
                        })}
                    />
                  </div>
                  {userId && activeUserItem && (
                    <div className='information-content-wrapper'>
                      <div className='fullName'>
                        <div className='fullName-wrapper'>
                          <span className='fz-30px'>
                            {activeUserItem.fullName}
                          </span>
                        </div>
                        <div className='mb-2 userId'>
                          <span className='fw-bold'>
                            <span>User Id:</span>
                            <span className='px-2'>{UserId}</span>
                            <textarea
                              readOnly
                              aria-disabled
                              value={UserId}
                              ref={textArea}
                            />
                          </span>
                          <Tooltip title='Copy'>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                copyTextToClipboard(UserId);
                              }}
                              className='mdi mdi-content-copy'
                            />
                          </Tooltip>
                        </div>
                      </div>
                      <div className='mb-2'>
                        <span className='fw-bold'>
                          <span>
                            {t(`${translationPath}Username`)}
                            :
                          </span>
                          <span className='px-2'>
                            {activeUserItem.userName}
                          </span>
                        </span>
                      </div>

                      <div className='roles-wrapper'>
                        <div className='roles-content'>
                          {roles.map((item, index) => (
                            <span
                              key={`userRolesRef${index + 1}`}
                              className='px-1'
                            >
                              <span>{item.roles.rolesName}</span>
                              {index < roles.length - 1 && <span>,</span>}
                            </span>
                          ))}
                        </div>
                        <PermissionsComponent
                          permissionsList={Object.values(UserLoginPermissions)}
                          permissionsId={
                            UserLoginPermissions.AddRole.permissionsId
                          }
                        >
                          <ButtonBase
                            className='btns theme-outline roles-button'
                            onClick={manageRolesClicked}
                          >
                            <span>{t(`${translationPath}manage-roles`)}</span>
                            <span className='mdi mdi-menu-swap' />
                          </ButtonBase>
                        </PermissionsComponent>
                      </div>
                    </div>
                  )}
                  {!userId && (
                    <div className='information-content-wrapper'>
                      <div className='form-item'>
                        <Inputs
                          inputPlaceholder='InputsFirstName'
                          labelValue='FirstName'
                          idRef='firstNameRef'
                          value={state.firstName || ''}
                          isWithError
                          parentTranslationPath='UsersView'
                          translationPath={translationPath}
                          isSubmitted={isSubmitted}
                          helperText={
                            getErrorByName(schema, 'firstName').message
                          }
                          error={getErrorByName(schema, 'firstName').error}
                          onInputChanged={(event) =>
                            setState({
                              id: 'firstName',
                              value: event.target.value,
                            })}
                        />
                      </div>
                      <div className='form-item'>
                        <Inputs
                          inputPlaceholder='InputsSecondName'
                          labelValue='SecondName'
                          idRef='secondNameRef'
                          value={state.secondName || ''}
                          parentTranslationPath='UsersView'
                          translationPath={translationPath}
                          isWithError
                          isSubmitted={isSubmitted}
                          helperText={
                            getErrorByName(schema, 'secondName').message
                          }
                          error={getErrorByName(schema, 'secondName').error}
                          onInputChanged={(event) =>
                            setState({
                              id: 'secondName',
                              value: event.target.value,
                            })}
                        />
                      </div>
                      <div className='form-item'>
                        <Inputs
                          inputPlaceholder='InputslastName'
                          labelValue='LastName'
                          idRef='lastNameRef'
                          value={state.lastName || ''}
                          isWithError
                          parentTranslationPath='UsersView'
                          translationPath={translationPath}
                          isSubmitted={isSubmitted}
                          helperText={
                            getErrorByName(schema, 'lastName').message
                          }
                          error={getErrorByName(schema, 'lastName').error}
                          onInputChanged={(event) =>
                            setState({
                              id: 'lastName',
                              value: event.target.value,
                            })}
                        />
                      </div>
                      <div className='form-item'>
                        <AutocompleteComponent
                          idRef='nationalityRef'
                          labelValue={t(`${translationPath}nationality-req`)}
                          inputPlaceholder={t(
                            `${translationPath}InputsNationality`
                          )}
                          defaultValue={[]}
                          value={state.nationality}
                          data={countries}
                          chipsLabel={(option) =>
                            (option.lookupItemName && option.lookupItemName) ||
                            ''}
                          displayLabel={(option) =>
                            (option.lookupItemName && option.lookupItemName) ||
                            ''}
                          multiple={false}
                          withoutSearchButton
                          helperText={
                            getErrorByName(schema, 'nationality').message
                          }
                          error={getErrorByName(schema, 'nationality').error}
                          isWithError
                          isSubmitted={isSubmitted}
                          onChange={(event, newValue) => {
                            setState({ id: 'nationality', value: newValue });
                          }}
                        />
                      </div>
                      <div className='form-item'>
                        <AutocompleteComponent
                          idRef='branchRef'
                          labelValue={t(`${translationPath}branch-req`)}
                          inputPlaceholder={t(
                            `${translationPath}InputsJobTitle`
                          )}
                          value={state.branch}
                          data={branchList}
                          chipsLabel={(option) =>
                            (option.branchName && option.branchName) || ''}
                          displayLabel={(option) =>
                            (option.branchName && option.branchName) || ''}
                          multiple={false}
                          withoutSearchButton
                          isWithError
                          isSubmitted={isSubmitted}
                          onChange={(event, newValue) => {
                            setState({
                              id: 'branchId',
                              value: (newValue && newValue.branchId) || null,
                            });
                            setSelected({ id: 'branch', value: newValue });
                          }}
                        />
                      </div>
                      <div className='form-item'>
                        <AutocompleteComponent
                          idRef='jobTitleRef'
                          labelValue={t(`${translationPath}jobTitle-req`)}
                          inputPlaceholder={t(
                            `${translationPath}InputsJobTitle`
                          )}
                          value={state.jobTitle}
                          data={jobTitleList}
                          chipsLabel={(option) =>
                            (option.lookupItemName && option.lookupItemName) ||
                            ''}
                          displayLabel={(option) =>
                            (option.lookupItemName && option.lookupItemName) ||
                            ''}
                          multiple={false}
                          withoutSearchButton
                          isWithError
                          isSubmitted={isSubmitted}
                          onChange={(event, newValue) => {
                            setState({
                              id: 'jobTitleId',
                              value: newValue.lookupItemId,
                            });
                            setSelected({ id: 'jobTitle', value: newValue });
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {userId && activeUserItem && (
                  <div className='information-section-footer'>
                    <div className='separator-h' />
                    <div className='footer-content-wrapper'>
                      <div className='footer-section'>
                        <div className='section-item'>
                          <span className='mdi mdi-cellphone-android' />
                          <span className='px-2'>
                            {activeUserItem.phoneNumber || 'N/A'}
                          </span>
                        </div>
                        <div className='section-item'>
                          <span className='mdi mdi-email-outline' />
                          <span className='px-2'>
                            {activeUserItem.email || 'N/A'}
                          </span>
                        </div>
                        <div className='section-item'>
                          <span className='mdi mdi-whatsapp' />
                          <span className='px-2'>
                            {activeUserItem.whatsAppNumber || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className='footer-section'>
                        <div className='section-item'>
                          <span className='mdi mdi-map-marker-outline' />
                          <span className='px-2'>
                            {' '}
                            {t(`${translationPath}nationality`)}
                            {' '}
                            :
                          </span>
                          <span>
                            {(activeUserItem.nationalityId &&
                              countries.find(
                                (item) =>
                                  item.lookupItemId ===
                                  activeUserItem.nationalityId
                              ) &&
                              countries.find(
                                (item) =>
                                  item.lookupItemId ===
                                  activeUserItem.nationalityId
                              ).lookupItemName) ||
                              'N/A'}
                          </span>
                        </div>
                        <div className='section-item'>
                          <span className='mdi mdi-calendar' />
                          <span className='px-2'>
                            {' '}
                            {t(`${translationPath}register`)}
                            :
                          </span>
                          <span>
                            {(activeUserItem.createdOn &&
                              moment(activeUserItem.createdOn)
                                .locale(i18next.language)
                                .format('DD, MMM YYYY')) ||
                              'N/A'}
                          </span>
                        </div>
                        <div className='section-item'>
                          <span className='mdi mdi-handshake' />
                          <span className='px-2'>
                            {t(`${translationPath}data-source`)}
                            {' '}
                            :
                          </span>
                          <span>{activeUserItem.dataSource || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {userTeamList && userTeamList.length > 0 && (
              <div className='team'>
                <div className='team-header'>
                  {t(`${translationPath}teams`)}
                </div>
                <div className='team-scroll'>
                  <div className='team-section'>
                    <TeamDetails />
                  </div>
                </div>
              </div>
            )}
          </div>

          {!userId && (
            <div className='account-dialog-section'>
              <div className='dialog-header'>
                {t(`${translationPath}account-details`)}
                {' '}
              </div>
              <div className='dialog-body'>
                <div className='form-item'>
                  <Inputs
                    inputPlaceholder='InputsUsername'
                    labelValue='Username-req'
                    idRef='usernameRef'
                    value={state.userName}
                    parentTranslationPath='UsersView'
                    translationPath={translationPath}
                    isWithError
                    isSubmitted={isSubmitted}
                    isLoading={isLoadingFields.username}
                    withLoader
                    helperText={getErrorByName(schema, 'userName').message}
                    error={getErrorByName(schema, 'userName').error}
                    afterIconClasses={
                      (!isLoadingFields.username &&
                        ((isExistUsername &&
                          isExistUsername.isExist &&
                          'mdi mdi-close-outline c-danger mt-1') ||
                          (!getErrorByName(schema, 'userName').error &&
                            'mdi mdi-check-outline c-success mt-1'))) ||
                      null
                    }
                    onInputChanged={(event) =>
                      setState({ id: 'userName', value: event.target.value })}
                  />
                </div>
                <div className='form-item'>
                  <Inputs
                    inputPlaceholder='InputsEmail'
                    idRef='emailRef'
                    value={state.email || ''}
                    isWithError
                    parentTranslationPath='UsersView'
                    translationPath={translationPath}
                    isSubmitted={isSubmitted}
                    helperText={getErrorByName(schema, 'email').message}
                    error={getErrorByName(schema, 'email').error}
                    isLoading={isLoadingFields.email}
                    withLoader
                    onInputChanged={(event) =>
                      setState({ id: 'email', value: event.target.value })}
                    labelValue='Email-req'
                    afterIconClasses={
                      (!isLoadingFields.email &&
                        ((isExistEmail &&
                          isExistEmail.isExist &&
                          'mdi mdi-close-outline c-danger mt-1') ||
                          (!getErrorByName(schema, 'email').error &&
                            'mdi mdi-check-outline c-success mt-1'))) ||
                      null
                    }
                  />
                </div>
                <div className='form-item'>
                  <PhonesComponent
                    country='ae'
                    idRef='phoneNumberRef'
                    labelValue={t(`${translationPath}Mobile-req`)}
                    value={state.phoneNumber}
                    helperText={getErrorByName(schema, 'phoneNumber').message}
                    error={getErrorByName(schema, 'phoneNumber').error}
                    inputPlaceholder='Mobile'
                    isSubmitted={isSubmitted}
                    isLoading={isLoadingFields.phoneNumber}
                    afterIconClasses={
                      (!isLoadingFields.phoneNumber &&
                        ((isExistPhoneNumber &&
                          isExistPhoneNumber.isExist &&
                          'mdi mdi-close-outline c-danger mt-1') ||
                          (!getErrorByName(schema, 'phoneNumber').error &&
                            'mdi mdi-check-outline c-success mt-1'))) ||
                      null
                    }
                    onInputChanged={(value) =>
                      setState({ id: 'phoneNumber', value })}
                  />
                </div>
                <div className='form-item'>
                  <PhonesComponent
                    country='ae'
                    idRef='whatsappNumberRef'
                    labelValue={t(`${translationPath}whatsapp-req`)}
                    value={state.whatsAppNumber}
                    helperText={
                      getErrorByName(schema, 'whatsAppNumber').message
                    }
                    error={getErrorByName(schema, 'whatsAppNumber').error}
                    inputPlaceholder='whatsapp'
                    isSubmitted={isSubmitted}
                    onInputChanged={(value) =>
                      setState({ id: 'whatsAppNumber', value })}
                  />
                </div>
                <div className='form-item'>
                  <DatePickerComponent
                    idRef='DateOfBirthRef'
                    labelValue='Date Of Birth'
                    // translationPath={translationPath}
                    // parentTranslationPath='UsersView'
                    // labelValue={t(`${translationPath}nationality-req`)}
                    placeholder='DD/MM/YYYY'
                    value={state.dateOfBirth || null}
                    onDateChanged={(newValue) => {
                      setState({
                        id: 'dateOfBirth',
                        value:
                          (newValue &&
                            moment(newValue).format('YYYY-MM-DDTHH:mm:ss')) ||
                          null,
                      });
                    }}
                  />
                </div>
                <div className='form-item'>
                  <DatePickerComponent
                    idRef='DateOfJoiningRef'
                    labelValue='Date of Joining'
                    // translationPath={translationPath}
                    // parentTranslationPath='UsersView'
                    // labelValue={t(`${translationPath}nationality-req`)}
                    placeholder='DD/MM/YYYY'
                    value={state.dateOfJoining || null}
                    onDateChanged={(newValue) => {
                      setState({
                        id: 'dateOfJoining',
                        value:
                          (newValue &&
                            moment(newValue).format('YYYY-MM-DDTHH:mm:ss')) ||
                          null,
                      });
                    }}
                  />
                </div>
                <div className='form-item'>
                  <AutocompleteComponent
                    idRef='RegistrationNoRef'
                    labelValue='Reports To'
                    inputPlaceholder='Reports To'
                    value={state.reportsTo}
                    data={usersResult || []}
                    chipsLabel={(option) =>
                      (option && option.fullName) ||
                      (option && option.firstName) ||
                      ''}
                    displayLabel={(option) =>
                      (option && option.fullName) ||
                      (option && option.firstName) ||
                      ''}
                    multiple={false}
                    withoutSearchButton
                    onChange={(event, newValue) => {
                      setState({
                        id: 'reportsToId',
                        value: (newValue && newValue.id) || null,
                      });
                      setSelected({ id: 'reportsTo', value: newValue });
                    }}
                    onInputKeyUp={(e) => {
                      const { value } = e.target;
                      if (searchTimer.current)
                        clearTimeout(searchTimer.current);
                      searchTimer.current = setTimeout(() => {
                        getAllUsers(value);
                      }, 700);
                    }}
                  />
                </div>
                <div className='form-item'>
                  <Inputs
                    labelValue='Registration No'
                    inputPlaceholder='RegistrationNo'
                    idRef='RegistrationNoRef'
                    value={state.registrationNo}
                    onInputChanged={(event) =>
                      setState({
                        id: 'registrationNo',
                        value: event.target.value,
                      })}
                  />
                </div>
                <div className='form-item'>
                  <Inputs
                    inputPlaceholder='InputsPassword'
                    labelValue='Password'
                    idRef='passwordRef'
                    value={state.password}
                    parentTranslationPath='UsersView'
                    translationPath={translationPath}
                    isWithError
                    type='password'
                    isSubmitted={isSubmitted}
                    helperText={getErrorByName(schema, 'password').message}
                    error={getErrorByName(schema, 'password').error}
                    onInputChanged={(event) =>
                      setState({ id: 'password', value: event.target.value })}
                  />
                </div>
                <div className='form-item'>
                  <Inputs
                    inputPlaceholder={t(
                      `${translationPath}Inputsconfirm-password`
                    )}
                    labelValue={t(`${translationPath}confirm-password`)}
                    idRef='confirmPasswordRef'
                    value={state.confirmPassword}
                    type='password'
                    isWithError
                    isDisabled={state.password === ''}
                    isSubmitted={isSubmitted}
                    helperText={
                      getErrorByName(schema, 'confirmPassword').message
                    }
                    error={getErrorByName(schema, 'confirmPassword').error}
                    onInputChanged={(event) =>
                      setState({
                        id: 'confirmPassword',
                        value: event.target.value,
                      })}
                  />
                </div>

                <div className='w-100 pb-130px mb-3'>
                  <ProgressComponet
                    inSameLine
                    value={
                      (state.password.match(strongStringRegex) && 100) ||
                      (state.password.match(mediumStringRegex) && 50) ||
                      (state.password !== '' && 25) ||
                      0
                    }
                    isTextColored
                    themeClasses='theme-gradient'
                    progressText={
                      (state.password.match(strongStringRegex) &&
                        t(`${translationPath}trong-password`)) ||
                      (state.password.match(mediumStringRegex) &&
                        `${translationPath}medium-password`) ||
                      (state.password !== '' &&
                        t(`${translationPath}weak-password`)) ||
                      t(`${translationPath}password-is-blank`)
                    }

                    // progressText={
                    //   (state.password.match(strongStringRegex) &&
                    //   (t(`${translationPath}strong-password`))||
                    //   (state.password.match(mediumStringRegex) &&
                    //     `${translationPath}medium-password`) ||
                    //   (state.password !== '' &&      (t(`${translationPath}weak-password`))) ||
                    //
                    // }
                  />
                </div>
              </div>
            </div>
          )}
          {userId && (
            <div className='account-dialog-section'>
              <div className='dialog-header'>
                {' '}
                {t(`${translationPath}profile-details`)}
              </div>
              <div className='dialog-body'>
                <div className='form-item'>
                  <Inputs
                    inputPlaceholder='FirstName'
                    idRef='firstNameRef'
                    value={state.firstName || ''}
                    isWithError
                    isSubmitted={isSubmitted}
                    helperText={getErrorByName(schema, 'firstName').message}
                    error={getErrorByName(schema, 'firstName').error}
                    onInputChanged={(event) =>
                      setState({ id: 'firstName', value: event.target.value })}
                    labelValue={t(`${translationPath}FirstName`)}
                  />
                </div>
                <div className='form-item'>
                  <Inputs
                    inputPlaceholder='SecondName'
                    labelValue={t(`${translationPath}SecondName`)}
                    idRef='secondNameRef'
                    value={state.secondName || ''}
                    isWithError
                    isSubmitted={isSubmitted}
                    helperText={getErrorByName(schema, 'secondName').message}
                    error={getErrorByName(schema, 'secondName').error}
                    onInputChanged={(event) =>
                      setState({ id: 'secondName', value: event.target.value })}
                  />
                </div>
                <div className='form-item'>
                  <Inputs
                    inputPlaceholder='LastName'
                    labelValue={t(`${translationPath}LastName`)}
                    idRef='lastNameRef'
                    value={state.lastName || ''}
                    isWithError
                    isSubmitted={isSubmitted}
                    helperText={getErrorByName(schema, 'lastName').message}
                    error={getErrorByName(schema, 'lastName').error}
                    onInputChanged={(event) =>
                      setState({ id: 'lastName', value: event.target.value })}
                  />
                </div>
                <div className='form-item'>
                  <Inputs
                    labelValue={t(`${translationPath}Email`)}
                    inputPlaceholder={t(`${translationPath}Email`)}
                    idRef='emailRef'
                    value={state.email}
                    isWithError
                    isSubmitted={isSubmitted}
                    helperText={getErrorByName(schema, 'email').message}
                    error={getErrorByName(schema, 'email').error}
                    isLoading={isLoadingFields.email}
                    withLoader
                    onInputChanged={(event) =>
                      setState({ id: 'email', value: event.target.value })}
                  />
                </div>
                <div className='form-item'>
                  <PhonesComponent
                    country='ae'
                    idRef='MobileRef'
                    labelValue={t(`${translationPath}Mobile`)}
                    value={state.phoneNumber}
                    helperText={getErrorByName(schema, 'phoneNumber').message}
                    error={getErrorByName(schema, 'phoneNumber').error}
                    inputPlaceholder='whatsapp'
                    isSubmitted={isSubmitted}
                    onInputChanged={(value) =>
                      setState({ id: 'phoneNumber', value })}
                  />
                </div>
                <div className='form-item'>
                  <PhonesComponent
                    country='ae'
                    idRef='whatsappNumberRef'
                    labelValue={t(`${translationPath}whatsapp`)}
                    value={state.whatsAppNumber}
                    helperText={
                      getErrorByName(schema, 'whatsAppNumber').message
                    }
                    error={getErrorByName(schema, 'whatsAppNumber').error}
                    inputPlaceholder='whatsapp'
                    isSubmitted={isSubmitted}
                    onInputChanged={(value) =>
                      setState({ id: 'whatsAppNumber', value })}
                  />
                </div>

                <div className='form-item'>
                  <AutocompleteComponent
                    idRef='nationality2Ref'
                    labelValue={t(`${translationPath}nationality-req`)}
                    selectedValues={state.nationality}
                    inputPlaceholder='nationality'
                    value={state.nationality}
                    data={countries}
                    chipsLabel={(option) =>
                      (option.lookupItemName && option.lookupItemName) || ''}
                    displayLabel={(option) =>
                      (option.lookupItemName && option.lookupItemName) || ''}
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
                  <AutocompleteComponent
                    idRef='branch2Ref'
                    labelValue={t(`${translationPath}branch-req`)}
                    selectedValues={selected.branch}
                    inputPlaceholder={t(`${translationPath}InputsBranch`)}
                    defaultValue={[]}
                    data={branchList}
                    chipsLabel={(option) =>
                      (option.branchName && option.branchName) || ''}
                    displayLabel={(option) =>
                      (option.branchName && option.branchName) || ''}
                    multiple={false}
                    withoutSearchButton
                    onChange={(event, newValue) => {
                      setState({
                        id: 'branchId',
                        value: (newValue && newValue.branchId) || null,
                      });
                      setSelected({ id: 'branch', value: newValue });
                    }}
                  />
                </div>
                <div className='form-item'>
                  <AutocompleteComponent
                    idRef='jobTitle2Ref'
                    labelValue={t(`${translationPath}jobTitle-req`)}
                    inputPlaceholder={t(`${translationPath}InputsJobTitle`)}
                    selectedValues={selected.jobTitle}
                    data={jobTitleList}
                    chipsLabel={(option) =>
                      (option.lookupItemName && option.lookupItemName) || ''}
                    displayLabel={(option) =>
                      (option.lookupItemName && option.lookupItemName) || ''}
                    multiple={false}
                    withoutSearchButton
                    onChange={(event, newValue) => {
                      setState({
                        id: 'jobTitleId',
                        value: (newValue && newValue.lookupItemId) || null,
                      });
                      setSelected({ id: 'jobTitle', value: newValue });
                    }}
                  />
                </div>
                <div className='form-item'>
                  <DatePickerComponent
                    idRef='DateOfBirthRef'
                    labelValue='Date Of Birth'
                    // translationPath={translationPath}
                    // parentTranslationPath='UsersView'
                    // labelValue={t(`${translationPath}nationality-req`)}
                    placeholder='DD/MM/YYYY'
                    value={state.dateOfBirth || null}
                    onDateChanged={(newValue) => {
                      setState({
                        id: 'dateOfBirth',
                        value:
                          (newValue &&
                            moment(newValue).format('YYYY-MM-DDTHH:mm:ss')) ||
                          null,
                      });
                    }}
                  />
                </div>
                <div className='form-item'>
                  <DatePickerComponent
                    idRef='DateOfJoiningRef'
                    labelValue='Date of Joining'
                    // translationPath={translationPath}
                    // parentTranslationPath='UsersView'
                    // labelValue={t(`${translationPath}nationality-req`)}
                    placeholder='DD/MM/YYYY'
                    value={state.dateOfJoining || null}
                    onDateChanged={(newValue) => {
                      setState({
                        id: 'dateOfJoining',
                        value:
                          (newValue &&
                            moment(newValue).format('YYYY-MM-DDTHH:mm:ss')) ||
                          null,
                      });
                    }}
                  />
                </div>
                <div className='form-item'>
                  <AutocompleteComponent
                    idRef='RegistrationNo2Ref'
                    labelValue='Reports To'
                    inputPlaceholder='Reports To'
                    selectedValues={selected.reportsTo}
                    value={state.reportsTo}
                    data={usersResult || []}
                    chipsLabel={(option) =>
                      (option && option.fullName) ||
                      (option && option.firstName) ||
                      ''}
                    displayLabel={(option) =>
                      (option && option.fullName) ||
                      (option && option.firstName) ||
                      ''}
                    multiple={false}
                    withoutSearchButton
                    onChange={(event, newValue) => {
                      setState({
                        id: 'reportsToId',
                        value: (newValue && newValue.id) || null,
                      });
                      setSelected({ id: 'reportsTo', value: newValue });
                    }}
                    onInputKeyUp={(e) => {
                      const { value } = e.target;
                      if (searchTimer.current)
                        clearTimeout(searchTimer.current);
                      searchTimer.current = setTimeout(() => {
                        getAllUsers(value);
                      }, 700);
                    }}
                  />
                </div>
                <div className='form-item'>
                  <Inputs
                    labelValue='Registration No'
                    inputPlaceholder='RegistrationNo'
                    idRef='RegistrationNoRef'
                    value={state.registrationNo}
                    onInputChanged={(event) =>
                      setState({
                        id: 'registrationNo',
                        value: event.target.value,
                      })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
      {activeUserItem && userId && (
        <AssignRoleDialog
          userFullName={activeUserItem.fullName || ''}
          userId={userId}
          isOpen={isOpenRole}
          selectedUserRoles={roles && roles.map((item) => item.roles)}
          isOpenChanged={() => {
            setIsOpenRole(false);
          }}
          reloadData={() => {
            getUserRolesById();
          }}
        />
      )}
      {openChangePassword && userId && (
        <ChangePasswordDialog
          open={openChangePassword}
          close={() => {
            setOpenChangePassword(false);
          }}
          onSave={() => {
            // setOpenDialog(false);
            // reload data
            // reloadData();
          }}
          userId={userId}
        />
      )}
    </div>
  );
};
