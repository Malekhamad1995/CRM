import React, {
  useCallback, useEffect, useState
} from 'react';
import {
  DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import {
  AutocompleteComponent,
  Inputs,
  RadiosGroupComponent,
} from '../../../../../../../Components';
import {
  GetParams, showError, showSuccess, getErrorByName
} from '../../../../../../../Helper';
import { BankAccount } from '../../../../../../../Enums/BankAccount.Enum.jsx';
import {
  GetAllLandLordByPortfolioId,
  lookupItemsGetId,
  CreatePortfolioBankAccount,
  UpdateBankAccount,
  GetAllPortfolioPropertiesByLandlordId,
} from '../../../../../../../Services';

export const BankAccountDialog = ({
  activeItem,
  reloadData,
  parentTranslationPath,
  translationPath,
  open,
  isEdit,
  close,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [Banks, setBanks] = useState([]);
  const [bank, setBank] = useState(null);
  const [Curren, setCurren] = useState([]);
  const [Currency, setCurrency] = useState(null);
  const [actionRadio, setactionRadio] = useState(1);
  const [Landlord, setLandlord] = useState([]);
  const [landlordsName, setlandlordsName] = useState(null);
  const [PropertyName, setPropertyName] = useState(null);
  const [ResponseProperty, setResponseProperty] = useState([]);

  const [response, Setresponse] = useState({
    accountNo: '',
    accountTitle: '',
    bankId: '',
    branch: '',
    contactId: '',
    currencyId: '',
    iban: '',
    isShow: JSON.parse('true'),
    notes: '',
    portfolioId: +GetParams('id'),
    propertyId: '',
    startingBalance: '',
    swiftCode: '',
    //  Floors: '',
  });

  const schema = Joi.object({
    contactId: Joi.number()
      .required()
      .messages({
        'number.base': t`${translationPath}landlords-is-required`,
        'number.empty': t`${translationPath}landlords-is-required`,
      }),

    startingBalance: Joi.number()
      .required()
      .messages({
        'number.base': t`${translationPath}startingBalance-is-required`,
        'number.empty': t`${translationPath}startingBalance-is-required`,
      }),
    currencyId: Joi.number()
      .required()
      .messages({
        'number.base': t`${translationPath}currencyId-is-required`,
        'number.empty': t`${translationPath}currencyId-is-required`,
      }),
    bankId: Joi.number()
      .required()
      .messages({
        'number.base': t`${translationPath}bankId-is-required`,
        'number.empty': t`${translationPath}bankId-is-required`,
      }),
    accountTitle: Joi.string()
      .required()
      .messages({
        'string.base': t`${translationPath}accountTitle-is-required`,
        'string.empty': t`${translationPath}accountTitle-is-required`,
      }),

  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(response);

  useEffect(() => {
    setIsLoading(true);
    lookupGetBank(BankAccount.Babk.value);
    lookupGetCurrencies(BankAccount.Currencies.value);
    LandlordAPI();
    PropertyByPortfolio();
    setIsLoading(false);

    if (isEdit) {
      Setresponse({
        ...response,
        accountNo: activeItem.accountNo,
        accountTitle: activeItem.accountTitle,
        bankId: activeItem.bankId,
        branch: activeItem.branch,
        contactId: activeItem.contactId,
        currencyId: activeItem.currencyId,
        iban: activeItem.iban,
        isShow: +activeItem.isShow,
        notes: activeItem.notes,
        portfolioId: +GetParams('id'),
        propertyId: activeItem.propertyId,
        startingBalance: +activeItem.startingBalance,
        swiftCode: activeItem.swiftCode,
        //  Floors: activeItem.Floors,
      });
      activeItem.isShow === true ? setactionRadio(1) : setactionRadio(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem]);
  const PropertyByPortfolio = useCallback(
    async (landlordId) => {
      if (response.portfolioId) {
        setLoading(true);
        const result = await GetAllPortfolioPropertiesByLandlordId(+GetParams('id'), landlordId);
        setLoading(false);
        if (!(result && result.status && result.status !== 200)) setResponseProperty(result);
        else setResponseProperty({});
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [response.propertyId, response.portfolioId]
  );
  useEffect(() => {
    if (isEdit) {
      if (activeItem.contactId && !landlordsName && Landlord && Landlord.length > 0) {
        const reservationTypeIndex = Landlord.findIndex(
          (item) => item.contactId === activeItem.contactId
        );
        if (reservationTypeIndex !== -1)
          setlandlordsName(Landlord[reservationTypeIndex]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Landlord, landlordsName]);

  useEffect(() => {
    if (isEdit) {
      if (
        activeItem.propertyId &&
        !PropertyName &&
        ResponseProperty &&
        ResponseProperty.length > 0
      ) {
        const reservationTypeIndex = ResponseProperty.findIndex(
          (item) => item.propertyId === activeItem.propertyId
        );

        if (reservationTypeIndex !== -1)
          setPropertyName(ResponseProperty[reservationTypeIndex]);
      }
    }
  }, [activeItem, ResponseProperty, PropertyName, isEdit]);

  useEffect(() => {
    if (isEdit) {
      if (activeItem.bankId && !bank && Banks && Banks.length > 0) {
        const reservationTypeIndex = Banks.findIndex(
          (item) => item.lookupItemId === activeItem.bankId
        );

        if (reservationTypeIndex !== -1)
          setBank(Banks[reservationTypeIndex]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem, Banks, bank]);

  useEffect(() => {
    if (isEdit) {
      if (activeItem.currencyId && !Currency && Curren && Banks.length > 0) {
        const reservationTypeIndex = Curren.findIndex(
          (item) => item.lookupItemId === activeItem.currencyId
        );
        if (reservationTypeIndex !== -1)
          setCurrency(Curren[reservationTypeIndex]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem, Curren, Currency]);

  useEffect(() => {
    PropertyByPortfolio(response.contactId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response.contactId, isEdit]);

  const lookupGetBank = useCallback(async (lookup) => {
    const result = await lookupItemsGetId({
      lookupTypeId: lookup,
    });
    setBanks(result);
  }, []);

  const lookupGetCurrencies = useCallback(async (lookup) => {
    const result = await lookupItemsGetId({
      lookupTypeId: lookup,
    });
    setCurren(result);
  }, []);


  const LandlordAPI = useCallback(async () => {
    if (+GetParams('id')) {
      const result = await GetAllLandLordByPortfolioId(+GetParams('id'), 1, 100);
      if (!(result && result.status && result.status !== 200)) setLandlord(result.result);
      else setLandlord([]);
    }
  }, []);

  const onSelectedRadioChanged = (e, newValue) => {
    setactionRadio(+newValue);
    // eslint-disable-next-line no-unused-expressions
    +newValue === 1 ?
      Setresponse({ ...response, isShow: JSON.parse('true') }) :
      Setresponse({ ...response, isShow: JSON.parse('false') });
  };

  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      setIsLoading(false);
      return;
    }
    if (isEdit) {
      const res = await UpdateBankAccount(activeItem.portfolioBankAccountId, response);
      if (!(res && res.status && res.status !== 200)) {
        showSuccess(t(`${translationPath}edit-successfully`));
        close();
        reloadData();
      } else
        showError(t(`${translationPath}edit-failed`));
    } else {
      const res = await CreatePortfolioBankAccount(response);
      if (!(res && res.status && res.status !== 200)) {
        showSuccess(t(`${translationPath}Accountcreated-successfully`));
        close();
        reloadData();
      } else showError(t(`${translationPath}create-failed`));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, t, translationPath]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          close();
        }}
        className='activities-Bank-accounts-dialog-wrapper'
      >
        <form noValidate>
          <DialogTitle id='alert-dialog-slide-title'>
            {t(`${translationPath}${(isEdit && 'EditBankaccount') || 'AddBankaccount'}`)}
          </DialogTitle>
          <DialogContent>
            <div className='dialog-content-wrapper'>
              <div className='dialog-content-item'>
                <AutocompleteComponent
                  idRef='landlordsRef'
                  labelValue={t('landlords')}
                  inputPlaceholder={t('selactlandlords')}
                  selectedValues={landlordsName}
                  data={Landlord && Landlord ? Landlord : []}
                  isLoading={isLoading}
                  displayLabel={(option) => (option.contactName && option.contactName) || ''}
                  multiple={false}
                  withoutSearchButton
                  onChange={(e, newValue) => {
                    Setresponse({
                      ...response,
                      contactId: (newValue && newValue.contactId) || null,
                    });
                    setlandlordsName(newValue && newValue ? newValue : Landlord);
                  }}
                  isSubmitted={isSubmitted}
                  labelClasses='Requierd-Color'
                  helperText={getErrorByName(schema, 'contactId').message}
                  error={getErrorByName(schema, 'contactId').error}
                  isWithError

                />
              </div>
              <div className='dialog-content-item'>
                <AutocompleteComponent
                  idRef='PropertyRef'
                  labelValue={t('Property')}
                  inputPlaceholder={t('selactProperty')}
                  selectedValues={PropertyName}
                  data={ResponseProperty && ResponseProperty ? ResponseProperty : []}
                  isLoading={Loading}
                  displayLabel={(option) => (option.propertyName && option.propertyName) || ''}
                  multiple={false}
                  withoutSearchButton
                  onChange={(e, newValue) => {
                    Setresponse({
                      ...response,
                      propertyId: (newValue && newValue.propertyId) || null,
                    });

                    setPropertyName(newValue && newValue ? newValue : PropertyName);
                  }}
                />
                {/*
              </div>
              <div className='dialog-content-item'>
            {/* <Inputs
              idRef='FloorsRef'
              labelValue='Floors'
              isDisabled={true}
              //        value={response.Floors || ''}
              // helperText={getErrorByName(schema, 'subject').message}
              // error={getErrorByName(schema, 'subject').error}
              isWithError
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              // onInputChanged={(event) => {
              //   Setresponse({ ...response, response: event.target.value });
              // }}
            /> */}
              </div>

              <div className='dialog-content-item'>
                <Inputs
                  idRef='NotesRef'
                  labelValue='Notes'
                  value={response.notes || ''}
                  multiline
                  rows={7}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onInputChanged={(event) => {
                    Setresponse({ ...response, notes: event.target.value });
                  }}
                />
              </div>
              <RadiosGroupComponent
                data={[
                  { id: 1, value: t(`${translationPath}Yes`) },
                  { id: 2, value: t(`${translationPath}No`) },
                ]}
                valueInput='id'
                labelInput='value'
                value={actionRadio}
                onSelectedRadioChanged={(e, newValue) => {
                  onSelectedRadioChanged(e, newValue);
                }}
                name='radioGroups'
                titleClasses='texts gray-primary-bold'
                wrapperClasses='mb-3'
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                labelValue='Showondevice'
              />
            </div>
            <div className='dialog-content-wrapper'>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='AccounttitleRef'
                  value={response.accountTitle || ''}
                  labelValue='AccTitle'
                  labelClasses='Requierd-Color'
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  helperText={getErrorByName(schema, 'accountTitle').message}
                  error={getErrorByName(schema, 'accountTitle').error}
                  isWithError
                  onInputChanged={(event) => {
                    Setresponse({ ...response, accountTitle: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='AccountRef'
                  labelValue='AccNo'
                  value={response.accountNo || ''}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onInputChanged={(event) => {
                    Setresponse({ ...response, accountNo: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <AutocompleteComponent
                  idRef='BanknameRef'
                  labelValue={t('Bankname')}
                  inputPlaceholder={t('selactBankname')}
                  selectedValues={bank}
                  data={Banks && Banks ? Banks : []}
                  isLoading={isLoading}
                  displayLabel={(option) => (option.lookupItemName && option.lookupItemName) || ''}
                  multiple={false}
                  withoutSearchButton
                  onChange={(e, newValue) => {
                    setBank(newValue);
                    Setresponse({
                      ...response,
                      bankId: (newValue && newValue.lookupItemId) || null,
                    });
                  }}
                  isSubmitted={isSubmitted}
                  labelClasses='Requierd-Color'
                  helperText={getErrorByName(schema, 'bankId').message}
                  error={getErrorByName(schema, 'bankId').error}
                  isWithError
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='BranchRef'
                  labelValue='Branch'
                  value={response.branch || ''}
                  isWithError
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onInputChanged={(event) => {
                    Setresponse({ ...response, branch: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='IBANRef'
                  labelValue='IBAN'
                  value={response.iban || ''}
                  isWithError
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onInputChanged={(event) => {
                    Setresponse({ ...response, iban: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='SwiftcodeRef'
                  labelValue='Swiftcode'
                  value={response.swiftCode || ''}
                  isWithError
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onInputChanged={(event) => {
                    Setresponse({ ...response, swiftCode: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <AutocompleteComponent
                  idRef='CurrencyRef'
                  labelValue={t('Currency')}
                  inputPlaceholder={t('selactCurrency')}
                  selectedValues={Currency}
                  data={Curren && Curren ? Curren : []}
                  isLoading={isLoading}
                  displayLabel={(option) => (option.lookupItemName && option.lookupItemName) || ''}
                  multiple={false}
                  withoutSearchButton
                  onChange={(e, newValue) => {
                    setCurrency(newValue);
                    Setresponse({
                      ...response,
                      currencyId: (newValue && newValue.lookupItemId) || null,
                    });
                  }}
                  isSubmitted={isSubmitted}
                  labelClasses='Requierd-Color'
                  helperText={getErrorByName(schema, 'currencyId').message}
                  error={getErrorByName(schema, 'currencyId').error}
                  isWithError
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='StartingbalanceRef'
                  labelValue='Startingbalance'
                  labelClasses='Requierd-Color'
                  value={response.startingBalance || ''}
                  helperText={getErrorByName(schema, 'startingBalance').message}
                  error={getErrorByName(schema, 'startingBalance').error}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onInputChanged={(event) => {
                    Setresponse({ ...response, startingBalance: +event.target.value });
                  }}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <ButtonBase onClick={() => close()} className='btns theme-solid bg-cancel'>
              {t(`${translationPath}cancel`)}
            </ButtonBase>
            <ButtonBase className='btns theme-solid' onClick={() => saveHandler()}>
              {t(`${translationPath}${(isEdit && 'editAccount') || 'SaveAccount'}`)}
            </ButtonBase>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
