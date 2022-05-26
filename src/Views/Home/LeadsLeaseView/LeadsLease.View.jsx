import React, {
  useState, useCallback, useEffect, useRef
} from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { DateRangePickerComponent } from '../../../Components/Controls/DateRangePickerComponent/DateRangePickerComponent';
import { LeadsReassignDialog } from '../LeadsSalesView/LeadsSalesUtilities/Dialogs/LeadsReassignDialog/LeadsReassignDialog';
import {
  sideMenuIsOpenUpdate,
  sideMenuComponentUpdate,
  GlobalHistory,
  bottomBoxComponentUpdate,
  WhatsAppMessage,
  showError,
  GlobalTranslate, showSuccess
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
  ContactTypeEnum,
  ActionsButtonsEnum,
  TableActions,
  LeadsPriorityEnum,
  LeadsTypesEnum,
  FormsIdsEnum,
  TableFilterOperatorsEnum,
  TableFilterTypesEnum,
  MediaEnum,
  LeadTab
} from '../../../Enums';
import {
  CardDetailsComponent,
  LeadsCardsComponent,
  LeadsLeaseTableComponent,
} from './LeadsLeaseUtilities';
import {
  ReassignLeads, GetAdvanceSearchLeaseLeads, GetAllSearchableFormFieldsByFormId, OrganizationUserSearch, lookupItemsGetId, CloseListOfLeads, GetAllContactLeadsAdvanceSearch
} from '../../../Services';
import { PaginationComponent } from '../../../Components/PaginationComponent/PaginationComponent';
import { LeadsImportDialog } from './LeadsLeaseUtilities/Dialogs/LeadsImportDialog/LeadsImportDialog';
import { ActiveItemActions } from '../../../store/ActiveItem/ActiveItemActions';
import { useTitle } from '../../../Hooks';
import { GlobalOrderFilterActions } from '../../../store/GlobalOrderFilter/GlobalOrderFilterActions';
import { PermissionsComponent } from '../../../Components/PermissionsComponent/PermissionsComponent';
import { LeadsLeasePermissions } from '../../../Permissions/Lease/LeadsLeasePermissions';
import { LeadsActionDialogsComponent } from '../LeadsView/LeadsUtilities/LeadsActionDialogsComponent/LeadsActionDialogsComponent';
import { Closed } from '../../../assets/json/StaticLookupsIds.json';
import { CloseLeadsDialog } from '../LeadsView/LeadsUtilities/Dialogs/CloseLeadsDialog/CloseLeadsDialog';

const parentTranslationPath = 'LeadsView';
const translationPath = '';

export const LeadsLeaseView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const [isCloseAction, setIsCloseAction] = useState(false);
  const [isOpenCloseLeadsDialog, setIsOpenCloseLeadsDialog] = useState(false);
  const [isOpenleadsReassignDialog, setIsOpenleadsReassignDialog] = useState(false);
  const [isLoadingReassign, setIsLoadingReassign] = useState(false);

  const dispatch = useDispatch();
  const dateRangeDefault = {
    startDate: null,
    endDate: null,
    key: 'selection',
  };
  const [list, setList] = useState([
    {
      enum: TableActions.openFile.key,
    },
    {
      enum: TableActions.editText.key,
    },
  ]);
  const [allReferred, setAllReferred] = useState([]);
  const [allMediaName, setAllMediaName] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const localStorageFilter = localStorage.getItem('GlobalFilter');
  const [isLoading, setIsLoading] = useState(
    {
      allLeads: false,
      referred: false,
      mediaDetails: false
    }
  );
  const [leadsTableFilter, setLeadsTableFilter] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isLoadingFormFilter, setIsLoadingFormFilter] = useState(false);
  const [activeSelectedAction, setActiveSelectedAction] = useState('');
  const [checkedCards, setCheckedCards] = useState([]);
  const [checkedCardsIds, setCheckedCardsIds] = useState([]);
  const [isFirst, setFirst] = useState(false);
  const [isSearchAvite, setisSearchAvite] = useState(false);
  const searchTimer = useRef(null);
  const [isFirst1, setFirst1] = useState(false);
  const [isOpenContactsActionDialog, setisOpenContactsActionDialog] = useState(false);
  const [detailedCardAction, setdetailedCardAction] = useState(() => ({
    actionEnum: '',
    item: '',
  }));
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
  // const [isHidden, setIsHidden] = useState(false);
  const [orderByToggler, setOrderByToggler] = useState(false);
  const [leadType, setLeadType] = useState(orderFilter.ActiveLeadTypeLeaseFilter || 0);
  const [Status, setStatus] = useState(orderFilter.StatusTypeLeadTypeLeaseFilter || 0);

  const [isOpenImportDialog, setIsOpenImportDialog] = useState(false);
  // isOpenImportDialog
  const [activeCard, setActiveCard] = useState(null);
  const [selectedOrderBy, setSelectedOrderBy] = useState({
    filterBy: orderFilter.leadsLeaseFilter.filterBy,
    orderBy: orderFilter.leadsLeaseFilter.orderBy,
  });
  const [orderBy, setOrderBy] = useState(selectedOrderBy.filterBy ? selectedOrderBy : {});
  const [detailsLeadsList, setDetailsLeadsList] = useState(() => ({
    result: [],
    totalCount: 0,
  }));
  // this one to change searchable form fields
  const [filterFormType, setFilterFormType] = useState(FormsIdsEnum.leadsOwner.id);
  // this one to change get contacts by type
  const [activeFormType, setActiveFormType] = useState(0);
  const [searchableFormFields, setSearchableFormFields] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchedItem, setSearchedItem] = useState('');
  const [filterSearchDto, setFilterSearchDto] = useState(null);
  const [contactsFilterSearchDto, setContactsFilterSearchDto] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState('');

  const [dateFilter, setDateFilter] = useState(
    (orderFilter && orderFilter.LeadTypeSaleFilterLeaseDate && orderFilter.LeadTypeSaleFilterLeaseDate.startDate && orderFilter.LeadTypeSaleFilterLeaseDate.endDat !== null) &&
    (
      {
        startDate: new Date(orderFilter && orderFilter.LeadTypeSaleFilterLeaseDate && orderFilter.LeadTypeSaleFilterLeaseDate.startDate || null),
        endDate: new Date(orderFilter && orderFilter.LeadTypeSaleFilterLeaseDate && orderFilter.LeadTypeSaleFilterLeaseDate.endDate || null),
        key: new Date(orderFilter && orderFilter.LeadTypeSaleFilterLeaseDate && orderFilter.LeadTypeSaleFilterLeaseDate.key || null),
      }) || dateRangeDefault
  );

  // Start New Code states
  // const [leadsRes, setLeadsRes] = useState({
  //   result: [],
  //   totalCount: 0,
  // });
  const [referred, setReferred] = useState({
    by: orderFilter && orderFilter.ReferredByLeadTypeLeaseFilter && orderFilter.ReferredByLeadTypeLeaseFilter.fullName || null,
    to: orderFilter && orderFilter.ReferredToLeadTypeLeaseFilter && orderFilter.ReferredToLeadTypeLeaseFilter.fullName || null,
    mediaDetails: orderFilter && orderFilter.MediaDetailsLeadTypeLeaseFilter && orderFilter.MediaDetailsLeadTypeLeaseFilter.lookupItemName || null
  });
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
  // const onFilterFormTypeSelectChanged = () => {
  //   setFilterFormType(
  //     (item) =>
  //       (item === FormsIdsEnum.leadsOwner.id && FormsIdsEnum.leadsSeeker.id) ||
  //       FormsIdsEnum.leadsOwner.id
  //   );
  //   if (searchData.length > 0) {
  //     setSearchData([]);
  //     onPageIndexChanged(0);
  //     setFilterSearchDto(null);
  //   }
  // };
  // const changeActiveFormType = (value) => {
  //   setActiveFormType(value);
  //   setLeadType(0);
  // };
  const changeActiveLeadType = (value) => {
    setLeadType(value);
    dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        ActiveLeadTypeLeaseFilter: value
      })
    );
  };
  const changeStatusType = (value) => {
    setStatus(value);
    dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        StatusTypeLeadTypeLeaseFilter: value
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
        { searchType: TableFilterOperatorsEnum.equal.key, value: (leadType || '').toLowerCase() },
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

    if (leadsTableFilter && leadsTableFilter.lastActivityTypeName && leadsTableFilter.lastActivityTypeName.value !== null)
      body.lastActivityTypeName = leadsTableFilter.lastActivityTypeName.value;

    if (leadsTableFilter && leadsTableFilter.activityCreatedBy && leadsTableFilter.activityCreatedBy.value !== null)
      body.activityCreatedBy = leadsTableFilter.activityCreatedBy.value;

    const leadTab = LeadTab.Lease;

    const res = await GetAdvanceSearchLeaseLeads(filter, body);

    if (!(res && res.status && res.status !== 200)) {
      setDetailsLeadsList({
        result: ((res && res.result) || []).map((item) => {
          const { lead } = item;
          return {
            leadClass: (lead.leadClass && lead.leadClass) || 'N/A',
            id: item.leadId,
            lastActivityTypeName: item.lastActivityTypeName,
            activityCreatedBy: item.activityCreatedBy,
            unitType: item.unitType,
            leadTypeId: lead.lead_type_id,
            imagePath: null,
            leadAssignedDate: item.leadAssignedDate || 'N/A',
            name: `${(lead.contact_name && lead.contact_name.name) || 'N/A'}`,
            matchingUnits: (lead.matching_units && lead.matching_units) || [],
            matchingUnitsNumber: (lead.matching_units && lead.matching_units.length) || 0,
            creationDate: item.createdOn,
            updateDate: item.updateOn,
            type: ContactTypeEnum.man.value,
            leadType:
              (lead.lead_type_id === 1 &&
                ((LeadsTypesEnum.Owner && LeadsTypesEnum.Owner.value) || 'N/A')) ||
              (lead.lead_type_id === 2 &&
                ((LeadsTypesEnum.Seeker && LeadsTypesEnum.Seeker.value) || 'N/A')) ||
              'N/A',
            rating: lead.rating ?
              (lead.rating.lookupItemName &&
                (LeadsPriorityEnum[lead.rating.lookupItemName] || '')) ||
              '' :
              '',
            progress:
              typeof lead.data_completed === 'string' && lead.data_completed.includes('%') ?
                +lead.data_completed.substr(0, lead.data_completed.length - 1) :
                +lead.data_completed,
            progressWithPercentage:
              typeof lead.data_completed !== 'string' ?
                `${lead.data_completed}%` :
                lead.data_completed,
            // price: '$2.200',
            status:
              (lead.status && lead.status.lookupItemName && lead.status.lookupItemName) || 'N/A',
            flatContent: lead.lead_type_id === 2 && [
              {
                iconClasses: 'mdi mdi-cash-multiple',
                title: null,
                value: lead.budget ?
                  lead.budget.map(
                    (element, index) =>
                      `${element}${(index < lead.budget.length - 1 && ',') || ''} `
                  ) :
                  'N/A',
              },
              {
                iconClasses: 'mdi mdi-bed',
                title: null,
                value: lead && lead.bedrooms && lead.bedrooms.length === 0 ? GlobalTranslate.t('Shared:any') : ((lead.bedrooms &&
                  lead.bedrooms.map(
                    (element, index) =>
                      `${element}${(index < lead.bedrooms.length - 1 && ',') || ''} `
                  )) ||
                  GlobalTranslate.t('Shared:any')),
              },
              {
                iconClasses: 'mdi mdi-shower',
                title: null,
                value: lead && lead.bathrooms && lead.bathrooms.length === 0 ? GlobalTranslate.t('Shared:any') : (lead.bathrooms &&
                  lead.bathrooms.map(
                    (element, index) =>
                      `${element}${(index < lead.bathrooms.length - 1 && ',') || ''} `
                  )) ||
                  GlobalTranslate.t('Shared:any'),

              },
              {
                iconClasses: 'mdi mdi-ruler-square',
                title: 'sqf',
                value: lead.size_sqft ?
                  lead.size_sqft.map(
                    (element, index) =>
                      `${element}${(index < lead.size_sqft.length - 1 && ',') || ''} `
                  ) :
                  'N/A',
              },
            ],
            details: [
              {
                iconClasses: 'mdi mdi-clipboard-account-outline',
                title: 'lead-type',
                value:
                  lead.lead_type_id === 1 ?
                    t(`${translationPath}owner`) :
                    t(`${translationPath}seeker`),
              },
              {
                iconClasses: 'mdi mdi-account-circle',
                title: 'stage',
                value: lead.lead_stage ? lead.lead_stage.lookupItemName : 'N/A',
              },
              // {
              //   iconClasses: 'mdi mdi-offer',
              //   title: 'status',
              //   value: lead.status ? lead.status.lookupItemName : 'N/A',
              // },
              {
                iconClasses: 'mdi mdi-account-box',
                title: 'contact-name',
                value: lead.contact_name ? lead.contact_name.name : 'N/A',
              },

              {
                iconClasses: 'mdi mdi-table-furniture',
                title: 'equipments-and-fixtures',
                value:
                  (lead.fitting_and_fixtures &&
                    lead.fitting_and_fixtures.map(
                      (element, index) =>
                        `${element.lookupItemName}${(index < lead.fitting_and_fixtures.length - 1 && ',') || ''
                        } `
                    )) ||
                  'N/A',
              },
              {
                iconClasses: 'mdi mdi-window-open-variant',
                title: 'views',
                value:
                  (lead.view &&
                    ((Array.isArray(lead.view) &&
                      lead.view.map(
                        (element, index) =>
                          `${element.lookupItemName}${(index < lead.view.length - 1 && ',') || ''} `
                      )) ||
                      (typeof lead.view === 'object' && lead.view.lookupItemName) ||
                      'N/A')) ||
                  'N/A',
              },
              {
                iconClasses: 'mdi mdi-laptop-windows',
                title: 'developers',
                value:
                  (lead.developers &&
                    lead.developers.map(
                      (element, index) =>
                        `${element.lookupItemName}${(index < lead.developers.length - 1 && ',') || ''
                        } `
                    )) ||
                  'N/A',
              },
              // {
              //   iconClasses: 'mdi mdi-star-half-full',
              //   title: 'rating',
              //   value: lead.rating ? lead.rating.lookupItemName : 'N/A',
              // },
            ],
            ...lead,
          };
        }),
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setDetailsLeadsList({
        result: [],
        totalCount: 0,
      });
    }
    // setIsLoading(false);
    setIsLoading((item) => ({ ...item, allLeads: false }));
  }, [activeFormType, filter, Status, filterSearchDto, leadType, leadsTableFilter, orderBy, t, referred, dateFilter]);

  const getContactLeadsData = useCallback(async () => {
    setIsLoading((item) => ({ ...item, allLeads: true }));
    const body = {
      criteria: contactsFilterSearchDto,
      ...orderBy,
    };
    const leadTab = LeadTab.Lease;

    const res = await GetAllContactLeadsAdvanceSearch(leadTab, filter, body);

    if (!(res && res.status && res.status !== 200)) {
      setDetailsLeadsList({
        result: ((res && res.result) || []).map((item) => {
          const { lead } = item;
          return {
            leadClass: (lead.leadClass && lead.leadClass) || 'N/A',
            id: item.leadId,
            lastActivityTypeName: item.lastActivityTypeName,
            activityCreatedBy: item.activityCreatedBy,
            unitType: item.unitType,
            leadTypeId: lead.lead_type_id,
            imagePath: null,
            name: `${(lead.contact_name && lead.contact_name.name) || 'N/A'}`,
            matchingUnits: (lead.matching_units && lead.matching_units) || [],
            matchingUnitsNumber: (lead.matching_units && lead.matching_units.length) || 0,
            creationDate: item.createdOn,
            updateDate: item.updateOn,
            type: ContactTypeEnum.man.value,
            leadType:
              (lead.lead_type_id === 1 &&
                ((LeadsTypesEnum.Owner && LeadsTypesEnum.Owner.value) || 'N/A')) ||
              (lead.lead_type_id === 2 &&
                ((LeadsTypesEnum.Seeker && LeadsTypesEnum.Seeker.value) || 'N/A')) ||
              'N/A',
            rating: lead.rating ?
              (lead.rating.lookupItemName &&
                (LeadsPriorityEnum[lead.rating.lookupItemName] || '')) ||
              '' :
              '',
            progress:
              typeof lead.data_completed === 'string' && lead.data_completed.includes('%') ?
                +lead.data_completed.substr(0, lead.data_completed.length - 1) :
                +lead.data_completed,
            progressWithPercentage:
              typeof lead.data_completed !== 'string' ?
                `${lead.data_completed}%` :
                lead.data_completed,
            // price: '$2.200',
            status:
              (lead.status && lead.status.lookupItemName && lead.status.lookupItemName) || 'N/A',
            flatContent: lead.lead_type_id === 2 && [
              {
                iconClasses: 'mdi mdi-cash-multiple',
                title: null,
                value: lead.budget ?
                  lead.budget.map(
                    (element, index) =>
                      `${element}${(index < lead.budget.length - 1 && ',') || ''} `
                  ) :
                  'N/A',
              },
              {
                iconClasses: 'mdi mdi-bed',
                title: null,
                value: lead && lead.bedrooms && lead.bedrooms.length === 0 ? GlobalTranslate.t('Shared:any') : ((lead.bedrooms &&
                  lead.bedrooms.map(
                    (element, index) =>
                      `${element}${(index < lead.bedrooms.length - 1 && ',') || ''} `
                  )) ||
                  GlobalTranslate.t('Shared:any')),
              },
              {
                iconClasses: 'mdi mdi-shower',
                title: null,
                value: lead && lead.bathrooms && lead.bathrooms.length === 0 ? GlobalTranslate.t('Shared:any') : (lead.bathrooms &&
                  lead.bathrooms.map(
                    (element, index) =>
                      `${element}${(index < lead.bathrooms.length - 1 && ',') || ''} `
                  )) ||
                  GlobalTranslate.t('Shared:any'),

              },
              {
                iconClasses: 'mdi mdi-ruler-square',
                title: 'sqf',
                value: lead.size_sqft ?
                  lead.size_sqft.map(
                    (element, index) =>
                      `${element}${(index < lead.size_sqft.length - 1 && ',') || ''} `
                  ) :
                  'N/A',
              },
            ],
            details: [
              {
                iconClasses: 'mdi mdi-clipboard-account-outline',
                title: 'lead-type',
                value:
                  lead.lead_type_id === 1 ?
                    t(`${translationPath}owner`) :
                    t(`${translationPath}seeker`),
              },
              {
                iconClasses: 'mdi mdi-account-circle',
                title: 'stage',
                value: lead.lead_stage ? lead.lead_stage.lookupItemName : 'N/A',
              },
              // {
              //   iconClasses: 'mdi mdi-offer',
              //   title: 'status',
              //   value: lead.status ? lead.status.lookupItemName : 'N/A',
              // },
              {
                iconClasses: 'mdi mdi-account-box',
                title: 'contact-name',
                value: lead.contact_name ? lead.contact_name.name : 'N/A',
              },

              {
                iconClasses: 'mdi mdi-table-furniture',
                title: 'equipments-and-fixtures',
                value:
                  (lead.fitting_and_fixtures &&
                    lead.fitting_and_fixtures.map(
                      (element, index) =>
                        `${element.lookupItemName}${(index < lead.fitting_and_fixtures.length - 1 && ',') || ''
                        } `
                    )) ||
                  'N/A',
              },
              {
                iconClasses: 'mdi mdi-window-open-variant',
                title: 'views',
                value:
                  (lead.view &&
                    ((Array.isArray(lead.view) &&
                      lead.view.map(
                        (element, index) =>
                          `${element.lookupItemName}${(index < lead.view.length - 1 && ',') || ''} `
                      )) ||
                      (typeof lead.view === 'object' && lead.view.lookupItemName) ||
                      'N/A')) ||
                  'N/A',
              },
              {
                iconClasses: 'mdi mdi-laptop-windows',
                title: 'developers',
                value:
                  (lead.developers &&
                    lead.developers.map(
                      (element, index) =>
                        `${element.lookupItemName}${(index < lead.developers.length - 1 && ',') || ''
                        } `
                    )) ||
                  'N/A',
              },
              // {
              //   iconClasses: 'mdi mdi-star-half-full',
              //   title: 'rating',
              //   value: lead.rating ? lead.rating.lookupItemName : 'N/A',
              // },
            ],
            ...lead,
          };
        }),
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

  useEffect(() => {
    if (isSearchAvite)
      getContactLeadsData();
  }, [contactsFilterSearchDto]);

  useEffect(() => {
    dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        LeadTypeSaleFilterLeaseDate: dateFilter || dateRangeDefault
      })
    );
  }, [dateFilter]);

  const searchClicked = async () => {
    if (searchData.length === 0) return;
    localStorage.setItem('LeadsLeaseFilter', JSON.stringify(searchData));
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
          `/home/lead-lease/lead-profile-edit?formType=${item.leadTypeId}&id=${item.id}`
        );
      } else if (actionEnum === TableActions.editText.key)
        GlobalHistory.push(`/home/lead-lease/edit?formType=${item.leadTypeId}&id=${item.id}`);
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
  // const detailedCardActionClicked = useCallback(
  //   (actionEnum) => (event) => {
  //     event.stopPropagation();
  //     if (actionEnum === ActionsEnum.reportEdit.key) {
  //       if (
  //         loginResponse
  //         && loginResponse.permissions
  //           .map((item) =>
  // item.permissionsId === LeadsPermissions.UpdateLeads.permissionsId)
  //           .includes(true)
  //       ) {
  //       }
  //     } else if (actionEnum === ActionsEnum.reportView.key) {
  //       if (
  //         loginResponse
  //         && loginResponse.permissions
  //           .map((item) => item.permissionsId === LeadsPermissions.ReadLeads.permissionsId)
  //           .includes(true)
  //       ) {
  //       }
  //     }
  //   },
  //   []
  // );
  const detailedCardSideActionClicked = useCallback(
    (actionEnum, activeData) => async (event) => {
      dispatch(ActiveItemActions.activeItemRequest(activeData));
      localStorage.setItem('leadStatus', JSON.stringify(activeData.status));
      event.stopPropagation();
      if (actionEnum === ActionsEnum.reportEdit.key) {
        GlobalHistory.push(
          `/home/lead-lease/edit?formType=${activeData.leadTypeId}&id=${activeData.id}`
        );
      } else if (actionEnum === ActionsEnum.folder.key) {
        GlobalHistory.push(
          `/home/lead-lease/lead-profile-edit?formType=${activeData.leadTypeId}&id=${activeData.id}`
        );
      } else if (actionEnum === ActionsEnum.matching.key) {
        GlobalHistory.push(
          `/home/lead-lease/lead-profile-edit?formType=${activeData.leadTypeId}&id=${activeData.id
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
        leadsLeaseFilter: {
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
    GlobalHistory.push(`/home/lead-lease/add?formType=${formType}`);
  };
  const getIsSelected = useCallback(
    (row) => checkedCardsIds && checkedCardsIds.findIndex((item) => item === row.id) !== -1,
    [checkedCards]
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
  const onFilterValuesChanged = (newValue) => {
    setLeadsTableFilter(newValue);
  };

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
    const data = localStorage.getItem('LeadsLeaseFilter');

    if (data) {
      setSearchData(JSON.parse(data));
      searchchachedClickedWithoutFilter(JSON.parse(data));
    } else
      getLeadsData();
  }, []);

  useEffect(() => {
    if (isFirst1) {
      if (searchData && searchData.length === 0) {
        localStorage.removeItem('LeadsLeaseFilter');
        getLeadsData();
      } else
        localStorage.setItem('LeadsLeaseFilter', JSON.stringify(searchData));
    } else
      setFirst1(true);
  }, [searchData]);

  useEffect(() => {
    if (!isFirst) setFirst(true);
    else {
      const data = localStorage.getItem('LeadsLeaseFilter');
      if (data)
        searchchachedClickedWithoutFilter(JSON.parse(data));
      else
        getLeadsData();
    }
  }, [filterSearchDto, filter, leadType, orderBy, leadsTableFilter, Status, referred, dateFilter]);
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

  const getIsSelectedAll = useCallback(
    () => {
      const returnSelect = (checkedCardsIds &&
        detailsLeadsList.result.findIndex((item) => !checkedCardsIds.includes(item.id)) === -1) || false;
      return returnSelect;
    }
  );

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
              <PermissionsComponent
                permissionsList={Object.values(LeadsLeasePermissions)}
                permissionsId={LeadsLeasePermissions.AddNewLead.permissionsId}
              >
                {/* {loginResponse &&
                loginResponse.permissions
                  .map((item) => item.permissionsId === LeadsPermissions.CreateLeads.permissionsId)
                  .includes(true) && ( */}
                <ActionsButtonsComponent
                  isDisabled={activeSelectedAction === 'merge' ? checkedCards.length < 2 : false}
                  withType
                  typeData={[
                    { id: '1', name: 'owner' },
                    { id: '2', name: 'seeker' },
                  ]}
                  enableImport
                  enableCloseLeads
                  enablereassignLeads
                  checkDisable={checkBulkDesabled}
                  onFormTypeSelectChanged={onFormTypeSelectChanged}
                  onActionsButtonClicked={onActionsButtonClicked}
                  onActionButtonChanged={onActionButtonChanged}
                  closeAction={isCloseAction}
                  withCheckbox={activeSelectedAction === 'close-leads' && (activeActionType === ViewTypesEnum.cards.key || activeActionType === ViewTypesEnum.cardsExpanded.key)}
                  onSelectAllClicked={onSelectAllClicked}
                />
              </PermissionsComponent>
            </div>
            <PermissionsComponent
              permissionsList={Object.values(LeadsLeasePermissions)}
              permissionsId={LeadsLeasePermissions.ViewAndSearchInLeaseLeads.permissionsId}
            >
              <div className='section autocomplete-section'>
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
                      inputPlaceholder='search-contacts'
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
                    <SelectComponet
                      data={[
                        { id: 'Tenant', name: 'tenant' },
                        { id: 'Landlord', name: 'landlord' },
                      ]}
                      emptyItem={{ value: 0, text: 'select-lead-type', isDisabled: false }}
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
                          selectedValues={orderFilter.ReferredByLeadTypeLeaseFilter}
                          getOptionSelected={(option) => option.id === orderFilter.ReferredByLeadTypeLeaseFilter.id || ''}
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
                                ReferredByLeadTypeLeaseFilter: {
                                  id: (newValue && newValue.id) || '',
                                  fullName: (newValue && newValue.fullName) || ''
                                } || ''
                              })
                            );
                            setReferred((item) => ({ ...item, by: (newValue && newValue.fullName) || null }));
                          }}
                        />

                      </div>
                      <div className='agentSection1'>
                        <AutocompleteComponent
                          idRef='ReferredToRef'
                          inputPlaceholder={t(`${translationPath}ReferredTo`)}
                          data={(allReferred && allReferred.result) || []}
                          selectedValues={orderFilter.ReferredToLeadTypeLeaseFilter}
                          getOptionSelected={(option) => option.id === orderFilter.ReferredToLeadTypeLeaseFilter.id || ''}
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
                                ReferredToLeadTypeLeaseFilter: {
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
                          data={(allMediaName) || []}
                          selectedValues={orderFilter.MediaDetailsLeadTypeLeaseFilter}
                          getOptionSelected={(option) => option.lookupItemId === orderFilter.MediaDetailsLeadTypeLeaseFilter.lookupItemId || ''}
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
                                MediaDetailsLeadTypeLeaseFilter: {
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
              </div>
            </PermissionsComponent>
          </div>
          <div className='d-flex px-2'>
            <PermissionsComponent
              permissionsList={Object.values(LeadsLeasePermissions)}
              permissionsId={LeadsLeasePermissions.ViewAndSearchInLeaseLeads.permissionsId}
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
                    emptyItem={{ value: null, text: 'select-sort-by', isDisabled: false }}
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
              {/* {loginResponse &&
                loginResponse.permissions
                  .map((item) => item.permissionsId === LeadsPermissions.ReadLeads.permissionsId)
                  .includes(true) && ( */}
              <PermissionsComponent
                permissionsList={Object.values(LeadsLeasePermissions)}
                permissionsId={LeadsLeasePermissions.ViewAndSearchInLeaseLeads.permissionsId}
              >
                <LeadsCardsComponent
                  data={detailsLeadsList}
                  isExpanded={isExpanded}
                  onCardClicked={onCardClick}
                  onFooterActionsClicked={detailedCardSideActionClicked}
                  onActionClicked={detailedCardActionClicked}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onCardCheckboxClick={cardCheckboxClicked}
                  activeCard={activeCard}
                  relodedata={reloadData}
                  notExpandedMax={3}
                  selectedCards={checkedCards}
                  withCheckbox={activeSelectedAction === 'merge' || activeSelectedAction === 'close-leads' || activeSelectedAction === 'reassign-leads'}
                  activeSelectedAction={activeSelectedAction}
                // isCheckBoxDisabled={
                //   activeSelectedAction === 'merge' ? checkedCards.length >= 2 : false
                // }
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
            permissionsList={Object.values(LeadsLeasePermissions)}
            permissionsId={LeadsLeasePermissions.ViewAndSearchInLeaseLeads.permissionsId}
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
              setCheckedCards={setCheckedCards}
            />
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
