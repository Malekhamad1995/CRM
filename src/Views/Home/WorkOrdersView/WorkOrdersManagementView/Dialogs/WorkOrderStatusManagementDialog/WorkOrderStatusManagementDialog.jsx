import React, {
 useCallback, useEffect, useReducer, useState
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import {
  AutocompleteComponent,
  DatePickerComponent,
  DialogComponent,
  Inputs,
  Spinner,
} from '../../../../../../Components';
import { getErrorByName, showError, showSuccess } from '../../../../../../Helper';
import { lookupItemsGetId, CreateWorkOrderStatus } from '../../../../../../Services';
import {
  WorkOrderStatus,
  ActivityPerformedBy,
} from '../../../../../../assets/json/StaticLookupsIds.json';

export const WorkOrderStatusManagementDialog = ({
  id,
  activeItem,
  isOpen,
  onSave,
  isOpenChanged,
  isFromDialog,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [loadings, setLoadings] = useState({
    statuses: false,
    activityPerformedBy: false,
  });
  const reducer = useCallback((state, action) => {
    if (action.index || action.index === 0) {
      if (state[action.id] && state[action.id].length > action.index)
        state[action.id].splice(action.index, 1, action.value);
      else if (state[action.id]) state[action.id].splice(action.index, 0, action.value);
      else return { ...state, [action.id]: action.value };
      return { ...state };
    }
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [selected, setSelected] = useReducer(reducer, {
    status: null,
    activityPerformedBy: null,
  });
  const [state, setState] = useReducer(reducer, {
    workOrderId: id,
    statusId: null,
    activityPerformedById: null,
    dateTime: null,
    remarks: null,
    statusName: null,
  });
  const [activityPerformedBy, setActivityPerformedBy] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const schema = Joi.object({
    statusId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}status-is-required`),
        'number.empty': t(`${translationPath}status-is-required`),
      }),
    dateTime: Joi.any()
      .custom((value, helpers) => {
        if (!value) return helpers.error('state.dateRequired');
        return value;
      })
      .messages({
        'state.dateRequired': t(`${translationPath}status-date-time-is-required`),
      }),
    activityPerformedById: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}activity-per-formed-by-is-required`),
        'number.empty': t(`${translationPath}activity-per-formed-by-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const getAllWorkOrderStatuses = useCallback(async () => {
    setLoadings((items) => ({ ...items, statuses: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: WorkOrderStatus,
    });
    if (!(res && res.status && res.status !== 200)) setStatuses(res || []);
    else setStatuses([]);
    setLoadings((items) => ({ ...items, statuses: false }));
  }, []);
  const getAllActivityPerformedBy = useCallback(async () => {
    setLoadings((items) => ({ ...items, activityPerformedBy: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: ActivityPerformedBy,
    });
    if (!(res && res.status && res.status !== 200)) setActivityPerformedBy(res || []);
    else setActivityPerformedBy([]);
    setLoadings((items) => ({ ...items, activityPerformedBy: false }));
  }, []);
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    if (id) {
      const res = await CreateWorkOrderStatus(state);
      setIsLoading(false);
      if (!(res && res.status && res.status !== 200)) {
        showSuccess(t`${translationPath}work-order-status-created-successfully`);
        onSave({
          ...state,
          statusName: (selected.status && selected.status.lookupItemName) || null,
          workOrderStatusId: res.workOrderStatusId,
        });
      } else showError(t`${translationPath}work-order-status-create-failed`);
    } else {
      onSave({
        ...state,
        statusName: (selected.status && selected.status.lookupItemName) || null,
        WorkOrderStatusId: 0,
      });
    }
  };
  const editInit = useCallback(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      setState({ id: 'edit', value: activeItem });
      if (state.statusId && !selected.status && statuses.length > 0) {
        const statusIndex = statuses.findIndex((item) => item.lookupItemId === state.statusId);
        if (statusIndex !== -1) setSelected({ id: 'status', value: statuses[statusIndex] });
        else setState({ id: 'statusId', value: null });
      }
      if (
        state.activityPerformedById &&
        !selected.activityPerformedBy &&
        activityPerformedBy.length > 0
      ) {
        const activityPerformedByIndex = activityPerformedBy.findIndex(
          (item) => item.lookupItemId === state.activityPerformedById
        );
        if (activityPerformedByIndex !== -1) {
          setSelected({
            id: 'activityPerformedBy',
            value: activityPerformedBy[activityPerformedByIndex],
          });
        } else setState({ id: 'activityPerformedById', value: null });
      }
    }
  }, [activeItem, activityPerformedBy, isFirstLoad, selected, state, statuses]);

  useEffect(() => {
    if (activeItem) editInit();
  }, [activeItem, editInit]);
  useEffect(() => {
    if (id) setState({ id: 'workOrderId', value: id });
  }, [id]);
  useEffect(() => {
    getAllWorkOrderStatuses();
    getAllActivityPerformedBy();
  }, [getAllActivityPerformedBy, getAllWorkOrderStatuses]);
  return (
    <DialogComponent
      titleText='status'
      saveText='save'
      maxWidth='sm'
      dialogContent={(
        <div className='work-order-status-management-dialog view-wrapper'>
          <Spinner isActive={isLoading} isAbsolute />
          <div className='w-100 mb-2'>
            <AutocompleteComponent
              idRef='statusIdRef'
              labelValue='status'
              selectedValues={selected.status}
              multiple={false}
              data={statuses}
              displayLabel={(option) => option.lookupItemName || ''}
              getOptionSelected={(option) => option.lookupItemId === state.statusId}
              withoutSearchButton
              helperText={getErrorByName(schema, 'statusId').message}
              error={getErrorByName(schema, 'statusId').error}
              isWithError
              isLoading={loadings.statuses}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onChange={(event, newValue) => {
                setSelected({ id: 'status', value: newValue });
                setState({
                  id: 'statusId',
                  value: (newValue && newValue.lookupItemId) || null,
                });
                setState({
                  id: 'statusName',
                  value: (newValue && newValue.lookupItemName) || null,
                });
              }}
            />
          </div>
          <div className='w-100 mb-2'>
            <AutocompleteComponent
              idRef='activityPerformedByIdRef'
              labelValue='activity-performed-by'
              selectedValues={selected.activityPerformedBy}
              multiple={false}
              data={activityPerformedBy}
              displayLabel={(option) => option.lookupItemName || ''}
              getOptionSelected={(option) => option.lookupItemId === state.activityPerformedById}
              withoutSearchButton
              helperText={getErrorByName(schema, 'activityPerformedById').message}
              error={getErrorByName(schema, 'activityPerformedById').error}
              isWithError
              isLoading={loadings.activityPerformedBy}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onChange={(event, newValue) => {
                setSelected({ id: 'activityPerformedBy', value: newValue });
                setState({
                  id: 'activityPerformedById',
                  value: (newValue && newValue.lookupItemId) || null,
                });
              }}
            />
          </div>
          <div className='w-100 mb-2'>
            <DatePickerComponent
              idRef='statusDateRef'
              labelValue='status-date'
              placeholder='DD/MM/YYYY'
              value={state.dateTime}
              helperText={getErrorByName(schema, 'dateTime').message}
              error={getErrorByName(schema, 'dateTime').error}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onDateChanged={(newValue) => {
                setState({ id: 'dateTime', value: newValue });
              }}
            />
          </div>
          <div className='w-100 mb-2'>
            <DatePickerComponent
              idRef='statusTimeRef'
              labelValue='status-time'
              isTimePicker
              value={state.dateTime}
              helperText={getErrorByName(schema, 'dateTime').message}
              error={getErrorByName(schema, 'dateTime').error}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onDateChanged={(newValue) => {
                setState({ id: 'dateTime', value: newValue });
              }}
            />
          </div>
          <div className='w-100 mb-2'>
            <Inputs
              idRef='remarksRef'
              labelValue='remarks'
              value={state.remarks || ''}
              helperText={getErrorByName(schema, 'remarks').message}
              error={getErrorByName(schema, 'remarks').error}
              isWithError
              isSubmitted={isSubmitted}
              multiline
              rows={4}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                setState({ id: 'remarks', value: event.target.value });
              }}
            />
          </div>
        </div>
      )}
      isOpen={isOpen}
      onSubmit={(!isFromDialog && saveHandler) || undefined}
      onSaveClicked={(isFromDialog && saveHandler) || undefined}
      saveType={(isFromDialog && 'button') || 'submit'}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

WorkOrderStatusManagementDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  isOpen: PropTypes.bool.isRequired,
  isFromDialog: PropTypes.bool.isRequired,
  id: PropTypes.number,
  onSave: PropTypes.func.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
WorkOrderStatusManagementDialog.defaultProps = {
  activeItem: null,
  id: undefined,
};
