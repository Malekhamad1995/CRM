import React, {
  useState, useCallback, useEffect, useRef
} from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { LeadsReassignDialog } from '../LeadsSalesView/LeadsSalesUtilities/Dialogs/LeadsReassignDialog/LeadsReassignDialog';
import {
  sideMenuIsOpenUpdate,
  sideMenuComponentUpdate,
  GlobalHistory,
  bottomBoxComponentUpdate,
  WhatsAppMessage,
  showError,
  showSuccess,
} from '../../../Helper';
import {
  ActionsButtonsComponent,
  ViewTypes,
  AutocompleteComponent,
  SelectComponet,
  Spinner,
  Inputs,
} from '../../../Components';
import {
  ActionsEnum,
  ViewTypesEnum,
  ActionsButtonsEnum,
  TableActions,
  FormsIdsEnum,
  TableFilterOperatorsEnum,
  MediaEnum,
  LeadTab
} from '../../../Enums';
import { DateRangePickerComponent } from '../../../Components/Controls/DateRangePickerComponent/DateRangePickerComponent';

import { CardDetailsComponent, LeadsCardsComponent } from './LeadsUtilities';
import {
  GetAdvanceSearchLeads,
  GetAllSearchableFormFieldsByFormId,
  GetManagedLeadsAdvanceSearch,
  OrganizationUserSearch, lookupItemsGetId,
  CloseListOfLeads,
  GetAllContactLeadsAdvanceSearch,
  ReassignLeads
} from '../../../Services';
import { PaginationComponent } from '../../../Components/PaginationComponent/PaginationComponent';
import { LeadsImportDialog } from './LeadsUtilities/Dialogs/LeadsImportDialog/LeadsImportDialog';
import { ActiveItemActions } from '../../../store/ActiveItem/ActiveItemActions';
import { useTitle } from '../../../Hooks';
import { GlobalOrderFilterActions } from '../../../store/GlobalOrderFilter/GlobalOrderFilterActions';
import { LeadsMapper } from './LeadsUtilities/LeadsMapper/LeadsMapper';
import { PermissionsComponent } from '../../../Components/PermissionsComponent/PermissionsComponent';
import { LeadsCAllCenterPermissions } from '../../../Permissions/CallCenter/LeadsCallCenterPermissions';
import { TableFilterTypesEnum } from '../../../Enums/TableFilterTypes.Enum';
import { LeadsLeaseTableComponent } from '../LeadsLeaseView';
import { LeadsPermissions } from '../../../Permissions';
import { LeadsActionDialogsComponent } from './LeadsUtilities/LeadsActionDialogsComponent/LeadsActionDialogsComponent';
import { Closed } from '../../../assets/json/StaticLookupsIds.json';
import { CloseLeadsDialog } from './LeadsUtilities/Dialogs/CloseLeadsDialog/CloseLeadsDialog';

const parentTranslationPath = 'LeadsView';
const translationPath = '';

export const LeadsView = () => {
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];
  const [list, setList] = useState([
    {
      enum: TableActions.openFile.key,
    },
    {
      enum: TableActions.editText.key,
    },
  ]);

  const [isOpenCloseLeadsDialog, setIsOpenCloseLeadsDialog] = useState(false);
  const [isCloseAction, setIsCloseAction] = useState(false);
  const [referred, setReferred] = useState({
    by: orderFilter && orderFilter.ReferredByLeadTypeFilter && orderFilter.ReferredByLeadTypeFilter.fullName || null,
    to: orderFilter && orderFilter.ReferredToLeadTypeFilter && orderFilter.ReferredToLeadTypeFilter.fullName || null,
    mediaDetails: orderFilter && orderFilter.MediaDetailsLeadTypeFilter && orderFilter.MediaDetailsLeadTypeFilter.lookupItemName || null

  });
  const dateRangeDefault = {
    startDate: null,
    endDate: null,
    key: 'selection',
  };
  const [dateFilter, setDateFilter] = useState(
    (orderFilter && orderFilter.LeadFilterDate && orderFilter.LeadFilterDate.startDate && orderFilter.LeadFilterDate.endDat !== null) &&
    (
      {
        startDate: new Date(orderFilter && orderFilter.LeadFilterDate && orderFilter.LeadFilterDate.startDate || null),
        endDate: new Date(orderFilter && orderFilter.LeadFilterDate && orderFilter.LeadFilterDate.endDate || null),
        key: new Date(orderFilter && orderFilter.LeadFilterDate && orderFilter.LeadFilterDate.key || null),
      }) || dateRangeDefault
  );

  const [allReferred, setAllReferred] = useState([]);
  const [allMediaName, setAllMediaName] = useState([]);
  const isPropertyManagementView = pathName === 'Leads-property-management';
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({

    allLeads: false,
    referred: false,
    mediaDetails: false
  });

  // eslint-disable-next-line no-unused-vars
  const [isLoadingFormFilter, setIsLoadingFormFilter] = useState(false);
  const [isLoadingReassign, setIsLoadingReassign] = useState(false);
  const [isSearchAvite, setisSearchAvite] = useState(false);
  const [activeSelectedAction, setActiveSelectedAction] = useState('');
  const [isOpenContactsActionDialog, setisOpenContactsActionDialog] = useState(false);
  const [detailedCardAction, setdetailedCardAction] = useState(() => ({
    actionEnum: '',
    item: '',
  }));
  const [checkedCards, setCheckedCards] = useState([]);
  const [checkedCardsIds, setCheckedCardsIds] = useState([]);
  const [isOpenleadsReassignDialog, setIsOpenleadsReassignDialog] = useState(false);
  const [isFirst, setFirst] = useState(false);
  const searchTimer = useRef(null);
  const [searchedItem, setSearchedItem] = useState('');
  const [isFirst1, setFirst1] = useState(false);
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const detailedCardActionClicked = useCallback(
    (actionEnum, item) => (event) => {
      event.stopPropagation();
      setisOpenContactsActionDialog(true);
      setdetailedCardAction({
        actionEnum,
        item,
      });
      if (actionEnum === 'whatsapp') {
        const el = document.createElement('a');
        if (item && item.contact_name && item.contact_name.mobile) {
          el.href = WhatsAppMessage(item && item.contact_name && item.contact_name.mobile);
          el.target = 'blank';
          el.click();
        } else
          showError(t(`${translationPath}Failure-Open-WhatsApp`));
      }

      // eslint-disable-next-line no-console
    },
    []
  );
  const [activeActionType, setActiveActionType] = useState(ViewTypesEnum.cards.key);
  const [isExpanded, setIsExpanded] = useState(
    activeActionType === ViewTypesEnum.cardsExpanded.key
  );
  const [orderByToggler, setOrderByToggler] = useState(false);
  const [leadType, setLeadType] = useState(orderFilter.ActiveLeadTypeFilter || 0);
  const [isOpenImportDialog, setIsOpenImportDialog] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [selectedOrderBy, setSelectedOrderBy] = useState({
    filterBy: orderFilter.leadsFilter.filterBy,
    orderBy: orderFilter.leadsFilter.orderBy,
  });
  const [orderBy, setOrderBy] = useState(selectedOrderBy.filterBy ? selectedOrderBy : {});
  const [detailsLeadsList, setDetailsLeadsList] = useState(() => ({
    result: [],
    totalCount: 0,
  }));
  // this one to change searchable form fields
  const [filterFormType, setFilterFormType] = useState(FormsIdsEnum.leadsOwner.id);
  // this one to change get leads by type
  const [activeFormType, setActiveFormType] = useState(orderFilter.StatusActiveFormTypeLeadTypeFilter || 0);
  const [searchableFormFields, setSearchableFormFields] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [filterSearchDto, setFilterSearchDto] = useState(null);
  const [contactsFilterSearchDto, setContactsFilterSearchDto] = useState(null);
  const [Status, setStatus] = useState(orderFilter.StatusTypeLeadTypeFilter || 0);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [leadsTableFilter, setLeadsTableFilter] = useState(null);

  // Start New Code states
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
  });
  // End New Code
  useTitle(t(`${translationPath}leads`));

  const onTypeChanged = useCallback(
    (activeType) => {
      setActiveActionType(activeType);
      setIsExpanded(activeType === ViewTypesEnum.cardsExpanded.key);
    },
    [setActiveActionType]
  );

  const onFilterValuesChanged = (newValue) => {
    setLeadsTableFilter(newValue);
  };
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
    setActiveCard(null);
    sideMenuComponentUpdate(null);
    sideMenuIsOpenUpdate(false);
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
    setActiveCard(null);
    sideMenuComponentUpdate(null);
    sideMenuIsOpenUpdate(false);
  };
  const filterOnChange = (event, newValue) => {
    const emptyKeyIndex = newValue.findIndex((item) => !item.value);
    if (!searchInputValue && emptyKeyIndex !== -1) {
      newValue.splice(emptyKeyIndex, 1);
      return;
    }
    if (emptyKeyIndex !== -1) newValue[emptyKeyIndex].value = searchInputValue;
    if (filterSearchDto && Object.keys(filterSearchDto).length > 0 && newValue.length === 0) {
      onPageIndexChanged(0);
      setFilterSearchDto(null);
    }
    setSearchData([...newValue]);
  };
  const onFilterFormTypeSelectChanged = (value) => {
    if (value === 2) setFilterFormType(FormsIdsEnum.contactsCorporate.id);
    else setFilterFormType(FormsIdsEnum.contactsIndividual.id);

    if (searchData.length > 0) {
      setSearchData([]);
      onPageIndexChanged(0);
      setFilterSearchDto(null);
    }
  };
  const changeActiveFormType = (value) => {
    setActiveFormType(value);
    setLeadType(0);
    onFilterFormTypeSelectChanged(value);
    dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        StatusActiveFormTypeLeadTypeFilter: value
      })
    );
  };
  const changeActiveLeadType = (value) => {
    setLeadType(value); dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        ActiveLeadTypeFilter: value
      })
    );
  };
  const changeStatusType = (value) => {
    setStatus(value);
    dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        StatusTypeLeadTypeFilter: value
      })
    );
  };
  const getAllSearchableFormFieldsByFormId = useCallback(async () => {
    setIsLoadingFormFilter(true);
    const result = await GetAllSearchableFormFieldsByFormId(filterFormType);
    if (!(result && result.status && result.status !== 200)) {
      const list = [];
      list.push({ key: 'Ids', title: 'Lead Id' });
      result.filter((item) => item.isSearchable)
        .map((item) => (list.push({
          key: item.searchableKey,
          title: item.formFieldTitle,
        })));
      setSearchableFormFields(
        list
      );
    } else setSearchableFormFields([]);
    setIsLoadingFormFilter(false);
  }, [filterFormType]);

  const getLeadsData = useCallback(async (f) => {
    // setIsLoading(true);
    setIsLoading((item) => ({ ...item, allLeads: true }));
    const localFilterDto = f || filterSearchDto || {};
    if (activeFormType) {
      localFilterDto.lead_type_id = [
        { searchType: TableFilterOperatorsEnum.equal.key, value: activeFormType },
      ];
    }
    if (leadType) {
      localFilterDto.leadClass = [
        { searchType: TableFilterOperatorsEnum.contains.key, value: leadType },
      ];
    }
    if (Status) {
      localFilterDto['status.lookupItemName'] = [
        { searchType: TableFilterOperatorsEnum.equal.key, value: (Status || '').toLowerCase() },
      ];
    }
    if (referred.by) {
      localFilterDto['referredby.name'] = [
        { searchType: TableFilterOperatorsEnum.equal.key, value: (referred.by || '').toLowerCase() },
      ];
    }
    if (referred.to) {
      localFilterDto['referredto.name'] = [
        { searchType: TableFilterOperatorsEnum.equal.key, value: (referred.to || '').toLowerCase() },
      ];
    }
    if (referred.mediaDetails) {
      localFilterDto['media_detail.lookupItemName'] = [
        { searchType: TableFilterOperatorsEnum.equal.key, value: (referred.mediaDetails || '').toLowerCase() },
      ];
    }
    if (leadsTableFilter) {
      Object.values(leadsTableFilter)
        .filter((item) => item.displayPath)
        .map((item) => {
          if (localFilterDto[item.displayPath]) {
            localFilterDto[item.displayPath].push({
              searchType: item.operator,
              value: item.value,
            });
          } else {
            localFilterDto[item.displayPath] = [
              {
                searchType: item.operator,
                value: item.value,
              },
            ];
          }
          return undefined;
        });
    }
    const body = {
      criteria: localFilterDto,
      ...orderBy,
    };
    if (dateFilter && dateFilter.startDate && dateFilter.endDate) {
      body.fromDate = moment(dateFilter.startDate).format();
      body.toDate = moment(dateFilter.endDate).format();
    }
    if (leadsTableFilter && leadsTableFilter.createdOn && leadsTableFilter.createdOn.value !== null) {
      if (leadsTableFilter && leadsTableFilter.createdOn.value && leadsTableFilter.createdOn.operator === 5) {
        body.fromDate = moment(leadsTableFilter && leadsTableFilter.createdOn.value).add(24, 'hours').format();
        body.toDate = moment().format();
      } else
        if (leadsTableFilter && leadsTableFilter.createdOn.value && leadsTableFilter.createdOn.operator === 1) {
          body.fromDate = moment(leadsTableFilter && leadsTableFilter.createdOn.value).format();
          body.toDate = moment(leadsTableFilter && leadsTableFilter.createdOn.value).add(23, 'hours').format();
        } else
          if (leadsTableFilter && leadsTableFilter.createdOn.value && leadsTableFilter.createdOn.operator === 6) {
            body.fromDate = moment().day(-2600 * 7);
            body.toDate = moment(leadsTableFilter && leadsTableFilter.createdOn.value).add(-23, 'hours').format();
          }
    }

    if (!pathName.includes('Leads-property-management')) {
      const res = await GetAdvanceSearchLeads(filter, body);

      if (!(res && res.status && res.status !== 200)) {
        setDetailsLeadsList({
          result: ((res && res.result) || []).map((item) => LeadsMapper(item, res, t)),
          totalCount: (res && res.totalCount) || 0,
        });
      } else {
        setDetailsLeadsList({
          result: [],
          totalCount: 0,
        });
      }
    } else {
      const res = await GetManagedLeadsAdvanceSearch(filter, body);

      if (!(res && res.status && res.status !== 200)) {
        setDetailsLeadsList({
          result: ((res && res.result) || []).map((item) => LeadsMapper(item, res, t)),
          totalCount: (res && res.totalCount) || 0,
        });
      } else {
        setDetailsLeadsList({
          result: [],
          totalCount: 0,
        });
      }
    }
    // setIsLoading(false);
    setIsLoading((item) => ({ ...item, allLeads: false }));
  }, [activeFormType, filter, filterSearchDto, leadType, Status, leadsTableFilter, orderBy, pathName, t, referred, dateFilter]);

  const getContactLeadsData = useCallback(async () => {
    const body = {
      criteria: contactsFilterSearchDto,
      ...orderBy,
    };
    const leadTab = LeadTab.CallCenter;
    setIsLoading((item) => ({ ...item, allLeads: true }));
    const res = await GetAllContactLeadsAdvanceSearch(leadTab, filter, body);

    if (!pathName.includes('Leads-property-management')) {
      if (!(res && res.status && res.status !== 200)) {
        setDetailsLeadsList({
          result: ((res && res.result) || []).map((item) => LeadsMapper(item, res, t)),
          totalCount: (res && res.totalCount) || 0,
        });
      } else {
        setDetailsLeadsList({
          result: [],
          totalCount: 0,
        });
      }
    } else if (!(res && res.status && res.status !== 200)) {
      setDetailsLeadsList({
        result: ((res && res.result) || []).map((item) => LeadsMapper(item, res, t)),
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setDetailsLeadsList({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading((item) => ({ ...item, allLeads: false }));
  });


  const reassignHandler = async (reassignItem) => {
    setIsLoadingReassign(true);
    const result = await ReassignLeads({ leadIds: checkedCardsIds, referredToId: reassignItem.referredToId, isCopyTo: reassignItem.isCopyTo });
    if (!(result && result.status && result.status !== 200)) {
      showSuccess(t(`${translationPath}leads-reassigned-successfully`));
      setIsOpenleadsReassignDialog(false);
    } else {
      showError(t(`${translationPath}leads-reassigned-failed`));
      setIsOpenleadsReassignDialog(false);
      setIsLoading(false);
    }
    setFilter((item) => ({ ...item, pageIndex: 0, leadStatus: null }));
    setIsLoadingReassign(false);
  };

  useEffect(() => {
    if (isSearchAvite)
      getContactLeadsData();
  }, [contactsFilterSearchDto]);

  const searchClicked = async () => {
    if (searchData.length === 0) return;
    localStorage.setItem('LeadsFilter', JSON.stringify(searchData));
    setSearchedItem('');
    setFilterSearchDto(
      searchData.reduce((total, item) => {
        if (total[item.key]) {
          total[item.key].push({
            searchType: TableFilterTypesEnum.textInput.defaultSelectedOperator,
            value: item.value,
          });
        } else {
          total[item.key] = [
            {
              searchType: TableFilterTypesEnum.textInput.defaultSelectedOperator,
              value: item.value,
            },
          ];
        }
        return total;
      }, {})
    );
    onPageIndexChanged(0);
  };

  const searchchachedClickedWithoutFilter = async (data) => {
    if (data.length === 0) return;
    const oldfilter = data.reduce((total, item) => {
      if (total[item.key]) {
        total[item.key].push({
          searchType: TableFilterTypesEnum.textInput.defaultSelectedOperator,
          value: item.value,
        });
      } else {
        total[item.key] = [
          {
            searchType: TableFilterTypesEnum.textInput.defaultSelectedOperator,
            value: item.value,
          },
        ];
      }
      return total;
    }, {});
    getLeadsData(oldfilter);
  };
  const searchHandler = (data) => {
    if (data === '')
      getLeadsData();
    else {
      if (searchData && searchData.length) setSearchData([]);

      if (searchTimer.current) clearTimeout(searchTimer.current);
      setisSearchAvite(true);
      searchTimer.current = setTimeout(() => {
        setContactsFilterSearchDto({
          All:
            [
              {
                value: data
              }
            ]
        });
      }, 800);
    }
  };

  const tableActionClicked = useCallback(
    (actionEnum, item) => {
      dispatch(ActiveItemActions.activeItemRequest(item));
      localStorage.setItem('leadStatus', JSON.stringify(item.status));
      if (actionEnum === TableActions.openFile.key) {
        GlobalHistory.push(
          `/home/leads/lead-profile-edit?formType=${item.leadTypeId}&id=${item.id}`
        );
      } else if (actionEnum === TableActions.editText.key)
        GlobalHistory.push(`/home/leads/edit?formType=${item.leadTypeId}&id=${item.id}`);
    },
    [dispatch]
  );
  const displayedLabel = (option) => `${option.title}: ${searchInputValue}`;
  const disabledOptions = (option) => option.disabledOnSelect;
  const chipsLabel = (option) => `${option.title}: ${option.value}`;
  const inputValueChanged = (event, newInputValue) => {
    setSearchInputValue(newInputValue);
  };
  const onActionButtonChanged = (activeAction) => {
    setActiveSelectedAction(activeAction);
    setStatus('Open');
    dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        StatusTypeLeadTypeSaleFilter: 'Open'
      })
    );
    setCheckedCards([]);
    setCheckedCardsIds([]);
  };
  const onActionsButtonClicked = useCallback(
    (activeAction) => {
      if (activeAction === ActionsButtonsEnum[3].id) setIsOpenImportDialog(true);
      if (activeAction === ActionsButtonsEnum[2].id) {
        GlobalHistory.push(
          `/home/lead-sales/merge?firstId=${checkedCardsIds[0]}&secondId=${checkedCardsIds[1]}&leadTypeId=${checkedCards[0].leadTypeId}`
        );
      }
      if (activeAction === ActionsButtonsEnum[5].id) setIsOpenCloseLeadsDialog(true);
      if (activeAction === ActionsButtonsEnum[6].id) setIsOpenleadsReassignDialog(true);
    },
    [checkedCards, checkedCardsIds]
  );
  const detailedCardSideActionClicked = useCallback(
    (actionEnum, activeData) => async (event) => {
      dispatch(ActiveItemActions.activeItemRequest(activeData));
      localStorage.setItem('leadStatus', JSON.stringify(activeData.status));

      event.stopPropagation();
      if (actionEnum === ActionsEnum.reportEdit.key) {
        GlobalHistory.push(
          `/home/leads/edit?formType=${activeData.leadTypeId}&id=${activeData.id}`
        );
      } else if (actionEnum === ActionsEnum.folder.key) {
        GlobalHistory.push(
          `/home/leads/lead-profile-edit?formType=${activeData.leadTypeId}&id=${activeData.id}`
        );
      } else if (actionEnum === ActionsEnum.matching.key) {
        GlobalHistory.push(
          `/home/leads/lead-profile-edit?formType=${activeData.leadTypeId}&id=${activeData.id
          }&matching=${true}`
        );
      }
    },
    [dispatch]
  );
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
        leadsFilter: {
          filterBy: selectedOrderBy.filterBy,
          orderBy: selectedOrderBy.orderBy,
        },
      })
    );
    setOrderBy({
      filterBy: selectedOrderBy.filterBy,
      orderBy: selectedOrderBy.orderBy,
    });
    setOrderByToggler(false);
  };
  const cardCheckboxClicked = useCallback((itemIndex, element) => {
    setCheckedCards((items) => {
      const index = items.findIndex((item) => item.id === element.id);
      if (index !== -1) items.splice(index, 1);
      else items.push(element);
      return [...items];
    });
    setCheckedCardsIds((items) => {
      const index = items.findIndex((item) => item === element.id);
      if (index !== -1) items.splice(index, 1);
      else items.push(element.id);
      return [...items];
    });
  }, []);

  const reloadData = useCallback(() => {
    setFilter((item) => ({ ...item, pageIndex: 0 }));
    setActiveCard(null);
    getLeadsData();
  }, [getLeadsData]);

  const onCardClick = useCallback(
    (item, selectedIndex) => (event) => {
      event.stopPropagation();
      event.preventDefault();
      setActiveCard(item);
      dispatch(ActiveItemActions.activeItemRequest(item));
      sideMenuComponentUpdate(
        <CardDetailsComponent
          activeData={detailsLeadsList.result[selectedIndex]}
          cardDetailsActionClicked={detailedCardSideActionClicked}
          loginResponse={loginResponse}
          relodedata={reloadData}
          onActionClicked={detailedCardActionClicked}
        />
      );
      sideMenuIsOpenUpdate(true);
    },
    [detailedCardActionClicked, detailedCardSideActionClicked, detailsLeadsList.result, dispatch, loginResponse, reloadData]
  );
  const focusedRowChanged = useCallback(
    (rowIndex, item) => {
      if (rowIndex !== -1) {
        sideMenuComponentUpdate(
          <CardDetailsComponent
            activeData={detailsLeadsList.result[rowIndex]}
            cardDetailsActionClicked={detailedCardSideActionClicked}
            loginResponse={loginResponse}
            onActionClicked={detailedCardActionClicked}
            relodedata={reloadData}
          />
        );
        sideMenuIsOpenUpdate(true);
      } else {
        sideMenuComponentUpdate(<></>);
        sideMenuIsOpenUpdate(false);
      }
      if (item && item.status &&
        item.status.lookupItemId !== Closed) {
        setList([{
          enum: TableActions.openFile.key,
          isDisabled: false,
          externalComponent: null,
        },
        {
          enum: TableActions.editText.key,
          isDisabled: false,
          externalComponent: null,
        }]);
      } else if (item && item.status &&
        item.status.lookupItemId === Closed) {
        setList([{
          enum: TableActions.openFile.key,
          isDisabled: false,
          externalComponent: null,
        },
        ]);
      }
    },
    [detailedCardActionClicked, detailedCardSideActionClicked, detailsLeadsList.result, loginResponse, reloadData]
  );
  const onFormTypeSelectChanged = (formType) => {
    localStorage.removeItem('leadStatus');
    GlobalHistory.push(`/home/leads/add?formType=${formType}`);
  };
  const getIsSelected = useCallback(
    (row) => checkedCardsIds && checkedCardsIds.findIndex((item) => item === row.id) !== -1,
    [checkedCardsIds]
  );
  const getIsDisabled = useCallback(
    (row) =>
      (checkedCardsIds && checkedCardsIds.length > 1 && !getIsSelected(row)) ||
      (checkedCards &&
        checkedCards[0] &&
        (checkedCards[0].leadTypeId !== row.leadTypeId ||
          (checkedCards[0].name === row.name && !getIsSelected(row)))),
    [checkedCards, checkedCardsIds, getIsSelected]
  );
  const onSelectClicked = useCallback(
    (row) => {
      const itemIndex = checkedCardsIds ? checkedCardsIds.findIndex((item) => item === row.id) : -1;
      if (itemIndex !== -1) {
        checkedCardsIds.splice(itemIndex, 1);
        setCheckedCards((items) => {
          const elementIndex = items.findIndex((item) => item.id === row.id);
          if (elementIndex !== -1) items.splice(elementIndex, 1);
          return [...items];
        });
      } else {
        checkedCardsIds.push(row.id);
        setCheckedCards((items) => {
          items.push(row);
          return [...items];
        });
      }
      setCheckedCardsIds(checkedCardsIds);
    },
    [checkedCardsIds]
  );
  useEffect(() => {
    getAllSearchableFormFieldsByFormId();
  }, [filterFormType, getAllSearchableFormFieldsByFormId]);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={detailsLeadsList.totalCount}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
    );
  });
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
      sideMenuComponentUpdate(null);
      sideMenuIsOpenUpdate(false);
    },
    []
  );
  useEffect(() => {
    const data = localStorage.getItem('LeadsFilter');

    if (data) {
      setSearchData(JSON.parse(data));
      searchchachedClickedWithoutFilter(JSON.parse(data));
    } else
      getLeadsData();
  }, []);

  useEffect(() => {
    if (isFirst1) {
      if (searchData && searchData.length === 0) {
        localStorage.removeItem('LeadsFilter');
        getLeadsData();
      } else
        localStorage.setItem('LeadsFilter', JSON.stringify(searchData));
    } else
      setFirst1(true);
  }, [searchData]);

  useEffect(() => {
    if (!isFirst) setFirst(true);
    else {
      const data = localStorage.getItem('LeadsFilter');
      if (data)
        searchchachedClickedWithoutFilter(JSON.parse(data));
      else
        getLeadsData();
    }
  }, [activeFormType, filter, Status, filterSearchDto, leadType, leadsTableFilter, orderBy, pathName, t, referred, dateFilter]);
  const getAllReferred = useCallback(async (searchValue) => {
    // setIsLoading(true);
    setIsLoading((item) => ({ ...item, referred: true }));

    const res = await OrganizationUserSearch({ pageIndex: 0, pageSize: 10, name: searchValue });
    if (!(res && res.status && res.status !== 200)) {
      setAllReferred({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setAllReferred({
        result: [],
        totalCount: 0,
      });
    }
    // setIsLoading(false);
    setIsLoading((item) => ({ ...item, referred: false }));
  }, []);
  const getAllMediaName = useCallback(async () => {
    // setIsLoading(true);
    setIsLoading((item) => ({ ...item, mediaDetails: true }));
    const res = await lookupItemsGetId({
      lookupTypeId: MediaEnum.MediaDetailsId.lookupTypeId
    });
    if (!(res && res.status && res.status !== 200))
      setAllMediaName(res);
    else
      setAllMediaName([]);
    // setIsLoading(false);
    setIsLoading((item) => ({ ...item, mediaDetails: false }));
  }, []);
  useEffect(() => {
    getAllReferred();
    getAllMediaName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkBulkDesabled = (enums) => {
    if (enums === ActionsButtonsEnum[5].id)
      return !(checkedCards && checkedCards.length >= 1);
    if (enums === ActionsButtonsEnum[5].id)
      return !(checkedCards && checkedCards.length >= 1);
    if (enums === ActionsButtonsEnum[6].id)
      return !(checkedCards && checkedCards.length >= 1);

    return false;
  };

  const closeLeads = useCallback(async (item) => {
    setIsLoading((item) => ({ ...item, allLeads: true }));
    const res = await CloseListOfLeads(item);
    if (!(res && res.status && res.status !== 200)) {
      showSuccess(t(`${translationPath}close-leads-success`));
      reloadData();
      setIsCloseAction(true);
    } else {
      showError(t(`${translationPath}close-leads-failure`));
      reloadData();
      setIsCloseAction(true);
    }
    setIsLoading((item) => ({ ...item, allLeads: false }));
  }, []);

  useEffect(() => {
    dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        LeadFilterDate: dateFilter || dateRangeDefault
      })
    );
  }, [dateFilter]);

  const getIsSelectedAll = useCallback(
    () => {
      const returnSelect = (checkedCardsIds &&
        detailsLeadsList.result.findIndex((item) => !checkedCardsIds.includes(item.id)) === -1) || false;
      return returnSelect;
    }
  );

  const onSelectAllClicked = () => {
    const cardItmes = [];
    if (!getIsSelectedAll()) {
      detailsLeadsList.result.map((item) => {
        if (!getIsSelected(item)) {
          checkedCardsIds.push(item.id);
          cardItmes.push({ ...item });
        }
      });
    } else {
      detailsLeadsList.result.map((item) => {
        if (getIsSelected(item)) {
          const isSelectedIndex = checkedCardsIds.findIndex(
            (element) => element === item.id
          );
          if (isSelectedIndex !== -1) checkedCardsIds.splice(isSelectedIndex, 1);
        }
      });
    }
    setCheckedCards(cardItmes);
  };
  return (
    <div className='view-wrapper leads'>
      <Spinner isActive={isLoading.allLeads} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section'>
              {/* {loginResponse &&
                loginResponse.permissions
                  .map((item) => item.permissionsId === LeadsPermissions.CreateLeads.permissionsId)
                  .includes(true) && ( */}
              <PermissionsComponent
                permissionsList={!isPropertyManagementView ? Object.values(LeadsCAllCenterPermissions) : Object.values(LeadsPermissions)}
                permissionsId={!isPropertyManagementView ? LeadsCAllCenterPermissions.AddNewLead.permissionsId : LeadsPermissions.AddNewLeadInPropertyManagemntPage.permissionsId}
              >
                <ActionsButtonsComponent
                  isDisabled={activeSelectedAction === 'merge' ? checkedCards.length < 2 : false}
                  withType
                  enableCloseLeads
                  enablereassignLeads
                  checkDisable={checkBulkDesabled}
                  typeData={[
                    { id: '1', name: 'owner' },
                    { id: '2', name: 'seeker' },
                  ]}
                  onFormTypeSelectChanged={onFormTypeSelectChanged}
                  onActionsButtonClicked={onActionsButtonClicked}
                  enableImport
                  onActionButtonChanged={onActionButtonChanged}
                  closeAction={isCloseAction}
                  withCheckbox={activeSelectedAction === 'close-leads' && (activeActionType === ViewTypesEnum.cards.key || activeActionType === ViewTypesEnum.cardsExpanded.key)}
                  onSelectAllClicked={onSelectAllClicked}
                />

              </PermissionsComponent>

            </div>
            <div className='section autocomplete-section'>
              <PermissionsComponent
                permissionsList={!isPropertyManagementView ? Object.values(LeadsCAllCenterPermissions) : Object.values(LeadsPermissions)}
                permissionsId={!isPropertyManagementView ? LeadsCAllCenterPermissions.ViewAndSearchInCallCenterLeads.permissionsId : LeadsPermissions.ViewandsearchinPropertyManagementLeads.permissionsId}
              >
                <div className='d-flex-column px-2 w-100 p-relative'>
                  <div className='w-100 p-relative'>
                    <AutocompleteComponent
                      data={searchableFormFields.map((item) => ({
                        key: item.key,
                        title: item.title,
                      }))}
                      wrapperClasses='autocomplete-with-btn'
                      selectedValues={searchData}
                      parentTranslationPath='ContactsView'
                      displayLabel={displayedLabel}
                      disabledOptions={disabledOptions}
                      onChange={filterOnChange}
                      searchClicked={searchClicked}
                      chipsLabel={chipsLabel}
                      getOptionSelected={(option) =>
                        searchData.findIndex(
                          (item) => item.key === option.key && item.value === searchInputValue
                        ) !== -1}
                      tagValues={searchData}
                      inputValue={searchInputValue}
                      onInputChange={inputValueChanged}
                      inputLabel='filter'
                      inputPlaceholder='search-leads'
                    />
                    {/* <ButtonBase
                    className='btns theme-tranparent filter-type-btn'
                    disabled={isLoadingFormFilter}
                    onClick={onFilterFormTypeSelectChanged}
                  >
                    <span>
                      {t(
                        `${translationPath}${
                          (filterFormType === FormsIdsEnum.leadsOwner.id &&
                            FormsIdsEnum.leadsOwner.name) ||
                          FormsIdsEnum.leadsSeeker.name
                        }`
                      )}
                    </span>
                  </ButtonBase> */}
                  </div>
                  <div className='d-flex-v-center-h-between pl-5-reversed '>
                    {!pathName.includes('Leads-property-management') && (
                      <div>
                        <SelectComponet
                          data={[
                            { id: 1, name: 'owner' },
                            { id: 2, name: 'seeker' },
                          ]}
                          emptyItem={{
                            value: 0,
                            text: 'select-category',
                            isDisabled: false,
                          }}
                          value={activeFormType}
                          valueInput='id'
                          textInput='name'
                          onSelectChanged={changeActiveFormType}
                          wrapperClasses='w-auto'
                          themeClass='theme-transparent'
                          idRef='activeFormTypeRef'
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          translationPathForData={translationPath}
                        />
                        {activeFormType !== 0 && (
                          <SelectComponet
                            data={
                              activeFormType === 1 ?
                                [
                                  { id: 'Seller', name: 'seller' },
                                  { id: 'Landlord', name: 'landlord' },
                                ] :
                                [
                                  { id: 'Buyer', name: 'buyer' },
                                  { id: 'Tenant', name: 'tenant' },
                                ]
                            }
                            emptyItem={{
                              value: 0,
                              text: 'select-lead-type',
                              isDisabled: false,
                            }}
                            value={leadType}
                            valueInput='id'
                            textInput='name'
                            onSelectChanged={changeActiveLeadType}
                            wrapperClasses='w-auto'
                            themeClass='theme-transparent'
                            idRef='activeFormTypeRef'
                            parentTranslationPath={parentTranslationPath}
                            translationPath={translationPath}
                            translationPathForData={translationPath}
                          />
                        )}
                      </div>
                    )}
                    <SelectComponet
                      data={[
                        { id: 'Open', name: 'open' },
                        { id: 'Closed', name: 'closed' },
                      ]}
                      emptyItem={{ value: 0, text: 'select-status', isDisabled: false }}
                      value={Status}
                      valueInput='id'
                      textInput='name'
                      onSelectChanged={changeStatusType}
                      wrapperClasses='w-auto'
                      themeClass='theme-transparent'
                      idRef='activeFormTypeRef'
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      translationPathForData={translationPath}
                    />
                    <div className='w-30 pt-2'>
                      <Inputs
                        value={searchedItem}
                        onKeyUp={(e) => searchHandler(e.target.value)}
                        idRef='activitiesSearchRef'
                        labelClasses='mt-4'
                        onInputChanged={(e) => setSearchedItem(e.target.value)}
                        inputPlaceholder={t(`${translationPath}search-Mobile-Email-ID`)}
                      />
                    </div>
                  </div>
                  <div className='d-flex-v-center-h-between pl-5-reversed  agentSection'>
                    <div className='agentSection'>
                      <div className='agentSection1'>
                        <AutocompleteComponent
                          idRef='ReferredByRef'
                          isLoading={isLoading.referred}
                          inputPlaceholder={t(`${translationPath}ReferredBy`)}
                          selectedValues={orderFilter.ReferredByLeadTypeFilter}
                          getOptionSelected={(option) => option.id === orderFilter.ReferredByLeadTypeFilter.id || ''}
                          data={(allReferred && allReferred.result) || []}
                          onInputChange={(e) => {
                            if (e && e.target && e.target.value)
                              getAllReferred(e.target.value || '');
                          }}
                          multiple={false}
                          displayLabel={(option) =>
                            (option && option.fullName) || ''}
                          chipsLabel={(option) => (option && option.fullName) || ''}
                          withoutSearchButton
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          onChange={(event, newValue) => {
                            dispatch(
                              GlobalOrderFilterActions.globalOrderFilterRequest({
                                ...orderFilter,
                                ReferredByLeadTypeFilter: {
                                  id: (newValue && newValue.id) || '',
                                  fullName: (newValue && newValue.fullName) || ''
                                } || ''
                              })
                            );
                            setReferred((item) => ({ ...item, by: (newValue && newValue.fullName) || '' }));
                          }}
                        />
                      </div>
                      <div className='agentSection1'>
                        <AutocompleteComponent
                          idRef='ReferredToRef'
                          inputPlaceholder={t(`${translationPath}ReferredTo`)}
                          data={(allReferred && allReferred.result) || []}
                          selectedValues={orderFilter.ReferredToLeadTypeFilter}
                          getOptionSelected={(option) => option.id === orderFilter.ReferredToLeadTypeFilter.id || ''}
                          onInputChange={(e) => {
                            if (e && e.target && e.target.value)
                              getAllReferred(e.target.value || '');
                          }}
                          multiple={false}
                          displayLabel={(option) =>
                            (option && option.fullName) || ''}
                          chipsLabel={(option) => (option && option.fullName) || ''}
                          withoutSearchButton
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          onChange={(event, newValue) => {
                            dispatch(
                              GlobalOrderFilterActions.globalOrderFilterRequest({
                                ...orderFilter,
                                ReferredToLeadTypeFilter: {
                                  id: (newValue && newValue.id) || '',
                                  fullName: (newValue && newValue.fullName) || ''
                                } || ''
                              })
                            );
                            setReferred((item) => ({ ...item, to: (newValue && newValue.fullName) || null }));
                          }}
                        />
                      </div>
                      <div className='agentSection1'>
                        <AutocompleteComponent
                          idRef='MediaDetailsRef'
                          isLoading={isLoading.mediaDetails}
                          inputPlaceholder={t(`${translationPath}MediaDetails`)}
                          selectedValues={orderFilter.MediaDetailsLeadTypeFilter}
                          getOptionSelected={(option) => option.lookupItemId === orderFilter.MediaDetailsLeadTypeFilter.lookupItemId || ''}
                          data={(allMediaName) || []}
                          displayLabel={(option) =>
                            (option && option.lookupItemName) || ''}
                          chipsLabel={(option) => (option && option.lookupItemName) || ''}
                          multiple={false}
                          withoutSearchButton
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          onChange={(event, newValue) => {
                            dispatch(
                              GlobalOrderFilterActions.globalOrderFilterRequest({
                                ...orderFilter,
                                MediaDetailsLeadTypeFilter: {
                                  lookupItemId: (newValue && newValue.lookupItemId) || '',
                                  lookupItemName: (newValue && newValue.lookupItemName) || ''
                                } || ''
                              })
                            );
                            setReferred((item) => ({ ...item, mediaDetails: (newValue && newValue.lookupItemName) || null }));
                          }}
                        />
                      </div>
                    </div>

                  </div>
                  <div className='pl-5-reversed lead-filters'>
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

                  </div>
                </div>
                <ViewTypes onTypeChanged={onTypeChanged} className='mb-3' />
              </PermissionsComponent>
            </div>
          </div>

          <div className='d-flex px-2'>
            <PermissionsComponent
              permissionsList={!isPropertyManagementView ? Object.values(LeadsCAllCenterPermissions) : Object.values(LeadsPermissions)}
              permissionsId={!isPropertyManagementView ? LeadsCAllCenterPermissions.ViewAndSearchInCallCenterLeads.permissionsId : LeadsPermissions.ViewandsearchinPropertyManagementLeads.permissionsId}
            >
              <span className='mx-2 mt-1'>{t(`${translationPath}leads`)}</span>
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
                      { id: 'createdOn', filterBy: 'created-on' },
                      { id: 'updateOn', filterBy: 'last-updated' },
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
                    value={selectedOrderBy.orderBy}
                    onSelectChanged={orderByChanged}
                    wrapperClasses='mb-3'
                    isRequired
                    valueInput='id'
                    textInput='orderBy'
                    emptyItem={{
                      value: null,
                      text: 'select-sort-by',
                      isDisabled: false,
                    }}
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
        {activeActionType !== ViewTypesEnum.tableView.key && (
          <>
            <div className='body-section'>
              <PermissionsComponent
                permissionsList={!isPropertyManagementView ? Object.values(LeadsCAllCenterPermissions) : Object.values(LeadsPermissions)}
                permissionsId={!isPropertyManagementView ? LeadsCAllCenterPermissions.ViewAndSearchInCallCenterLeads.permissionsId : LeadsPermissions.ViewandsearchinPropertyManagementLeads.permissionsId}
              >
                {/* {loginResponse &&
                loginResponse.permissions
                  .map((item) => item.permissionsId === LeadsPermissions.ReadLeads.permissionsId)
                  .includes(true) && ( */}
                <LeadsCardsComponent
                  data={detailsLeadsList}
                  isExpanded={isExpanded}
                  onCardClicked={onCardClick}
                  onFooterActionsClicked={detailedCardSideActionClicked}
                  onActionClicked={detailedCardActionClicked}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  withCheckbox={activeSelectedAction === 'close-leads' || activeSelectedAction === 'reassign-leads'}
                  onCardCheckboxClick={cardCheckboxClicked}
                  activeCard={activeCard}
                  notExpandedMax={3}
                  selectedCards={checkedCards}
                  relodedata={reloadData}
                  isCheckBoxDisabled={
                    activeSelectedAction === 'merge' ? checkedCards.length >= 2 : false
                  }
                  activeSelectedAction={activeSelectedAction}
                  checkedCards={checkedCards}
                />
                {/* )} */}
              </PermissionsComponent>
            </div>
          </>
        )}
        {/* loginResponse &&
          loginResponse.permissions
            .map((item) => item.permissionsId === LeadsPermissions.ReadLeads.permissionsId)
            .includes(true) && */}

        {activeActionType === ViewTypesEnum.tableView.key && (
          <PermissionsComponent
            permissionsList={!isPropertyManagementView ? Object.values(LeadsCAllCenterPermissions) : Object.values(LeadsPermissions)}
            permissionsId={!isPropertyManagementView ? LeadsCAllCenterPermissions.ViewAndSearchInCallCenterLeads.permissionsId : LeadsPermissions.ViewandsearchinPropertyManagementLeads.permissionsId}
          >
            <LeadsLeaseTableComponent
              detailsLeadsList={detailsLeadsList}
              tableActionClicked={tableActionClicked}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              filter={filter}
              parentTranslationPath={parentTranslationPath}
              focusedRowChanged={focusedRowChanged}
              leadsTableFilter={leadsTableFilter}
              onFilterValuesChanged={onFilterValuesChanged}
              checkedCardsIds={checkedCardsIds}
              getIsSelected={getIsSelected}
              // getIsDisabled={getIsDisabled}
              onSelectClicked={onSelectClicked}
              activeSelectedAction={activeSelectedAction}
              defaultActions={list}
              setCheckedCardsIds={setCheckedCardsIds}
              checkedCards={checkedCards}
              setCheckedCards={setCheckedCards}
            />
            {' '}

          </PermissionsComponent>
        )}
        <LeadsActionDialogsComponent
          isOpen={isOpenContactsActionDialog}
          isOpenChanged={() => setisOpenContactsActionDialog(false)}
          actionEnum={detailedCardAction.actionEnum}
          item={detailedCardAction.item}
          translationPath={translationPath}
          parentTranslationPath='ContactsView'
        />
      </div>
      <LeadsImportDialog
        isOpen={isOpenImportDialog}
        isOpenChanged={() => setIsOpenImportDialog(false)}
      />
      {
        isOpenCloseLeadsDialog && (
          <CloseLeadsDialog
            isOpen={isOpenCloseLeadsDialog}
            setIsLoading={setIsLoading}
            onSave={(item) => {
              const closeLeadsBody = { leadsIds: checkedCardsIds, closeReasonId: item.closeReasonId, remarks: item.remarks };
              closeLeads(closeLeadsBody);
              setIsOpenCloseLeadsDialog(false);
              setCheckedCards([]);
              setCheckedCardsIds([]);
            }}
            onClose={() => {
              setIsOpenCloseLeadsDialog(false);
              setCheckedCards([]);
              setCheckedCardsIds([]);
            }}
          />
        )
      }
      {isOpenleadsReassignDialog && (
        <LeadsReassignDialog
          isOpen={isOpenleadsReassignDialog}
          leadType={checkedCards && checkedCards[0] && checkedCards[0].leadClass}
          isLoadingReassign={isLoadingReassign}
          setIsLoadingReassign={setIsLoadingReassign}
          onSave={(reassignItem) => {
            reassignHandler(reassignItem);
            setCheckedCards([]);
            setCheckedCardsIds([]);
          }}
          parentTranslationPath={'ContactProfileManagementView'}
          translationPath={''}
          onClose={() => {
            setIsOpenleadsReassignDialog(false);
          }}
        />
      )
      }
    </div>
  );
};
