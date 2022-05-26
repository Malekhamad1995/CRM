import React, {
  useCallback, useState, useReducer
} from 'react';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  ButtonBase,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { useHistory } from 'react-router';
import { QuickAddContact } from '../../../../../../../../../Services/ContactsServices';
import {
  showError,
  showSuccess,
  getErrorByName,
  GlobalHistory,
} from '../../../../../../../../../Helper';
import {
  emailExpression,
  phoneExpression,
} from '../../../../../../../../../Utils/Expressions';

import { Inputs, Spinner } from '../../../../../../../../../Components';
import { TitleComponent } from './Components/TitleComponent';
import { PhoneNumberComponent } from './Components/PhoneNumberComponent';
import { EmailAddressComponent } from './Components/EmailAddressComponent';
import { NationalityComponent } from './Components/NationalityComponent';
import { DistrictComponent } from './Components/DistrictComponent';
import { CountryComponent } from './Components/CountryComponent';
import { CityComponent } from './Components/CityComponent';
import { CommunityComponent } from './Components/CommunityComponent';

export const AddContactDialog = ({
  parentTranslationPath,
  translationPath,
  open,
  close,
}) => {
  const { t } = useTranslation([parentTranslationPath]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isInValidSalutation, setIsInValidSalutation] = useState(false);
  const history = useHistory();
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit')
      return { ...state, [action.id]: action.value };
  }, []);

  const [cityList, setCityList] = useState(false);
  const [districtList, setDistrictList] = useState([]);
  const [communityList, setCommunityList] = useState([]);

  const [state, setState] = useReducer(reducer, {
    contactsTypeId: 1,
    firstName: '',
    lastName: '',
    salutationId: '',
    emailAddress: [],
    phoneNumber: [],
    nationalityId: '',
    countryId: 0,
    cityId: 0,
    districtId: 0,
    communityId: 0,
    postalZipCode: '',
  });

  const [selected, setSelected] = useReducer(reducer, {
    Title: null,
    AssignedTo: null,
    Nationality: null,
    Country: null,
    City: null,
    District: null,
    Community: null,
  });

  const schema = Joi.object({
    // salutationId: Joi.number()
    //   .required()
    //   .messages({
    //     "number.base": t(`${translationPath}salutation-is-required`),
    //     "number.empty": t(`${translationPath}salutation-is-required`),
    //   }),
    firstName: Joi.string()
      .required()
      .messages({
        'string.base': t`${translationPath}firstName-is-required`,
        'string.empty': t`${translationPath}firstName-is-required`,
      }),

    lastName: Joi.string()
      .required()
      .messages({
        'string.base': t`${translationPath}lastName-is-required`,
        'string.empty': t`${translationPath}lastName-is-required`,
      }),

    nationalityId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}nationality-is-required`),
        'number.empty': t(`${translationPath}nationality-is-required`),
      }),

    emailAddress: Joi.array()
      .items(
        Joi.string().optional().allow('')
          .regex(emailExpression)
          .messages({
            'string.pattern.base': t(`${translationPath}invalid-email`),
          })
      ),
    //
    //   .required()
    //   .min(1)
    //   .messages({
    //     'array.base': t(`${translationPath}emailAddress-is-required`),
    //     'array.empty': t(`${translationPath}emailAddress-is-is-required`),
    //     'array.min': t(
    //       `${translationPath}should-have-a-minimum-one-of-email-address`
    //     ),
    //   }),

    phoneNumber: Joi.array()
      .items(
        Joi.string()
          //.regex(phoneExpression)
           .messages({
             'string.pattern.base': t(`${translationPath}invalid-mobile-number`),
             'string.base': t(`${translationPath}phoneNumber-is-required`),
             'string.empty': t(`${translationPath}phoneNumber-is-required`),
          })
      )
      .required()
      .min(1)
      .messages({
        'array.base': t(`${translationPath}phoneNumber-is-required`),
        'array.empty': t(`${translationPath}phoneNumber-is-required`),
        'array.min': t(
          `${translationPath}should-have-a-minimum-one-of-phone-number`
        ),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);

  const saveHandler = useCallback(async (isContinue) => {
    setIsLoading(true);
    setIsSubmitted(true);
    if (!state.salutationId)
      setIsInValidSalutation(true);


    if (schema.error || isInValidSalutation) {
      showError(t('Shared:please-fix-all-errors'));
      setIsLoading(false);
      return;
    }

    const result = await QuickAddContact(state);
    if (!(result && result.data)) {
      if (isContinue)
        history.push(`/home/Contacts-CRM/contact-profile-edit?formType=1&id=${result.contactId}`);
      showSuccess(t`${translationPath}AddContactSuccessfully`);
      close();
    } else showError(t('Shared:please-fix-all-errors'));
    setIsLoading(false);
  }, [schema.error, state]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          close();
        }}
        className='activities-management-dialog-wrapper'
      >
        <form noValidate>
          <DialogTitle id='alert-dialog-slide-title'>
            {t(`${translationPath}AddNewcontact`)}
          </DialogTitle>
          <DialogContent>
            <div className='dialog-content-wrapper'>
              <Spinner isActive={isLoading} isAbsolute />
              <div className='title-wrapper'>
                <span className='title-text'>
                  {t(`${translationPath}MainInfo`)}
                </span>
              </div>

              <div className='reminder-wrapper'>
                <div className='reminder-item-wrapper'>
                  <div className='reminder-section-20'>
                    <TitleComponent
                      labelClasses='Requierd-Color'
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      salutationId={state.salutationId}
                      selected={selected}
                      setSelected={(event) => {
                        setSelected({
                          id: 'Title',
                          value: event || null,
                        });
                      }}
                      setSalutationId={(event) => {
                        setState({
                          id: 'salutationId',
                          value: event || null,
                        });
                      }}
                      isSubmitted={isSubmitted}
                      helperText={
                        getErrorByName(schema, 'salutationId').message
                      }
                      error={getErrorByName(schema, 'salutationId').error}
                      isInValidSalutation={isInValidSalutation}
                      setIsInValidSalutation={setIsInValidSalutation}
                    />
                  </div>
                  <div className='reminder-section-30'>
                    <Inputs
                      labelClasses='Requierd-Color'
                      idRef='firstNameRef'
                      labelValue='firstName'
                      value={state.firstName}
                      isWithError
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      onInputChanged={(e) => {
                        setState({
                          id: 'firstName',
                          value: e.target.value || null,
                        });
                      }}
                      isSubmitted={isSubmitted}
                      helperText={getErrorByName(schema, 'firstName').message}
                      error={getErrorByName(schema, 'firstName').error}
                    />
                  </div>
                  <div className='reminder-section-50'>
                    <Inputs
                      value={state.lastName}
                      idRef='lastNameRef'
                      labelClasses='Requierd-Color'
                      labelValue='lastName'
                      isWithError
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      onInputChanged={(e) => {
                        setState({
                          id: 'lastName',
                          value: e.target.value || null,
                        });
                      }}
                      isSubmitted={isSubmitted}
                      helperText={getErrorByName(schema, 'lastName').message}
                      error={getErrorByName(schema, 'lastName').error}
                    />
                  </div>
                </div>
              </div>

              <div className='dialog-content-item'>
                <PhoneNumberComponent
                  labelClasses='Requierd-Color'
                  phoneNumber={state.phoneNumber}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  setPhone={(event) => {
                    setState({ id: 'phoneNumber', value: event || null });
                  }}
                  isSubmitted={isSubmitted}
                  helperText={getErrorByName(schema, 'phoneNumber').message}
                  error={getErrorByName(schema, 'phoneNumber').error}
                />
              </div>

              <div className='dialog-content-item'>
                <EmailAddressComponent
                  emailAddress={state.emailAddress}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  setEmail={(event) => {
                    setState({ id: 'emailAddress', value: event || null });
                  }}
                  isSubmitted={isSubmitted}
                  helperText={getErrorByName(schema, 'emailAddress').message}
                  error={getErrorByName(schema, 'emailAddress').error}
                />
              </div>

              <div className='dialog-content-item'>
                <NationalityComponent
                  labelClasses='Requierd-Color'
                  nationalityId={state.nationalityId}
                  selected={selected}
                  setSelected={(event) => {
                    setSelected({
                      id: 'Nationality',
                      value: event || null,
                    });
                  }}
                  setNationalityId={(event) => {
                    setState({ id: 'nationalityId', value: event || null });
                  }}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  isSubmitted={isSubmitted}
                  helperText={getErrorByName(schema, 'nationalityId').message}
                  error={getErrorByName(schema, 'nationalityId').error}
                />
              </div>

              <div className='title-wrapper'>
                <span className='title-text'>
                  {t(`${translationPath}Address`)}
                </span>
              </div>

              <div className='dialog-content-item'>
                <CountryComponent
                  countryId={state.countryId}
                  selected={selected}
                  setSelected={(event) => {
                    setSelected({
                      id: 'Country',
                      value: event || null,
                    });
                  }}
                  setCountryId={(event) => {
                    setState({ id: 'countryId', value: event || null });
                  }}
                  setCityList={setCityList}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>

              <div className='dialog-content-item'>
                <CityComponent
                  cityId={state.cityId}
                  cityList={cityList && cityList.length > 0 ? cityList : []}
                  selected={selected}
                  setSelected={(event) => {
                    setSelected({
                      id: 'City',
                      value: event || null,
                    });
                  }}
                  setCityId={(event) => {
                    setState({ id: 'cityId', value: event || null });
                  }}
                  setDistrictList={setDistrictList}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>

              <div className='dialog-content-item'>
                <DistrictComponent
                  districtId={state.districtId}
                  selected={selected}
                  districtList={
                    districtList && districtList.length > 0 ? districtList : []
                  }
                  setSelected={(event) => {
                    setSelected({
                      id: 'District',
                      value: event || null,
                    });
                  }}
                  setDistrictId={(event) => {
                    setState({ id: 'districtId', value: event || null });
                  }}
                  setCommunityList={setCommunityList}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>

              <div className='dialog-content-item'>
                <CommunityComponent
                  communityId={state.communityId}
                  selected={selected}
                  communityList={
                    communityList && communityList.length > 0 ?
                      communityList :
                      []
                  }
                  setSelected={(event) => {
                    setSelected({
                      id: 'Community',
                      value: event || null,
                    });
                  }}
                  setCommunityId={(event) => {
                    setState({ id: 'communityId', value: event || null });
                  }}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <div className='form-builder-wrapper'>
              <div className='form-builder-footer-wrapper is-dialog w-100 MuiGrid-align-items-xs-center MuiGrid-justify-xs-space-between'>
                <div className='MuiGrid-root-left'>
                  <ButtonBase
                    className='MuiButtonBase-root MuiButton-root MuiButton-text btns c-danger'
                    onClick={() => close()}
                  >
                    <span className='MuiButton-label'>
                      <span className='mx-2'>
                        {t(`${translationPath}cancel`)}
                      </span>
                    </span>
                    <span className='MuiTouchRipple-root' />
                  </ButtonBase>
                </div>
                <div className='MuiGrid-root-right'>
                  <ButtonBase
                    className='MuiButtonBase-root MuiButton-root MuiButton-text btns'
                    onClick={() => {
                      close();
                      GlobalHistory.push('/home/Contacts-CRM/add?formType=1');
                    }}
                  >
                    <span className='MuiButton-label'>
                      <span className='mx-2'>
                        {t(`${translationPath}openFullContactView`)}
                      </span>
                    </span>
                    <span className='MuiTouchRipple-root' />
                  </ButtonBase>

                  <ButtonBase
                    className='MuiButtonBase-root MuiButton-root MuiButton-text btns'
                    onClick={() => saveHandler(true)}
                  >
                    <span className='MuiButton-label'>
                      <span className='mx-2'>
                        {t(`${translationPath}Save and Continue`)}
                      </span>
                    </span>
                    <span className='MuiTouchRipple-root' />
                  </ButtonBase>
                  <ButtonBase
                    className='MuiButtonBase-root MuiButton-root MuiButton-text btns theme-solid bg-primary'
                    onClick={() => saveHandler()}
                  >
                    <span className='MuiButton-label'>
                      <span className='mx-2'>
                        {t(`${translationPath}save`)}
                      </span>
                    </span>
                    <span className='MuiTouchRipple-root' />
                  </ButtonBase>
                </div>
              </div>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
