import React, {
  useState, useRef, useCallback, useEffect, useMemo
} from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import {
  Inputs, SelectComponet, Spinner, ViewTypes, PermissionsComponent
} from '../../../Components';
import { ViewTypesEnum } from '../../../Enums/ViewTypes.Enum';
import { DateRangePickerComponent } from '../../../Components/Controls/DateRangePickerComponent/DateRangePickerComponent';
import { QACardsComponent } from './QACallCenterUtitities/QACardsComponent';
import {
  GetQaActivitiesWithLeadInfo,
  lookupItemsGetId,
  GetUsersOfQaRoles,
  ReassignLeads
} from '../../../Services'; import { QATableComponent } from './QACallCenterUtitities/QATableComponent';
import { ActiveItemActions } from '../../../store/ActiveItem/ActiveItemActions';
import { ActionsEnum } from '../../../Enums/Actions.Enum';
import {
  GlobalHistory, returnPropsByPermissions, sideMenuComponentUpdate, sideMenuIsOpenUpdate, showError, showSuccess,
} from '../../../Helper';
import Lookups from '../../../assets/json/StaticLookupsIds.json';
import { bottomBoxComponentUpdate } from '../../../Helper/Middleware.Helper';
import { PaginationComponent } from '../../../Components/PaginationComponent/PaginationComponent';
import { QACallCenterPermissions } from '../../../Permissions';
import { GlobalOrderFilterActions } from '../../../store/GlobalOrderFilter/GlobalOrderFilterActions';
import { CardDetailsComponent } from './QACallCenterUtitities/CardDetailsComponent';
import { LeadsReassignDialog } from '../LeadsSalesView/LeadsSalesUtilities/Dialogs/LeadsReassignDialog/LeadsReassignDialog';

const parentTranslationPath = 'QAActivitiesView';
const translationPath = '';

export const QAView = () => {
  const dateRangeDefault = {
    startDate: null,
    endDate: null,
    key: 'selection',
  };
  const searchTimer = useRef(null);
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const [selectedOrderBy, setSelectedOrderBy] = useState({
    filterBy: (orderFilter.qaFilter && orderFilter.qaFilter.filterBy) || null,
    orderBy: (orderFilter.qaFilter && orderFilter.qaFilter.orderBy) || null,
  });
  const [searchActivity, setSearchActivity] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [activeActionType, setActiveActionType] = useState(ViewTypesEnum.cards.key);
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [saveDisable, setSaveDisable] = useState(false)
  const [isLoadingReassign, setIsLoadingReassign] = useState(false);
  const [activtiesRate, setActivitesRate] = useState([]);
  const [dateFilter, setDateFilter] = useState(dateRangeDefault);
  const pathName = window.location.pathname.split('/home/')[1].split('/QA')[0];
  const dispatch = useDispatch();
  const [qaUsers, setQaUsers] = useState();
  const [activeCard, setActiveCard] = useState(null);
  const [detailsUnitsList, setDetailsUnitsList] = useState(() => ({
    result: [],
    totalCount: 0,
  }));
  const [filter, setFilter] = useState({

    pageIndex: 0,
    pageSize: 25,
    filterBy: (selectedOrderBy && selectedOrderBy.filterBy) || null,
    orderBy: (selectedOrderBy && selectedOrderBy.orderBy) || null,
    activityRate: Lookups.Negative,
    fromDate: null,
    toDate: dateFilter.startDate,
    userId: dateFilter.endDate,
    search: '',
  });
  const [qaList, setQaList] = useState({
    result: [],
    totalCount: 0,
  });
  const [isOpenReassign, setIsOpenReassign] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const filterByChanged = (value) => {
    setSelectedOrderBy((item) => ({ ...item, filterBy: value }));
  };
  const changeActivityRate = (value) => {
    setFilter((item) => ({ ...item, activityRate: value }));
  };
  const changeQaUsers = (value) => {
    setFilter((item) => ({ ...item, userId: value }));
  };
  const orderByChanged = (value) => {
    setSelectedOrderBy((item) => ({ ...item, orderBy: value }));
  };
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
    sideMenuComponentUpdate(null);
    sideMenuIsOpenUpdate(false)
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
    sideMenuComponentUpdate(null);
    sideMenuIsOpenUpdate(false)
  };
  const searchHandler = (event) => {
    const { value } = event.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({ ...item, search: value }));
    }, 700);
  };
  const GetAllQA = useCallback(async () => {
    setIsLoading(true);
    const result = await GetQaActivitiesWithLeadInfo({ ...filter, pageIndex: filter.pageIndex + 1, search: searchActivity });
    setDetailsUnitsList(({ result: result.result, totalCount: result.totalCount || 0 }));
    if (!(result && result.status && result.status !== 200)) {
      result.result.map((item) => {
        item.leadClass === 3 || item.leadClass === 4 ? item['reassignIsAble'] = true : item['reassignIsAble'] = false
      })
      setQaList({ result: result.result, totalCount: result.totalCount || 0 });
    }
    else
      setQaList({ result: [], totalCount: 0 });

    setIsLoading(false);
  });
  const orderBySubmitted = (event) => {
    event.preventDefault();
    if (!selectedOrderBy.filterBy || !selectedOrderBy.orderBy)
      return;
    dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        qaFilter: {
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

  const ActivityRate = useCallback(async () => {
    setIsLoading(true);
    const results = await lookupItemsGetId({ lookupTypeId: Lookups.ActivityRate });
    setActivitesRate(results);
  }, []);
  const UsersOfQaRoles = useCallback(async () => {
    const results = await GetUsersOfQaRoles();
    setQaUsers(results);
  }, []);
  const detailedCardSideActionClicked = useCallback(
    (actionEnum, activeData) => async (event) => {
      dispatch(ActiveItemActions.activeItemRequest(activeData));
      event.stopPropagation();
      if (actionEnum === ActionsEnum.reportEdit.key) {
        if (pathName === 'QA') {
          GlobalHistory.push(
            `/home/Contacts-CRM/contact-profile-edit?formType=${activeData.contactsTypeId}&id=${activeData.contactId}`
          );
        }
      } else if (actionEnum === ActionsEnum.reassignAgent.key) {
        setIsOpenReassign(true);
        setActiveItem(activeData);
      }
    },
    [dispatch, pathName]
  );

  const onTypeChanged = useCallback(
    (activeType) => {
      setActiveActionType(activeType);
    },
    [setActiveActionType]
  );
  const reassignHandler = async (reassignItem) => {
    setIsLoadingReassign(true);
    setSaveDisable(true);
    const result = await ReassignLeads({ leadIds: [activeItem && activeItem.relatedLeadNumberId], referredToId: reassignItem.referredToId, isCopyTo: reassignItem.isCopyTo });
    if (!(result && result.status && result.status !== 200)) {
      showSuccess(t(`${translationPath}leads-reassigned-successfully`));
      setIsOpenReassign(false);
    } else {
      showError(t(`${translationPath}leads-reassigned-failed`));
      setIsOpenReassign(false);
      setIsLoadingReassign(false);
    }
    setFilter((item) => ({ ...item, pageIndex: 0, leadStatus: null }));
    setIsLoadingReassign(false);
  };
  useEffect(() => {
    GetAllQA();
  }, [filter]);
  useEffect(() => {
    if (orderBy)
      setFilter((item) => ({ ...item, filterBy: orderBy.filterBy, orderBy: orderBy.orderBy }));
  }, [orderBy]);
  useEffect(() => {
    if (sortBy)
      setFilter((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);

  useEffect(() => {
    if (returnPropsByPermissions(QACallCenterPermissions.ViewQaActivitiesWithLeadInfo.permissionsId)) {
      bottomBoxComponentUpdate(
        <PaginationComponent
          pageIndex={filter.pageIndex}
          pageSize={filter.pageSize}
          totalCount={qaList.totalCount}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
        />

      );
    }
  });
  useEffect(() => {
    UsersOfQaRoles();
    ActivityRate();
  }, [ActivityRate, UsersOfQaRoles]);

  useMemo(() => {
    setFilter((item) => ({
      ...item,
      fromDate: dateFilter.startDate,
      toDate: dateFilter.endDate,
    }));
  }, [dateFilter]);
  useEffect(() => () => {
    bottomBoxComponentUpdate(null);
    sideMenuComponentUpdate(null);
    sideMenuIsOpenUpdate(false);
  }, []);

  const onCardClick = useCallback(
    (item, selectedIndex) => (event) => {
      event.stopPropagation();
      event.preventDefault();
      setActiveCard(item);
      sideMenuComponentUpdate(
        <CardDetailsComponent
          activeData={detailsUnitsList.result[selectedIndex]}
          cardDetailsActionClicked={detailedCardSideActionClicked}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      );
      sideMenuIsOpenUpdate(true);
    },
    [detailedCardSideActionClicked, detailsUnitsList.result]
  );

  return (
    <div className='view-wrapper QA-view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section' />
            <div className='section autocomplete-section'>
              <div className='d-flex-column px-2 w-100 p-relative'>
                <div className='d-flex-column w-100'>
                  <PermissionsComponent
                    permissionsList={Object.values(QACallCenterPermissions)}
                    permissionsId={QACallCenterPermissions.ViewQaActivitiesWithLeadInfo.permissionsId}
                  >

                    <Inputs
                      value={searchActivity}
                      onKeyUp={searchHandler}
                      idRef='activitiesSearchRef'
                      label={t('search-QA-activity')}
                      onInputChanged={(e) =>
                        setSearchActivity(e.target.value)}
                      inputPlaceholder={t('search-QA-activity')}
                      beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                    />
                  </PermissionsComponent>
                </div>

                <div className='QA d-inline-flex pl-5-relative'>
                  <PermissionsComponent
                    permissionsList={Object.values(QACallCenterPermissions)}
                    permissionsId={QACallCenterPermissions.ViewQaActivitiesWithLeadInfo.permissionsId}
                  >
                    <DateRangePickerComponent
                      onClearClicked={() => setDateFilter(dateRangeDefault)}
                      ranges={[dateFilter]}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      onDateChanged={(selectedDate) =>
                        setDateFilter({
                          startDate: selectedDate.selection && selectedDate.selection.startDate,
                          endDate: selectedDate.selection && selectedDate.selection.endDate,
                          key: 'selection',
                        })}
                    />

                    <SelectComponet
                      data={(activtiesRate && activtiesRate) || []}
                      defaultValue={null}
                      emptyItem={{
                        value: null,
                        text: t('Select-Activities-rate'),
                        isDisabled: false,
                        // isHiddenOnOpen: true,
                      }}
                      value={filter.activityRate || null}
                      className='px-2'
                      valueInput='lookupItemId'
                      textInput='lookupItemName'
                      wrapperClasses='w-auto'
                      idRef='activeFormTypeRef'
                      onSelectChanged={changeActivityRate}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      translationPathForData={translationPath}
                    />
                  </PermissionsComponent>
                  <PermissionsComponent
                    permissionsList={Object.values(QACallCenterPermissions)}
                    permissionsId={QACallCenterPermissions.ViewUsersOfQaRoles.permissionsId}
                  >
                    <SelectComponet
                      data={(qaUsers && qaUsers) || []}
                      defaultValue={null}
                      emptyItem={{
                        value: null,
                        text: t('Select-QA-Users'),
                        isDisabled: false,
                        // isHiddenOnOpen: true,
                      }}
                      value={filter.userId || null}
                      onSelectChanged={changeQaUsers}
                      className='px-2'
                      valueInput='usersId'
                      textInput='fullName'
                      wrapperClasses='w-auto'
                      idRef='activeFormTypeRef'
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      translationPathForData={translationPath}
                    />
                  </PermissionsComponent>
                  <div className='buttons'>
                    <PermissionsComponent
                      permissionsList={Object.values(QACallCenterPermissions)}
                      permissionsId={QACallCenterPermissions.ViewQaActivitiesWithLeadInfo.permissionsId}
                    >
                      <ButtonBase
                        className='btns theme-solid reset'
                        onClick={() => {
                          setDateFilter(dateRangeDefault);
                          setFilter(() => ({
                            pageIndex: 0,
                            pageSize: 25,
                            filterBy: null,
                            orderBy: null,
                            activityRate: null,
                            fromDate: null,
                            toDate: null,
                            userId: null,
                            search: '',
                          }));
                        }}
                      >
                        <span>{t(`${translationPath}reset`)}</span>
                      </ButtonBase>
                    </PermissionsComponent>
                  </div>
                </div>
              </div>
              <PermissionsComponent
                permissionsList={Object.values(QACallCenterPermissions)}
                permissionsId={QACallCenterPermissions.ViewQaActivitiesWithLeadInfo.permissionsId}
              >
                <ViewTypes
                  onTypeChanged={onTypeChanged}
                  activeTypes={[ViewTypesEnum.tableView.key, ViewTypesEnum.cards.key]}
                  className='mb-3'
                />
              </PermissionsComponent>
            </div>
          </div>
          <div className='d-flex px-2'>
            <PermissionsComponent
              permissionsList={Object.values(QACallCenterPermissions)}
              permissionsId={QACallCenterPermissions.ViewQaActivitiesWithLeadInfo.permissionsId}
            >
              <span className='mx-2 mt-1'>{t('select')}</span>
              <span className='separator-v s-primary s-reverse s-h-25px mt-1' />
              <span className='px-2 d-flex'>
                <span className='texts-large mt-1'>
                  {t('order-by')}
                  :
                </span>
                <div className='px-2'>
                  <SelectComponet
                    idRef='filterByRef'
                    data={[
                      { id: 'CreatedOn', filterBy: 'created-date' },
                      { id: 'UpdateOn', filterBy: 'Updated-date' },
                    ]}
                    value={selectedOrderBy.filterBy}
                    onSelectChanged={filterByChanged}
                    wrapperClasses='mb-3'
                    isRequired
                    valueInput='id'
                    textInput='filterBy'
                    emptyItem={{
                      value: null,
                      text: 'select-filter-by',
                      isDisabled: false,
                      isHiddenOnOpen: false,
                    }}
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
                      isHiddenOnOpen: false,
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
            </PermissionsComponent>
          </div>
        </div>
        <div className='w-100 px-3'>
          <PermissionsComponent
            permissionsList={Object.values(QACallCenterPermissions)}
            permissionsId={QACallCenterPermissions.ViewQaActivitiesWithLeadInfo.permissionsId}
          >
            {activeActionType === ViewTypesEnum.tableView.key && (
              <QATableComponent
                filter={filter}
                data={qaList.result}
                openFile={detailedCardSideActionClicked}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                setIsOpenReassign={setIsOpenReassign}
                setActiveItem={setActiveItem}
              />
            )}
            {activeActionType !== ViewTypesEnum.tableView.key && (
              <QACardsComponent
                data={qaList.result}
                onFooterActionsClicked={detailedCardSideActionClicked}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onCardClicked={onCardClick}
              />
            )}
          </PermissionsComponent>
          {isOpenReassign && (
            <LeadsReassignDialog
              isOpen={isOpenReassign}
              leadType={activeItem && activeItem.leadClass}
              setIsLoading={isLoadingReassign}
              setIsLoadingReassign={setIsLoadingReassign}
              onSave={(reassignItem) => {
                reassignHandler(reassignItem);
                setActiveItem(null);
                setSaveDisable(false);
              }}
              parentTranslationPath={'ContactProfileManagementView'}
              translationPath={''}
              onClose={() => {
                setIsOpenReassign(false);
                setActiveItem(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
