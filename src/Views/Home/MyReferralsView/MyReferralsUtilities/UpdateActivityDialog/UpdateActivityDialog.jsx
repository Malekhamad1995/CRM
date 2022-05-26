import React, {
  useCallback, useEffect, useReducer, useState
} from 'react';
import Joi from 'joi';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { CreateActivity, GetAllActivityTypes } from '../../../../../Services';
import { getErrorByName, showError, showSuccess } from '../../../../../Helper';
import { AutocompleteComponent, DialogComponent, Inputs } from '../../../../../Components';

export const UpdateActivityDialog = ({
  isOpen,
  reloadData,
  activeItem,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [selected, setSelected] = useReducer(reducer, {
    activity: null,
  });
  const [loadings, setLoadings] = useReducer(reducer, {
    activity: false,
  });
  const [data, setData] = useReducer(reducer, {
    activity: [],
  });
  const defaultState = {
    assignAgentId: null,
    activityDate: null,
    relatedLeadNumberId: null,
    relatedUnitNumberId: null,
    relatedPortfolioId: null,
    relatedWorkOrderId: null,
    relatedMaintenanceContractId: null,
    activityTypeId: null,
    subject: null,
    comments: null,
    isOpen: true,
    activityReminders: null,
  };
  const [state, setState] = useReducer(reducer, defaultState);
  useEffect(() => {
    if (activeItem && loginResponse) {
      setState({
        id: 'edit',
        value: {
          assignAgentId: loginResponse && loginResponse.userId,
          activityDate: moment(new Date()).format(),
          relatedLeadNumberId: activeItem && activeItem.id,
          relatedUnitNumberId: null,
          relatedPortfolioId: null,
          relatedWorkOrderId: null,
          relatedMaintenanceContractId: null,
          activityTypeId: null,
          subject: null,
          comments: null,
          isOpen: true,
          activityReminders: null,
        },
      });
    }
  }, [activeItem, loginResponse]);
  const getAllActivityTypes = useCallback(async () => {
    setLoadings({ id: 'activity', value: true });
    const res = await GetAllActivityTypes();
    if (!(res && res.status && res.status !== 200)) {
      setData({
        id: 'activity',
        value: res || [],
      });
    } else {
      setData({
        id: 'activity',
        value: [],
      });
    }
    setLoadings({ id: 'activity', value: false });
  }, []);
  useEffect(() => {
    getAllActivityTypes();
  }, [getAllActivityTypes]);
  const schema = Joi.object({
    activityTypeId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}activity-type-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    const res = await CreateActivity(state);
    if (!(res && res.status && res.status !== 200)) {
      reloadData();
      showSuccess(t(`${translationPath}activity-created-successfully`));
    } else showError(t(`${translationPath}activity-create-failed`));
    isOpenChanged();
  };
  return (
    <DialogComponent
      titleText='update-activity'
      saveText='update'
      saveType='button'
      maxWidth='sm'
      dialogContent={(
        <div className='form-wrapper px-5'>
          <div className='px-2 mb-3'>
            <span className='fw-bold fz-15px c-primary'>
              {t(`${translationPath}lead`)}
              :
              {`  ${(activeItem && activeItem.name && activeItem.name) || 'N/A'}  `}
              {`( ${(activeItem && activeItem.id && activeItem.id) || 'N/A'} )`}
            </span>
          </div>
          <div className='form-item mb-3'>
            <AutocompleteComponent
              idRef='activityTypeIdRef'
              labelValue='activity'
              selectedValues={selected.activity}
              multiple={false}
              data={data.activity}
              helperText={getErrorByName(schema, 'activityTypeId').message}
              error={getErrorByName(schema, 'activityTypeId').error}
              isLoading={loadings.activity}
              isWithError
              isSubmitted={isSubmitted}
              displayLabel={(option) => option.activityTypeName || ''}
              groupBy={(option) => option.categoryName || ''}
              getOptionSelected={(option) => option.activityTypeId === state.activityTypeId}
              withoutSearchButton
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onChange={(event, newValue) => {
                setSelected({ id: 'activity', value: newValue });
                setState({
                  id: 'subject',
                  value: (newValue && newValue.activityTypeName) || null,
                });
                setState({
                  id: 'activityTypeId',
                  value: (newValue && newValue.activityTypeId) || null,
                });
              }}
            />
          </div>
          <div className='form-item mb-3'>
            <Inputs
              isDisabled
              value={
                (selected.activity && selected.activity.leadStageName) ||
                t(`${translationPath}not-contacted`)
              }
              idRef='leadStageRef'
              labelValue='lead-stage'
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
          </div>
          <div className='form-item'>
            <Inputs
              multiline
              rows={4}
              idRef='firstNameRef'
              labelValue='extra-update'
              value={state.comments || ''}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              onInputChanged={(event) => setState({ id: 'comments', value: event.target.value })}
            />
          </div>
        </div>
      )}
      isOpen={isOpen}
      onSaveClicked={saveHandler}
      onCancelClicked={isOpenChanged}
      translationPath={translationPath}
      parentTranslationPath={parentTranslationPath}
      saveClasses='btns theme-solid bg-primary w-100 mx-2 mb-2'
    />
  );
};
UpdateActivityDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  reloadData: PropTypes.func.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  activeItem: PropTypes.instanceOf(Object).isRequired,
};
