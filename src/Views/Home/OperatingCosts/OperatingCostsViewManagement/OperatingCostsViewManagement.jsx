import React, {
  useState, useCallback, useEffect, useReducer, useRef
} from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PropTypes } from 'prop-types';
import Joi from 'joi';
import {
  Inputs,
  Spinner,
  AutocompleteComponent,
  SelectComponet,
  PermissionsComponent,
} from '../../../../Components';
import {
  bottomBoxComponentUpdate,
  getErrorByName,
  GetParams,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../Helper';
import {
  CreateOperatingCost,
  UpdateOperatingCost,
  GetOperatingCostById,
  GetAllPortfolio,
  GetAllPropertyByPortfolioId,
  GetContacts,
} from '../../../../Services';
import { MonthsEnum } from '../../../../Enums';
import { PropertiesPermissionsCRM } from '../../../../Permissions/PropertiesPermissions';


const parentTranslationPath = 'OperatingCostsView';
const translationPath = '';

export const OperatingCostsViewManagement = ({ isPortfolio, reloadData, isOpenChanged }) => {
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const pathName = window.location.pathname.split('/home/')[1].split('/')[1];
  const { t } = useTranslation(parentTranslationPath);
  const searchTimer = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [years, setYears] = useState([]);
  const [loadings, setLoadings] = useReducer(reducer, {
    portfolio: false,
    property: false,
    billedTo: false,
  });
  const [data, setData] = useReducer(reducer, {
    portfolio: [],
    property: [],
    billedTo: [],
  });
  const [selected, setSelected] = useReducer(reducer, {
    portfolio: '',
    property: '',
    billedTo: null,
  });
  const [loaading, setLoaading] = useState(false);
  const defaultState = {
    portfolioId: isPortfolio ? +GetParams('id') : '',
    propertyId: '',
    billingToId: '',
    month: '',
    year: '',
    remark: '',
    waterElectricityAmount: '',
    waterElectricityAmountTax: '',
    waterElectricityAmountTotalAmount: '',
    telePhoneAmount: '',
    telePhoneAmountTax: '',
    telePhoneTotalAmount: '',
    buildingInsuranceAmount: '',
    buildingInsuranceAmountTax: '',
    buildingInsuranceTotalAmount: '',
    internetAmount: '',
    internetAmountTax: '',
    internetTotalAmount: '',
    othersAmount: '',
    othersAmountTax: '',
    othersTotalAmount: '',
    staffCostAmount: '',
    staffCostAmountTax: '',
    staffCostTotalAmount: '',
  };
  const [state, setState] = useReducer(reducer, defaultState);
  const getAllPortfolio = useCallback(async (search) => {
    setLoadings({ id: 'portfolio', value: true });
    const result = await GetAllPortfolio({ pageIndex: 0, pageSize: 25, search });
    if (!(result && result.status && result.status !== 200))
      setData({ id: 'portfolio', value: result.result });
    setLoadings({ id: 'portfolio', value: false });
  }, []);

  const getAllProperties = useCallback(async () => {
    if (state.portfolioId) {
      setLoadings({ id: 'property', value: true });
      const result = await GetAllPropertyByPortfolioId(state.portfolioId, 0, 40);
      if (!(result && result.status && result.status !== 200))
        setData({ id: 'property', value: result.result });
      setLoadings({ id: 'property', value: false });
    }
  }, [state.portfolioId]);

  useEffect(() => {
    getAllProperties();
    if (!isPortfolio) getAllPortfolio('');
  }, [getAllPortfolio, getAllProperties, isPortfolio]);

  const getOperatingCostById = useCallback(async () => {
    setLoaading(true);
    const result = await GetOperatingCostById(+GetParams('id'));
    if (!(result && result.status && result.status !== 200)) {
      setState({
        id: 'edit',
        value: {
          portfolioId: result.portfolioId,
          propertyId: result.propertyId,
          billingToId: result.billingToId,
          month: result.month,
          year: result.year,
          remark: result.remark,
          waterElectricityAmount: result.waterElectricityAmount,
          waterElectricityAmountTax: result.waterElectricityAmountTax,
          waterElectricityAmountTotalAmount: result.waterElectricityAmountTotalAmount,
          telePhoneAmount: result.telePhoneAmount,
          telePhoneAmountTax: result.telePhoneAmountTax,
          telePhoneTotalAmount: result.telePhoneTotalAmount,
          buildingInsuranceAmount: result.buildingInsuranceAmount,
          buildingInsuranceAmountTax: result.buildingInsuranceAmountTax,
          buildingInsuranceTotalAmount: result.buildingInsuranceTotalAmount,
          internetAmount: result.internetAmount,
          internetAmountTax: result.internetAmountTax,
          internetTotalAmount: result.internetTotalAmount,
          othersAmount: result.othersAmount,
          othersAmountTax: result.othersAmountTax,
          othersTotalAmount: result.othersTotalAmount,
          staffCostAmount: result.staffCostAmount,
          staffCostAmountTax: result.staffCostAmountTax,
          staffCostTotalAmount: result.staffCostTotalAmount,
        },
      });
      setSelected({
        id: 'edit',
        value: {
          portfolio: { portfolioName: result.portfolioName, portfolioId: result.portfolioId },
          property: { propertyName: result.propertyName, propertyId: result.propertyId },
          billedTo: {
            contactId: result.billingToId,
            contact: { first_name: result.billingToName },
          },
        },
      });
    }
    setLoaading(false);
  }, []);

  useEffect(() => {
    if (GetParams('id') && !isPortfolio) getOperatingCostById();
  }, [getOperatingCostById, isPortfolio]);

  const getAllContacts = useCallback(async (value) => {
    setLoadings({ id: 'billedTo', value: true });
    const res = await GetContacts({ pageIndex: 0, pageSize: 25, search: value });
    if (!(res && res.status && res.status !== 200)) setData({ id: 'billedTo', value: res.result });
    else setData({ id: 'billedTo', value: [] });
    setLoadings({ id: 'billedTo', value: false });
  }, []);

  useEffect(() => {
    getAllContacts('');
  }, [getAllContacts]);

  const cancelHandler = () => {
    GlobalHistory.goBack();
  };

  const schema = Joi.object({
    month: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}month-is-required`),
        'number.empty': t(`${translationPath}month-is-required`),
      }),
    propertyId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}property-name-is-required`),
        'number.empty': t(`${translationPath}property-name-is-required`),
      }),
    portfolioId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}portfolio-name-is-required`),
        'number.empty': t(`${translationPath}portfolio-name-is-required`),
      }),
    billingToId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}billing-to-is-required`),
        'number.empty': t(`${translationPath}billing-to-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);

  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setLoaading(true);
    let result;
    if (pathName === 'add') result = await CreateOperatingCost(state);
    else result = await UpdateOperatingCost(+GetParams('id'), state);
    if (!(result && result.status && result.status !== 200)) {
      cancelHandler();
      if (pathName === 'add') showSuccess(`${translationPath}operating-cost-created-successfully`);
      else showSuccess(`${translationPath}operating-cost-updated-successfully`);
    } else if (pathName === 'add') showError(`${translationPath}operating-cost-created-failed`);
    else showError(`${translationPath}operating-cost-updated-failed`);
    setLoaading(false);
  }, [pathName, schema.error, state, t]);

  const isPortFolioSaveHandler = useCallback(async () => {
    setLoaading(true);
    const result = await CreateOperatingCost(state);
    if (!(result && result.status && result.status !== 200)) {
      reloadData();
      isOpenChanged();
      showSuccess(`${translationPath}operating-cost-created-successfully`);
    } else showError(`${translationPath}operating-cost-updated-failed`);
    setLoaading(false);
  }, [isOpenChanged, reloadData, state]);

  useEffect(() => {
    if (!isPortfolio) {
      bottomBoxComponentUpdate(
        <div className='d-flex-v-center-h-end flex-wrap'>
          <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
            <span>{t('Shared:cancel')}</span>
          </ButtonBase>
          <PermissionsComponent
            permissionsList={Object.values(PropertiesPermissionsCRM)}
            permissionsId={PropertiesPermissionsCRM.AddOperatingCostForProperty.permissionsId}
          >
            <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
              <span>{t('Shared:save')}</span>
            </ButtonBase>
          </PermissionsComponent>
        </div>
      );
    }
  });
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );

  const getYears = useCallback(() => {
    const allYears = [{ key: new Date().getFullYear() }];
    for (let i = 1; i < 10; i += 1) allYears.push({ key: new Date().getFullYear() + i });
    setYears(allYears);
  }, []);

  useEffect(() => {
    getYears();
  }, [getYears]);

  return (
    <div
      className={`operating-costs-managements-wrapper ${!isPortfolio ? 'is-portfolio px-4' : ''}`}
    >
      <Spinner isActive={loaading} />
      <div className='operating-costs-form-wrapper w-100'>
        <div className='operating-cost-section w-100 mt-2'>
          <div className='operating-section-title mb-3'>
            {t(`${translationPath}operating-costs`)}
          </div>
          <div className='operating-costs-content'>
            {!isPortfolio && (
              <div className='operating-item px-4'>
                <AutocompleteComponent
                  idRef='activityTypeIdRef'
                  labelValue={t(`${translationPath}portfolio-name`)}
                  selectedValues={selected.portfolio}
                  multiple={false}
                  data={data.portfolio || []}
                  displayLabel={(option) => option.portfolioName || ''}
                  renderOption={(option) => option.portfolioName || ''}
                  getOptionSelected={(option) => option.portfolioId === state.portfolioId}
                  withoutSearchButton
                  helperText={getErrorByName(schema, 'portfolioId').message}
                  error={getErrorByName(schema, 'portfolioId').error}
                  isWithError
                  isSubmitted={isSubmitted}
                  isLoading={loadings.portfolio}
                  onInputKeyUp={(e) => {
                    const { value } = e.target;
                    if (searchTimer.current) clearTimeout(searchTimer.current);
                    searchTimer.current = setTimeout(() => {
                      getAllPortfolio(value);
                    }, 700);
                  }}
                  onChange={(event, value) => {
                    setSelected({ id: 'portfolio', value });
                    setState({ id: 'portfolioId', value: value && value.portfolioId });
                    setSelected({ id: 'property', value: '' });
                    setState({ id: 'propertyId', value: '' });
                  }}
                />
              </div>
            )}
            <div className='operating-item px-4'>
              <AutocompleteComponent
                idRef='activityTypeIdRef'
                labelValue={t(`${translationPath}property-name`)}
                selectedValues={selected.property}
                multiple={false}
                helperText={getErrorByName(schema, 'propertyId').message}
                error={getErrorByName(schema, 'propertyId').error}
                isWithError
                isSubmitted={isSubmitted}
                data={data.property || []}
                isDisabled={isPortfolio ? false : !state.portfolioId && data.property.length === 0}
                displayLabel={(option) => option.propertyName || ''}
                getOptionSelected={(option) => option.propertyId === state.propertyId}
                withoutSearchButton
                onInputKeyUp={(e) => {
                  const { value } = e.target;
                  if (searchTimer.current) clearTimeout(searchTimer.current);
                  searchTimer.current = setTimeout(() => {
                    getAllProperties(value);
                  }, 700);
                }}
                isLoading={loadings.property}
                onChange={(event, value) => {
                  setSelected({ id: 'property', value });
                  setState({ id: 'propertyId', value: value && value.propertyId });
                }}
              />
            </div>
            <div className='operating-item px-4'>
              <AutocompleteComponent
                idRef='activityTypeIdRef'
                labelValue={t(`${translationPath}billed-to`)}
                selectedValues={selected.billedTo}
                multiple={false}
                helperText={getErrorByName(schema, 'billingToId').message}
                error={getErrorByName(schema, 'billingToId').error}
                isWithError
                isSubmitted={isSubmitted}
                data={data.billedTo || []}
                displayLabel={(option) =>
                  `${option.contact && option.contact.first_name} ${(option.contact && option.contact.last_name) || ''
                  }` || ''}
                getOptionSelected={(option) => option.contactsId === state.billingToId}
                withoutSearchButton
                isLoading={loadings.billedTo}
                onInputKeyUp={(e) => {
                  const { value } = e.target;
                  if (searchTimer.current) clearTimeout(searchTimer.current);
                  searchTimer.current = setTimeout(() => {
                    getAllContacts(value);
                  }, 700);
                }}
                onChange={(event, value) => {
                  setSelected({ id: 'billedTo', value });
                  setState({ id: 'billingToId', value: value && value.contactsId });
                }}
              />
            </div>
          </div>
          <div className='operating-costs-content'>
            <div className='operating-item px-4 mt-3'>
              <SelectComponet
                valueInput='key'
                idRef='monthsRef'
                textInput='value'
                helperText={getErrorByName(schema, 'month').message}
                error={getErrorByName(schema, 'month').error}
                isWithError
                isSubmitted={isSubmitted}
                data={MonthsEnum}
                value={state.month || 0}
                wrapperClasses='w-50 px-1'
                translationPath={translationPath}
                translationPathForData={translationPath}
                parentTranslationPath={parentTranslationPath}
                emptyItem={{
                  value: 0,
                  text: 'month',
                  isDisabled: true,
                  isHiddenOnOpen: true,
                }}
                onSelectChanged={(value) => setState({ id: 'month', value })}
              />
              <SelectComponet
                data={years}
                textInput='key'
                valueInput='key'
                wrapperClasses='w-50 px-1'
                value={state.year || 0}
                idRef='yearsRef'
                translationPath={translationPath}
                translationPathForData={translationPath}
                parentTranslationPath={parentTranslationPath}
                emptyItem={{
                  value: 0,
                  text: 'year',
                  isDisabled: true,
                  isHiddenOnOpen: true,
                }}
                onSelectChanged={(value) => setState({ id: 'year', value: `${value}` })}
              />
            </div>
            <div className='operating-item px-4'>
              <Inputs
                multiline
                rows={4}
                idRef='firstNameRef'
                value={state.remark || ''}
                labelValue={t(`${translationPath}remarks`)}
                onInputChanged={(event) => setState({ id: 'remark', value: event.target.value })}
              />
            </div>
          </div>
        </div>

        <div className='operating-cost-section w-100 mt-2'>
          <div className='operating-section-title mb-3'>{t(`${translationPath}costs-details`)}</div>
          <div className='operating-costs-content mb-4'>
            <div className='operating-item px-4'>
              <Inputs
                idRef='firstNameRef'
                value={state.waterElectricityAmount || ''}
                labelValue={t(`${translationPath}water-electricity`)}
                onInputChanged={(event) => {
                  setState({ id: 'waterElectricityAmount', value: +event.target.value });
                  setState({
                    id: 'waterElectricityAmountTotalAmount',
                    value: (state.waterElectricityAmountTax / 100) * +event.target.value,
                  });
                }}
                type='number'
              />
              <Inputs
                idRef='securityDepositRef'
                labelClasses='has-inside-label'
                value={state.waterElectricityAmountTax || ''}
                type='number'
                min={0}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <Inputs
                      idRef='premiumPercentageOfBasePriceRef'
                      value={state.waterElectricityAmountTotalAmount || ''}
                      endAdornment={<span className='px-2'>%</span>}
                      type='number'
                      labelClasses='inside-input-label'
                      wrapperClasses='mb-0'
                      min={0}
                      max={100}
                      isDisabled
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  </div>
                )}
                max={state.waterElectricityAmount}
                onInputChanged={(event) => {
                  setState({ id: 'waterElectricityAmountTax', value: +event.target.value });
                  setState({
                    id: 'waterElectricityAmountTotalAmount',
                    value: (+event.target.value / 100) * state.waterElectricityAmount,
                  });
                }}
              />
            </div>
            <div className='operating-item px-4'>
              <Inputs
                type='number'
                min={0}
                idRef='firstNameRef'
                value={state.telePhoneAmount || ''}
                labelValue={t(`${translationPath}telephone`)}
                onInputChanged={(event) => {
                  setState({ id: 'telePhoneAmount', value: +event.target.value });
                  setState({
                    id: 'telePhoneTotalAmount',
                    value: (state.telePhoneAmountTax / 100) * +event.target.value,
                  });
                }}
              />
              <Inputs
                idRef='securityDepositRef'
                type='number'
                min={0}
                labelClasses='has-inside-label'
                value={state.telePhoneAmountTax || ''}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <Inputs
                      idRef='premiumPercentageOfBasePriceRef'
                      value={state.telePhoneTotalAmount || ''}
                      endAdornment={<span className='px-2'>%</span>}
                      type='number'
                      labelClasses='inside-input-label'
                      wrapperClasses='mb-0'
                      min={0}
                      isDisabled
                      max={100}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  </div>
                )}
                max={state.telePhoneAmount}
                onInputChanged={(event) => {
                  setState({ id: 'telePhoneAmountTax', value: +event.target.value });
                  setState({
                    id: 'telePhoneTotalAmount',
                    value: (+event.target.value / 100) * state.telePhoneAmount,
                  });
                }}
              />
            </div>
            <div className='operating-item px-4'>
              <Inputs
                type='number'
                min={0}
                idRef='firstNameRef'
                value={state.internetAmount || ''}
                labelValue={t(`${translationPath}internet`)}
                onInputChanged={(event) => {
                  setState({ id: 'internetAmount', value: +event.target.value });
                  setState({
                    id: 'internetTotalAmount',
                    value: (state.internetAmountTax / 100) * +event.target.value,
                  });
                }}
              />
              <Inputs
                type='number'
                min={0}
                idRef='securityDepositRef'
                labelClasses='has-inside-label'
                value={state.internetAmountTax || ''}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <Inputs
                      idRef='premiumPercentageOfBasePriceRef'
                      value={state.internetTotalAmount || ''}
                      endAdornment={<span className='px-2'>%</span>}
                      type='number'
                      labelClasses='inside-input-label'
                      wrapperClasses='mb-0'
                      min={0}
                      max={100}
                      isDisabled
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  </div>
                )}
                max={state.internetAmount}
                onInputChanged={(event) => {
                  setState({ id: 'internetAmountTax', value: +event.target.value });
                  setState({
                    id: 'internetTotalAmount',
                    value: (+event.target.value / 100) * state.internetAmount,
                  });
                }}
              />
            </div>
          </div>
          <div className='operating-costs-content'>
            <div className='operating-item px-4'>
              <Inputs
                type='number'
                min={0}
                idRef='firstNameRef'
                value={state.buildingInsuranceAmount || ''}
                labelValue={t(`${translationPath}building-insurance`)}
                onInputChanged={(event) => {
                  setState({ id: 'buildingInsuranceAmount', value: +event.target.value });
                  setState({
                    id: 'buildingInsuranceTotalAmount',
                    value: (state.buildingInsuranceAmountTax / 100) * +event.target.value,
                  });
                }}
              />
              <Inputs
                idRef='securityDepositRef'
                labelClasses='has-inside-label'
                value={state.buildingInsuranceAmountTax || ''}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <Inputs
                      idRef='premiumPercentageOfBasePriceRef'
                      value={state.buildingInsuranceTotalAmount || ''}
                      endAdornment={<span className='px-2'>%</span>}
                      type='number'
                      labelClasses='inside-input-label'
                      wrapperClasses='mb-0'
                      min={0}
                      isDisabled
                      max={100}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  </div>
                )}
                max={state.buildingInsuranceAmount}
                onInputChanged={(event) => {
                  setState({ id: 'buildingInsuranceAmountTax', value: +event.target.value });
                  setState({
                    id: 'buildingInsuranceTotalAmount',
                    value: (+event.target.value / 100) * state.buildingInsuranceAmount,
                  });
                }}
              />
            </div>
            <div className='operating-item px-4'>
              <Inputs
                type='number'
                min={0}
                idRef='firstNameRef'
                value={state.othersAmount || ''}
                labelValue={t(`${translationPath}others`)}
                onInputChanged={(event) => {
                  setState({ id: 'othersAmount', value: +event.target.value });
                  setState({
                    id: 'othersTotalAmount',
                    value: (state.othersAmountTax / 100) * +event.target.value,
                  });
                }}
              />
              <Inputs
                idRef='securityDepositRef'
                labelClasses='has-inside-label'
                value={state.othersAmountTax || ''}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <Inputs
                      idRef='premiumPercentageOfBasePriceRef'
                      value={state.othersTotalAmount || ''}
                      endAdornment={<span className='px-2'>%</span>}
                      type='number'
                      labelClasses='inside-input-label'
                      wrapperClasses='mb-0'
                      min={0}
                      isDisabled
                      max={100}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  </div>
                )}
                max={state.othersAmount}
                onInputChanged={(event) => {
                  setState({ id: 'othersAmountTax', value: +event.target.value });
                  setState({
                    id: 'othersTotalAmount',
                    value: (+event.target.value / 100) * state.othersAmount,
                  });
                }}
              />
            </div>
            <div className='operating-item px-4'>
              <Inputs
                type='number'
                min={0}
                idRef='firstNameRef'
                value={state.staffCostAmount || ''}
                labelValue={t(`${translationPath}staff-cost`)}
                onInputChanged={(event) => {
                  setState({ id: 'staffCostAmount', value: +event.target.value });
                  setState({
                    id: 'staffCostTotalAmount',
                    value: (state.staffCostAmountTax / 100) * +event.target.value,
                  });
                }}
              />
              <Inputs
                type='number'
                min={0}
                idRef='securityDepositRef'
                labelClasses='has-inside-label'
                value={state.staffCostAmountTax || ''}
                endAdornment={(
                  <div className='d-flex-v-center'>
                    <Inputs
                      idRef='premiumPercentageOfBasePriceRef'
                      value={state.staffCostTotalAmount || ''}
                      endAdornment={<span className='px-2'>%</span>}
                      type='number'
                      labelClasses='inside-input-label'
                      wrapperClasses='mb-0'
                      min={0}
                      max={100}
                      isDisabled
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  </div>
                )}
                max={state.staffCostAmount}
                onInputChanged={(event) => {
                  setState({ id: 'staffCostAmountTax', value: +event.target.value });
                  setState({
                    id: 'staffCostTotalAmount',
                    value: (+event.target.value / 100) * state.staffCostAmount,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {isPortfolio && (
        <div className='d-flex-v-center-h-end flex-wrap add-cancel-bottom-actions'>
          <ButtonBase className='btns theme-transparent mb-2' onClick={isOpenChanged}>
            <span>{t('Shared:cancel')}</span>
          </ButtonBase>
          <PermissionsComponent
            permissionsList={Object.values(PropertiesPermissionsCRM)}
            permissionsId={PropertiesPermissionsCRM.AddOperatingCostForProperty.permissionsId}
          >
            <ButtonBase className='btns theme-solid mb-2' onClick={isPortFolioSaveHandler}>
              <span>{t('Shared:save')}</span>
            </ButtonBase>
          </PermissionsComponent>
        </div>
      )}
    </div>
  );
};

OperatingCostsViewManagement.propTypes = {
  isPortfolio: PropTypes.bool,
  isOpenChanged: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
};
OperatingCostsViewManagement.defaultProps = {
  isPortfolio: false,
};
