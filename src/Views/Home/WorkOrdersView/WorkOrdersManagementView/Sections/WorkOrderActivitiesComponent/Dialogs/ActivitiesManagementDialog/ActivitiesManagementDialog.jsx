import React, {
 useCallback, useEffect, useReducer, useRef, useState
} from 'react';
import PropTypes from 'prop-types';
import {
 DialogActions, DialogContent, DialogTitle, Dialog, ButtonBase, Chip
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Joi from 'joi';
import moment from 'moment';
import {
  AutocompleteComponent,
  DatePickerComponent,
  DialogComponent,
  Inputs,
  SelectComponet,
  Spinner,
  SwitchComponent,
  UploaderActivitieFileComponent,
} from '../../../../../../../../Components';

import {
  floatHandler,
  getDownloadableLink,
  getErrorByName,
  GlobalTranslate,
  showError,
  showSuccess,
} from '../../../../../../../../Helper';
import {
  OrganizationUserSearch,
  GetAllActivityTypes,
  GetLeads,
  getUnits,
  CreateActivity,
  EditActivity,
  GetPortfolioById,
  GetWorkOrderById,
  GetAllWorkOrders,
  GetAllPortfolio,
} from '../../../../../../../../Services';
import { GetActivityTypeById } from '../../../../../../../../Services/ActivitiesTypesServices';

import { UnitMapper } from '../../../../../../UnitsView/UnitMapper';
import { ReminderTypesEnum, LeadsStatusEnum } from '../../../../../../../../Enums';

export const ActivitiesManagementDialog = ({
  id,
  activeItem,
  onSave,
  parentTranslationPath,
  translationPath,
  open,
  close,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const searchTimer = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reminder, setReminder] = useState();
  const [AssignActivity, setAssignActivity] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [withDateTime, setwithDateTime] = useState(true);
  const [edit, setEdit] = useState(false);
  const [isOpenGallery , setIsOpenGallery] = useState(false);
  const [uploadedFile , setUploadedFile] = useState([]);
  const [allFiles , setAllFiles] = useState([{uuid:"" , fullfileName:"" , fileName:""}]);
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
    pageSize: 10,
  });
  const [rols, setrols] = useState([]);
  const [loadings, setLoadings] = useReducer(reducer, {
    activityAssignments: false,
    activityTypes: false,
    units: false,
    relatedUnits: false,
    relatedLeads: false,
    relatedWorkOrders: false,
    relatedPortfolios: false,
  });
  const [selected, setSelected] = useReducer(reducer, {
    activityAssign: null,
    activityType: null,
    unit: null,
    activeFormType: 1,
    relatedUnit: null,
    relatedLead: null,
    relatedWorkOrder: null,
    relatedPortfolio: null,
    reminderPersons: [],
  });
  const [data, setData] = useReducer(reducer, {
    activityAssignments: [],
    activityTypes: [],
    units: [],
    relatedLeads: [],
    relatedUnits: [],
    relatedWorkOrders: [],
    relatedPortfolios: [],
  });
  const [state, setState] = useReducer(reducer, {
    assignAgentId: null,
    activityTypeId: null,
    unitId: null,
    relatedLeadNumberId: null,
    relatedUnitNumberId: null,
    relatedWorkOrderId: id,
    relatedPortfolioId: null,
    activityDate: moment().add(2, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
    subject: null,
    comments: null,
    isOpen: true,
    activityReminders: [],
    fileId:null,
    fileName:null
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
    activityDate: ((!activeItem) && (
      (withDateTime && (Joi.date()
      .required()
      .greater(Date.now())
      .messages({
        'date.base': t(`${translationPath}activity-date-is-required`),
        'date.greater': t(`${translationPath}choose-time-after-now`),
      })) || Joi.any()))) || Joi.any(),
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
    [rols, filter]
  );
  const getAllRelatedLeads = useCallback(
    async (value) => {
      setLoadings({ id: 'relatedLeads', value: true });
      const response = await GetLeads({ ...filter, search: value, leadStatus: LeadsStatusEnum.Open.status });
      if (!(response && response.status && response.status !== 200))
        setData({ id: 'relatedLeads', value: (response && response.result) || [] });
      else setData({ id: 'relatedLeads', value: [] });

      setLoadings({ id: 'relatedLeads', value: false });
    },
    [filter]
  );

  const getAllRelatedUnits = useCallback(
    async (value) => {
      setLoadings({ id: 'relatedUnits', value: true });
      const response = await getUnits({ ...filter, search: value });
      if (!(response && response.status && response.status !== 200)) {
        const unitMapped = ((response && response.result) || []).map((item) => UnitMapper(item));
        setData({
          id: 'relatedUnits',
          value: unitMapped || [],
        });
      } else setData({ id: 'relatedUnits', value: [] });

      setLoadings({ id: 'relatedUnits', value: false });
    },
    [filter]
  );

  const getAllUnits = useCallback(
    async (value) => {
      setLoadings({ id: 'units', value: true });
      const response = await getUnits({ ...filter, search: value });
      if (!(response && response.status && response.status !== 200)) {
        const unitMapped = ((response && response.result) || []).map((item) => UnitMapper(item));
        setData({
          id: 'units',
          value: unitMapped || [],
        });
      } else setData({ id: 'units', value: [] });

      setLoadings({ id: 'units', value: false });
    },
    [filter]
  );

  const GetActivityType = useCallback(async () => {
    setLoadings({ id: 'activityTypes', value: true });
    if (selected.activityType !== null) {
      const res = await GetActivityTypeById(selected.activityType.activityTypeId);
      if (!(res && res.status && res.status !== 200)) { setReminder(res.withReminder); setwithDateTime(res.withDateTime); } else setReminder(res.withReminder); setwithDateTime(res.withDateTime);
    }
    setLoadings({ id: 'activityTypes', value: false });
  }, [selected.activityType]);

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
  const getAllRelatedWorkOrders = useCallback(
    async (value) => {
      setLoadings({ id: 'relatedWorkOrders', value: true });
      const res = await GetAllWorkOrders({ ...filter, search: value });
      if (!(res && res.status && res.status !== 200)) {
        setData({
          id: 'relatedWorkOrders',
          value: (res && res.result) || [],
        });
      } else {
        setData({
          id: 'relatedWorkOrders',
          value: [],
        });
      }
      setLoadings({ id: 'relatedWorkOrders', value: false });
    },
    [filter]
  );
  const getAllRelatedPortfolios = useCallback(
    async (value) => {
      setLoadings({ id: 'relatedPortfolios', value: true });
      const res = await GetAllPortfolio({ ...filter, search: value });
      if (!(res && res.status && res.status !== 200)) {
        setData({
          id: 'relatedPortfolios',
          value: (res && res.result) || [],
        });
      } else {
        setData({
          id: 'relatedPortfolios',
          value: [],
        });
      }
      setLoadings({ id: 'relatedPortfolios', value: false });
    },
    [filter]
  );
  // const getUserById = useCallback(async () => {
  //   setIsLoading(true);
  //   const res =
  //   await ActiveOrganizationUser(userId);
  //   // setActiveUserItem(res);
  //   setActiveUserItem(JSON.parse(localStorage.getItem('activeUserItem')));
  //   setIsLoading(false);
  // }, [userId]);

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
  const getWorkOrderById = useCallback(async (workOrderId) => {
    setIsLoading(true);
    const res = await GetWorkOrderById({ workOrderById: workOrderId });
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) return res;
    return null;
  }, []);
  const getPortfolioById = useCallback(async (portfolioId) => {
    setIsLoading(true);
    const res = await GetPortfolioById(portfolioId);
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) return res;
    return null;
  }, []);

  useEffect(() => {
    getAllActivityTypes();
    getAllRelatedLeads();
    getAllUnits();
    GetActivityType();
    getAllRelatedUnits();
    getAllRelatedWorkOrders();
    getAllRelatedPortfolios();
  }, [
    getAllActivityTypes,
    getAllRelatedLeads,
    getAllUnits,
    GetActivityType,
    getAllRelatedUnits,
    getAllRelatedWorkOrders,
    getAllRelatedPortfolios,
  ]);
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
          relatedWorkOrderId: activeItem.relatedWorkOrderId,
          relatedPortfolioId: activeItem.relatedPortfolioId,
          activityDate: activeItem.activityDate,
          comments: activeItem.comments,
          isOpen: activeItem.isOpen,
          activityReminders: activeItem.activityReminders || [],
          subject: activeItem.subject,
        },
      });
      setEdit(true);
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
          activityType: activeItem.activityType,
          activeFormType: activeItem.relatedUnitNumberId ? 1 : 2,
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
            }) ||
            null,
          relatedWorkOrder:
            (activeItem.relatedWorkOrderId && getWorkOrderById(activeItem.relatedWorkOrderId)) ||
            null,
          relatedPortfolio:
            (activeItem.relatedPortfolioId && getPortfolioById(activeItem.relatedPortfolioId)) ||
            null,
          reminderPersons,
        },
      });
    }
  }, [activeItem, getPortfolioById, getWorkOrderById]);
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

  const convertToUploderReview = (item)=>{
    const filess = item.map((element , index)=>{
      return {
        uuid : element.uuid , fileName : element.fullfileName
      }
    })
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
      setAllFiles([{uuid: '', fullfileName: '', fileName: ''}]);
      setState({ id: 'fileId', value: null });   // temprory, until the APi are ready and take more one files ; 
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
        onClose={() => {
          close();
        }}
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
                  labelClasses='Requierd-Color'
                  labelValue='activity-type'
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
                  labelValue='activity-assign-to'
                  labelClasses='Requierd-Color'
                  selectedValues={selected.activityAssign}
                  multiple={false}
                  isDisabled={AssignActivity}
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
                      minDate={(!activeItem) ? moment().format('YYYY-MM-DDTHH:mm:ss') : ''}
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
                      labelClasses='Requierd-Color'
                      idRef='activityTimeRef'
                      labelValue='activity-time'
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
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onInputChanged={(event) => {
                    setState({ id: 'subject', value: event.target.value });
                  }}
                />
              </div>
              <div className='dialog-content-item'>
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
              <ButtonBase onClick={() => setOpenDialog(true)} className='btns theme-solid bg-cancel '>
                <span className='mdi mdi-file-multiple c-warning px-2 ' />
                {' '}
                { GlobalTranslate.t('Shared:Files')}
              </ButtonBase>
              {state.activityReminders && state.activityReminders.length > 0 && reminder && (
                <div className='title-wrapper'>
                  <span className='title-text Requierd-Color'>{t(`${translationPath}add-reminders`)}</span>
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
                              type='number'
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
               {!edit? ( uploadedFile.map((element , index)=>(
                <Chip
                className='uploader-chip'
                label={element.fileName}
                key={`importFileRefchip${index + 1}`}
                onDelete={fileDeleted(element, index) || undefined} 
                onClick={download(element)}
                clickable
                />
               ))):(
                [{uuid: state.fileId ,  fileName : state.fileName }].map((element , index)=>(
                element.uuid?(  <Chip
                className='uploader-chip'
                label={element.fileName}
                key={`importFileRefchip${index + 1}`}
                onDelete={fileDeleted(element , index) || undefined} 
                onClick={download(element)}
                clickable
                />):(<div></div>)
               )))}
            </div>
          </DialogContent>
          <DialogActions>
            <ButtonBase onClick={() => close()} className='btns theme-solid bg-cancel'>
              {t(`${translationPath}cancel`)}
            </ButtonBase>
            <ButtonBase className='btns theme-solid' type='submit'>
              {t(`${translationPath}${(activeItem && 'edit-activity') || 'add-activity'}`)}
            </ButtonBase>
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
                  onCloseClicked={() => {setIsOpenGallery(true);setAllFiles([{}]);setOpenDialog(false)}}
                  onUploaderActivitieChange={(item) => {
                    convertToUploderReview(item) ; 
                    setState({ id: 'fileId', value: item[0].uuid });
                    setState({ id: 'fileName', value: item[0].fullfileName });}}
                     state= {state}
                     allFiles = {allFiles}
                />
                </div>
              </>
        )}
          />
        </form>
      </Dialog>
    </div>
  );
}; ActivitiesManagementDialog.propTypes = {
  id: PropTypes.number.isRequired,
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
