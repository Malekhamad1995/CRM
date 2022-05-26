import React, {
  useCallback, useEffect, useReducer, useState
} from 'react';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Spinner, TabsComponent } from '../../../../Components';
import { GetParams } from '../../../../Helper';
import { WorkOrdersManagementTabsData } from '../TabsData';
import {
  WorkOrderActivitiesComponent,
  WorkOrderDetailsComponent,
  WorkOrderDocumentsComponent,
  WorkOrderQuotationsComponent,
  WorkOrderReferenceComponent,
} from './Sections';
import { WorkOrderStatusHistoryDialog, WorkOrderStatusManagementDialog } from './Dialogs';
import { GetWorkOrderById } from '../../../../Services';

const parentTranslationPath = 'WorkOrdersManagementView';
const translationPath = '';
export const WorkOrdersManagementView = ({
  isFromDialog,
  parentSaveRef,
  toParentSender,
  maintenanceContractId,
  reloadData,
  workOrderId,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isAssetsBase, setIsAssetsBase] = useState(false);
  const [isUnit, setIsUnit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [statusManagementDialog, setStatusManagementDialog] = useState(false);
  const [statusHistoryDialog, setStatusHistoryDialog] = useState(false);
  const [savedWorkOrderStatus, setSavedWorkOrderStatus] = useState(null);
  const [id, setId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
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
    property: null,
    portfolio: null,
    unit: null,
    commonArea: null,
    workAssignTo: null,
    asset: null,
    workPriority: null,
    category: null,
    serviceType: null,
    contractorType: null,
    driver: null,
    assignedBy: null,
    assignedTo: null,
    workAchievedBy: [],
  });
  const [state, setState] = useReducer(reducer, {
    workOrderId: 0,
    workOrderStatus: null,
    propertyId: null,
    portfolioId: null,
    unitId: null,
    commonAreaId: null,
    otherLocation: null,
    workAssignToId: null,
    maintenanceContractId: null,
    assetsId: null,
    workPriorityId: null,
    categoryId: null,
    serviceTypeId: null,
    contractorTypeId: null,
    agentEmail: false,
    agentSMS: false,
    tenantSMS: false,
    driverId: null,
    travelTime: null,
    estimatedTimeInMinutes: 0,
    unitAreaSize: 0,
    materialsRequired: null,
    jobStartingTime: null,
    jobEndingTime: null,
    scheduleDate: null,
    workOrderUsers: [],
    assignedById: null,
    assignedToId: null,
    note: null,
  });
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };

  const schema = Joi.object({
    workOrderStatus: Joi.any()
      .required()
      .messages({
        'any.base': t(`${translationPath}status-is-required`),
        'any.required': t(`${translationPath}status-is-required`),
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
        'number.base': t(`${translationPath}portfolio-is-required`),
        'number.empty': t(`${translationPath}portfolio-is-required`),
      }),
    unitId: Joi.any()
      .custom((value, helpers) => {
        if (!value && !state.commonAreaId && !state.otherLocation)
          return helpers.error('state.unitRequired');
        return value;
      })
      .messages({
        'state.unitRequired': t(`${translationPath}unit-is-required`),
      }),
    commonAreaId: Joi.any()
      .custom((value, helpers) => {
        if (!value && !state.unitId && !state.otherLocation)
          return helpers.error('state.commonAreaRequired');
        return value;
      })
      .messages({
        'state.commonAreaRequired': t(`${translationPath}common-area-is-required`),
      }),
    workAssignToId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}work-assign-to-is-required`),
        'number.empty': t(`${translationPath}work-assign-to-is-required`),
      }),
    assetsId: Joi.any()
      .custom((value, helpers) => {
        if (!value && isAssetsBase) return helpers.error('state.assetsRequired');
        return value;
      })
      .messages({
        'state.assetsRequired': t(`${translationPath}assets-is-required`),
      }),
    workPriorityId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}work-priority-is-required`),
        'number.empty': t(`${translationPath}work-priority-is-required`),
      }),
    categoryId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}category-is-required`),
        'number.empty': t(`${translationPath}category-is-required`),
      }),
    contractorTypeId: Joi.number()
      .required()
      .messages({
        'number.base': t(`${translationPath}contractor-type-is-required`),
        'number.empty': t(`${translationPath}contractor-type-is-required`),
      }),
  })
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const onStateChangedHandler = (newValue) => {
    setState(newValue);
  };
  const onSelectedChangedHandler = (newValue) => {
    setSelected(newValue);
  };
  const getWorkOrderById = useCallback(async () => {
    setIsLoading(true);
    const res = await GetWorkOrderById({ workOrderById: id });
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) return res;
    return null;
  }, [id]);
  const getEditInit = useCallback(async () => {
    if (!state.workOrderId) {
      const workOrder = await getWorkOrderById();
      if (workOrder) {
        setState({
          id: 'edit',
          value: {
            ...workOrder,
            assignedById:
              (workOrder.workOrderUsers &&
                workOrder.workOrderUsers.findIndex((item) => item.isAssignedBy && item.usersId) !==
                -1 &&
                workOrder.workOrderUsers.find((item) => item.isAssignedBy && item.usersId)
                  .usersId) ||
              null,
            assignedToId:
              (workOrder.workOrderUsers &&
                workOrder.workOrderUsers.findIndex((item) => item.isAssignedTo && item.usersId) !==
                -1 &&
                workOrder.workOrderUsers.find((item) => item.isAssignedTo && item.usersId)
                  .usersId) ||
              null,
            workOrderUsers:
              (workOrder.workOrderUsers &&
                workOrder.workOrderUsers.filter((item) => item.isAchievedBy && item.usersId)) ||
              [],
          },
        });
        if (workOrder.assetsId) setIsAssetsBase(true);
        if (workOrder.commonAreaId) setIsUnit(false);
      }
    }
  }, [getWorkOrderById, state.workOrderId]);
  useEffect(() => {
    if (maintenanceContractId)
      setState({ id: 'maintenanceContractId', value: maintenanceContractId });
  }, [maintenanceContractId]);
  useEffect(() => {
    if (workOrderId) setId(workOrderId);
  }, [workOrderId]);

  useEffect(() => {
    if (id) getEditInit();
  }, [id, getEditInit]);
  useEffect(() => {
    const localId = GetParams('id');
    if (localId && !workOrderId) setId(+localId);
  }, [workOrderId]);
  useEffect(() => {
    if (toParentSender) toParentSender('activeTab', activeTab);
  }, [activeTab, toParentSender]);
  return (
    <div className='work-orders-management-wrapper view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='status-header'>
        <div>
          <ButtonBase
            className='btns theme-solid mx-2'
            onClick={() => setStatusManagementDialog(true)}
          >
            <span>
              {state.statusName ||
                (savedWorkOrderStatus && savedWorkOrderStatus.statusName) ||
                t(`${translationPath}entered`)}
            </span>
          </ButtonBase>
          <ButtonBase
            className='btns theme-transparent mx-2'
            onClick={() => setStatusHistoryDialog(true)}
          >
            <span>{t(`${translationPath}status-history`)}</span>
          </ButtonBase>
        </div>
        <ButtonBase className='btns theme-transparent c-black-light'>
          <span className='mdi mdi-clock-time-four-outline' />
          <span className='px-2'>{t(`${translationPath}history`)}</span>
        </ButtonBase>
      </div>
      <TabsComponent
        data={WorkOrdersManagementTabsData}
        labelInput='label'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-solid'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
      />
      {activeTab === 0 && (
        <WorkOrderDetailsComponent
          state={state}
          selected={selected}
          schema={schema}
          onStateChanged={onStateChangedHandler}
          onSelectedChanged={onSelectedChangedHandler}
          isUnit={isUnit}
          onIsUnitChanged={(newValue) => setIsUnit(newValue)}
          isAssetsBase={isAssetsBase}
          onIsAssetsBaseChanged={(newValue) => setIsAssetsBase(newValue)}
          id={id}
          parentSaveRef={parentSaveRef}
          toParentSender={toParentSender}
          isFromDialog={isFromDialog}
          reloadData={reloadData}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {activeTab === 1 && (
        <WorkOrderQuotationsComponent
          id={id}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {activeTab === 2 && (
        <WorkOrderReferenceComponent
          id={id}
          parentSaveRef={parentSaveRef}
          isFromDialog={isFromDialog}
          // reloadData={reloadData}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {/* {activeTab === 3 && (
        <WorkOrderNotesComponent
          state={state}
          schema={schema}
          onStateChanged={onStateChangedHandler}
          isSubmitted={isSubmitted}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )} */}
      {activeTab === 3 && (
        <WorkOrderDocumentsComponent
          id={id}
          toParentSender={toParentSender}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {activeTab === 4 && (
        <WorkOrderActivitiesComponent
          id={id}
          toParentSender={toParentSender}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {statusManagementDialog && (
        <WorkOrderStatusManagementDialog
          id={id}
          activeItem={savedWorkOrderStatus}
          isOpen={statusManagementDialog}
          isFromDialog={isFromDialog}
          onSave={(savedItem) => {
            setSavedWorkOrderStatus(savedItem);
            setState({
              id: 'workOrderStatus',
              value: savedItem || null,
            });
            setStatusManagementDialog(false);
          }}
          isOpenChanged={() => {
            setStatusManagementDialog(false);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      <WorkOrderStatusHistoryDialog
        id={id}
        isOpen={statusHistoryDialog}
        isOpenChanged={() => {
          setStatusHistoryDialog(false);
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};
WorkOrdersManagementView.propTypes = {
  workOrderId: PropTypes.number,
  maintenanceContractId: PropTypes.number,
  isFromDialog: PropTypes.bool,
  reloadData: PropTypes.func,
  toParentSender: PropTypes.func,
  parentSaveRef: PropTypes.instanceOf(Object),
};
WorkOrdersManagementView.defaultProps = {
  workOrderId: null,
  maintenanceContractId: null,
  isFromDialog: false,
  reloadData: undefined,
  toParentSender: undefined,
  parentSaveRef: undefined,
};
