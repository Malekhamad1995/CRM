import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { Spinner } from '../../../../../Components';
import {
  bottomBoxComponentUpdate,
  GetParams,
  GlobalHistory,
  showError,
  showSuccess,
  getErrorByName,
} from '../../../../../Helper';
import {
  AmountAEDComponent,
  AmountpaidbyComponent,
  ContractdateComponent,
  ContractEndComponent,
  ContractStartComponent,
  MaintenanceCompanyComponent,
  AmountRadioComponent,
  TermsofpaymentComponent,
  PropertyComponent,
  PortfolioCompanyComponent,
  AmountperComponent,
  NoOfservicesComponent,
  StatusComponentComponent,
  NotesComponent,
  ServicesofferedComponent,
} from './Component';
import {
  UpdateMaintenanceContract,
  GetMaintenanceContract,
  MaintenanceContract,
} from '../../../../../Services/MaintenanceContractsServices';

const translationPath = '';
export const AddMaintenanContractView = ({
  portfolioId,
  fromOutSide,
  setStates,
  // reloadData,
  editMaintenanceContract,
  isSubmittedDialog,
  outSideLoading,
}) => {
  const { t } = useTranslation('MaintenanceContracts');
  const parentTranslationPath = 'MaintenanceContracts';
  const searchTimer = useRef(null);
  const [loadings, setLoadings] = useState(false);
  const [isEdit, setisEdit] = useState('');
      // eslint-disable-next-line no-unused-vars
  const [lod,
    setlod] = useState(false);
  const [Id, setId] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  // const MaintenanContractArray = [1];

  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') {
      if (setStates)
        setStates({ ...state, [action.id]: action.value });

      return { ...state, [action.id]: action.value };
    }
    if (setStates)
      setStates({ ...action.value });

    return {
      ...action.value,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reducer2 = useCallback((state, action) => {
    if (action.id !== 'edit')
      return { ...state, [action.id]: action.value };

    return {
      ...action.value,
    };
  }, []);

  const [state, setState] = useReducer(reducer, {
    contactId: '',
    portfolioId: '',
    propertyId: '',
    amountPaidBy: '',
    contractDate: '',
    startDate: '',
    endDate: '',
    maintenanceContractServicesIds: [],
    status: '',
    numberOfServices: '',
    amount: '',
    termOfPayment: '',
    notes: '',
    amountType: +1,
  });
  const [selected, setSelected] = useReducer(reducer2, {
    MaintenanceCompany: null,
    Portfolio: null,
    Property: null,
    maintenanceContractServices: null,
    Servicesoffered: null,
  });

  useEffect(() => {
    setLoadings(outSideLoading);
  }, [outSideLoading]);

  const schema = Joi.object({
    contactId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}maintenance-company-required`),
        'number.empty': t(`${translationPath}maintenance-company-required`),
      }),

    portfolioId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}portfolio-is-required`),
        'number.empty': t(`${translationPath}portfolio-is-required`),
      }),

    propertyId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}property-name-is-required`),
        'number.empty': t(`${translationPath}property-name-is-required`),
      }),

    contractDate: Joi.date()
      .required()
      .messages({
        'date.base': t(`${translationPath}contract-Date-is-required`),
        'date.empty': t(`${translationPath}contract-Date-is-required`),
      }),

    startDate: Joi.date()
      .required()
      .messages({
        'date.base': t(`${translationPath}start-Date-is-required`),
        'date.empty': t(`${translationPath}start-Date-is-required`),
      }),

    endDate: Joi.date()
      .greater(Joi.ref('startDate'))
      .required()
      .messages({
        'date.base': t(`${translationPath}endDate-is-required`),
        'date.empty': t(`${translationPath}endDate-is-required`),
        'date.greater': t(`${translationPath}select-end-date-after-start-date`),
      }),

    maintenanceContractServicesIds: Joi.array()
      .required()
      .min(1)
      .messages({
        'array.base': t(
          `${translationPath}maintenance-Contract-Services-is-required`
        ),
        'array.empty': t(
          `${translationPath}maintenance-Contract-Services-is-required`
        ),
        'array.min': t(
          `${translationPath}should-have-a-minimum-length-of-service-offered`
        ),
      }),

    amount: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}amount-is-required`),
        'number.empty': t(`${translationPath}amount-is-required`),
      }),

    amountPaidBy: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}amount-Paid-By-is-required`),
        'number.empty': t(`${translationPath}amount-Paid-By-is-required`),
      }),

    numberOfServices: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}number-Of-Services-is-required`),
        'number.empty': t(`${translationPath}number-Of-Services-is-required`),
      }),

    termOfPayment: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}term-Of-payment-is-required`),
        'number.empty': t(`${translationPath}term-Of-payment-is-required`),
      }),

    status: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}status-is-required`),
        'number.empty': t(`${translationPath}status-is-required`),
      }),

    amountType: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}amountType-is-required`),
        'number.empty': t(`${translationPath}amountType-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);

  useEffect(() => {
    setIsSubmitted(isSubmittedDialog);
  }, [isSubmittedDialog]);

  const GetMaintenanceContractAPI = useCallback(async (id) => {
    setLoadings(true);
    let res = null;
    if (id) res = await GetMaintenanceContract(id);
    else res = await GetMaintenanceContract(+GetParams('id'));

    setState({
      id: 'edit',
      value: {
        contactId: res.contactId,
        portfolioId: res.portfolioId,
        propertyId: res.propertyId,
        amountPaidBy: res.amountPaidBy,
        contractDate: res.contractDate,
        startDate: res.startDate,
        endDate: res.endDate,
        maintenanceContractServicesIds:
          res &&
          res.maintenanceContractServices &&
          res.maintenanceContractServices.length !== 0 &&
          res.maintenanceContractServices.map((x) => x.serviceOfferId),
        status: res.status,
        numberOfServices: res.numberOfServices,
        amount: res.amount,
        termOfPayment: res.termOfPayment,
        notes: res.notes,
        amountType: res.amountType,
      },
    });

    const result =
      res &&
      res.maintenanceContractServices &&
      res.maintenanceContractServices.length !== 0 &&
      res.maintenanceContractServices.map((x) => ({
        lookupItemId: x.serviceOfferId,
        lookupItemName: x.serviceOfferName,
      }));

    setSelected({ id: 'MaintenanceCompany', value: res });
    setSelected({ id: 'Property', value: res });
    setSelected({ id: 'Portfolio', value: res });
    setSelected({ id: 'Property', value: res });
    setlod(true);
    setSelected({
      id: 'maintenanceContractServices',
      value: result,
    });
    setlod(false);
    if (!(res && res.status && res.status !== 200)) setLoadings(false);
    else setLoadings(false);
  }, []);
  useEffect(() => {
    if (fromOutSide && !editMaintenanceContract) {
      setisEdit(false);
      return;
    } if (fromOutSide && editMaintenanceContract) {
      setisEdit(true);
      // setId(editMaintenanceContract.maintenanceContractId);
      GetMaintenanceContractAPI(editMaintenanceContract.maintenanceContractId);
      return;
    }
    if (+GetParams('id') !== 0 || null || undefined) {
      setisEdit(true);
      setId(+GetParams('id'));
      GetMaintenanceContractAPI();
    } else setisEdit(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GetMaintenanceContractAPI]);

  useEffect(() => {
    setState({ id: 'portfolioId', value: portfolioId });
  }, [portfolioId]);

  const cancelHandler = () => {
    GlobalHistory.push('/home/Maintenance-Contracts/view');
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveHandler = useCallback(async () => {
    setLoadings(true);
    setIsSubmitted(true);

    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      setLoadings(false);
      return;
    }

    const result = isEdit ?
      await UpdateMaintenanceContract(Id, state) :
      await MaintenanceContract(state);

    if (!(result && result.data)) {
      if (isEdit !== true)
        showSuccess(t`${translationPath}AddMaintenanceContractsMsg`);
      // reloadData();
      else showSuccess(t`${translationPath}EditMaintenanceContractsMsg`);
      setLoadings(false);
      GlobalHistory.push('/home/Maintenance-Contracts/view');
    } else showError(t('Shared:please-fix-all-errors'));
    setLoadings(false);
  }, [Id, isEdit, schema.error, state, t]);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase
          className='btns theme-transparent mb-2'
          onClick={cancelHandler}
        >
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <ButtonBase className='btns theme-solid mb-2' onClick={saveHandler}>
          <span>{t('Shared:save')}</span>
        </ButtonBase>
      </div>
    );
  }, [saveHandler, schema.error, t]);

  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );

  return (
    <div>
      <Spinner isActive={loadings} isAbsolute />
      <div className='Maintenance-Contracts-wrapper'>
        <div className='title-section mt-3'>
          <span>
            {isEdit !== true ?
              t(`${translationPath}AddNewMaintenancecontract`) :
              t(`${translationPath}editMaintenanceContracts`)}
          </span>
        </div>
        <div className='Maintenance-Contracts-wrapper-conteaner'>
          <div className='row-num-1'>
            <div className='form-item'>
              <MaintenanceCompanyComponent
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                selected={selected}
                setSelected={(event) =>
                  setSelected({
                    id: 'MaintenanceCompany',
                    value: event || null,
                  })}
                contactId={state.contactId}
                setcontactId={(event) => {
                  setState({ id: 'contactId', value: event || null });
                }}
                isSubmitted={isSubmitted}
                helperText={getErrorByName(schema, 'contactId').message}
                error={getErrorByName(schema, 'contactId').error}
              />
            </div>
            {!portfolioId && (
              <div className='form-item'>
                <PortfolioCompanyComponent
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  selected={selected.Portfolio}
                  setSelectedProperty={(event) =>
                    setSelected({ id: 'Property', value: event || null })}
                  setSelected={(event) =>
                    setSelected({ id: 'Portfolio', value: event || null })}
                  portfolioId={state.portfolioId}
                  setportfolioId={(event) =>
                    setState({ id: 'portfolioId', value: event || null })}
                  isSubmitted={isSubmitted}
                  helperText={getErrorByName(schema, 'portfolioId').message}
                  error={getErrorByName(schema, 'portfolioId').error}
                />
              </div>
            )}
            <div className='form-item'>
              <PropertyComponent
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                portfolioId={state.portfolioId}
                selected={selected.Property}
                setSelected={(event) =>
                  setSelected({ id: 'Property', value: event || null })}
                propertyId={state.propertyId}
                setpropertyId={(event) =>
                  setState({ id: 'propertyId', value: event || null })}
                isSubmitted={isSubmitted}
                helperText={getErrorByName(schema, 'propertyId').message}
                error={getErrorByName(schema, 'propertyId').error}
              />
            </div>
            <div className='form-item'>
              <ContractdateComponent
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                contractDate={state.contractDate}
                setcontractDate={(event) =>
                  setState({ id: 'contractDate', value: event || null })}
                isSubmitted={isSubmitted}
                helperText={getErrorByName(schema, 'contractDate').message}
                error={getErrorByName(schema, 'contractDate').error}
              />
            </div>
            <div className='form-itemDate'>
              <ContractStartComponent
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                startDate={state.startDate}
                setstartDate={(event) =>
                  setState({ id: 'startDate', value: event || null })}
                isSubmitted={isSubmitted}
                helperText={getErrorByName(schema, 'startDate').message}
                error={getErrorByName(schema, 'startDate').error}
              />
              <ContractEndComponent
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                endDate={state.endDate}
                setendDate={(event) =>
                  setState({ id: 'endDate', value: event || null })}
                isSubmitted={isSubmitted}
                helperText={getErrorByName(schema, 'endDate').message}
                error={getErrorByName(schema, 'endDate').error}
              />
            </div>
          </div>
          <div className='row-num-2'>
            <div className='form-item'>
              <AmountRadioComponent
                amountType={state.amountType}
                setamountType={(event) =>
                  setState({
                    id: 'amountType',
                    value: +event || null,
                  })}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </div>

            {state.amountType === 1 ? (
              <div className='form-item'>
                <AmountAEDComponent
                  amount={state.amount}
                  setamount={(event) =>
                    setState({
                      id: 'amount',
                      value: +event || null,
                    })}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  isSubmitted={isSubmitted}
                  helperText={getErrorByName(schema, 'amount').message}
                  error={getErrorByName(schema, 'amount').error}
                />
              </div>
            ) : (
              ''
            )}
            {state.amountType === 2 ? (
              <div className='form-item'>
                <AmountperComponent
                  amount={state.amount}
                  setamount={(event) =>
                    setState({
                      id: 'amount',
                      value: +event || null,
                    })}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  isSubmitted={isSubmitted}
                  helperText={getErrorByName(schema, 'amount').message}
                  error={getErrorByName(schema, 'amount').error}
                />
              </div>
            ) : (
              ''
            )}
            <div className='form-item'>
              <AmountpaidbyComponent
                amountPaidBy={state.amountPaidBy}
                setamountPaidBy={(event) =>
                  setState({
                    id: 'amountPaidBy',
                    value: +event || null,
                  })}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                isSubmitted={isSubmitted}
                helperText={getErrorByName(schema, 'amountPaidBy').message}
                error={getErrorByName(schema, 'amountPaidBy').error}
              />
            </div>
            <div className='form-item'>
              <NoOfservicesComponent
                state={state.numberOfServices}
                setnumberOfServices={(event) =>
                  setState({
                    id: 'numberOfServices',
                    value: +event || null,
                  })}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                isSubmitted={isSubmitted}
                helperText={getErrorByName(schema, 'numberOfServices').message}
                error={getErrorByName(schema, 'numberOfServices').error}
              />
            </div>
            <div className='form-item'>
              <TermsofpaymentComponent
                termOfPayment={state.termOfPayment}
                state={state.termOfPayment}
                setTermsofpayment={(event) =>
                  setState({
                    id: 'termOfPayment',
                    value: +event || null,
                  })}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                isSubmitted={isSubmitted}
                helperText={getErrorByName(schema, 'termOfPayment').message}
                error={getErrorByName(schema, 'termOfPayment').error}
              />
            </div>
          </div>
          <div className='row-num-3'>
            <div className='form-item'>
              <StatusComponentComponent
                status={state.status}
                setstatus={(event) =>
                  setState({ id: 'status', value: +event || null })}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                isSubmitted={isSubmitted}
                helperText={getErrorByName(schema, 'status').message}
                error={getErrorByName(schema, 'status').error}
              />
            </div>
            <div className='form-item'>
              <NotesComponent
                notes={state.notes}
                setnotes={(event) =>
                  setState({ id: 'notes', value: event || null })}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </div>
            <div className='form-item'>
              <ServicesofferedComponent
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                maintenanceContractServices={
                  state.maintenanceContractServicesIds
                }
                setmaintenanceContractServices={(event) =>
                  setState({
                    id: 'maintenanceContractServicesIds',
                    value: event || null,
                  })}
                selected={selected.maintenanceContractServices}
                setSelected={(event) =>
                  setSelected({
                    id: 'maintenanceContractServices',
                    value: event || null,
                  })}
                isSubmitted={isSubmitted}
                helperText={
                  getErrorByName(schema, 'maintenanceContractServicesIds')
                    .message
                }
                error={
                  getErrorByName(schema, 'maintenanceContractServicesIds').error
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
