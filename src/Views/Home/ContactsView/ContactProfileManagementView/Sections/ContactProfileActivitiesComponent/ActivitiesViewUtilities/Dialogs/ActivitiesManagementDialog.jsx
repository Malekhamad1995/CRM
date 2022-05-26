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
import { useSelector } from 'react-redux';
import {
  AutocompleteComponent,
  DataFileAutocompleteComponent,
  DatePickerComponent,
  DialogComponent,
  Inputs,
  Spinner,
  SwitchComponent,
  UploaderActivitieFileComponent,
} from '../../../../../../../../Components';
import {
  getDownloadableLink,
  getErrorByName, GetParams, GlobalTranslate, showError, showSuccess
} from '../../../../../../../../Helper';
import {
  ActivitiesRelatedToActivitiesTypeEnum, LeadsStatusEnum
} from '../../../../../../../../Enums';
import {
  OrganizationUserSearch,
  GetAllActivityTypes,
  CreateActivity,
  EditActivity,
  GetAllLeadsByContactId,
  GetActivityTypeBasedOnRelatedType
} from '../../../../../../../../Services';

export const ActivitiesManagementDialog = ({
  activeItem,
  onSave,
  parentTranslationPath,
  translationPath,
  open,
  close,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const loginResponse = useSelector((sa) => sa.login.loginResponse);
  const [allFiles, setAllFiles] = useState([{ uuid: "", fullfileName: "", fileName: "" }]);
  const [isOpenGallery, setIsOpenGallery] = useState(false);
  const [uploadedFile, setUploadedFile] = useState([]);
  const searchTimer = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [edit, setEdit] = useState(false);
  const [AssignActivity, setAssignActivity] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [rols, setrols] = useState([]);
  const [loadings, setLoadings] = useReducer(reducer, {
    activityAssignments: false,
    activityTypes: false,
    units: false,
    relatedUnits: false,
    relatedLeads: false,
  });
  const [selected, setSelected] = useReducer(reducer, {
    activityAssign: null,
    activityType: null,
    unit: null,
    activeFormType: 2,
    relatedUnit: null,
    relatedLead: null,
  });
  const [data, setData] = useReducer(reducer, {
    activityAssignments: [],
    activityTypes: [],
    units: [],
    relatedLeads: [],
    relatedUnits: [],
  });

  const [state, setState] = useReducer(reducer, {
    assignAgentId: null,
    activityTypeId: null,
    unitId: null,
    relatedLeadNumberId: null,
    relatedUnitNumberId: null,
    activityDate: moment().add(2, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
    subject: null,
    comments: null,
    isOpen: true,
    activityReminders: [],
    createdByName: (loginResponse && loginResponse.fullName) || null,
    fileId: null,
    fileName: null
  });


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
    activityDate: Joi.date().required().greater(Date.now())
      .messages({
        'date.base': t(`${translationPath}activity-date-is-required`),
        'date.greater': t(`${translationPath}choose-time-after-now`),
      }),
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
        setData({
          id: 'activityAssignments',
          value:
            (selectedValue &&
              ((res && res.result && [...res.result, selectedValue]) || [selectedValue])) ||
            (res && res.result) ||
            [],
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
  const getAllRelatedLeads = useCallback(async () => {
    setLoadings({ id: 'relatedLeads', value: true });
    const response = await GetAllLeadsByContactId(
      { pageIndex: 0, pageSize: 100 , leadStatus: LeadsStatusEnum.Open.status},
      +GetParams('id')
    );
    if (!(response && response.status && response.status !== 200))
      setData({ id: 'relatedLeads', value: (response && response.result) || [] });
    else setData({ id: 'relatedLeads', value: [] });

    setLoadings({ id: 'relatedLeads', value: false });
  }, []);
  // const getAllRelatedUnits = useCallback(
  //   async (value) => {
  //     setLoadings({ id: 'relatedUnits', value: true });
  //     const response = await getUnits({ ...filter, search: value });
  //     if (!(response && response.status && response.status !== 200)) {
  //       const unitMapped = ((response && response.result) || []).map((item) => UnitMapper(item));
  //       setData({
  //         id: 'relatedUnits',
  //         value: unitMapped || [],
  //       });
  //     } else setData({ id: 'relatedUnits', value: [] });

  //     setLoadings({ id: 'relatedUnits', value: false });
  //   },
  //   [filter]
  // );

  // const getAllUnits = useCallback(
  //   async (value) => {
  //     setLoadings({ id: 'units', value: true });
  //     const response = await getUnits({ ...filter, search: value });
  //     if (!(response && response.status && response.status !== 200)) {
  //       const unitMapped = ((response && response.result) || []).map((item) => UnitMapper(item));
  //       setData({
  //         id: 'units',
  //         value: unitMapped || [],
  //       });
  //     } else setData({ id: 'units', value: [] });

  //     setLoadings({ id: 'units', value: false });
  //   },
  //   [filter]
  // );
  const getAllActivityTypes = useCallback(async () => {
    setLoadings({ id: 'activityTypes', value: true });
    // const res = await GetAllActivityTypes();
    const res = await GetActivityTypeBasedOnRelatedType(ActivitiesRelatedToActivitiesTypeEnum.lead.key);

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
  // const getUserById = useCallback(async () => {
  //   setIsLoading(true);
  //   const res =
  //   await ActiveOrganizationUser(userId);
  //   // setActiveUserItem(res);
  //   setActiveUserItem(JSON.parse(localStorage.getItem('activeUserItem')));
  //   setIsLoading(false);
  // }, [userId]);
  // const changeActiveFormType = (newValue) => {
  //   setSelected({
  //     id: 'edit',
  //     value: {
  //       ...selected,
  //       activeFormType: +newValue,
  //       relatedUnit: null,
  //       relatedLead: null,
  //     },
  //   });
  //   if (state.relatedLeadNumberId) setState({ id: 'relatedLeadNumberId', value: null });
  //   if (state.relatedUnitNumberId) setState({ id: 'relatedUnitNumberId', value: null });
  // };

  const convertToUploderReview = (item) => {
    const filess = item.map((element, index) => {
      return {
        uuid: element.uuid, fileName: element.fullfileName
      }
    })
    setUploadedFile(filess);
    setAllFiles(item);
    return item;
  }

  const saveHandler = async (event) => {
    event.preventDefault();
    // setState({ id: 'fileId', value: allFiles[0].uuid });
    // setState({id: 'fileName', value: allFiles[0].fullfileName});
    setIsSubmitted(true);
    if (state.activityDate && (state.activityDate <= moment().format('YYYY-MM-DDTHH:mm:ss'))) {
      showError(t(`${translationPath}choose-time-after-now`));
      setIsLoading(false);
      return;
    }
    if (schema.error) {
      showError(t('Shared:please-fix-all-errors'));
      return;
    }
    setIsLoading(true);
    const res =
      (activeItem && activeItem.activityId && (await EditActivity(activeItem.activityId, state))) ||
      (await CreateActivity(state));
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
  useEffect(() => {
    getAllActivityTypes();
    getAllRelatedLeads();
    // getAllUnits();
    // getAllRelatedUnits();
  }, [
    getAllActivityTypes,
    getAllRelatedLeads,
    // getAllUnits,
    // getAllRelatedUnits,
  ]);

  useEffect(() => {
    getAllActivityAssignments();
  }, [
    getAllActivityAssignments,
    rols
  ]);

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
          activityDate: activeItem.activityDate,
          subject: activeItem.subject,
          comments: activeItem.comments,
          isOpen: activeItem.isOpen,
          activityReminders: activeItem.activityReminders || [],
          createdByName: activeItem.createdBy,
          fileId: activeItem.fileId,
          fileName: activeItem.fileName
        },
      });
      setEdit(true);
    }
  }, [activeItem]);
  useEffect(() => {
    if (activeItem) {
      setSelected({
        id: 'edit',
        value: {
          ...selected,
          activityAssign: { fullName: activeItem.agentName },
          activityType: activeItem.activityType,
          activeFormType: activeItem.relatedUnitNumberId ? 1 : 2,
          unit: {
            propertyName:
              (data.units &&
                data.units[0] &&
                data.units[0].propertyName &&
                data.units.filter((item) => item.id === activeItem.unitId)[0].propertyName) ||
              '',
          },
          relatedLead: activeItem.relatedLeadNumberId && {
            lead: {
              contact_name: {
                name:
                  data.relatedLeads &&
                  data.relatedLeads[0] &&
                  data.relatedLeads.filter(
                    (item) => item.leadId === activeItem.relatedLeadNumberId
                  )[0].lead.contact_name.name,
              },
            },
          },
          relatedUnit: {
            propertyName:
              activeItem.relatedUnitNumberId &&
              data.relatedUnits &&
              data.relatedUnits[0] &&
              data.relatedUnits.filter((item) => item.id === activeItem.relatedUnitNumberId)[0]
                .propertyName,
          },
          createdByName: activeItem.createdByName,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const fileDeleted = useCallback(
    (item, index) => () => {

      setUploadedFile([]);
      setAllFiles([{ uuid: '', fullfileName: '', fileName: '' }]);
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

  const download = (value) => () => {
    const link = document.createElement('a');
    link.setAttribute('download', value.fileName);
    link.href = getDownloadableLink(value.uuid);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
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
                    const assignedToActivityTypeRoles = ((newValue && newValue.assignedToActivityTypeRoles) || []);
                    const rolesIds = (assignedToActivityTypeRoles && assignedToActivityTypeRoles.map((item) => item.rolesId || []));
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
                    setState({
                      id: 'assignAgentId',
                      value: (newValue && newValue.id) || null,
                    });
                  }}
                />
              </div>
              {/* <div className='dialog-content-item'>
                <DataFileAutocompleteComponent
                  idRef='unitIdRef'
                  labelValue='unit'
                  selectedValues={selected.unit}
                  multiple={false}
                  data={data.units}
                  displayLabel={(option) => option.propertyName || ''}
                  renderFor='unit'
                  getOptionSelected={(option) => option.id === state.unitId}
                  withoutSearchButton
                  helperText={getErrorByName(schema, 'unitId').message}
                  error={getErrorByName(schema, 'unitId').error}
                  isLoading={loadings.units}
                  onInputKeyUp={(e) => {
                    const { value } = e.target;
                    if (searchTimer.current) clearTimeout(searchTimer.current);
                    searchTimer.current = setTimeout(() => {
                      getAllUnits(value);
                    }, 700);
                  }}
                  isWithError
                  isSubmitted={isSubmitted}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onChange={(event, newValue) => {
                    setSelected({ id: 'unit', value: newValue });
                    setState({
                      id: 'unitId',
                      value: (newValue && newValue.id) || null,
                    });
                  }}
                />
              </div> */}
              <div className='dialog-content-item'>
                <DataFileAutocompleteComponent
                  idRef='RelatedToRef'
                  labelClasses='Requierd-Color'
                  labelValue='related-to-lead'
                  selectedValues={
                    (selected.activeFormType === 1 && selected.relatedUnit) || selected.relatedLead
                  }
                  multiple={false}
                  data={(selected.activeFormType === 1 && data.relatedUnits) || data.relatedLeads}
                  displayLabel={
                    (selected.activeFormType === 1 && ((option) => option.propertyName || '')) ||
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
                    (selected.activeFormType === 1 && loadings.relatedUnits) ||
                    loadings.relatedLeads
                  }
                  // onInputKeyUp={(e) => {
                  //   const { value } = e.target;
                  //   if (searchTimer.current) clearTimeout(searchTimer.current);
                  //   searchTimer.current = setTimeout(() => {
                  //     getAllRelatedLeads(value);
                  //   }, 700);
                  // }}
                  // inputStartAdornment={(
                  //   <SelectComponet
                  //     data={[
                  //       {
                  //         key: 1,
                  //         value: 'unit',
                  //       },
                  //       {
                  //         key: 2,
                  //         value: 'lead',
                  //       },
                  //     ]}
                  //     value={selected.activeFormType}
                  //     valueInput='key'
                  //     textInput='value'
                  //     onSelectChanged={changeActiveFormType}
                  //     wrapperClasses='over-input-select w-auto'
                  //     idRef='relatedToTypeRef'
                  //     parentTranslationPath={parentTranslationPath}
                  //     translationPath={translationPath}
                  //     translationPathForData={translationPath}
                  //   />
                  // )}
                  isWithError
                  isSubmitted={isSubmitted}
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
                  }}
                />
              </div>
              <div className='dialog-content-item'>
                <DatePickerComponent
                  idRef='activityDateRef'
                  labelClasses='Requierd-Color'
                  labelValue='activity-date'
                  placeholder='DD/MM/YYYY'
                  value={state.activityDate ? state.activityDate : moment().format('YYYY-MM-DDTHH:mm:ss')}
                  helperText={getErrorByName(schema, 'activityDate').message}
                  error={getErrorByName(schema, 'activityDate').error}
                  isSubmitted={isSubmitted}
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
                  idRef='activityDateRef'
                  labelValue='activity-time'
                  labelClasses='Requierd-Color'
                  isTimePicker
                  value={state.activityDate ? state.activityDate : moment().add(2, 'minutes').format('YYYY-MM-DDTHH:mm:ss')}
                  helperText={getErrorByName(schema, 'activityDate').message}
                  error={getErrorByName(schema, 'activityDate').error}
                  isSubmitted={isSubmitted}
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
                    (state.relatedLeadNumberId && t(`${translationPath}lead`)) ||
                    (state.relatedUnitNumberId && t(`${translationPath}unit`)) ||
                    t(`${translationPath}not-contacted`)
                  }
                  isDisabled
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                // onInputChanged={(event) => {
                //   setState({ id: 'stage', value: event.target.value });
                // }}
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
              <ButtonBase onClick={() => setOpenDialog(true)} className='btns theme-solid bg-cancel '>
                <span className='mdi mdi-file-multiple c-warning px-2 ' />
                {' '}
                {GlobalTranslate.t('Shared:Files')}
              </ButtonBase>
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
                  element.uuid ? (<Chip
                    className='uploader-chip'
                    label={element.fileName}
                    key={`importFileRefchip${index + 1}`}
                    onDelete={fileDeleted(element, index) || undefined}
                    onClick={download(element)}
                    clickable
                  />) : (<div></div>)
                )))}
            </div>
          </DialogContent>
          <DialogActions>
            <ButtonBase onClick={() => { setIsOpenGallery(true); close(); }} className='btns theme-solid bg-cancel'>
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
                    onCloseClicked={() => { setIsOpenGallery(true); setAllFiles([{}]); setOpenDialog(false) }}
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
