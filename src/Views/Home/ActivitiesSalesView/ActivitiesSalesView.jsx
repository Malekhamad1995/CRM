import React, {
  useState, useRef, useEffect, useCallback, useReducer
} from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import {
  Inputs, Spinner, PermissionsComponent, SelectComponet, ViewTypesActivities, AutocompleteComponent, DataFileAutocompleteComponent
} from '../../../Components';
import { DateRangePickerComponent } from '../../../Components/Controls/DateRangePickerComponent/DateRangePickerComponent';
import { useTitle } from '../../../Hooks';
import { ViewTypes2Enum ,  UnitsOperationTypeEnum  } from '../../../Enums';
import {
  GetAllNotRelatedActivitiesOfTypeSale,
  GetActivitiesWithUnitsOfTypeSale,
  OrganizationUserSearch,
  GetLeads,
  getUnits
} from '../../../Services';
import { UnitMapper } from '../UnitsView/UnitMapper';
import { ActivitiesSalesPermissions } from '../../../Permissions/Sales/ActivitiesSalesPermissions';
import { ActivitiesSalesTableView } from './ActivitiesSalesViewUtilities/ActivitiesSalesTableView';
import { ActivitiesManagementDialog } from './ActivitiesSalesViewUtilities/Dialogs/ActivitiesManagementDialog';
import { GlobalOrderFilterActions } from '../../../store/GlobalOrderFilter/GlobalOrderFilterActions';

const parentTranslationPath = 'ActivitiesView';
const translationPath = '';

export const ActivitiesSalesView = () => {
  const dateRangeDefault = {
    startDate: null,
    endDate: null,
    key: 'selection',
  };

  const { t } = useTranslation(parentTranslationPath);
  const [activeActionType, setActiveActionType] = useState(ViewTypes2Enum.tableRelatedView.key);
  const [dateFilter, setDateFilter] = useState(dateRangeDefault);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [isLoading, setIsLoading] = useState({agents:false,
 units:false, leads:false});
  const [searchedItem, setSearchedItem] = useState('');
  const [activities, setActivities] = useState({
    result: [],
    totalCount: 0,
  });

  const [agents, setAllAgent] = useState({
    result: [],
    totalCount: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const dispatch = useDispatch();
  const [selectedOrderBy, setSelectedOrderBy] = useState({
    filterBy: (orderFilter.activitesSaleFilter && orderFilter.activitesSaleFilter.filterBy) || null,
    orderBy: (orderFilter.activitesSaleFilter && orderFilter.activitesSaleFilter.orderBy) || null,
  });

  const [orderBy, setOrderBy] = useState(selectedOrderBy.filterBy ? selectedOrderBy : { filterBy: null, orderBy: null });
  const [sortBy, setSortBy] = useState(null);

  const searchTimer = useRef(null);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
    fromDate: null,
    toDate: null,
    agentId: null,
    relatedUnitNumberId: null,
    relatedLeadNumberId: null,
  });
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
    activeFormType: 1,
    relatedUnit: null,
    relatedLead: null,
    reminderPersons: [],
  });

  const [data, setData] = useReducer(reducer, {
    activityAssignments: [],
    activityTypes: [],
    units: [],
    relatedLeads: [],
    relatedUnits: [],
  });
  const changeActiveFormType = (newValue) => {
    setSelected({
      id: 'edit',
      value: {
        ...selected,
        activeFormType: +newValue,
        relatedUnit: null,
        relatedLead: null,
      },
    });
    if (filter.relatedLeadNumberId) {
           setFilter((item) => ({
            ...item,
             relatedLeadNumberId: null,
             pageIndex: 0,
             search: '',
             fromDate: null,
             toDate: null,
             agentId: null,
             relatedUnitNumberId: null,
       }));
}
    if (filter.relatedUnitNumberId) {
        setFilter((item) => ({
        ...item,
        relatedUnitNumberId: null,
        pageIndex: 0,
        search: '',
        fromDate: null,
        toDate: null,
        agentId: null,
         }));
    }
  };

  useTitle(t(`${translationPath}activities`));

  const getAllActivities = useCallback(async () => {
    let activitiesDate = { fromDate: null, toDate: null };
    if (dateFilter && dateFilter.startDate && dateFilter.endDate) {
      activitiesDate = {
        fromDate: moment(dateFilter.startDate).format(),
        toDate: moment(dateFilter.endDate).format()
      };
    }

    setIsLoadingActivities(true);

    const res = activeActionType === ViewTypes2Enum.tableRelatedView.key ? await GetAllNotRelatedActivitiesOfTypeSale({
      ...filter, filterBy: orderBy.filterBy, orderBy: orderBy.orderBy, pageIndex: filter.pageIndex + 1, fromDate: activitiesDate.fromDate, toDate: activitiesDate.toDate
    }) : await GetActivitiesWithUnitsOfTypeSale({
      ...filter, filterBy: orderBy.filterBy, orderBy: orderBy.orderBy, pageIndex: filter.pageIndex + 1, fromDate: activitiesDate.fromDate, toDate: activitiesDate.toDate
    });
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
  }, [filter, activeActionType, dateFilter, orderBy]);


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

  const searchHandler = (event) => {
    const { value } = event.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({
     ...item,
        search: value,
        pageIndex: 0,
        fromDate: null,
        toDate: null,
        agentId: null,
        relatedUnitNumberId: null,
        relatedLeadNumberId: null
      }));
    }, 700);
  };

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({
     ...item,
      pageIndex,
      search: '',
      fromDate: null,
      toDate: null,
      agentId: null,
      relatedUnitNumberId: null,
      relatedLeadNumberId: null
    }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({
    ...item,
    pageIndex: 0,
    pageSize,
    search: '',
    fromDate: null,
    toDate: null,
    agentId: null,
    relatedUnitNumberId: null,
    relatedLeadNumberId: null
    }));
  };

  const addNewHandler = () => {
    setOpenDialog(true);
  };

  const filterByChanged = (value) => {
    setSelectedOrderBy((item) => ({ ...item, filterBy: value }));
  };
  const orderByChanged = (value) => {
    setSelectedOrderBy((item) => ({ ...item, orderBy: value }));
  };
  const orderBySubmitted = (event) => {
    event.preventDefault();
    if (!selectedOrderBy.filterBy || !selectedOrderBy.orderBy) {
      if (orderBy.filterBy || orderBy.orderBy) setOrderBy({});
      return;
    }
    dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        activitesSaleFilter: {
          filterBy: selectedOrderBy.filterBy,
          orderBy: selectedOrderBy.orderBy,
        },
      })
    );
    setOrderBy({
      filterBy: selectedOrderBy.filterBy,
      orderBy: selectedOrderBy.orderBy,
    });
  };

  const onTypeChanged = useCallback(
    (activeType) => {
      setActiveActionType(activeType);
    },
    [setActiveActionType]
  );

  const getAllRelatedUnits = useCallback(
    async (value) => {
 
    setIsLoading((loading)=>({...loading, units:true}));

      const response = await getUnits({ search: value , operationType: UnitsOperationTypeEnum.sale.key });
      if (!(response && response.status && response.status !== 200)) {
        const unitMapped = ((response && response.result) || []).map((item) => UnitMapper(item));
        setData({
          id: 'relatedUnits',
          value: unitMapped || [],
        });
      } else setData({ id: 'relatedUnits', value: [] });

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
  useEffect(() => {
    if (selected.activeFormType === 1)
      getAllRelatedUnits();
    else
      getAllRelatedLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.activeFormType]);

  useEffect(() => {
    getAllActivities();
  }, [getAllActivities]);

  useEffect(() => {
    if (sortBy) {
    setOrderBy((item) => ({
     ...item,
        filterBy: sortBy.filterBy,
        orderBy: sortBy.orderBy,
     }));
     dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        activitesLeaseFilter: {
          filterBy: sortBy.filterBy,
          orderBy: sortBy.orderBy,
        },
      })
    );
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
              <PermissionsComponent
                permissionsList={Object.values(ActivitiesSalesPermissions)}
                permissionsId={ActivitiesSalesPermissions.AddNewActivity.permissionsId}
              >
                <ButtonBase className='btns theme-solid' onClick={addNewHandler}>
                  <span className='mdi mdi-plus' />
                  {t(`${translationPath}add-new`)}
                </ButtonBase>
              </PermissionsComponent>
            </div>
            <PermissionsComponent
              permissionsList={Object.values(ActivitiesSalesPermissions)}
              permissionsId={ActivitiesSalesPermissions.ViewAndSearchInSaleActivities.permissionsId}
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
                          // onInputKeyUp={(e) => setFilter(e)}
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          // selectedValues={filter.referredTo}
                          onChange={(event, newValue) => {
                            setFilter((item) => ({
                              ...item,
                              filterBy: null,
                              orderBy: null,
                              search: '',
                              fromDate: null,
                              toDate: null,
                              relatedUnitNumberId: null,
                              relatedLeadNumberId: null,
                              pageIndex: 0,
                              agentId: (newValue && newValue.id) || null
                            }));
                          }}
                        />

                      </div>
                      <div className='agentSection1'>
                        <DataFileAutocompleteComponent
                          idRef='RelatedToRef'
                          isLoading={(isLoading.units || isLoading.leads)}
                          labelClasses='Requierd-Color'
                          multiple={false}
                          selectedValues={
                            (selected.activeFormType === 1 && selected.relatedUnit) ||
                            (selected.activeFormType === 2 && selected.relatedLead)
                          }
                          data={(selected.activeFormType === 1 && data.relatedUnits) || data.relatedLeads}
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
                              ((option) => option.id === filter.relatedUnitNumberId)) ||
                            ((option) => option.leadId === filter.relatedLeadNumberId)
                          }
                          onChange={(event, newValue) => {
                            if (selected.activeFormType === 1) {
                              setSelected({ id: 'relatedUnit', value: newValue });
                              setFilter((item) => ({
                               ...item,
                                relatedUnitNumberId: (newValue && newValue.id) || null,
                                relatedLeadNumberId: null,
                                filterBy: null,
                                orderBy: null,
                                search: '',
                                fromDate: null,
                                toDate: null,
                                pageIndex: 0,
                                agentId: null
                              }));
                            } else {
                              setSelected({ id: 'relatedLead', value: newValue });
                              setFilter((item) => ({
                               ...item,
                                 relatedLeadNumberId: (newValue && newValue.leadId) || null,
                                pageIndex: 0,
                                relatedUnitNumberId: null,
                                filterBy: null,
                                orderBy: null,
                                search: '',
                                fromDate: null,
                                toDate: null,
                                agentId: null
                                }));
                            }
                          }}
                          onInputKeyUp={(e) => {
                            const { value } = e.target;
                            if (searchTimer.current) clearTimeout(searchTimer.current);
                            searchTimer.current = setTimeout(() => {
                              if (selected.activeFormType === 1) getAllRelatedUnits(value);
                              else getAllRelatedLeads(value);
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
                              inputPlaceholder={t(`${translationPath}Agent`)}
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
                          isWithError
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                        />

                      </div>
                      <div className='agentSection1'>
                        <DateRangePickerComponent
                          onClearClicked={() => setDateFilter(dateRangeDefault)}
                          ranges={[dateFilter]}
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          onDateChanged={(selectedDate) => {
                            setDateFilter({
                              startDate: selectedDate.selection && selectedDate.selection.startDate,
                              endDate: selectedDate.selection && selectedDate.selection.endDate,
                              key: 'selection',
                            });
                            setFilter((item) => ({
                             ...item,
                              pageIndex: 0,
                              search: '',
                              relatedLeadNumberId: null,
                              relatedUnitNumberId: null,
                              filterBy: null,
                              orderBy: null
                           }));
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
            permissionsList={Object.values(ActivitiesSalesPermissions)}
            permissionsId={ActivitiesSalesPermissions.ViewAndSearchInSaleActivities.permissionsId}
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
                    value={selectedOrderBy.filterBy}
                    onSelectChanged={filterByChanged}
                    emptyItem={{
                      value: null,
                      text: 'select-filter-by',
                      isDisabled: false,
                    }}
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
                    value={selectedOrderBy.orderBy}
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
                    onClick={orderBySubmitted}
                    disabled={!selectedOrderBy.filterBy || !selectedOrderBy.orderBy}
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
            permissionsList={Object.values(ActivitiesSalesPermissions)}
            permissionsId={ActivitiesSalesPermissions.ViewAndSearchInSaleActivities.permissionsId}
          >
            <ActivitiesSalesTableView
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
              setSortBy={setSortBy}
              activeActionType={activeActionType}
              onTypeChanged={onTypeChanged}
            />
          </PermissionsComponent>
        )}
        {activeActionType === ViewTypes2Enum.tableView.key && (
          <PermissionsComponent
            permissionsList={Object.values(ActivitiesSalesPermissions)}
            permissionsId={ActivitiesSalesPermissions.ViewAndSearchInSaleActivities.permissionsId}
          >
            <ActivitiesSalesTableView
              data={activities.result || []}
              activitiesCount={activities.totalCount || 0}
              parentTranslationPath={parentTranslationPath}
              filter={filter}
              translationPath={translationPath}
              // reloadData={reloadData}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              isLoading={isLoadingActivities}
              setIsLoading={setIsLoadingActivities}
              setSortBy={setSortBy}
              activeActionType={activeActionType}
              onTypeChanged={onTypeChanged}
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
