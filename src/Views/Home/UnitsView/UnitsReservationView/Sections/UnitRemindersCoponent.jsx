import React, {
  useCallback, useEffect, useReducer, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import moment from 'moment';
import { Inputs, SelectComponet, Spinner } from '../../../../../Components';
import {
  floatHandler, getErrorByName, showError, showSuccess
} from '../../../../../Helper';
import { CreateActivity, EditActivity } from '../../../../../Services';
import { ReminderTypesEnum } from '../../../../../Enums';

export const UnitRemindersCoponent = ({
  activeItem,
  onSave,
  parentTranslationPath,
  translationPath,
}) => {
  const pathName = window.location.pathname.split('/home/')[1];
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const [selected, setSelected] = useReducer(reducer, {
    activityAssign: null,
    activityType: null,
    unit: null,
    activeFormType: pathName === 'Activities' ? 1 : 3,
    relatedUnit: null,
    relatedLead: null,
    relatedPortfolio: null,
    relatedWorkOrder: null,
    reminderPersons: [],
    maintenanceContract: null,
    relatedMaintenanceContractId: null,
  });
  const [data, setData] = useReducer(reducer, {
    activityAssignments: [],
    units: [],
  });
  const [state, setState] = useReducer(reducer, {
    reminderType: null,
    // /////////////////
    assignAgentId: null,
    activityTypeId: null,
    unitId: null,
    relatedLeadNumberId: null,
    relatedUnitNumberId: null,
    activityDate: null,
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
    activityReminders: Joi.array().items(
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
    ),
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
    const saveState = { ...state };
    saveState.activityReminders = saveState.activityReminders.filter(
      (item) => item.reminderTime !== 0 && (item.usersId || item.contactId)
    );
    setIsLoading(true);
    const res =
      (activeItem &&
        activeItem.activityId &&
        (await EditActivity(activeItem.activityId, saveState))) ||
      (await CreateActivity(saveState));
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      if (activeItem && activeItem.activityId)
        showSuccess(t`${translationPath}activity-updated-successfully`);
      else showSuccess(t`${translationPath}activity-created-successfully`);
      if (onSave) onSave();
    } else if (activeItem && activeItem.activityId)
      showError(t(`${translationPath}activity-update-failed`));
    else showError(t`${translationPath}activity-create-failed`);
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
    if (activeItem) {
      setState({
        id: 'edit',
        value: {
          assignAgentId: activeItem.agentUserId,
          activityTypeId: activeItem.activityTypeId,
          relatedMaintenanceContractId: activeItem.relatedMaintenanceContractId,
          unitId: activeItem.unitId,
          relatedLeadNumberId: activeItem.relatedLeadNumberId,
          relatedUnitNumberId: activeItem.relatedUnitNumberId,
          activityDate: activeItem.activityDate,
          comments: activeItem.comments,
          isOpen: activeItem.isOpen,
          activityReminders: activeItem.activityReminders || [],
          subject: activeItem.subject,
        },
      });
    }
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

      setSelected({
        id: 'edit',
        value: {
          unit:
            (activeItem.unitId && {
              id: activeItem.unitId,
              propertyName: null,
            }) ||
            null,

          relatedUnit:
            (activeItem.relatedUnitNumberId && {
              id: activeItem.relatedUnitNumberId,
              propertyName: null,
              unitRefNo: activeItem.relatedUnitNumber,
            }) ||
            null,
          reminderPersons,
        },
      });
    }
  }, [activeItem, pathName]);
  useEffect(() => {
    if (state.activityReminders && state.activityReminders.length === 0) {
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
  return (
    <div className='remiders-view-wrapper'>
      <div className='activities-management-dialog-wrapper'>
        <Spinner isActive={isLoading} isAbsolute />
        <form noValidate onSubmit={saveHandler}>
          <div className='dialog-content-wrapper'>
            <div className='title-wrapper'>
              <span className='title-text'>{t(`${translationPath}add-reminders`)}</span>
            </div>
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
                          setState({ id: 'reminderType', value: state.reminderType });
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
                          getErrorByName(schema, `activityReminders.${index}`, 'state.userNotSet')
                            .message
                        }
                        error={
                          getErrorByName(schema, `activityReminders.${index}`, 'state.userNotSet')
                            .error
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
                            getErrorByName(schema, `activityReminders.${index}`, 'state.timeIsZero')
                              .message
                          }
                          error={
                            getErrorByName(schema, `activityReminders.${index}`, 'state.timeIsZero')
                              .error
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
          </div>
          {/*
        <ButtonBase onClick={() => close()} className='btns theme-solid bg-cancel'>
          {t(`${translationPath}cancel`)}
        </ButtonBase>
        <ButtonBase className='btns theme-solid' type='submit'>
          {t(`${translationPath}${(activeItem && 'edit-activity') || 'add-activity'}`)}
        </ButtonBase> */}
        </form>
      </div>
    </div>
  );
};
UnitRemindersCoponent.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  onSave: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
UnitRemindersCoponent.defaultProps = {
  activeItem: null,
  parentTranslationPath: '',
  translationPath: '',
};
