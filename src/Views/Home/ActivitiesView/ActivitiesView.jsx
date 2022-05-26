import React, {
  useState, useRef, useEffect, useCallback, useReducer
} from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import {
  Inputs, SelectComponet, Spinner, AutocompleteComponent, DataFileAutocompleteComponent, ViewTypesActivities
} from '../../../Components';
import { DateRangePickerComponent } from '../../../Components/Controls/DateRangePickerComponent/DateRangePickerComponent';

import { useTitle } from '../../../Hooks';
// import { GetForms } from '../../../Services/formbuilder/getForms';
import { TableActions, ViewTypes2Enum ,UnitsOperationTypeEnum } from '../../../Enums';
import { ActivitiesManagementDialog } from './ActivitiesViewUtilities/Dialogs/ActivitiesManagementDialog';
import {
  GetAllActivitiesForPropertyManagement,
  GetAllNotRelatedActivitiesForPropertyManagement,
  GetAllRelatedActivities,
  GetAllActivitiesFilter,
  OrganizationUserSearch,
  GetLeads,
  getUnits,
  GetAllMaintenanceContract,
  GetAllWorkOrders,
  GetAllPortfolio

} from '../../../Services';
import { ActivitesPermissions } from '../../../Permissions';
import { PermissionsComponent } from '../../../Components/PermissionsComponent/PermissionsComponent';
import { ActivitiesCallCenterPermissions } from '../../../Permissions/CallCenter/ActivitiesCallCenterPermissions';
import { returnPropsByPermissions } from '../../../Helper/ReturnPropsByPermissions.Helper';
import { GlobalOrderFilterActions } from '../../../store/GlobalOrderFilter/GlobalOrderFilterActions';
import { UnitMapper } from '../UnitsView/UnitMapper';
import { ActivitiesTableView } from './ActivitiesViewUtilities/ActivitiesTableView';

const parentTranslationPath = 'ActivitiesView';
const translationPath = '';

export const ActivitiesView = () => {
  // eslint-disable-next-line prefer-const
  const dateRangeDefault = {
    startDate: null,
    endDate: null,
    key: 'selection',
  };
  const [agents, setAllAgent] = useState({
    result: [],
    totalCount: 0,
  });

  const [sortBy, setSortBy] = useState(null);
  const [activeActionType, setActiveActionType] = useState(ViewTypes2Enum.tableRelatedView.key);
  const [dateFilter, setDateFilter] = useState(dateRangeDefault);

  const { t } = useTranslation(parentTranslationPath);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [isLoading, setIsLoading] = useState({agents:false,
    units:false, leads:false});
  const [searchedItem, setSearchedItem] = useState('');
  const [activities, setActivities] = useState({
    result: [],
    totalCount: 0,
  });
  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];
  const [openDialog, setOpenDialog] = useState(false);
  const searchTimer = useRef(null);

  const [editpermissionsList, setEditpermissionsList] = useState([]);

  const isPropertyManagementView = pathName === 'activities-management';
  const dispatch = useDispatch();
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const [selectedOrderBy, setSelectedOrderBy] = useState(pathName === 'Activities' ?
    {
      filterBy: (orderFilter.activitesCallCenterFilter && orderFilter.activitesCallCenterFilter.filterBy) || null,
      orderBy: (orderFilter.activitesCallCenterFilter && orderFilter.activitesCallCenterFilter.orderBy) || null,
    } :
    {
      filterBy: (orderFilter.activitesManagementFilter && orderFilter.activitesManagementFilter.filterBy) || null,
      orderBy: (orderFilter.activitesManagementFilter && orderFilter.activitesManagementFilter.orderBy) || null,
    });
  const [selectSortBy, setSelectSortBy] = useState(selectedOrderBy.filterBy ? selectedOrderBy : { filterBy: null, orderBy: null });
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
    fromDate: null,
    toDate: null,
    filterBy: selectSortBy.filterBy || null,
    orderBy: selectSortBy.orderBy || null,
    agentId: null,
    relatedUnitNumberId: null,
    relatedLeadNumberId: null,
    relatedWorkOrderId: null,
    relatedMaintenanceContractId: null,
    relatedPortfolioId: null,

  });
  useTitle(t(`${translationPath}activities`));

  const getAllActivities = useCallback(async () => {
    setIsLoadingActivities(true);

    let activitiesDate = { fromDate: null, toDate: null };
    if (dateFilter && dateFilter.startDate && dateFilter.endDate) {
      activitiesDate = {
        fromDate: moment(dateFilter.startDate).format(),
        toDate: moment(dateFilter.endDate).format()
      };
    }
    let res = {
      result: [],
      totalCount: 0
    };
    if (pathName === 'activities-management') {
      res = activeActionType === ViewTypes2Enum.tableRelatedView.key ? await GetAllNotRelatedActivitiesForPropertyManagement({
        ...filter, pageIndex: filter.pageIndex + 1, fromDate: activitiesDate.fromDate, toDate: activitiesDate.toDate
      }) : await GetAllActivitiesForPropertyManagement({
        ...filter, pageIndex: filter.pageIndex + 1, fromDate: activitiesDate.fromDate, toDate: activitiesDate.toDate
      });
    } else {
      res = activeActionType === ViewTypes2Enum.tableRelatedView.key ? await GetAllRelatedActivities({
        ...filter, pageIndex: filter.pageIndex + 1, fromDate: activitiesDate.fromDate, toDate: activitiesDate.toDate
      }) : await GetAllActivitiesFilter({
        ...filter, pageIndex: filter.pageIndex + 1, fromDate: activitiesDate.fromDate, toDate: activitiesDate.toDate
      });
    }
    if (!(res && res.status && res.status !== 200)) {
      setActivities({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setActivities({
        result: [],
        totalCount: 0,
      });
    }

    setIsLoadingActivities(false);

  }, [filter, pathName, activeActionType, dateFilter]);

  useEffect(() => {
    getAllActivities();
  }, [getAllActivities]);

  const searchHandler = (event) => {
    const { value } = event.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({ ...item, search: value, pageIndex: 0, }));
    }, 700);
  };

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  const addNewHandler = () => {
    setOpenDialog(true);
  };
  const filterByChanged = (value) => {
    setSelectSortBy((item) => ({ ...item, filterBy: value }));
  };
  const orderByChanged = (value) => {
    setSelectSortBy((item) => ({ ...item, orderBy: value }));
  };

  const GetOrdered = () => {
    if (pathName === 'Activities') {
      // if (!selectedOrderBy.filterBy || !selectedOrderBy.orderBy) {
      //   if (sortBy.filterBy || sortBy.orderBy) setSelectSortBy({});
      //   return;
      // }
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          activitesCallCenterFilter: {
            filterBy: selectSortBy.filterBy,
            orderBy: selectSortBy.orderBy,
          },
        })
      );
    } else {
      // if (!selectedOrderBy.filterBy || !selectedOrderBy.orderBy) {
      //   if (sortBy.filterBy || sortBy.orderBy) setSelectSortBy({});
      //   return;
      // }
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          activitesManagementFilter: {
            filterBy: selectSortBy.filterBy,
            orderBy: selectSortBy.orderBy,
          },
        })
      );
    }

    setSelectedOrderBy({
      filterBy: selectSortBy.filterBy || null,
      orderBy: selectSortBy.orderBy || null,
    });

    setFilter((item) => ({ ...item, orderBy: selectSortBy.orderBy, filterBy: selectSortBy.filterBy }));
  };

  // const GetOrdered = () => {
  //   setFilter((item) => ({ ...item, orderBy: sortBy.orderBy, filterBy: sortBy.filterBy }));
  // };

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
    activeFormType: (pathName === 'Activities' ? 1 : 3),
    relatedUnit: null,
    relatedLead: null,
    relatedWorkOrder: null,
    relatedPortfolio: null,
    relatedMaintenanceContract: null,
    reminderPersons: [],
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
        relatedMaintenanceContract: null
      },
    });
    if (filter.relatedLeadNumberId)
      setFilter((item) => ({ ...item, relatedLeadNumberId: null }));
    if (filter.relatedUnitNumberId)
      setFilter((item) => ({ ...item, relatedUnitNumberId: null }));
    if (filter.relatedWorkOrderId) setFilter((item) => ({ ...item, relatedWorkOrderId: null }));
    if (filter.relatedPortfolioId) setFilter((item) => ({ ...item, relatedPortfolioId: null }));
    if (filter.relatedMaintenanceContractId) setFilter((item) => ({ ...item, relatedMaintenanceContractId: null }));
  };

  const getAllAgents = useCallback(async () => {

    setIsLoading((loading)=>({...loading, agents:true}));

    const res = await OrganizationUserSearch({});
    if (!(res && res.status && res.status !== 200)) {
      setAllAgent({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setAllAgent({
        result: [],
        totalCount: 0,
      });
    }

    setIsLoading((loading)=>({...loading, agents:false}));

  }, []);
  useEffect(() => {
    getAllAgents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onTypeChanged = useCallback(
    (activeType) => {
      setActiveActionType(activeType);
    },
    [setActiveActionType]
  );
  const getAllRelatedUnits = useCallback(
    async (value) => {
      // setLoadings({ id: 'relatedUnits', value: true });
      setIsLoading((loading)=>({...loading, units:true}));

      const response = await getUnits({ search: value ,  operationType:  (pathName === 'Activities' ? null :UnitsOperationTypeEnum.rent.key)
      });
      if (!(response && response.status && response.status !== 200)) {
        const unitMapped = ((response && response.result) || []).map((item) => UnitMapper(item));
        setData({
          id: 'relatedUnits',
          value: unitMapped || [],
        });
      } else setData({ id: 'relatedUnits', value: [] });

      // setLoadings({ id: 'relatedUnits', value: false });
      setIsLoading((loading)=>({...loading, units:false}));

    },
    []
  );
  const getAllRelatedLeads = useCallback(
    async (value) => {

      setIsLoading((loading)=>({...loading, leads:true}));

      const response = await GetLeads({ search: value });
      if (!(response && response.status && response.status !== 200))
        setData({ id: 'relatedLeads', value: (response && response.result) || [] });
      else setData({ id: 'relatedLeads', value: [] });

      setIsLoading((loading)=>({...loading, leads:false}));

    }, []
  );
  const getAllMaintenanceContracts = useCallback(
    async (value) => {
      // setLoadings({ id: 'relatedMaintenanceContractId', value: true });
      const response = await GetAllMaintenanceContract({
 ...filter, filterBy: null, orderBy: null, search: value
});
      if (!(response && response.status && response.status !== 200))
        setData({ id: 'relatedMaintenanceContractId', value: (response && response.result) || [] });
      else setData({ id: 'relatedMaintenanceContractId', value: [] });
      // setLoadings({ id: 'relatedMaintenanceContractId', value: false });
    },
    [filter]
  );

  const getAllRelatedWorkOrder = useCallback(async (value) => {
    // setLoadings({ id: 'relatedWorkOrder', value: true });
    const response = await GetAllWorkOrders({ pageIndex: 0, pageSize: 25, search: value });
    if (!(response && response.status && response.status !== 200)) {
      setData({
        id: 'relatedWorkOrder',
        value: response.result || [],
      });
    } else setData({ id: 'relatedWorkOrder', value: [] });

    // setLoadings({ id: 'relatedWorkOrder', value: false });
  }, []);

  const getAllRelatedPortfolio = useCallback(async (value) => {
    // setLoadings({ id: 'relatedPortfolio', value: true });
    const response = await GetAllPortfolio({ pageIndex: 0, pageSize: 25, search: value });
    if (!(response && response.status && response.status !== 200)) {
      setData({
        id: 'relatedPortfolio',
        value: response.result || [],
      });
    } else setData({ id: 'relatedPortfolio', value: [] });

    // setLoadings({ id: 'relatedPortfolio', value: false });
  }, []);

  useEffect(() => {
    if (pathName === 'Activities') {
      getAllRelatedUnits();
      getAllRelatedLeads();
    } else if (pathName === 'activities-management') {
      getAllRelatedWorkOrder('');
      getAllRelatedPortfolio('');
      getAllMaintenanceContracts();
    }
  }, []);

  useEffect(() => {
    const EditpermissionsId = !isPropertyManagementView ? ActivitiesCallCenterPermissions.EditActivity.permissionsId : ActivitesPermissions.EditActivity.permissionsId;
    if (activeActionType === ViewTypes2Enum.tableRelatedView.key) {
      if (returnPropsByPermissions(EditpermissionsId))
        setEditpermissionsList([{ enum: TableActions.editText.key }, { enum: TableActions.replyText.key }]);
      else setEditpermissionsList([{ enum: TableActions.replyText.key }]);
    } else if (returnPropsByPermissions(EditpermissionsId))
      setEditpermissionsList([{ enum: TableActions.editText.key }]);
    else setEditpermissionsList([]);
  }, [isPropertyManagementView, activeActionType]);

  useEffect(() => {
    if (sortBy) {
    setFilter((item) => ({
        ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy, search: '', pageIndex: 0, relatedLeadNumberId: null, relatedUnitNumberId: null, agentId: null
     }));
    if (pathName === 'Activities') {
      dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        activitesCallCenterFilter: {
          filterBy: sortBy.filterBy,
          orderBy: sortBy.orderBy,
        },
      })
    );
    } else {
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          activitesManagementFilter: {
            filterBy: sortBy.filterBy,
            orderBy: sortBy.orderBy,
          },
        })
      );
    }

    setSelectSortBy((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
    setSelectedOrderBy((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
    }
  }, [sortBy]);

  return (
    <div className='view-wrapper'>
      <Spinner isActive={isLoadingActivities} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section px-3'>
              {!isPropertyManagementView && (
                <PermissionsComponent
                  permissionsList={Object.values(ActivitiesCallCenterPermissions)}
                  permissionsId={ActivitiesCallCenterPermissions.AddNewActivity.permissionsId}
                >
                  <ButtonBase className='btns theme-solid px-3' onClick={addNewHandler}>
                    <span className='mdi mdi-plus' />
                    {t(`${translationPath}add-new`)}
                  </ButtonBase>
                </PermissionsComponent>
              )}

              {isPropertyManagementView && (
                <PermissionsComponent
                  permissionsList={Object.values(ActivitesPermissions)}
                  permissionsId={ActivitesPermissions.CreateActivity.permissionsId}
                >
                  <ButtonBase className='btns theme-solid px-3' onClick={addNewHandler}>
                    <span className='mdi mdi-plus' />
                    {t(`${translationPath}add-new`)}
                  </ButtonBase>
                </PermissionsComponent>
              )}
            </div>
            <PermissionsComponent
              permissionsList={!isPropertyManagementView ? Object.values(ActivitiesCallCenterPermissions) : Object.values(ActivitesPermissions)}
              permissionsId={!isPropertyManagementView ? ActivitiesCallCenterPermissions.ViewAndSearchInCallCenterActivities.permissionsId : ActivitesPermissions.ViewandsearchinPropertyManagementActivites.permissionsId}
            >
              <div className='section autocomplete-section'>
                <div className='d-flex-column px-2 w-100 p-relative'>
                  <div className='d-flex-column w-100'>
                    <Inputs
                      value={searchedItem}
                      onKeyUp={searchHandler}
                      idRef='activitiesSearchRef'
                      label={t(`${translationPath}search-activity`)}
                      onInputChanged={(e) => setSearchedItem(e.target.value)}
                      inputPlaceholder={t(`${translationPath}search-activity`)}
                      beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                    />
                  </div>
                  <div className='d-inline-flex pl-5-reversed agentSection'>
                    <div className='agentSection'>
                      <div className='agentSection1'>
                        <AutocompleteComponent
                          idRef='referredToRef'
                          isLoading={isLoading.agents}
                          multiple={false}
                          data={agents.result || []}
                          value={filter.agentId}
                          chipsLabel={(option) => option.fullName || ''}
                          displayLabel={(option) => option.fullName || ''}
                          withoutSearchButton
                          inputPlaceholder={t(`${translationPath}Agent`)}
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          onChange={(event, newValue) => {
                            setFilter((item) => ({ ...item, agentId: (newValue && newValue.id) || null, pageIndex: 0 }));
                          }}
                        />

                      </div>
                      <div className='agentSection1'>
                        {isPropertyManagementView && (
                          <DataFileAutocompleteComponent
                            idRef='RelatedToRef'
                            isLoading={(isLoading.units || isLoading.leads)}
                            labelClasses='Requierd-Color'
                            multiple={false}
                            selectedValues={
                              (selected.activeFormType === 3 && selected.relatedWorkOrder) ||
                              (selected.activeFormType === 4 && selected.relatedPortfolio) ||
                              (selected.activeFormType === 5 && selected.maintenanceContract)
                            }
                            data={
                              (selected.activeFormType === 3 && data.relatedWorkOrder) ||
                              (selected.activeFormType === 4 && data.relatedPortfolio) ||
                              (selected.activeFormType === 5 && data.relatedMaintenanceContractId)
                            }
                            displayLabel={
                              (selected.activeFormType === 3 && ((option) => option.referenceNo || '')) ||
                              (selected.activeFormType === 4 && ((option) => option.portfolioName || '')) ||
                              (selected.activeFormType === 5 &&
                                ((option) => String(option.maintenanceContractId) || '')) ||
                              ''
                            }
                            renderFor={
                              (selected.activeFormType === 3 && 'work-order') ||
                              (selected.activeFormType === 4 && 'portfolio') ||
                              (selected.activeFormType === 5 && 'relatedMaintenanceContractId')
                            }
                            getOptionSelected={
                              (selected.activeFormType === 3 &&
                                ((option) => option.workOrderId === filter.relatedWorkOrderId)) ||
                              (selected.activeFormType === 4 &&
                                ((option) => option.portfolioId === filter.relatedPortfolioId)) ||
                              (selected.activeFormType === 5 &&
                                ((option) =>
                                  option.maintenanceContractId === filter.relatedMaintenanceContractId))
                            }
                            onChange={(event, newValue) => {
                              if (selected.activeFormType === 3) {
                                setSelected({ id: 'relatedWorkOrder', value: newValue });
                                setFilter((item) => ({ ...item, relatedWorkOrderId: (newValue && newValue.workOrderId) || null, pageIndex: 0 }));
                              } else if (selected.activeFormType === 4) {
                                setSelected({ id: 'relatedPortfolio', value: newValue });
                                setFilter((item) => ({ ...item, relatedPortfolioId: (newValue && newValue.portfolioId) || null, pageIndex: 0 }));
                              } else if (selected.activeFormType === 5) {
                                setSelected({ id: 'relatedMaintenanceContract', value: newValue });
                                setFilter((item) => ({ ...item, relatedMaintenanceContractId: (newValue && newValue.maintenanceContractId) || null, pageIndex: 0 }));
                              }
                            }}
                            onInputKeyUp={(e) => {
                              const { value } = e.target;
                              if (searchTimer.current) clearTimeout(searchTimer.current);
                              searchTimer.current = setTimeout(() => {
                                if (selected.activeFormType === 3) getAllRelatedWorkOrder(value);
                                else if (selected.activeFormType === 4) getAllRelatedPortfolio(value);
                                else if (selected.activeFormType === 5)
                                  getAllMaintenanceContracts(value);
                              }, 700);
                            }}
                            withoutSearchButton
                            inputStartAdornment={(
                              <SelectComponet
                                data={[
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
                                ]}
                                value={selected.activeFormType}
                                valueInput='key'
                                textInput='value'
                                onSelectChanged={changeActiveFormType}
                                wrapperClasses='over-input-select w-auto'
                                idRef='relatedToTypeRef'
                                parentTranslationPath={parentTranslationPath}
                                translationPath={translationPath}
                                translationPathForData={translationPath}
                              />
                            )}
                            parentTranslationPath={parentTranslationPath}
                            translationPath={translationPath}
                          />

                        )}

                        {!isPropertyManagementView && (
                          <DataFileAutocompleteComponent
                            idRef='RelatedToRef'
                            isLoading={(isLoading.units || isLoading.leads)}
                            labelClasses='Requierd-Color'
                            multiple={false}
                            selectedValues={
                              (selected.activeFormType === 1 && selected.relatedUnit) ||
                              (selected.activeFormType === 2 && selected.relatedLead)

                            }
                            data={
                              (selected.activeFormType === 1 && data.relatedUnits) ||
                              (selected.activeFormType === 2 && data.relatedLeads)

                            }
                            displayLabel={
                              (selected.activeFormType === 1 && ((option) => option.unitRefNo || '')) ||
                              (selected.activeFormType === 2 &&
                                ((option) =>
                                  (option.lead && option.lead.company_name) ||
                                  (option.lead &&
                                    option.lead.contact_name &&
                                    option.lead.contact_name.name))) ||
                              ''
                            }
                            renderFor={
                              (selected.activeFormType === 1 && 'unit') ||
                              (selected.activeFormType === 2 && 'lead')

                            }
                            getOptionSelected={
                              (selected.activeFormType === 1 &&
                                ((option) => option.id === filter.relatedUnitNumberId)) ||
                              (selected.activeFormType === 2 &&
                                ((option) => option.leadId === filter.relatedLeadNumberId))

                            }
                            onChange={(event, newValue) => {
                              if (selected.activeFormType === 1) {
                                setSelected({ id: 'relatedUnit', value: newValue });
                                setFilter((item) => ({ ...item, relatedUnitNumberId: (newValue && newValue.id) || null, pageIndex: 0 }));
                              } else if (selected.activeFormType === 2) {
                                setSelected({ id: 'relatedLead', value: newValue });
                                setFilter((item) => ({ ...item, relatedLeadNumberId: (newValue && newValue.leadId) || null, pageIndex: 0 }));
                              }
                            }}
                            onInputKeyUp={(e) => {
                              const { value } = e.target;
                              if (searchTimer.current) clearTimeout(searchTimer.current);
                              searchTimer.current = setTimeout(() => {
                                if (selected.activeFormType === 1) getAllRelatedUnits(value);
                                else if (selected.activeFormType === 2) getAllRelatedLeads(value);
                              }, 700);
                            }}
                            withoutSearchButton
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
                                onSelectChanged={changeActiveFormType}
                                wrapperClasses='over-input-select w-auto'
                                idRef='relatedToTypeRef'
                                parentTranslationPath={parentTranslationPath}
                                translationPath={translationPath}
                                translationPathForData={translationPath}
                              />
                            )}
                            parentTranslationPath={parentTranslationPath}
                            translationPath={translationPath}
                          />

                        )}

                      </div>
                      <div className='agentSection1'>
                        <DateRangePickerComponent
                          onClearClicked={() => setDateFilter(dateRangeDefault)}
                          ranges={[dateFilter]}
                          emptyLabel={t(`${translationPath}all`)}
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          onDateChanged={(selectedDate) => {
                            setDateFilter({
                              startDate: selectedDate.selection && selectedDate.selection.startDate,
                              endDate: selectedDate.selection && selectedDate.selection.endDate,
                              key: 'selection',
                            });
                            setFilter((item) => ({ ...item, pageIndex: 0 }));
                          }}
                        />

                      </div>
                    </div>

                  </div>
                </div>
                <ViewTypesActivities onTypeChanged={onTypeChanged} className='mb-3' />
              </div>
            </PermissionsComponent>
          </div>
          <PermissionsComponent
            permissionsList={!isPropertyManagementView ? Object.values(ActivitiesCallCenterPermissions) : Object.values(ActivitesPermissions)}
            permissionsId={!isPropertyManagementView ? ActivitiesCallCenterPermissions.ViewAndSearchInCallCenterActivities.permissionsId : ActivitesPermissions.ViewandsearchinPropertyManagementActivites.permissionsId}
          >
            <div className='d-flex px-2'>
              <span className='mx-2 mt-1'>{t(`${translationPath}select`)}</span>
              <span className='separator-v s-primary s-reverse s-h-25px mt-1' />
              <span className='px-2 d-flex'>
                <span className='texts-large mt-1'>
                  {t(`${translationPath}order-by`)}
                  :
                </span>
                <div className='px-2'>
                  <SelectComponet
                    idRef='filterByRef'
                    data={[
                      { id: 'CreatedOn', filterBy: 'created-date' },
                      { id: 'UpdateOn', filterBy: 'Updated-date' },
                      { id: 'ActivityDate', filterBy: 'activitie-date' },
                    ]}
                    wrapperClasses='mb-3'
                    isRequired
                    value={selectSortBy.filterBy}
                    emptyItem={{
                      value: null,
                      text: 'select-filter-by',
                      isDisabled: false,
                    }}
                    onSelectChanged={filterByChanged}
                    valueInput='id'
                    textInput='filterBy'
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    translationPathForData={translationPath}
                  />

                </div>
                <div className='px-2'>
                  <SelectComponet
                    idRef='orderByRef'
                    data={[
                      { id: 1, orderBy: 'ascending' },
                      { id: 2, orderBy: 'descending' },
                    ]}
                    emptyItem={{
                      value: null,
                      text: 'select-sort-by',
                      isDisabled: false,
                    }}
                    value={selectSortBy.orderBy}
                    onSelectChanged={orderByChanged}
                    wrapperClasses='mb-3'
                    isRequired
                    valueInput='id'
                    textInput='orderBy'
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    translationPathForData={translationPath}
                  />
                </div>
                <div className='mt-1'>

                  <ButtonBase
                    className='btns theme-solid'
                    onClick={GetOrdered}
                    disabled={selectSortBy.filterBy === null || selectSortBy.orderBy === null}
                  >
                    <span>{t(`${translationPath}apply`)}</span>
                  </ButtonBase>

                </div>
              </span>
            </div>
          </PermissionsComponent>
        </div>

        {activeActionType === ViewTypes2Enum.tableRelatedView.key && (
          <PermissionsComponent
            permissionsList={!isPropertyManagementView ? Object.values(ActivitiesCallCenterPermissions) : Object.values(ActivitesPermissions)}
            permissionsId={!isPropertyManagementView ? ActivitiesCallCenterPermissions.ViewAndSearchInCallCenterActivities.permissionsId : ActivitesPermissions.ViewandsearchinPropertyManagementActivites.permissionsId}
          >
            <ActivitiesTableView
              data={activities.result || []}
              activitiesCount={activities.totalCount || 0}
              parentTranslationPath={parentTranslationPath}
              filter={filter}
              translationPath={translationPath}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              isLoading={isLoadingActivities}
              setIsLoading={setIsLoadingActivities}
              isTableRelatedView
              getTableActionsByPermissions={editpermissionsList}
              setSortBy={setSortBy}
              pathName={pathName}
              activeActionType={activeActionType}
              onTypeChanged={onTypeChanged}
            />
          </PermissionsComponent>
        )}
        {activeActionType === ViewTypes2Enum.tableView.key && (
          <PermissionsComponent
            permissionsList={!isPropertyManagementView ? Object.values(ActivitiesCallCenterPermissions) : Object.values(ActivitesPermissions)}
            permissionsId={!isPropertyManagementView ? ActivitiesCallCenterPermissions.ViewAndSearchInCallCenterActivities.permissionsId : ActivitesPermissions.ViewandsearchinPropertyManagementActivites.permissionsId}
          >
            <ActivitiesTableView
              data={activities.result || []}
              activitiesCount={activities.totalCount || 0}
              parentTranslationPath={parentTranslationPath}
              filter={filter}
              translationPath={translationPath}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              isLoading={isLoadingActivities}
              setIsLoading={setIsLoadingActivities}
              getTableActionsByPermissions={editpermissionsList}
              setSortBy={setSortBy}
              pathName={pathName}
              activeActionType={activeActionType}
            />
          </PermissionsComponent>
        )}
      </div>
      {
        openDialog && (
          <ActivitiesManagementDialog
            open={openDialog}
            onSave={() => {
              setOpenDialog(false);
              onPageIndexChanged(0);
            }}
            close={() => {
              setOpenDialog(false);
            }}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />

        )

      }

    </div>
  );
};
