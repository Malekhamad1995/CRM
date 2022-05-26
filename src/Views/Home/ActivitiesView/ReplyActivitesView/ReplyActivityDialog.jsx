/* eslint-disable prefer-const */
import React, {
  useCallback, useEffect, useReducer, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import {
  DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import moment from 'moment';
import {
  AutocompleteComponent,
  DataFileAutocompleteComponent,
  DatePickerComponent,
  Inputs,
  SelectComponet,
  Spinner
} from '../../../../Components';
import {
  floatHandler, getErrorByName, showError, showSuccess
} from '../../../../Helper';
import {
  OrganizationUserSearch,
  GetAllReplyActivityType,
  CreateActivity,
} from '../../../../Services';
import { ReminderTypesEnum } from '../../../../Enums';
import { GetActivityTypeById } from '../../../../Services/ActivitiesTypesServices';

export const ReplyActivityDialog = ({
  open,
  close,
  activeItem,
  onSave,
  parentTranslationPath,
  translationPath,

}) => {
  const pathName = window.location.pathname.split('/home/')[1];
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const searchTimer = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reminder, setReminder] = useState();
  // eslint-disable-next-line no-unused-vars
  const [relatedTo,
    setRelatedTo] = useState();
  const [AssignActivity, setAssignActivity] = useState(false);
  const [reminderAmountOfTimeTypes] = useState([
    {
      key: 1,
      value: 'minutes',
      momentKey: 'minutes',
    },
    {
      key: 2,
      value: 'hours',
      momentKey: 'hours',
    },
    {
      key: 3,
      value: 'days',
      momentKey: 'days',
    },
  ]);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [rols, setrols] = useState([]);
  const [loadings, setLoadings] = useReducer(reducer, {
    activityAssignments: false,
    activityTypes: false,
    units: false,
    relatedUnits: false,
    relatedLeads: false,
    relatedPortfolio: false,
    relatedWorkOrder: false,
    maintenanceContract: false,
    relatedMaintenanceContractId: false,
  });
  const [selected, setSelected] = useReducer(reducer, {
    activityAssign: null,
    activityType: null,
    unit: null,
    activeFormType: pathName === 'Activities' ? 1 : 3,
    relatedUnit: null,
    relatedLead: null,
    relatedPortfolio: null,
    relatedWorkOrder: null,
    relatedMaintenanceContractId: null,
    reminderPersons: [],
    maintenanceContract: null,
  });
  const [data, setData] = useReducer(reducer, {
    activityAssignments: [],
    activityTypes: [],
    units: [],
    relatedLeads: [],
    relatedUnits: [],
    relatedPortfolio: [],
    relatedWorkOrder: [],
    maintenanceContract: [],
    relatedMaintenanceContractId: [],
  });
  const [state, setState] = useReducer(reducer, {
    assignAgentId: null,
    activityTypeId: null,
    unitId: null,
    relatedLeadNumberId: null,
    relatedUnitNumberId: null,
    relatedPortfolioId: null,
    relatedMaintenanceContractId: null,
    maintenanceContract: null,
    relatedWorkOrderId: null,
    activityDate: moment().add(2, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
    subject: null,
    comments: null,
    isOpen: true,
    activityReminders: [],
  });

  const defaultActivityReminderItem = useRef({
    reminderType: 1,
    contactId: null,
    usersId: null,
    reminderTime: state.activityDate,
    reminderAmountOfTimeTypes: 1,
  });
  const getTimeValue = (item) => {
    if (!state.activityDate) return 0;
    const currentTimeAmountType = reminderAmountOfTimeTypes.find(
      (items) => items.key === (item.reminderAmountOfTimeType || 1)
    );
    return moment(state.activityDate).diff(item.reminderTime, currentTimeAmountType.momentKey);
  };
  const schema = Joi.object({
    assignAgentId: Joi.string()
      .required()
      .messages({
        'string.base': t(`${translationPath}activity-assign-to-is-required`),
      }),
    relatedMaintenanceContractId: Joi.any().custom((value, helpers) => {
      if (!value && selected.activeFormType === 5)
        return helpers.error('relatedMaintenanceContractId');
      return value;
    }),
    activityTypeId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}activity-type-is-required`),
      }),
    activityDate: Joi.date()
      .required()
      .greater(Date.now())
      .messages({
        'date.base': t(`${translationPath}activity-date-is-required`),
        'date.greater': t(`${translationPath}choose-time-after-now`),
      }),
    relatedUnitNumberId: Joi.any()
      .custom((value, helpers) => {
        if (!value && selected.activeFormType === 1) return helpers.error('state.required');
        return value;
      })
      .messages({
        'state.required': t(`${translationPath}related-to-unit-is-required`),
      }),
    relatedLeadNumberId: Joi.any()
      .custom((value, helpers) => {
        if (!value && selected.activeFormType === 2) return helpers.error('state.required');
        return value;
      })
      .messages({
        'state.required': t(`${translationPath}related-to-lead-is-required`),
      }),
    relatedWorkOrderId: Joi.any()
      .custom((value, helpers) => {
        if (!value && selected.activeFormType === 3) return helpers.error('state.required');
        return value;
      })
      .messages({
        'state.required': t(`${translationPath}work-order-is-required`),
      }),
    relatedPortfolioId: Joi.any()
      .custom((value, helpers) => {
        if (!value && selected.activeFormType === 4) return helpers.error('state.required');
        return value;
      })
      .messages({
        'state.required': t(`${translationPath}portfolio-is-required`),
      }),
    activityReminders:
      (reminder &&
        Joi.array().items(
          Joi.object({
            reminderType: Joi.any(),
            contactId: Joi.any(),
            usersId: Joi.any(),
            reminderTime: Joi.any(),
          })
            .custom((value, helpers) => {
              if (
                !value.contactId &&
                !value.usersId &&
                ((value.reminderTime && getTimeValue(value)) || 0) > 0
              )
                return helpers.error('state.userNotSet');
              if (
                (value.contactId || value.usersId) &&
                ((value.reminderTime && getTimeValue(value)) || 0) === 0
              )
                return helpers.error('state.timeIsZero');
              return value;
            })
            .messages({
              'state.userNotSet': t(`${translationPath}reminder-for-is-required`),
              'state.timeIsZero': t(`${translationPath}time-must-be-greater-than-zero`),
            })
        )) ||
      Joi.any(),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const getAllActivityAssignments = useCallback(
    async (value, selectedValue) => {
      setLoadings({ id: 'activityAssignments', value: true });
      const res = await OrganizationUserSearch({
        ...filter,
        rolesIds: rols,
        name: value,
      });
      if (!(res && res.status && res.status !== 200)) {
        const localValue = (res && res.result) || [];
        if (selectedValue && localValue.findIndex((item) => item.id === selectedValue.id) === -1)
          value.push(selectedValue);

        setData({
          id: 'activityAssignments',
          value: localValue,
        });
      } else {
        setData({
          id: 'activityAssignments',
          value: [],
        });
      }
      setLoadings({ id: 'activityAssignments', value: false });
    },
    [filter, rols]
  );

  const getAllActivityTypes = useCallback(async () => {
    setIsLoading(true);
    setLoadings({ id: 'activityTypes', value: true });
    const res = await GetAllReplyActivityType(activeItem && activeItem.activityTypeId);
    if (!(res && res.status && res.status !== 200)) {
      setData({
        id: 'activityTypes',
        value: res || [],
      });
    } else {
      setData({
        id: 'activityTypes',
        value: [],
      });
    }
    setLoadings({ id: 'activityTypes', value: false });
    setIsLoading(false);
  }, [activeItem]);

  const GetActivityType = useCallback(async () => {
    setLoadings({ id: 'activityTypes', value: true });
    if (selected.activityType !== null) {
      const res = await GetActivityTypeById((state && state.activityTypeId) || (activeItem && activeItem.activityTypeId));
      if (!(res && res.status && res.status !== 200)) {
        setReminder(res.withReminder);
        setRelatedTo(res.relatedTo);
      } else {
        setReminder(res.withReminder);
        setRelatedTo(res.relatedTo);
      }
    }
    setLoadings({ id: 'activityTypes', value: false });
  }, [activeItem, selected.activityType, setRelatedTo, state]);

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    setIsLoading(true);
    if (state.activityDate && state.activityDate <= moment().format('YYYY-MM-DDTHH:mm:ss')) {
      showError(t(`${translationPath}choose-time-after-now`));
      setIsLoading(false);
      return;
    }

    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      setIsLoading(false);
      return;
    }

    let saveState = { ...state };
    saveState.relatedActivityToId = activeItem.activityId;
    saveState.isOpen = true;
    saveState.activityReminders = saveState && saveState.activityReminders && saveState.activityReminders.length > 0 && saveState.activityReminders.filter(
      (item) => item.reminderTime !== 0 && (item.usersId || item.contactId)
    );
    const res =
      (activeItem &&
        activeItem.activityId &&
        (await CreateActivity(saveState)));
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t`${translationPath}activity-reply-create-successfully`);
      if (onSave) onSave();
    } else
      showError(t`${translationPath}activity-reply-create-failed`);
  };
  const reminderTimeCalculateHandler = useCallback(
    (item, value, type) => {
      const currentTimeAmountType = reminderAmountOfTimeTypes.find(
        (items) => items.key === (type || item.reminderAmountOfTimeType || 1)
      );
      let newTimeValue = moment(state.activityDate)
        .add(-value, currentTimeAmountType.momentKey)
        .format('YYYY-MM-DDTHH:mm:ss');
      if (moment(newTimeValue).isBefore(moment().format('YYYY-MM-DDTHH:mm:ss')))
        newTimeValue = moment().format('YYYY-MM-DDTHH:mm:ss');
      item.reminderTime = newTimeValue;
      setState({
        id: 'activityReminders',
        value: state.activityReminders,
      });
    },
    [reminderAmountOfTimeTypes, state.activityDate, state.activityReminders]
  );

  const reminderTimeChangeHandler = useCallback(
    (item) => (event) => {
      const value = floatHandler(event.target.value, 0);
      reminderTimeCalculateHandler(item, value);
    },
    [reminderTimeCalculateHandler]
  );
  const reminderDecrementHandler = useCallback(
    (index) => () => {
      const localActivityReminders = [...state.activityReminders];
      localActivityReminders.splice(index, 1);
      setState({
        id: 'activityReminders',
        value: localActivityReminders,
      });
    },
    [state.activityReminders]
  );
  const reminderIncrementHandler = useCallback(
    (index) => () => {
      const localActivityReminders = [...state.activityReminders];
      localActivityReminders.splice(index + 1, 0, { ...defaultActivityReminderItem.current });
      setState({
        id: 'activityReminders',
        value: localActivityReminders,
      });
    },
    [state.activityReminders]
  );
  useEffect(() => {
    setIsLoading(true);
    if (activeItem) {
      getAllActivityTypes();
      GetActivityType();
    }
    setIsLoading(false);
  }, [
    getAllActivityTypes,
    GetActivityType,
    activeItem
  ]);

  useEffect(() => {
    getAllActivityAssignments();
  }, [getAllActivityAssignments, rols]);
  useEffect(() => {
    if (activeItem) {
      setState({
        id: 'edit',
        value: {
          relatedMaintenanceContractId: activeItem.relatedMaintenanceContractId,
          unitId: activeItem.unitId,
          relatedLeadNumberId: activeItem.relatedLeadNumberId,
          relatedUnitNumberId: activeItem.relatedUnitNumberId,
          activityDate: state.activityDate,
          activityReminders: activeItem.activityReminders || [],
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem]);
  useEffect(() => {
    if (activeItem) {
      const activityAssign = {
        id: activeItem.agentUserId,
        userName: activeItem.agentUsername,
        fullName: activeItem.agentName,
      };
      const reminderPersons = [
        { id: activityAssign.id, value: activityAssign.fullName, type: 'user' },
      ];
      const relatedLead =
        (activeItem.relatedLeadNumberId && {
          leadId: activeItem.relatedLeadNumberId,
          lead: (activeItem.type === 1 && {
            contact_name: {
              name: activeItem.contactName || 'N/A',
            },
          }) || {
            company_name: activeItem.contactName || 'N/A',
          },
        }) ||
        null;
      if (relatedLead) {
        reminderPersons.push({
          id: relatedLead.leadId,
          value:
            (activeItem.type === 1 && relatedLead.lead.contact_name.name) ||
            relatedLead.lead.company_name,
          type: 'contact',
        });
      }
      setSelected({
        id: 'edit',
        value: {
          activityAssign,
          activeFormType:
            (activeItem.relatedUnitNumberId && 1) ||
            (activeItem.relatedLeadNumberId && 2) ||
            (activeItem.relatedWorkOrderId && 3) ||
            (activeItem.relatedPortfolioId && 4) ||
            (activeItem.relatedMaintenanceContractId && 5) ||
            1,
          relatedMaintenanceContractId: activeItem.relatedMaintenanceContractId,
          unit:
            (activeItem.unitId && {
              id: activeItem.unitId,
              propertyName: null,
            }) ||
            null,
          relatedLead,
          relatedUnit:
            (activeItem.relatedUnitNumberId && {
              id: activeItem.relatedUnitNumberId,
              propertyName: null,
              unitRefNo: activeItem.relatedUnitNumber,
            }) ||
            null,
          reminderPersons,
          relatedPortfolio: {
            portfolioId: activeItem.relatedPortfolioId,
            portfolioName: activeItem.relatedPortfolioName,
          },
          relatedWorkOrder: {
            workOrderId: activeItem.relatedWorkOrderId,
            referenceNo: activeItem.relatedWorkOrderRefNumber,
          },
          maintenanceContract: {
            contactName: String(activeItem.relatedMaintenanceContractId),
            maintenanceContractId: activeItem.relatedMaintenanceContractId,
          },
        },
      });
      if (pathName === 'activities-management') {
        if (activeItem && activeItem.relatedWorkOrderId) {
          setSelected({
            id: 'activeFormType',
            value: 3,
          });
        } else if (activeItem && activeItem.relatedPortfolioId) {
          setSelected({
            id: 'activeFormType',
            value: 4,
          });
        } else if (activeItem && activeItem.relatedMaintenanceContractId) {
          setSelected({
            id: 'activeFormType',
            value: 5,
          });
        }
      }
      if (pathName === 'Activities') {
        if (activeItem && activeItem.relatedUnitNumberId) {
          setSelected({
            id: 'activeFormType',
            value: 1,
          });
        }
        if (activeItem && activeItem.relatedLeadNumberId) {
          setSelected({
            id: 'activeFormType',
            value: 2,
          });
        }
        if (activeItem && activeItem.relatedWorkOrderId) {
          setSelected({
            id: 'activeFormType',
            value: 3,
          });
        } else if (activeItem && activeItem.relatedPortfolioId) {
          setSelected({
            id: 'activeFormType',
            value: 4,
          });
        } else if (activeItem && activeItem.relatedMaintenanceContractId) {
          setSelected({
            id: 'activeFormType',
            value: 5,
          });
        }
      }
    }
  }, [activeItem, pathName]);
  useEffect(() => {
    if (
      state.activityReminders &&
      state.activityReminders.length === 0
    ) {
      setState({
        id: 'activityReminders',
        value: [{ ...defaultActivityReminderItem.current }],
      });
    }
  }, [state]);

  useEffect(() => {
    if (activeItem) {
      const assignIndex = data.activityAssignments.findIndex(
        (item) => item.id === activeItem.agentUserId
      );
      const unitIndex = data.units.findIndex((item) => item.id === activeItem.unitId);
      const relatedUnitIndex = data.relatedUnits.findIndex(
        (item) => item.id === activeItem.relatedUnitNumberId
      );
      const relatedLeadIndex = data.relatedLeads.findIndex(
        (item) => item.leadId === activeItem.relatedLeadNumberId
      );
      if (assignIndex === -1) {
        const activityAssign = {
          id: activeItem.agentUserId,
          userName: activeItem.agentUsername,
          fullName: activeItem.agentName,
        };
        data.activityAssignments.push(activityAssign);
      }
      const unit =
        (activeItem.unitId && {
          id: activeItem.unitId,
          propertyName: null,
        }) ||
        null;
      if (unitIndex === -1 && unit) if (unit) data.units.push(unit);

      const relatedUnit =
        (activeItem.relatedUnitNumberId && {
          id: activeItem.relatedUnitNumberId,
          propertyName: null,
        }) ||
        null;
      if (relatedUnitIndex === -1 && relatedUnit) data.relatedUnits.push(relatedUnit);

      const relatedLead =
        (activeItem.relatedLeadNumberId && {
          leadId: activeItem.relatedLeadNumberId,
          lead: (activeItem.type === 1 && {
            contact_name: {
              name: activeItem.contactName || 'N/A',
            },
          }) || {
            company_name: activeItem.contactName || 'N/A',
          },
        }) ||
        null;
      if (relatedLeadIndex === -1 && relatedLead) data.relatedLeads.push(relatedLead);

      if (
        assignIndex === -1 ||
        (unitIndex === -1 && unit) ||
        (relatedUnitIndex === -1 && relatedUnit) ||
        (relatedLeadIndex === -1 && relatedLead)
      )
        setData({ id: 'edit', value: data });
    }
  }, [activeItem, data]);
  useEffect(() => {
    if (state.activityTypeId == null) {
      setAssignActivity(true);
      setState({
        id: 'assignAgentId',
        value: null,
      });
      setSelected({ id: 'activityAssign', value: null });
    } else setAssignActivity(false);
  }, [state.activityTypeId]);

  return (
    <div>
      {activeItem && activeItem.isReplyAble && (
        <Dialog
          open={open}
          onClose={() => {
            close();
          }}
          className='activities-management-dialog-wrapper'
        >
          <Spinner isActive={isLoading} isAbsolute />

          <form noValidate onSubmit={saveHandler}>
            <DialogTitle id='alert-dialog-slide-title'>
              {t(`${translationPath}reply-activity`)}
            </DialogTitle>
            <DialogContent>
              <div className='dialog-content-wrapper'>
                <div className='dialog-content-item'>
                  <AutocompleteComponent
                    idRef='activityTypeIdRef'
                    labelValue='activity-type'
                    labelClasses='Requierd-Color'
                    selectedValues={selected.activityType}
                    multiple={false}
                    data={data.activityTypes}
                    displayLabel={(option) => option.activityTypeName || ''}
                    groupBy={(option) => option.categoryName || ''}
                    getOptionSelected={(option) => option.activityTypeId === state.activityTypeId}
                    withoutSearchButton
                    helperText={getErrorByName(schema, 'activityTypeId').message}
                    error={getErrorByName(schema, 'activityTypeId').error}
                    isLoading={loadings.activityTypes}
                    isWithError
                    isSubmitted={isSubmitted}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    onChange={(event, newValue) => {
                      setState({
                        id: 'subject',
                        value: (newValue && newValue.activityTypeName) || null,
                      });
                      setSelected({ id: 'activityType', value: newValue });
                      setState({
                        id: 'activityTypeId',
                        value: (newValue && newValue.activityTypeId) || null,
                      });
                      const assignedToActivityTypeRoles =
                        (newValue && newValue.assignedToActivityTypeRoles) || [];
                      const rolesIds =
                        assignedToActivityTypeRoles &&
                        assignedToActivityTypeRoles.map((item) => item.rolesId || []);
                      setrols(rolesIds);
                      setState({
                        id: 'assignAgentId',
                        value: (newValue && newValue.id) || null,
                      });
                      setSelected({ id: 'activityAssign', value: null });
                    }}
                  />
                </div>
                <div className='dialog-content-item'>
                  <AutocompleteComponent
                    idRef='assignAgentIdRef'
                    labelClasses='Requierd-Color'
                    labelValue='activity-assign-to'
                    isDisabled={AssignActivity}
                    selectedValues={selected.activityAssign}
                    multiple={false}
                    data={data.activityAssignments}
                    displayLabel={(option) => option.fullName || ''}
                    renderOption={(option) =>
                      ((option.userName || option.fullName) &&
                        `${option.fullName} (${option.userName})`) ||
                      ''}
                    getOptionSelected={(option) => option.id === state.assignAgentId}
                    withoutSearchButton
                    helperText={getErrorByName(schema, 'assignAgentId').message}
                    error={getErrorByName(schema, 'assignAgentId').error}
                    isLoading={loadings.activityAssignments}
                    onInputKeyUp={(e) => {
                      const { value } = e.target;
                      if (searchTimer.current) clearTimeout(searchTimer.current);
                      searchTimer.current = setTimeout(() => {
                        getAllActivityAssignments(value, selected.activityAssign);
                      }, 700);
                    }}
                    isWithError
                    isSubmitted={isSubmitted}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    onChange={(event, newValue) => {
                      setSelected({ id: 'activityAssign', value: newValue });
                      const localReminderPersons = [...selected.reminderPersons];
                      const localReminderPersonIndex = localReminderPersons.findIndex(
                        (item) => item.type === 'user'
                      );
                      if (newValue) {
                        const itemToPush = {
                          id: newValue.id,
                          value: newValue.fullName,
                          type: 'user',
                        };
                        if (localReminderPersonIndex !== -1)
                          localReminderPersons[localReminderPersonIndex] = itemToPush;
                        else localReminderPersons.push(itemToPush);
                        setSelected({ id: 'reminderPersons', value: localReminderPersons });
                      } else if (localReminderPersonIndex !== -1) {
                        localReminderPersons.splice(localReminderPersonIndex, 1);
                        setSelected({ id: 'reminderPersons', value: localReminderPersons });
                      }
                      setState({
                        id: 'assignAgentId',
                        value: (newValue && newValue.id) || null,
                      });
                    }}
                  />
                </div>
                <div className='dialog-content-item'>
                  <DataFileAutocompleteComponent
                    idRef='RelatedToRef'
                    labelValue='related-to'
                    labelClasses='Requierd-Color'
                    selectedValues={
                      (selected.activeFormType === 1 && selected.relatedUnit) ||
                      (selected.activeFormType === 2 && selected.relatedLead) ||
                      (selected.activeFormType === 3 && selected.relatedWorkOrder) ||
                      (selected.activeFormType === 4 && selected.relatedPortfolio) ||
                      (selected.activeFormType === 5 && selected.maintenanceContract)
                    }
                    isDisabled
                    data={
                      (selected.activeFormType === 1 && data.relatedUnits) ||
                      (selected.activeFormType === 2 && data.relatedLeads) ||
                      (selected.activeFormType === 3 && data.relatedWorkOrder) ||
                      (selected.activeFormType === 4 && data.relatedPortfolio) ||
                      (selected.activeFormType === 5 && data.relatedMaintenanceContractId)
                    }
                    displayLabel={
                      (selected.activeFormType === 1 && ((option) => option.unitRefNo || '')) ||
                      (selected.activeFormType === 2 &&
                        ((option) =>
                          (option.lead && option.lead.company_name) ||
                          (option.lead &&
                            option.lead.contact_name &&
                            option.lead.contact_name.name))) ||
                      (selected.activeFormType === 3 && ((option) => option.referenceNo || '')) ||
                      (selected.activeFormType === 4 && ((option) => option.portfolioName || '')) ||
                      (selected.activeFormType === 5 &&
                        ((option) => String(option.maintenanceContractId) || '')) ||
                      ''
                    }
                    renderFor={
                      (selected.activeFormType === 1 && 'unit') ||
                      (selected.activeFormType === 2 && 'lead') ||
                      (selected.activeFormType === 3 && 'work-order') ||
                      (selected.activeFormType === 4 && 'portfolio') ||
                      (selected.activeFormType === 5 && 'relatedMaintenanceContractId')
                    }
                    getOptionSelected={
                      (selected.activeFormType === 1 &&
                        ((option) => option.id === state.unitRefNo)) ||
                      (selected.activeFormType === 2 &&
                        ((option) => option.leadId === state.relatedLeadNumberId)) ||
                      (selected.activeFormType === 3 &&
                        ((option) => option.workOrderId === state.relatedWorkOrderId)) ||
                      (selected.activeFormType === 4 &&
                        ((option) => option.portfolioId === state.relatedPortfolioId)) ||
                      (selected.activeFormType === 5 &&
                        ((option) =>
                          option.maintenanceContractId === state.relatedMaintenanceContractId))
                    }
                    withoutSearchButton
                    helperText={
                      getErrorByName(
                        schema,
                        (selected.activeFormType === 1 && 'relatedUnitNumberId') ||
                        (selected.activeFormType === 2 && 'relatedLeadNumberId') ||
                        (selected.activeFormType === 3 && 'relatedWorkOrderId') ||
                        (selected.activeFormType === 4 && 'relatedPortfolioId') ||
                        (selected.activeFormType === 5 && 'relatedMaintenanceContractId')
                      ).message
                    }
                    error={
                      getErrorByName(
                        schema,
                        (selected.activeFormType === 1 && 'relatedUnitNumberId') ||
                        (selected.activeFormType === 2 && 'relatedLeadNumberId') ||
                        (selected.activeFormType === 3 && 'relatedWorkOrderId') ||
                        (selected.activeFormType === 4 && 'relatedPortfolioId') ||
                        (selected.activeFormType === 5 && 'relatedMaintenanceContractId')
                      ).error
                    }
                    isLoading={
                      (selected.activeFormType === 1 && loadings.relatedUnits) ||
                      (selected.activeFormType === 2 && loadings.relatedLeads) ||
                      (selected.activeFormType === 3 && loadings.relatedWorkOrder) ||
                      (selected.activeFormType === 4 && loadings.relatedPortfolio) ||
                      (selected.activeFormType === 5 && loadings.maintenanceContract)
                    }
                    inputStartAdornment={(
                      <SelectComponet
                        isDisabled
                        data={
                          (pathName === 'Activities' &&
                            [
                              {
                                key: 1,
                                value: 'unit',
                                backendValue: 'Unit',
                              },
                              {
                                key: 2,
                                value: 'lead',
                                backendValue: 'Lead',
                              },
                              {
                                key: 3,
                                value: 'work-order',
                                backendValue: 'WorkOrder',
                              },
                              {
                                key: 4,
                                value: 'portfolio',
                                backendValue: 'Portfolio',
                              },
                              {
                                key: 5,
                                value: 'maintenance-contract',
                                backendValue: 'MaintenanceContract',
                              },
                            ]) ||
                          (pathName === 'activities-management' && [
                            {
                              key: 3,
                              value: 'work-order',
                            },
                            {
                              key: 4,
                              value: 'portfolio',
                            },
                            {
                              key: 5,
                              value: 'maintenance-contract',
                            },
                          ]) || [
                            {
                              key: 1,
                              value: 'unit',
                            },
                            {
                              key: 2,
                              value: 'lead',
                            },
                            {
                              key: 3,
                              value: 'work-order',
                            },
                            {
                              key: 4,
                              value: 'portfolio',
                            },
                            {
                              key: 5,
                              value: 'maintenance-contract',
                            },
                          ]
                        }
                        value={selected.activeFormType}
                        valueInput='key'
                        textInput='value'
                        wrapperClasses='over-input-select w-auto'
                        idRef='relatedToTypeRef'
                        isWithError
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        translationPathForData={translationPath}
                      />
                    )}
                    isWithError
                    isSubmitted={isSubmitted}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                  />
                </div>
                {activeItem && (activeItem.relatedUnitNumber && activeItem.relatedLeadNumberId) &&
                  (
                    <div className='dialog-content-item'>
                      <DataFileAutocompleteComponent
                        idRef='RelatedToRef'
                        labelValue='related-to'
                        labelClasses='Requierd-Color'
                        selectedValues={
                          selected.relatedLead
                        }
                        isDisabled
                        data={
                          data.relatedLeads
                        }
                        displayLabel={
                          ((option) =>
                            (option.lead && option.lead.company_name) ||
                            (option.lead &&
                              option.lead.contact_name &&
                              option.lead.contact_name.name)) ||
                          ''
                        }
                        renderFor='lead'
                        getOptionSelected={
                          ((option) => option.leadId === state.relatedLeadNumberId) || ''

                        }
                        withoutSearchButton
                        helperText={
                          getErrorByName(
                            schema,
                            ('relatedUnitNumberId')
                          ).message
                        }
                        error={
                          getErrorByName(
                            schema,
                            ('relatedLeadNumberId')
                          ).error
                        }
                        isLoading={
                          (loadings.relatedLeads)
                        }
                        inputStartAdornment={(
                          <SelectComponet
                            isDisabled
                            data={
                              (pathName === 'Activities' &&
                                [
                                  {
                                    key: 1,
                                    value: 'unit',
                                    backendValue: 'Unit',
                                  },
                                  {
                                    key: 2,
                                    value: 'lead',
                                    backendValue: 'Lead',
                                  },
                                  {
                                    key: 3,
                                    value: 'work-order',
                                    backendValue: 'WorkOrder',
                                  },
                                  {
                                    key: 4,
                                    value: 'portfolio',
                                    backendValue: 'Portfolio',
                                  },
                                  {
                                    key: 5,
                                    value: 'maintenance-contract',
                                    backendValue: 'MaintenanceContract',
                                  },
                                ]) ||
                              (pathName === 'activities-management' && [
                                {
                                  key: 3,
                                  value: 'work-order',
                                },
                                {
                                  key: 4,
                                  value: 'portfolio',
                                },
                                {
                                  key: 5,
                                  value: 'maintenance-contract',
                                },
                              ]) || [
                                {
                                  key: 1,
                                  value: 'unit',
                                },
                                {
                                  key: 2,
                                  value: 'lead',
                                },
                                {
                                  key: 3,
                                  value: 'work-order',
                                },
                                {
                                  key: 4,
                                  value: 'portfolio',
                                },
                                {
                                  key: 5,
                                  value: 'maintenance-contract',
                                },
                              ]
                            }
                            value={2}
                            valueInput='key'
                            textInput='value'
                            wrapperClasses='over-input-select w-auto'
                            idRef='relatedToTypeRef'
                            isWithError
                            parentTranslationPath={parentTranslationPath}
                            translationPath={translationPath}
                            translationPathForData={translationPath}
                          />
                        )}
                        isWithError
                        isSubmitted={isSubmitted}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                      />
                    </div>
                  )}
                <div className='dialog-content-item'>
                  <DatePickerComponent
                    labelClasses='Requierd-Color'
                    idRef='activityDateRef'
                    labelValue='activity-date'
                    placeholder='DD/MM/YYYY'
                    value={
                      state.activityDate ? state.activityDate : moment().format('YYYY-MM-DDTHH:mm:ss')
                    }
                    helperText={getErrorByName(schema, 'activityDate').message}
                    error={getErrorByName(schema, 'activityDate').error}
                    isSubmitted={isSubmitted}
                    minDate={moment().format('YYYY-MM-DDTHH:mm:ss')}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    onDateChanged={(newValue) => {
                      setState({
                        id: 'activityDate',
                        value: (newValue && moment(newValue).format('YYYY-MM-DDTHH:mm:ss')) || null,
                      });
                    }}
                  />
                </div>
                <div className='dialog-content-item'>
                  <DatePickerComponent
                    idRef='activityTimeRef'
                    labelValue='activity-time'
                    labelClasses='Requierd-Color'
                    isTimePicker
                    value={
                      state.activityDate ?
                        state.activityDate :
                        moment().add(2, 'minutes').format('YYYY-MM-DDTHH:mm:ss')
                    }
                    helperText={getErrorByName(schema, 'activityDate').message}
                    error={getErrorByName(schema, 'activityDate').error}
                    isSubmitted={isSubmitted}
                    minDate={moment().format('YYYY-MM-DDTHH:mm:ss')}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    onDateChanged={(newValue) => {
                      setState({
                        id: 'activityDate',
                        value: (newValue && moment(newValue).format('YYYY-MM-DDTHH:mm:ss')) || null,
                      });
                    }}
                  />
                </div>
                <div className='dialog-content-item'>
                  <Inputs
                    idRef='stageRef'
                    labelValue='stage'
                    value={
                      (selected.activityType && selected.activityType.leadStageName) ||
                      t(`${translationPath}not-contacted`)
                    }
                    isDisabled
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                  />
                </div>
                <div className='dialog-content-item'>
                  <Inputs
                    idRef='subjectRef'
                    labelValue='subject'
                    value={state.subject || ''}
                    helperText={getErrorByName(schema, 'subject').message}
                    error={getErrorByName(schema, 'subject').error}
                    isWithError
                    isDisabled
                    isSubmitted={isSubmitted}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    onInputChanged={(event) => {
                      setState({ id: 'subject', value: event.target.value });
                    }}
                  />
                </div>
                <div className='dialog-content-item w-100'>
                  <Inputs
                    idRef='commentsRef'
                    labelValue='comments'
                    value={state.comments || ''}
                    helperText={getErrorByName(schema, 'comments').message}
                    error={getErrorByName(schema, 'comments').error}
                    isWithError
                    isSubmitted={isSubmitted}
                    multiline
                    rows={4}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    onInputChanged={(event) => {
                      setState({ id: 'comments', value: event.target.value });
                    }}
                  />
                </div>
                {state.activityReminders && state.activityReminders.length > 0 && reminder && (
                  <div className='title-wrapper'>
                    <span className='title-text Requierd-Color'>
                      {t(`${translationPath}add-reminders`)}
                    </span>
                  </div>
                )}

                {reminder ? (
                  <div className='reminder-wrapper'>
                    {state.activityReminders &&
                      state.activityReminders.map((item, index) => (
                        <div className='reminder-item-wrapper' key={`remindersRef${index + 1}`}>
                          <div className='mb-1 w-100 px-2'>
                            <span>{`${t(`${translationPath}reminder`)}# ${index + 1}`}</span>
                          </div>
                          <div className='reminder-section'>
                            <SelectComponet
                              idRef={`reminderWayRef${index + 1}`}
                              data={Object.values(ReminderTypesEnum)}
                              value={item.reminderType}
                              valueInput='key'
                              textInput='value'
                              onSelectChanged={(value) => {
                                item.reminderType = +(value || 1);
                                setState({ id: 'activityReminders', value: state.activityReminders });
                              }}
                              translationPathForData={translationPath}
                              parentTranslationPath={parentTranslationPath}
                              translationPath={translationPath}
                            />
                          </div>
                          <div className='reminder-section'>
                            <SelectComponet
                              idRef={`reminderPersonRef${index + 1}`}
                              data={selected.reminderPersons}
                              value={item.contactId || item.usersId || ''}
                              placeholder='reminder-for'
                              valueInput='id'
                              textInput='value'
                              helperText={
                                getErrorByName(
                                  schema,
                                  `activityReminders.${index}`,
                                  'state.userNotSet'
                                ).message
                              }
                              error={
                                getErrorByName(
                                  schema,
                                  `activityReminders.${index}`,
                                  'state.userNotSet'
                                ).error
                              }
                              isSubmitted={isSubmitted}
                              onSelectChanged={(value) => {
                                if (value) {
                                  const localReminderPerson = selected.reminderPersons.find(
                                    (element) => element.id === value
                                  );

                                  if (localReminderPerson.type === 'contact') {
                                    item.contactId = value;
                                    item.usersId = null;
                                  } else {
                                    item.usersId = value;
                                    item.contactId = null;
                                  }
                                } else {
                                  item.contactId = null;
                                  item.usersId = null;
                                }
                                setState({ id: 'activityReminders', value: state.activityReminders });
                              }}
                              emptyItem={{
                                value: '',
                                text: 'select-reminder-for',
                                isDisabled: false,
                              }}
                              translationPathForData={translationPath}
                              parentTranslationPath={parentTranslationPath}
                              translationPath={translationPath}
                            />
                          </div>
                          <div className='reminder-section'>
                            <div className='d-flex w-100'>
                              <Inputs
                                idRef='reminderTimeRef'
                                value={(item.reminderTime && getTimeValue(item)) || 0}
                                helperText={
                                  getErrorByName(
                                    schema,
                                    `activityReminders.${index}`,
                                    'state.timeIsZero'
                                  ).message
                                }
                                error={
                                  getErrorByName(
                                    schema,
                                    `activityReminders.${index}`,
                                    'state.timeIsZero'
                                  ).error
                                }
                                isDisabled={!state.activityDate || !state.assignAgentId}
                                wrapperClasses='mb-0'
                                endAdornment={(
                                  <SelectComponet
                                    data={reminderAmountOfTimeTypes}
                                    value={item.reminderAmountOfTimeType || 1}
                                    valueInput='key'
                                    textInput='value'
                                    onSelectChanged={(value) => {
                                      item.reminderAmountOfTimeType = +(value || 1);
                                      reminderTimeCalculateHandler(
                                        item,
                                        (item.reminderTime && getTimeValue(item)) || 0,
                                        +(value || 1)
                                      );
                                      setState({
                                        id: 'activityReminders',
                                        value: state.activityReminders,
                                      });
                                    }}
                                    wrapperClasses='over-input-select w-auto'
                                    idRef='timeAmountTypeRef'
                                    parentTranslationPath={parentTranslationPath}
                                    translationPath={translationPath}
                                    translationPathForData={translationPath}
                                  />
                                )}
                                min={0}
                                isWithError
                                isSubmitted={isSubmitted}
                                parentTranslationPath={parentTranslationPath}
                                translationPath={translationPath}
                                onInputChanged={reminderTimeChangeHandler(item)}
                              />
                              {index > 0 && (
                                <ButtonBase
                                  className='btns-icon theme-solid bg-secondary-light mt-1 mx-2'
                                  onClick={reminderDecrementHandler(index)}
                                >
                                  <span className='mdi mdi-minus c-black-light' />
                                </ButtonBase>
                              )}
                              {index === 0 && (
                                <ButtonBase
                                  className='btns-icon theme-solid bg-secondary-light mt-1 mx-2'
                                  disabled={!state.activityDate || !state.assignAgentId}
                                  onClick={reminderIncrementHandler(index)}
                                >
                                  <span className='mdi mdi-plus c-black-light' />
                                </ButtonBase>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : null}
              </div>
            </DialogContent>
            <DialogActions>
              <ButtonBase onClick={() => close()} className='btns theme-solid bg-cancel'>
                {t(`${translationPath}cancel`)}
              </ButtonBase>

              <ButtonBase className='btns theme-solid' type='submit'>
                {t(`${translationPath}Reply`)}
              </ButtonBase>
            </DialogActions>
          </form>
        </Dialog>
      )}
      {
        activeItem && !activeItem.isReplyAble && (
          <Dialog
            open={open}
            onClose={() => {
              close();
            }}
            className='activities-management-dialog-wrapper'
          >
            <DialogTitle id='alert-dialog-slide-title'>
              {t(`${translationPath}reply-activity`)}
            </DialogTitle>
            <DialogContent>
              <div className='dialog-content-wrapper'>
                <div className='d-flex-column-center'>
                  <span className='mdi mdi-close-octagon c-danger mdi-48px' />
                  <span>
                    <span>{`${t('this-activity-cannot-be-replyed')} ${activeItem.activityId}`}</span>
                  </span>
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <ButtonBase onClick={() => close()} className='btns theme-solid bg-cancel'>
                {t(`${translationPath}cancel`)}
              </ButtonBase>
            </DialogActions>

          </Dialog>
        )
      }
    </div>
  );
};
ReplyActivityDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
ReplyActivityDialog.defaultProps = {
  activeItem: null,
  parentTranslationPath: '',
  translationPath: '',
};
