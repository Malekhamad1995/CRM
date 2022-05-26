import React, {
 useCallback, useEffect, useReducer, useRef, useState
} from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Joi from 'joi';
import moment from 'moment';
import {
  bottomBoxComponentUpdate,
  getErrorByName,
  GetParams,
  GlobalHistory,
  showError,
  showSuccess,
} from '../../../../../../Helper';
import {
  AutocompleteComponent,
  DatePickerComponent,
  Inputs,
  Spinner,
} from '../../../../../../Components';
import {
  IncidentsGetAllPropertyByPortfolioId,
  UpdateIncident,
  GetIncidentById,
  GetAllPortfolio,
  CreateIncident,
} from '../../../../../../Services';

export const IncidentsReferenceComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const [incidentId, setincidentId] = useState(null);
  const searchTimer = useRef(null);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [selected, setSelected] = useReducer(reducer, {
    Portfolio: null,
    AllProperty: null,
  });
  const [state, setState] = useReducer(reducer, {
    PortfolioId: null,
    PropertyId: null,
    Reportedby: null,
    occurredOn: null,
    Title: null,
    Description: null,
    Action: null,
  });
  const schema = Joi.object({
    PortfolioId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}Portfolio-Name-is-required`),
        'number.empty': t(`${translationPath}Portfolio-Name-is-required`),
      }),
    PropertyId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}communication-media-is-required`),
        'number.empty': t(`${translationPath}communication-media-is-required`),
      }),
    occurredOn: Joi.date()
      .required()
      .messages({
        'number.base': t(`${translationPath}communication-media-is-required`),
        'number.empty': t(`${translationPath}communication-media-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);

  const [Portfolio, setPortfolio] = useState([]);
  const [AllProperty, setAllProperty] = useState([]);
  const [loadings, setLoadings] = useState({
    Portfolio: false,
    AllProperty: false,
  });

  const [filter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
  });

  const getAllPortfolio = useCallback(async () => {
    setLoadings((items) => ({ ...items, Portfolio: true }));
    const res = await GetAllPortfolio(filter);
    if (!(res && res.status && res.status !== 200)) setPortfolio((res && res.result) || []);
    else setPortfolio([]);
    setLoadings((items) => ({ ...items, Portfolio: false }));
  }, [filter]);

  const GetAllPropertyByPortfolioId = useCallback(async (PortfolioId) => {
    setLoadings((items) => ({ ...items, AllProperty: true }));
    const res = await IncidentsGetAllPropertyByPortfolioId(PortfolioId, 1, 100);
    if (!(res && res.status && res.status !== 200)) setAllProperty((res && res.result) || []);
    else setAllProperty([]);
    setLoadings((items) => ({ ...items, AllProperty: false }));
  }, []);

  const GetIncidentEdit = useCallback(async (id) => {
    setIsLoading(true);
    const res = await GetIncidentById(id);
    if (!(res && res.status && res.status !== 200)) {
      setState({
        id: 'edit',
        value: {
          PortfolioId: res.portfolioId,
          PropertyId: res.propertyId,
          Reportedby: res.reportedBy,
          occurredOn: res.occurredOn,
          Title: res.title,
          Description: res.description,
          Action: res.action,
        },
      });
      setSelected({ id: 'Portfolio', value: res });
      setSelected({ id: 'AllProperty', value: res });
      setIsLoading(false);
    } else setIsLoading(false);
  }, []);

  const cancelHandler = () => {
    GlobalHistory.push('/home/Incidents/view');
  };
  const saveHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    try {
      const res =
        (await isEdit) === true ? UpdateIncident(incidentId, state) : CreateIncident(state);
      if (!(res && res.status && res.status !== 200)) {
        if (isEdit) {
          showSuccess(t`${translationPath}updated-Incidents-successfully`);
          GlobalHistory.push('/home/Incidents/view');
        } else {
          showSuccess(t`${translationPath}created-Incidents-successfully`);
          GlobalHistory.push('/home/Incidents/view');
        }
      } else if (isEdit) showError(t(`${translationPath}update-Incidents-failed`));
      else showError(t`${translationPath}create-Incidents-failed`);
      setIsLoading(false);
    } catch (error) {
      showError(t`${translationPath}create failed`);
    }
  }, [incidentId, isEdit, schema.error, state, t, translationPath]);

  useEffect(() => {
    getAllPortfolio();
  }, [getAllPortfolio]);
  useEffect(() => {
    GetAllPropertyByPortfolioId(state.PortfolioId);
  }, [state.PortfolioId, getAllPortfolio, GetAllPropertyByPortfolioId]);

  useEffect(() => {
    if (+GetParams('id') !== 0 || null || undefined) {
      setisEdit(true);
      setincidentId(+GetParams('id'));
      GetIncidentEdit(+GetParams('id'));
    } else setisEdit(false);
  }, [GetIncidentEdit]);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase className='btns theme-transparent mb-2' onClick={cancelHandler}>
          <span>{t('Shared:cancel')}</span>
        </ButtonBase>
        <ButtonBase className='btns theme-solid mb-2' disabled={schema.error} onClick={saveHandler}>
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
    <div className='work-order-reference-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='work-order-reference-body'>
        <div className='form-item'>
          <AutocompleteComponent
            idRef='PortfolioName'
            labelValue='PortfolioName'
            selectedValues={selected.Portfolio}
            multiple={false}
            data={Portfolio}
            displayLabel={(option) => option.portfolioName || ''}
            getOptionSelected={(option) => option.portfolioName === state.portfolioId}
            withoutSearchButton
            helperText={getErrorByName(schema, 'PortfolioId').message}
            error={getErrorByName(schema, 'PortfolioId').error}
            isWithError
            isLoading={loadings.Portfolio}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setSelected({ id: 'Portfolio', value: newValue });
              setState({
                id: 'PortfolioId',
                value: (newValue && newValue.portfolioId) || null,
              });
              setSelected({ id: 'AllProperty', value: { propertyId: '', propertyName: '' } });
            }}
          />
        </div>
        <div className='form-item'>
          <AutocompleteComponent
            idRef='Property-nameRef'
            labelValue='Property-name'
            selectedValues={selected.AllProperty}
            multiple={false}
            data={AllProperty}
            displayLabel={(option) => option.propertyName || `${option.propertyId}` || ''}
            withoutSearchButton
            helperText={getErrorByName(schema, 'PropertyId').message}
            error={getErrorByName(schema, 'PropertyId').error}
            isWithError
            isLoading={loadings.AllProperty}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onChange={(event, newValue) => {
              setSelected({ id: 'AllProperty', value: newValue });
              setState({
                id: 'PropertyId',
                value: (newValue && newValue.propertyId) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <DatePickerComponent
            idRef='curredonDateRef'
            labelValue='curredon-date-description'
            placeholder='DD/MM/YYYY'
            value={state.occurredOn}
            helperText={getErrorByName(schema, 'occurredOn').message}
            error={getErrorByName(schema, 'occurredOn').error}
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onDateChanged={(newValue) => {
              setState({
                id: 'occurredOn',
                value: (newValue && moment(newValue).format()) || null,
              });
            }}
          />
        </div>
        <div className='form-item'>
          <Inputs
            idRef='TitleRef'
            labelValue='Title'
            value={state.Title}
            isWithError
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              const { value } = event.target;
              setState({ id: 'Title', value });
            }}
          />
        </div>
        <div className='form-item'>
          <Inputs
            idRef='ReportedbyRef'
            labelValue='Reportedby'
            value={state.Reportedby}
            isWithError
            isSubmitted={isSubmitted}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              const { value } = event.target;
              setState({ id: 'Reportedby', value });
            }}
          />
        </div>
        <div className='form-item'>
          <Inputs
            idRef='DescriptionRef'
            labelValue='Description'
            value={state.Description}
            isWithError
            isSubmitted={isSubmitted}
            multiline
            rows={5}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              const { value } = event.target;
              setState({ id: 'Description', value });
            }}
          />
        </div>
        <div className='form-item'>
          <Inputs
            idRef='problemsOrRemarksRef'
            labelValue='Action'
            value={state.Action}
            isWithError
            isSubmitted={isSubmitted}
            multiline
            rows={5}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onInputChanged={(event) => {
              setState({ id: 'Action', value: event.target.value });
            }}
          />
        </div>
      </div>
    </div>
  );
};

IncidentsReferenceComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
