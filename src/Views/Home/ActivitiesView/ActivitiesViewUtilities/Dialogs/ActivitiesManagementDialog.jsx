import React, {
  useCallback, useEffect, useReducer, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import {
  DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase, Chip
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import { useSelector } from 'react-redux';

import moment from 'moment';
import {
  AutocompleteComponent,
  DataFileAutocompleteComponent,
  DatePickerComponent,
  DialogComponent,
  Inputs,
  SelectComponet,
  Spinner,
  SwitchComponent,
  UploaderActivitieFileComponent,
} from '../../../../../Components';
import {
  floatHandler, getDownloadableLink, getErrorByName, GlobalTranslate, showError, showSuccess
} from '../../../../../Helper';
import {
  OrganizationUserSearch,
  GetAllActivityTypes,
  CreateActivity,
  EditActivity,
  GetLeads,
  getUnits,
  GetAllPortfolio,
  GetAllWorkOrders,
  GetAllMaintenanceContract,

} from '../../../../../Services';
import { UnitMapper } from '../../../UnitsView/UnitMapper';
import { ReminderTypesEnum , UnitsOperationTypeEnum, LeadsStatusEnum } from '../../../../../Enums';
import { PermissionsComponent } from '../../../../../Components/PermissionsComponent/PermissionsComponent';
import { ActivitiesCallCenterPermissions } from '../../../../../Permissions/CallCenter/ActivitiesCallCenterPermissions';
import { GetActivityTypeById } from '../../../../../Services/ActivitiesTypesServices';

export const ActivitiesManagementDialog = ({
  activeItem,
  onSave,
  parentTranslationPath,
  translationPath,
  open,
  close,
}) => {
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const pathName = window.location.pathname.split('/home/')[1];
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const searchTimer = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reminder, setReminder] = useState();
  const [relatedTo, setRelatedTo] = useState();
  const [withDateTime, setwithDateTime] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [edit, setedit] = useState(false);
  const [AssignActivity, setAssignActivity] = useState(false);
  const [relatedToNameList, setRelatedToNameList] = useState([]);
  const [isRelatedToEmpty, setIsRelatedToEmpty] = useState(true);
  const [isOpenGallery, setIsOpenGallery] = useState(false);
  const [uploadedFile, setUploadedFile] = useState([]);
  const [allFiles, setAllFiles] = useState([{ uuid: '', fullfileName: '', fileName: '' }]);
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

  const relatedToEnums = {
    Unit: {
      id: 'relatedUnitNumberId',
      name: 'relatedUnit',
      label: 'unit'
    },
    Lead: {
      id: 'relatedLeadNumberId',
      name: 'relatedLead',
      label: 'lead'
    },
    WorkOrder: {
      id: 'relatedWorkOrderId',
      name: 'relatedWorkOrder',
      label: 'workOrder'
    },
    Portfolio: {
      id: 'relatedPortfolioId',
      name: 'relatedPortfolio',
      label: 'portfolio'
    },
    MaintenanceContract: {
      id: 'relatedMaintenanceContractId',
      name: 'relatedMaintenanceContract',
      label: 'maintenance-contract'
    }
  };

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
    relatedUnit: false,
    relatedLead: false,
    relatedPortfolio: false,
    relatedWorkOrder: false,
    relatedMaintenanceContract: false,

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
    relatedMaintenanceContract: null,
    reminderPersons: [],

  });
  const [data, setData] = useReducer(reducer, {
    activityAssignments: [],
    activityTypes: [],
    units: [],

    relatedLead: [],
    relatedUnit: [],
    relatedPortfolio: [],
    relatedWorkOrder: [],
    relatedMaintenanceContract: [],

  });
  const [state, setState] = useReducer(reducer, {
    assignAgentId: null,
    activityTypeId: null,
    unitId: null,

    relatedUnitNumberId: null,
    relatedLeadNumberId: null,
    relatedPortfolioId: null,
    relatedWorkOrderId: null,
    relatedMaintenanceContractId: null,

    activityDate: moment().add(2, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
    subject: null,
    comments: null,
    isOpen: true,
    activityReminders: [],
    createdByName: (loginResponse && loginResponse.fullName) || null,
    fileId: null,
    fileName: null
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

    activityTypeId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}activity-type-is-required`),
      }),
    activityDate: ((!activeItem) && (
      (withDateTime && (Joi.date()
        .required()
        .greater(Date.now())
        .messages({
          'date.base': t(`${translationPath}activity-date-is-required`),
          'date.greater': t(`${translationPath}choose-time-after-now`),
        })) || Joi.any()))) || Joi.any(),

    relatedUnitNumberId: Joi.any()
      .custom((value, helpers) => {
        if (!value && isRelatedToEmpty) return helpers.error('state.required');

        return value;
      })
      .messages({
        'state.required': t(`${translationPath}related-to-is-required-one-at-least`),
      }),
    relatedLeadNumberId: Joi.any()
      .custom((value, helpers) => {
        if (!value && isRelatedToEmpty) return helpers.error('state.required');

        return value;
      })
      .messages({
        'state.required': t(`${translationPath}related-to-is-required-one-at-least`),
      }),

    relatedPortfolioId: Joi.any()
      .custom((value, helpers) => {
        if (!value && isRelatedToEmpty) return helpers.error('state.required');

        return value;
      })
      .messages({
        'state.required': t(`${translationPath}related-to-is-required-one-at-least`),
      }),
    relatedWorkOrderId: Joi.any()
      .custom((value, helpers) => {
        if (!value && isRelatedToEmpty) return helpers.error('state.required');

        return value;
      })
      .messages({
        'state.required': t(`${translationPath}related-to-is-required-one-at-least`),
      }),
    relatedMaintenanceContractId: Joi.any()
      .custom((value, helpers) => {
        if (!value && isRelatedToEmpty) return helpers.error('state.required');

        return value;
      })
      .messages({
        'state.required': t(`${translationPath}related-to-is-required-one-at-least`),
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
        name: (value && value.value),
      });
      if (!(res && res.status && res.status !== 200)) {
        const localValue = (res && res.result) || [];
        // if (selectedValue && localValue.findIndex((item) => item.id === selectedValue.id) === -1)
        //   value.push(selectedValue);
        if (localValue.length > 0) {
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
      }
    },
    [filter, rols]
  );

  const getAllMaintenanceContracts = useCallback(
    async (value) => {
      setLoadings({ id: 'relatedMaintenanceContractId', value: true });
      const response = await GetAllMaintenanceContract({ ...filter, search: value });
      if (!(response && response.status && response.status !== 200))
        setData({ id: 'relatedMaintenanceContractId', value: (response && response.result) || [] });
      else setData({ id: 'relatedMaintenanceContractId', value: [] });
      setLoadings({ id: 'relatedMaintenanceContractId', value: false });
    },
    [filter]
  );

  useEffect(() => {
    getAllMaintenanceContracts();
  }, [getAllMaintenanceContracts]);


  const getAllRelatedUnits = useCallback(
    async (value) => {
      setLoadings({ id: 'relatedUnit', value: true });
      const response = await getUnits({ ...filter, search: value , operationType:  (pathName === 'Activities' ? null :UnitsOperationTypeEnum.rent.key)});
      if (!(response && response.status && response.status !== 200)) {
        const unitMapped = ((response && response.result) || []).map((item) => UnitMapper(item));
        setData({
          id: 'relatedUnit',
          value: unitMapped || [],
        });
      } else setData({ id: 'relatedUnit', value: [] });

      setLoadings({ id: 'relatedUnit', value: false });
    },
    [filter]
  );

  const getAllRelatedLeads = useCallback(
    async (value) => {
      setLoadings({ id: 'relatedLead', value: true });
      const response = await GetLeads({ ...filter, search: value, leadStatus: LeadsStatusEnum.Open.status });
      if (!(response && response.status && response.status !== 200))
        setData({ id: 'relatedLead', value: (response && response.result) || [] });
      else setData({ id: 'relatedLead', value: [] });

      setLoadings({ id: 'relatedLead', value: false });
    },
    [filter]
  );

  const getAllRelatedPortfolios = useCallback(
    async (value) => {
      setLoadings({ id: 'relatedPortfolio', value: true });
      const response = await GetAllPortfolio({ ...filter, search: value });

      if (!(response && response.status && response.status !== 200))
        setData({ id: 'relatedPortfolio', value: (response && response.result) || [] });
      else setData({ id: 'relatedPortfolio', value: [] });

      setLoadings({ id: 'relatedPortfolio', value: false });
    },
    [filter]
  );
  const getAllRelatedWorkOrders = useCallback(
    async (value) => {
      setLoadings({ id: 'relatedWorkOrder', value: true });
      const response = await GetAllWorkOrders({ ...filter, search: value });

      if (!(response && response.status && response.status !== 200))
        setData({ id: 'relatedWorkOrder', value: (response && response.result) || [] });
      else setData({ id: 'relatedWorkOrder', value: [] });

      setLoadings({ id: 'relatedWorkOrder', value: false });
    },
    [filter]
  );
  const getAllRelatedMaintenanceContracts = useCallback(
    async (value) => {
      setLoadings({ id: 'relatedMaintenanceContract', value: true });
      const response = await GetAllMaintenanceContract({ ...filter, search: value });

      if (!(response && response.status && response.status !== 200))
        setData({ id: 'relatedMaintenanceContract', value: (response && response.result) || [] });
      else setData({ id: 'relatedMaintenanceContract', value: [] });

      setLoadings({ id: 'relatedMaintenanceContract', value: false });
    },
    [filter]
  );

  //  const getAllUnits = useCallback(
  //    async (value) => {
  //      setLoadings({ id: 'units', value: true });
  //      const response = await getUnits({ ...filter, search: value });
  //      if (!(response && response.status && response.status !== 200)) {
  //        const unitMapped = ((response && response.result) || []).map((item) =>
  //         UnitMapper(item));
  //        setData({
  //          id: 'units',
  //          value: unitMapped || [],
  //        });
  //      } else setData({ id: 'units', value: [] });

  //      setLoadings({ id: 'units', value: false });
  //    },
  //    [filter]
  //  );
  const getAllActivityTypes = useCallback(async () => {
    setLoadings({ id: 'activityTypes', value: true });
    const res = await GetAllActivityTypes();
    if (!(res && res.status && res.status !== 200)) {
      // const sortedActivityTypes = (res || []).sort((a, b) => b.categoryName - a.categoryName);
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
  }, []);

  const GetActivityType = useCallback(async () => {
    setLoadings({ id: 'activityTypes', value: true });
    if (selected.activityType !== null) {
      const res = await GetActivityTypeById(selected.activityType.activityTypeId);
      if (!(res && res.status && res.status !== 200)) {
        setReminder(res.withReminder);
        setRelatedTo(res.relatedTo);
        setwithDateTime(res.withDateTime);

        const relatedToResponse = res.relatedTo ? res.relatedTo : [];
        setRelatedToNameList(relatedToResponse.length ? relatedToResponse.map((item) => item.relatedToName) : []);
      } else {
        setReminder(res.withReminder);
        setRelatedTo(res.relatedTo);
        setwithDateTime(res.withDateTime);
      }
    } else
      setRelatedToNameList((selected.activityType === null) && []);

    setLoadings({ id: 'activityTypes', value: false });
  }, [selected.activityType]);
  // const getUserById = useCallback(async () => {
  //   setIsLoading(true);
  //   const res =
  //   await ActiveOrganizationUser(userId);
  //   // setActiveUserItem(res);
  //   setActiveUserItem(JSON.parse(localStorage.getItem('activeUserItem')));
  //   setIsLoading(false);
  // }, [userId]);

  const changeActiveFormType = (newValue) => {
    setSelected({
      id: 'edit',
      value: {
        ...selected,
        activeFormType: +newValue,
        relatedUnit: null,
        relatedLead: null,
        relatedPortfolio: null,
        relatedWorkOrder: null,
      },
    });
    if (state.relatedLeadNumberId) setState({ id: 'relatedLeadNumberId', value: null });
    if (state.relatedUnitNumberId) setState({ id: 'relatedUnitNumberId', value: null });
    if (state.relatedWorkOrderId) setState({ id: 'relatedWorkOrderId', value: null });
    if (state.relatedPortfolioId) setState({ id: 'relatedPortfolioId', value: null });
  };
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (withDateTime === true && !activeItem) {
      if (state.activityDate && state.activityDate <= moment().format('YYYY-MM-DDTHH:mm:ss')) {
        showError(t(`${translationPath}choose-time-after-now`));
        setIsLoading(false);
        return;
      }
    }
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
    getAllActivityTypes();
    getAllRelatedUnits();
    getAllRelatedLeads();
    getAllRelatedPortfolios();
    getAllRelatedWorkOrders();
    getAllRelatedMaintenanceContracts();
    // getAllUnits();
    GetActivityType();
  }, [getAllActivityTypes,
    //  getAllUnits,
    GetActivityType, getAllRelatedUnits, getAllRelatedLeads, getAllRelatedPortfolios, getAllRelatedWorkOrders, getAllRelatedMaintenanceContracts]);

  useEffect(() => {
    getAllActivityAssignments();
  }, [getAllActivityAssignments, rols]);
  useEffect(() => {
    if (activeItem) {
      setState({
        id: 'edit',
        value: {
          assignAgentId: activeItem.agentUserId,
          activityTypeId: activeItem.activityTypeId,
          unitId: activeItem.unitId,
          relatedLeadNumberId: activeItem.relatedLeadNumberId,
          relatedUnitNumberId: activeItem.relatedUnitNumberId,

          relatedPortfolioId: activeItem.relatedPortfolioId,
          relatedWorkOrderId: activeItem.relatedWorkOrderId,
          relatedMaintenanceContractId: activeItem.relatedMaintenanceContractId,

          activityDate: activeItem.activityDate,
          comments: activeItem.comments,
          isOpen: activeItem.isOpen,
          activityReminders: activeItem.activityReminders || [],
          subject: activeItem.subject,
          createdByName: activeItem.createdByName
        },
      });
      setedit(true);
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

      const relatedUnit =
        (activeItem.relatedUnitNumberId && activeItem.relatedUnitPropertyName && {
          id: activeItem.relatedUnitNumberId,
          propertyName: activeItem.relatedUnitPropertyName,
          unitRefNo: activeItem.relatedUnitNumber,
        }) ||
        null;

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

      const relatedPortfolio = (activeItem.relatedPortfolioId && activeItem.relatedPortfolioName && {
        portfolioId: activeItem.relatedPortfolioId,
        portfolioName: activeItem.relatedPortfolioName
      }) || '';
      const relatedMaintenanceContract = (activeItem.relatedMaintenanceContractId && {
        maintenanceContractId: activeItem.relatedMaintenanceContractId,
      }) || '';

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
          activityType: activeItem.activityType,
          relatedMaintenanceContractId: activeItem.relatedMaintenanceContractId,
          unit:
            (activeItem.unitId && activeItem.relatedUnitPropertyName && {
              id: activeItem.unitId,
              propertyName: activeItem.relatedUnitPropertyName,
            }) ||
            null,

          relatedLead,
          relatedUnit,
          relatedPortfolio,
          relatedMaintenanceContract,
          reminderPersons,
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
      // state.activityDate &&
      // state.assignAgentId &&
      state.activityReminders &&
      state.activityReminders.length === 0
    ) {
      setState({
        id: 'activityReminders',
        value: [{ ...defaultActivityReminderItem.current }],
      });
    }
    // else if (
    //   (!state.activityDate || !state.assignAgentId) &&
    //   state.activityReminders &&
    //   state.activityReminders.length > 0
    // )
    //   setState({ id: 'activityReminders', value: [] });
  }, [state]);
  useEffect(() => {
    if (activeItem) {
      const assignIndex = data.activityAssignments.findIndex(
        (item) => item.id === activeItem.agentUserId
      );
      const unitIndex = data.units.findIndex((item) => item.id === activeItem.unitId);

      const relatedUnitIndex = data.relatedUnit.findIndex(
        (item) => item.id === activeItem.relatedUnitNumberId
      );
      const relatedLeadIndex = data.relatedLead.findIndex(
        (item) => item.leadId === activeItem.relatedLeadNumberId
      );

      // const relatedWorkOrderIndex = data.relatedWorkOrder.findIndex(
      //   (item) => item.workOrderId === activeItem.relatedWorkOrderId
      // );
      const relatedPortfolioIndex = data.relatedPortfolio.findIndex(
        (item) => item.portfolioId === activeItem.relatedPortfolioId
      );
      const relatedMaintenanceContractIndex = data.relatedMaintenanceContract.findIndex(
        (item) => item.maintenanceContractId === activeItem.relatedMaintenanceContractId
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
        (activeItem.unitId && activeItem.relatedUnitPropertyName && {
          id: activeItem.unitId,
          propertyName: activeItem.relatedUnitPropertyName,
        }) ||
        null;
      if (unitIndex === -1 && unit) if (unit) data.units.push(unit);

      const relatedUnit =
        (activeItem.relatedUnitNumberId && activeItem.relatedUnitPropertyName && {
          id: activeItem.relatedUnitNumberId,
          propertyName: activeItem.relatedUnitPropertyName,
        }) ||
        null;
      if (relatedUnitIndex === -1 && relatedUnit) data.relatedUnit.push(relatedUnit);

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
      if (relatedLeadIndex === -1 && relatedLead) data.relatedLead.push(relatedLead);

      const relatedMaintenanceContract =
        (activeItem.relatedMaintenanceContractId && {
          maintenanceContractId: activeItem.relatedMaintenanceContractId,
        }) ||
        null;
      if (relatedMaintenanceContractIndex === -1 && relatedMaintenanceContract) data.relatedMaintenanceContract.push(relatedMaintenanceContract);

      const relatedPortfolio =
        (activeItem.relatedPortfolioId && {
          portfolioId: activeItem.relatedPortfolioId,
          portfolioName: activeItem.relatedPortfolioName,
        }) ||
        null;
      if (relatedPortfolioIndex === -1 && relatedPortfolio) data.relatedPortfolio.push(relatedPortfolio);

      if (
        assignIndex === -1 ||
        (unitIndex === -1 && unit) ||
        (relatedUnitIndex === -1 && relatedUnit) ||
        (relatedLeadIndex === -1 && relatedLead) ||
        (relatedMaintenanceContractIndex === -1 && relatedMaintenanceContract) ||
        (relatedPortfolioIndex === -1 && relatedPortfolio)
      )
        setData({ id: 'edit', value: data });
    }
  }, [activeItem, data]);

  useEffect(() => {
    setIsRelatedToEmpty(!(state.relatedLeadNumberId || state.relatedUnitNumberId || state.relatedPortfolioId || state.relatedWorkOrderId || state.relatedMaintenanceContractId));
  }, [state.relatedLeadNumberId,
  state.relatedUnitNumberId, state.relatedPortfolioId, state.relatedWorkOrderId, state.relatedMaintenanceContractId]);

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

  const convertToUploderReview = (item) => {
    const filess = item.map((element, index) => ({
      uuid: element.uuid, fileName: element.fullfileName

    }));
    setUploadedFile(filess);
    setAllFiles(item);
    return item;
  };

  const download = (value) => () => {
    const link = document.createElement('a');
    link.setAttribute('download', value.fileName);
    link.href = getDownloadableLink(value.uuid);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const fileDeleted = useCallback(
    (item, index) => () => {
      setUploadedFile([]);
      setAllFiles([{ uuid: '', fullfileName: '', fileName: '' }]);
      setState({ id: 'fileId', value: null }); // temprory, until the APi are ready and take more one files ;
      setState({ id: 'fileName', value: null }); // temprory, until the APi are ready and take more one files ;

      // const uploadedFilesIndex = uploadedFile.findIndex((element) => element.uuid === item.uuid);
      // if (uploadedFilesIndex !== -1) {
      //   const localFiles = [...uploadedFile];
      //   localFiles.splice(uploadedFilesIndex, 1);
      //   setUploadedFile(localFiles);
      // }
      // const localFiles = [...uploadedFile];
      // localFiles.splice(uploadedFilesIndex, 1);
      // setUploadedFile(localFiles);
      // setAllFiles((items) => {
      //   items.splice(index, 1);
      //   setState({ id: 'fileId', value: null });   // temprory, until the APi are ready and take more one files ;
      //   setState({ id: 'fileName', value: null }); // temprory, until the APi are ready and take more one files ;
      //   return [...items];
      // });
    },
    [uploadedFile]
  );

  return (
    <div>
      <Dialog
        open={open}
        // onClose={() => {
        //   close();
        // }}
        className='activities-management-dialog-wrapper'
      >
        <Spinner isActive={isLoading} isAbsolute />
        <form noValidate onSubmit={saveHandler}>
          <DialogTitle id='alert-dialog-slide-title'>
            {t(`${translationPath}${(activeItem && 'edit-activity') || 'add-new-activity'}`)}
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
                  isDisabled={edit}
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

                    setState({ id: 'relatedUnitNumberId', value: null });
                    setState({ id: 'relatedLeadNumberId', value: null });
                    setState({ id: 'relatedPortfolioId', value: null });
                    setState({ id: 'relatedWorkOrderId', value: null });
                    setState({ id: 'relatedMaintenanceContractId', value: null });
                    setSelected({ id: 'relatedUnit', value: null });
                    setSelected({ id: 'relatedLead', value: null });
                    setSelected({ id: 'relatedPortfolio', value: null });
                    setSelected({ id: 'relatedWorkOrder', value: null });
                    setSelected({ id: 'relatedMaintenanceContract', value: null });

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
                    const onSearch = e.target;
                    if (searchTimer.current) clearTimeout(searchTimer.current);
                    searchTimer.current = setTimeout(() => {
                      getAllActivityAssignments(onSearch, selected.activityAssign);
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

              <div className='dialog-content-item related-to-wrapper'>

                {
                  (relatedToNameList && relatedToNameList.length > 0) && (
                    <fieldset className={(relatedToNameList.length === 1) && 'one-autocomplete-container'}>

                      <legend>{t(`${translationPath}related-to`)}</legend>
                      {
                        relatedToNameList.map((item) => (
                          <DataFileAutocompleteComponent
                            labelValue={t(`${translationPath}${ relatedToEnums[item] && relatedToEnums[item].label}`)}
                            idRef='RelatedToRef'
                            selectedValues={
                              (item !== 'MaintenanceContract') &&
                              (relatedToEnums[item] && selected[relatedToEnums[item].name]) || (relatedToEnums[item] && { maintenanceContractId: state[relatedToEnums[item].id] }) || null
                            }
                            multiple={false}

                            data={(relatedToEnums[item] && data[relatedToEnums[item].name]) || []}

                            displayLabel={(option) => {
                              switch (item) {
                                case 'Unit':
                                  return (option.unitRefNo || '');
                                case 'Lead':
                                  return ((option.lead && option.lead.company_name) ||
                                    (option.lead && option.lead.contact_name && option.lead.contact_name.name) ||
                                    '');
                                case 'Portfolio':
                                  return (option.portfolioName || '');
                                case 'MaintenanceContract':
                                  return (option.maintenanceContractId || '').toString();
                              }
                            }}

                            renderFor={item && item.toLowerCase()}
                            withoutSearchButton
                            isSubmitted={isSubmitted}

                            helperText={
                              getErrorByName(
                                schema,
                                ((item === relatedToNameList[0]) && (relatedToEnums[item] && relatedToEnums[item].id)) || ''
                              ).message
                            }
                            error={
                              getErrorByName(
                                schema,
                                (relatedToEnums[item] && relatedToEnums[item].id) || ''
                              ).error
                            }
                            isLoading={
                              relatedToEnums[item] && loadings[relatedToEnums[item].name] || false
                            }
                            onInputKeyUp={(e) => {
                              const { value } = e.target;
                              if (searchTimer.current) clearTimeout(searchTimer.current);
                              searchTimer.current = setTimeout(() => {
                                switch (item) {
                                  case 'Unit':
                                    getAllRelatedUnits(value);
                                    break;
                                  case 'Lead':
                                    getAllRelatedLeads(value);
                                    break;
                                  case 'WorkOrder':
                                    getAllRelatedWorkOrders(value);
                                    break;
                                  case 'Portfolio':
                                    getAllRelatedPortfolios(value);
                                    break;
                                  case 'MaintenanceContract':
                                    getAllRelatedMaintenanceContracts(value);
                                    break;
                                }
                              }, 700);
                            }}

                            isWithError
                            parentTranslationPath={parentTranslationPath}
                            translationPath={translationPath}

                            onChange={(event, newValue) => {
                              setSelected({
                                id: (relatedToEnums[item] && relatedToEnums[item].name) || '',
                                value: newValue
                              });
                              setState({
                                id: (relatedToEnums[item] && relatedToEnums[item].id) || '',
                                value: (
                                  newValue && ((item === 'Unit' && newValue.id) || (item === 'Lead' && newValue.leadId) || (item === 'Portfolio' && newValue.portfolioId) || (item === 'MaintenanceContract' && newValue.maintenanceContractId)) || null
                                )
                              });

                              const localReminderPersons = [...selected.reminderPersons];
                              const localReminderPersonIndex = localReminderPersons.findIndex(
                                (item) => item.type === 'contact'
                              );
                              if (newValue && item === 'Lead') {
                                const itemToPush = {
                                  id: newValue.leadId,
                                  value:
                                    (newValue.lead && newValue.lead.company_name) ||
                                    (newValue.lead &&
                                      newValue.lead.contact_name &&
                                      newValue.lead.contact_name.name) ||
                                    '',
                                  type: 'contact',
                                };
                                if (localReminderPersonIndex !== -1)
                                  localReminderPersons[localReminderPersonIndex] = itemToPush;
                                else localReminderPersons.push(itemToPush);
                                setSelected({ id: 'reminderPersons', value: localReminderPersons });
                              } else if (localReminderPersonIndex !== -1) {
                                localReminderPersons.splice(localReminderPersonIndex, 1);
                                setSelected({ id: 'reminderPersons', value: localReminderPersons });
                              }
                            }}
                          />
))
                      }
                    </fieldset>
                  ) || null

                }
                {/* <DataFileAutocompleteComponent
                  idRef='RelatedToRef'
                  labelClasses='Requierd-Color'
                  labelValue='related-to'
                  selectedValues={
                    (selected.activeFormType === 1 && data['relatedUnit']) || selected.relatedLead
                  }
                  multiple={false}
                  data={(selected.activeFormType === 1 && data.relatedUnit) || data.relatedLead}
                  displayLabel={
                    (selected.activeFormType === 1 && ((option) => option.unitRefNo || '')) ||
                    ((option) =>
                      (option.lead && option.lead.company_name) ||
                      (option.lead && option.lead.contact_name && option.lead.contact_name.name) ||
                      '')
                  }
                  renderFor={(selected.activeFormType === 1 && 'unit') || 'lead'}
                  getOptionSelected={
                    (selected.activeFormType === 1 &&
                      ((option) => option.id === state.relatedUnitNumberId)) ||
                    ((option) => option.leadId === state.relatedLeadNumberId)
                  }
                  withoutSearchButton
                  isSubmitted={isSubmitted}
                  helperText={
                    getErrorByName(
                      schema,
                      (selected.activeFormType === 1 && 'relatedUnitNumberId') ||
                      'relatedLeadNumberId'
                    ).message
                  }
                  error={
                    getErrorByName(
                      schema,
                      (selected.activeFormType === 1 && 'relatedUnitNumberId') ||
                      'relatedLeadNumberId'
                    ).error
                  }
                  isLoading={
                    (selected.activeFormType === 1 && loadings.relatedUnit) ||
                    loadings.relatedLead
                  }
                  onInputKeyUp={(e) => {
                    const { value } = e.target;
                    if (searchTimer.current) clearTimeout(searchTimer.current);
                    searchTimer.current = setTimeout(() => {
                      if (selected.activeFormType === 1) getAllRelatedUnits(value);
                      else getAllRelatedLeads(value);
                    }, 700);
                  }}
                  inputStartAdornment={(
                    <SelectComponet
                      data={[
                        {
                          key: 1,
                          value: 'unit',
                        },
                        {
                          key: 2,
                          value: 'lead',
                        },
                      ]}
                      value={selected.activeFormType}
                      valueInput='key'
                      textInput='value'
                      //here
                      // onSelectChanged={changeActiveFormType}
                      wrapperClasses='over-input-select w-auto'
                      idRef='relatedToTypeRef'
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      translationPathForData={translationPath}
                    />
                  )}
                  isWithError
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onChange={(event, newValue) => {
                    if (selected.activeFormType === 1) {
                      setSelected({ id: 'relatedUnit', value: newValue });
                      setState({
                        id: 'relatedUnitNumberId',
                        value: (newValue && newValue.id) || null,
                      });
                    } else {
                      setSelected({ id: 'relatedLead', value: newValue });

                      setState({
                        id: 'relatedLeadNumberId',
                        value: (newValue && newValue.leadId) || null,
                      });
                    }
                    const localReminderPersons = [...selected.reminderPersons];
                    const localReminderPersonIndex = localReminderPersons.findIndex(
                      (item) => item.type === 'contact'
                    );
                    if (newValue && selected.activeFormType === 2) {
                      const itemToPush = {
                        id: newValue.leadId,
                        value:
                          (newValue.lead && newValue.lead.company_name) ||
                          (newValue.lead &&
                            newValue.lead.contact_name &&
                            newValue.lead.contact_name.name) ||
                          '',
                        type: 'contact',
                      };
                      if (localReminderPersonIndex !== -1)
                        localReminderPersons[localReminderPersonIndex] = itemToPush;
                      else localReminderPersons.push(itemToPush);
                      setSelected({ id: 'reminderPersons', value: localReminderPersons });
                    } else if (localReminderPersonIndex !== -1) {
                      localReminderPersons.splice(localReminderPersonIndex, 1);
                      setSelected({ id: 'reminderPersons', value: localReminderPersons });
                    }
                  }}
                /> */}
              </div>

              {(withDateTime === true) && (
                <>
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
                      minDate={(!activeItem && !activeItem) ? moment().format('YYYY-MM-DDTHH:mm:ss') : null}
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
                </> ||
                '')}
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
              <div className='dialog-content-item'>
                <SwitchComponent
                  idRef='isOpenStatusRef'
                  isChecked={state.isOpen}
                  themeClass='theme-line'
                  labelValue={(state.isOpen && 'open') || 'closed'}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onChangeHandler={(event, isChecked) =>
                    setState({ id: 'isOpen', value: isChecked })}
                />
              </div>
              <div className='dialog-content-item'>
                <Inputs
                  idRef='created-byRef'
                  labelValue='created-by'
                  value={
                    (state.createdByName || '')
                  }
                  isDisabled
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
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
              <ButtonBase onClick={() => { setIsOpenGallery(true); setOpenDialog(true); }} className='btns theme-solid bg-cancel '>
                <span className='mdi mdi-file-multiple c-warning px-2 ' />
                {' '}
                {GlobalTranslate.t('Shared:Files')}
              </ButtonBase>
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
              {!edit ? (uploadedFile.map((element, index) => (
                <Chip
                  className='uploader-chip'
                  label={element.fileName}
                  key={`importFileRefchip${index + 1}`}
                  onDelete={fileDeleted(element, index) || undefined}
                  onClick={download(element)}
                  clickable
                />
              ))) : (
                [{ uuid: state.fileId, fileName: state.fileName }].map((element, index) => (
                  element.uuid ? (
                    <Chip
                      className='uploader-chip'
                      label={element.fileName}
                      key={`importFileRefchip${index + 1}`}
                      onDelete={fileDeleted(element, index) || undefined}
                      onClick={download(element)}
                      clickable
                    />
                  ) : (<div />)
                )))}
            </div>
          </DialogContent>
          <DialogActions>
            <ButtonBase onClick={() => close()} className='btns theme-solid bg-cancel'>
              {t(`${translationPath}cancel`)}
            </ButtonBase>
            <PermissionsComponent
              permissionsList={Object.values(ActivitiesCallCenterPermissions)}
              permissionsId={ActivitiesCallCenterPermissions.EditActivity.permissionsId}
            >
              <ButtonBase className='btns theme-solid' type='submit'>
                {t(`${translationPath}${(activeItem && 'edit-activity') || 'add-activity'}`)}
              </ButtonBase>
            </PermissionsComponent>
          </DialogActions>
          <DialogComponent
            disableBackdropClick
            isOpen={openDialog}
            translationPath={translationPath}
            parentTranslationPath='Shared'
            titleClasses='DialogComponent-WorkingHoursDialogView'
            wrapperClasses='wrapperClasses-WorkingHoursDialogView'
            titleText='Activities-Files'
            onCloseClicked={() => setOpenDialog(false)}
            maxWidth='sm'
            dialogContent={(
              <>
                <div className='dialog-content-item w-100'>
                  <UploaderActivitieFileComponent
                    onCloseClicked={() => { setIsOpenGallery(true); setAllFiles([{}]); setOpenDialog(false); }}
                    onUploaderActivitieChange={(item) => {
                      convertToUploderReview(item);
                      setState({ id: 'fileId', value: item[0].uuid });
                      setState({ id: 'fileName', value: item[0].fullfileName });
                    }}
                    state={state}
                    allFiles={allFiles}
                  />
                </div>
              </>
            )}
          />
        </form>
      </Dialog>
    </div>
  );
};
ActivitiesManagementDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
ActivitiesManagementDialog.defaultProps = {
  activeItem: null,
  parentTranslationPath: '',
  translationPath: '',
};
