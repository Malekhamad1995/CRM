import React, {
  useState, useCallback, useEffect, useRef
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { ButtonBase } from '@material-ui/core';
import {
  sideMenuIsOpenUpdate,
  sideMenuComponentUpdate,
  GlobalHistory,
  bottomBoxComponentUpdate,
  getIsAllowedPermission,
  WhatsAppMessage,
  showError
} from '../../../Helper';
import {
  ActionsButtonsComponent,
  ViewTypes,
  AutocompleteComponent,
  SelectComponet,
  Spinner,
  PaginationComponent,
  PermissionsComponent,
  Inputs,
} from '../../../Components';
import {
  ActionsEnum,
  ViewTypesEnum,
  ActionsButtonsEnum,
  FormsIdsEnum,
  TableFilterOperatorsEnum,
  TableFilterTypesEnum,
  LeadsClassTypesEnum,
} from '../../../Enums';
import {
  CardDetailsComponent,
  ContactsCardsComponent,
  ContactsImportDialog,
  ContactsMapper,
  ContactsTableComponent,
} from './ContactsUtilities';
import { GetAllSearchableFormFieldsByFormId, GetAdvanceSearchContacts } from '../../../Services';
import { ActiveItemActions } from '../../../store/ActiveItem/ActiveItemActions';
import { GlobalOrderFilterActions } from '../../../store/GlobalOrderFilter/GlobalOrderFilterActions';
import { useTitle } from '../../../Hooks';
import { ContactsActionDialogsComponent } from './ContactsUtilities/ContactsActionDialogsComponent/ContactsActionDialogsComponent';
import { ContactsPermissions } from '../../../Permissions';

const parentTranslationPath = 'ContactsView';
const translationPath = '';

export const ContactsView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];
  const [contactTableFilter, setContactTableFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirst, setFirst] = useState(false);
  const [LeadClassesFilter, setLeadClassesFilter] = useState([]);
  const [isFirst1, setFirst1] = useState(false);
  const dispatch = useDispatch();
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const [isOpenContactsActionDialog, setisOpenContactsActionDialog] = useState(false);
  const [detailedCardAction, setdetailedCardAction] = useState(() => ({
    actionEnum: '',
    item: '',
  }));
  const detailedCardActionClicked = useCallback(
    (actionEnum, item) => (event) => {
      event.stopPropagation();
      setisOpenContactsActionDialog(true);
      setdetailedCardAction({
        actionEnum,
        item,
      });
      if (actionEnum === 'whatsappSolid') {
        const el = document.createElement('a');
        if (item && item.mobile && item.mobile.phone) {
          el.href = WhatsAppMessage(item && item.mobile && item.mobile.phone);
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
  const [, setOrderByToggler] = useState(false);
  const [activeSelectedAction, setActiveSelectedAction] = useState('');
  const [isOpenImportDialog, setIsOpenImportDialog] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [selectedSeachIn, setSelectedSeachIn] = useState([]);

  const seachInChangedHandler = (newValue) => {
    setSelectedSeachIn((items) => {
      const previousSelectAllIndex = items.findIndex((item) => item === -1);
      const currentSelectAllIndex = newValue && newValue.findIndex((item) => item === -1);
      if (
        (previousSelectAllIndex === -1 && currentSelectAllIndex !== -1) ||
        (previousSelectAllIndex === -1 &&
          currentSelectAllIndex === -1 &&
          newValue.length === Object.values(LeadsClassTypesEnum).length)
      ) {
        const localSelected = [-1];
        Object.values(LeadsClassTypesEnum).map((item) => localSelected.push(item.key));
        return localSelected;
      }
      if (
        previousSelectAllIndex !== -1 &&
        currentSelectAllIndex !== -1 &&
        newValue.length - 1 !== Object.values(LeadsClassTypesEnum).length
      ) {
        const localSelected = [...newValue];
        localSelected.splice(currentSelectAllIndex, 1);
        return localSelected;
      }
      if (previousSelectAllIndex !== -1 && currentSelectAllIndex === -1) return [];
      setLeadClassesFilter([...newValue]);
      return [...newValue];
    });
  };

  const [selectedOrderBy, setSelectedOrderBy] = useState(
    (pathName === 'contacts' && {
      filterBy: orderFilter.contactsFilter.filterBy,
      orderBy: orderFilter.contactsFilter.orderBy,
    }) ||
    (pathName === 'contact-lease' && {
      filterBy: orderFilter.contactsLeaseFilter.filterBy,
      orderBy: orderFilter.contactsLeaseFilter.orderBy,
    }) ||
    (pathName === 'contact-sales' && {
      filterBy: orderFilter.contactsSalesFilter.filterBy,
      orderBy: orderFilter.contactsSalesFilter.orderBy,
    }) ||
    (pathName === 'contact-property-management' && {
      filterBy: orderFilter.contactsFilter.filterBy,
      orderBy: orderFilter.contactsFilter.orderBy,
    }) ||
    (pathName === 'Contacts-CRM' && {
      filterBy: orderFilter.contactsCrmFilter.filterBy,
      orderBy: orderFilter.contactsCrmFilter.orderBy,
    })
  );
  const [sortBy, setSortBy] = useState(selectedOrderBy.filterBy ? selectedOrderBy : {});
  const [checkedCards, setCheckedCards] = useState([]);
  const [checkedCardsIds, setCheckedCardsIds] = useState([]);
  const [detailsContactsList, setDetailsContactsList] = useState(() => ({
    result: [],
    totalCount: 0,
  }));
  // this one to change searchable form fields
  const [filterFormType, setFilterFormType] = useState(1);
  // this one to change get contacts by type
  const [activeFormType, setActiveFormType] = useState(0);
  const [searchableFormFields, setSearchableFormFields] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [filterSearchDto, setFilterSearchDto] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchedItem, setSearchedItem] = useState('');
  const searchTimer = useRef(null);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
  });
  useTitle(t(`${translationPath}contacts`));

  const orderBySubmitted = (event) => {
    event.preventDefault();
    if (!selectedOrderBy.filterBy || !selectedOrderBy.orderBy) {
      if (sortBy.filterBy || sortBy.orderBy) setSortBy({});
      return;
    }
    if (pathName === 'contact-sales') {
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          contactsSalesFilter: {
            filterBy: selectedOrderBy.filterBy,
            orderBy: selectedOrderBy.orderBy,
          },
        })
      );
    } else if (pathName === 'contact-lease') {
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          contactsLeaseFilter: {
            filterBy: selectedOrderBy.filterBy,
            orderBy: selectedOrderBy.orderBy,
          },
        })
      );
    } else if (pathName === 'Contacts-CRM') {
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          contactsCrmFilter: {
            filterBy: selectedOrderBy.filterBy,
            orderBy: selectedOrderBy.orderBy,
          },
        })
      );
    } else {
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          contactsFilter: {
            filterBy: selectedOrderBy.filterBy,
            orderBy: selectedOrderBy.orderBy,
          },
        })
      );
    }
    setSortBy({
      filterBy: selectedOrderBy.filterBy,
      orderBy: selectedOrderBy.orderBy,
    });
    setOrderByToggler(false);
  };

  const searchHandler = (data) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const newV = [{
        key: 'All',
        title: 'All',
        value: data
      }];
      setSearchData([...newV]);
      setFilterSearchDto({
        All:
          [
            {
              value: data
            }
          ]
      });
    }, 1300);
  };
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
    setSearchedItem('');
    onFilterFormTypeSelectChanged(value);
  };
  const getAllSearchableFormFieldsByFormId = useCallback(async () => {
    const result = await GetAllSearchableFormFieldsByFormId(filterFormType);
    if (!((result && result.data && result.data.ErrorId) || !result)) {
      let list = [];
      list.push({ key: 'All', title: 'All' });
      list.push({ key: 'Ids', title: 'Contact Id' });
      list.push({ key: 'lead_id', title: 'Lead Id' });
      const res =
        (Array.isArray(result) &&
          result
            .filter((item) => item.isSearchable)
            .map((item) => ({ key: item.searchableKey, title: item.formFieldTitle }))) ||
        [];
      list = [...list, ...res];
      setSearchableFormFields(list);
    } else setSearchableFormFields([]);
  }, [filterFormType]);

  const getContactsData = useCallback(async (f) => {
    setIsLoading(true);
    const localFilterDto = f || filterSearchDto || {};
    if (activeFormType) {
      localFilterDto.contact_type_id = [
        { searchType: TableFilterOperatorsEnum.equal.key, value: activeFormType },
      ];
    }
    if (contactTableFilter) {
      Object.values(contactTableFilter)
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
    const res = await GetAdvanceSearchContacts(filter, {
      criteria: localFilterDto,
      ...sortBy,
      fromDate: null,
      toDate: null,
      LeadClasses: LeadClassesFilter,
    });
    if (!(res && res.status && res.status !== 200)) {
      setDetailsContactsList({
        result: ((res && res.result) || []).map((item) => ContactsMapper(item)),
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setDetailsContactsList({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [activeFormType, contactTableFilter, filter, filterSearchDto, sortBy, LeadClassesFilter]);

  const searchClicked = async () => {
    if (searchData.length === 0) return;

    localStorage.setItem('ContactFilter', JSON.stringify(searchData));
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
    getContactsData(oldfilter);
  };
  const displayedLabel = (option) => `${option.title}: ${searchInputValue}`;
  const disabledOptions = (option) => option.disabledOnSelect;
  const chipsLabel = (option) => `${option.title}: ${option.value}`;
  const inputValueChanged = (event, newInputValue) => {
    setSearchInputValue(newInputValue);
  };
  const onActionButtonChanged = (activeAction) => {
    setActiveSelectedAction(activeAction);
    setCheckedCards([]);
    setCheckedCardsIds([]);
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
  const onActionsButtonClicked = useCallback(
    (activeAction) => {
      if (activeAction === ActionsButtonsEnum[3].id) setIsOpenImportDialog(true);
      if (activeAction === ActionsButtonsEnum[2].id) {
        if (pathName === 'Contacts-CRM') {
          GlobalHistory.push(
            `/home/Contacts-CRM/merge?firstId=${checkedCardsIds[0]}&secondId=${checkedCardsIds[1]}&userTypeId=${checkedCards[0].userTypeId}`
          );
        } else if (pathName === 'contact-property-management') {
          GlobalHistory.push(
            `/home/contact-property-management/merge?firstId=${checkedCardsIds[0]}&secondId=${checkedCardsIds[1]}&userTypeId=${checkedCards[0].userTypeId}`
          );
        }
      }
    },
    [checkedCards, checkedCardsIds, pathName]
  );
  const detailedCardSideActionClicked = useCallback(
    (actionEnum, activeData) => async (event) => {
      dispatch(ActiveItemActions.activeItemRequest(activeData));
    event.stopPropagation();
      if (actionEnum === ActionsEnum.reportEdit.key) {
        if (pathName === 'contact-sales') {
          GlobalHistory.push(
            `/home/contact-sales/edit?formType=${activeData.userTypeId}&id=${activeData.id}`
          );
        } else if (pathName === 'contact-lease') {
          GlobalHistory.push(
            `/home/contact-lease/edit?formType=${activeData.userTypeId}&id=${activeData.id}`
          );
        } else if (pathName === 'contact-property-management') {
          GlobalHistory.push(
            `/home/contact-property-management/edit?formType=${activeData.userTypeId}&id=${activeData.id}`
          );
        } else if (pathName === 'Contacts-CRM') {
          GlobalHistory.push(
            `/home/Contacts-CRM/edit?formType=${activeData.userTypeId}&id=${activeData.id}`
          );
        } else {
          GlobalHistory.push(
            `/home/contacts/edit?formType=${activeData.userTypeId}&id=${activeData.id}`
          );
        }
      } else if (actionEnum === ActionsEnum.folder.key) {
        if (pathName === 'contact-sales') {
          GlobalHistory.push(
            `/home/contact-sales/contact-profile-edit?formType=${activeData.userTypeId}&id=${activeData.id}`
          );
        } else if (pathName === 'contact-lease') {
          GlobalHistory.push(
            `/home/contact-lease/contact-profile-edit?formType=${activeData.userTypeId}&id=${activeData.id}`
          );
        } else if (pathName === 'contact-property-management') {
          GlobalHistory.push(
            `/home/contact-property-management/contact-profile-edit?formType=${activeData.userTypeId}&id=${activeData.id}`
          );
        } else if (pathName === 'Contacts-CRM') {
          GlobalHistory.push(
            `/home/Contacts-CRM/contact-profile-edit?formType=${activeData.userTypeId}&id=${activeData.id}`
          );
        } else {
          GlobalHistory.push(
            `/home/contacts/contact-profile-edit?formType=${activeData.userTypeId}&id=${activeData.id}`
          );
        }
      }
    },
    [dispatch, pathName]
  );
  const filterByChanged = (value) => {
    setSelectedOrderBy((item) => ({ ...item, filterBy: value }));
  };
  const orderByChanged = (value) => {
    setSelectedOrderBy((item) => ({ ...item, orderBy: value }));
  };

  const reloadData = useCallback(() => {
    setFilter((item) => ({ ...item, pageIndex: 0 }));
    setActiveCard(null);
    getContactsData();
  }, [getContactsData]);

  const onCardClick = useCallback(
    (item, selectedIndex) => (event) => {
      event.stopPropagation();
      event.preventDefault();
      setActiveCard(item);
      dispatch(ActiveItemActions.activeItemRequest(item));
      sideMenuComponentUpdate(
        <CardDetailsComponent
          activeData={detailsContactsList.result[selectedIndex]}
          cardDetailsActionClicked={detailedCardSideActionClicked}
          loginResponse={loginResponse}
          onActionClicked={detailedCardActionClicked}
          relodedata={reloadData}
        />
      );
      sideMenuIsOpenUpdate(true);
    },
    [detailedCardActionClicked, detailedCardSideActionClicked,
      detailsContactsList.result, loginResponse, reloadData]
  );
  const onRowClicked = useCallback(
    (item, rowIndex) => {
      setActiveCard(item);
      sideMenuComponentUpdate(
        <CardDetailsComponent
          relodedata={reloadData}
          loginResponse={loginResponse}
          onActionClicked={detailedCardActionClicked}
          activeData={detailsContactsList.result[rowIndex]}
          cardDetailsActionClicked={detailedCardSideActionClicked}
        />
      );
      sideMenuIsOpenUpdate(true);
    },
    [detailedCardActionClicked, detailedCardSideActionClicked,
      detailsContactsList.result, loginResponse, reloadData]
  );
  const onFormTypeSelectChanged = (formType) => {
    if (pathName === 'contact-sales')
      GlobalHistory.push(`/home/contact-sales/add?formType=${formType}`);
    else if (pathName === 'contact-lease')
      GlobalHistory.push(`/home/contact-lease/add?formType=${formType}`);
    else if (pathName === 'contact-property-management')
      GlobalHistory.push(`/home/contact-property-management/add?formType=${formType}`);
    else if (pathName === 'Contacts-CRM')
      GlobalHistory.push(`/home/Contacts-CRM/add?formType=${formType}`);
    else GlobalHistory.push(`/home/contacts/add?formType=${formType}`);
  };
  const onFilterValuesChanged = (newValue) => {
    setContactTableFilter(newValue);
  };

  const getIsChecked = (item) =>
    selectedSeachIn.findIndex((element) => element === item.key) !== -1;

  useEffect(() => {
    getAllSearchableFormFieldsByFormId();
  }, [filterFormType, getAllSearchableFormFieldsByFormId]);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={detailsContactsList.totalCount}
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
    const data = localStorage.getItem('ContactFilter');

    if (data) {
      setSearchData(JSON.parse(data));
      searchchachedClickedWithoutFilter(JSON.parse(data));
    } else
      getContactsData();
  }, []);

  useEffect(() => {
    if (isFirst1) {
      if (searchData && searchData.length === 0) {
        localStorage.removeItem('ContactFilter');
        getContactsData();
      } else
        localStorage.setItem('ContactFilter', JSON.stringify(searchData));
    } else
      setFirst1(true);
  }, [searchData]);

  useEffect(() => {
    if (!isFirst) setFirst(true);
    else {
      const data = localStorage.getItem('ContactFilter');
      if (data)
        searchchachedClickedWithoutFilter(JSON.parse(data));
      else
        getContactsData();
    }
  }, [activeFormType, contactTableFilter, filter, filterSearchDto, sortBy, LeadClassesFilter]);

  return (
    <div className='view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section'>
              <ActionsButtonsComponent
                permissionsList={Object.values(ContactsPermissions)}
                addPermissionsId={ContactsPermissions.AddNewContact.permissionsId}
                selectPermissionsId={[
                  ContactsPermissions.ImportContact.permissionsId,
                  ContactsPermissions.MergeContacts.permissionsId,
                ]}
                enableMerge={getIsAllowedPermission(
                  Object.values(ContactsPermissions),
                  loginResponse,
                  ContactsPermissions.MergeContacts.permissionsId
                )}
                enableImport={getIsAllowedPermission(
                  Object.values(ContactsPermissions),
                  loginResponse,
                  ContactsPermissions.ImportContact.permissionsId
                )}
                withType
                typeData={[
                  { id: '1', name: 'individual' },
                  { id: '2', name: 'corporate' },
                ]}
                onFormTypeSelectChanged={onFormTypeSelectChanged}
                onActionsButtonClicked={onActionsButtonClicked}
                onActionButtonChanged={onActionButtonChanged}
              />
            </div>
            <div className='section autocomplete-section'>
              <PermissionsComponent
                permissionsList={Object.values(ContactsPermissions)}
                permissionsId={ContactsPermissions.ViewAndSearchContacts.permissionsId}
              >
                <div className='d-flex-column px-2 w-100 p-relative'>
                  <div className='w-100 p-relative'>
                    <AutocompleteComponent
                      data={
                        searchableFormFields &&
                        searchableFormFields.map((item) => ({
                          key: item.key,
                          title: item.title,
                        }))
                      }
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
                  </div>
                  <div className='d-flex-v-center-h-between pl-5-reversed '>
                    <SelectComponet
                      data={Object.values(FormsIdsEnum).filter((item) => item.page === 'contacts')}
                      emptyItem={{ value: 0, text: 'select-type', isDisabled: false }}
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
                    <div className='d-inline-flex section-select '>
                      <div className='Contacts-View-select'>
                        <SelectComponet
                          getIsChecked={getIsChecked}
                          singleIndeterminate={
                            selectedSeachIn &&
                            selectedSeachIn.length > 0 &&
                            Object.values(LeadsClassTypesEnum).length > 0 &&
                            Object.values(LeadsClassTypesEnum).length > selectedSeachIn.length
                          }
                          singleChecked={
                            selectedSeachIn &&
                            selectedSeachIn.length > 0 &&
                            Object.values(LeadsClassTypesEnum).length === selectedSeachIn.length - 1
                          }
                          renderValue={(value) =>
                            (selectedSeachIn.length > 0 && (
                              <span>
                                {value.map((option, mapIndex) => {
                                  let toReturn = '';
                                  const optionIndex = Object.values(LeadsClassTypesEnum).findIndex((element) => element.key === option);
                                  if (optionIndex !== -1) {
                                    toReturn += Object.values(LeadsClassTypesEnum)[optionIndex].value;
                                    if (mapIndex < value.length - 1) toReturn += ', ';
                                  }
                                  return toReturn;
                                })}
                              </span>
                            )) || <span>{t(`${translationPath}select-Leads-Class`)}</span>}
                          data={Object.values(LeadsClassTypesEnum)}
                          value={selectedSeachIn}
                          multiple
                          isWithCheckAll
                          valueInput='key'
                          keyLoopBy='key'
                          textInput='value'
                          onSelectChanged={seachInChangedHandler}
                          wrapperClasses='w-auto'
                          themeClass='theme-transparent'
                          idRef='headerSearchRef'
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          translationPathForData={translationPath}
                        />
                      </div>
                    </div>
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
                </div>
                <ViewTypes onTypeChanged={onTypeChanged} className='mb-3' />
              </PermissionsComponent>
            </div>
          </div>
          <PermissionsComponent
            permissionsList={Object.values(ContactsPermissions)}
            permissionsId={ContactsPermissions.ViewAndSearchContacts.permissionsId}
          >
            <div className='d-flex px-2'>
              <span className='mx-2 mt-1'>{t(`${translationPath}contacts`)}</span>
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
            </div>
          </PermissionsComponent>
        </div>
        {activeActionType !== ViewTypesEnum.tableView.key && (
          <PermissionsComponent
            permissionsList={Object.values(ContactsPermissions)}
            permissionsId={ContactsPermissions.ViewAndSearchContacts.permissionsId}
          >
            <div className='body-section'>
              <ContactsCardsComponent
                data={detailsContactsList}
                isExpanded={isExpanded}
                onCardClicked={onCardClick}
                onFooterActionsClicked={detailedCardSideActionClicked}
                onActionClicked={detailedCardActionClicked}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                withCheckbox={activeSelectedAction === 'merge'}
                onCardCheckboxClick={cardCheckboxClicked}
                activeCard={activeCard}
                selectedCards={checkedCards}
                isCheckBoxDisabled={
                  activeSelectedAction === 'merge' ? checkedCards.length >= 2 : false
                }
              />
            </div>
          </PermissionsComponent>
        )}
        {
          // loginResponse &&
          //   loginResponse.permissions &&
          //   loginResponse.permissions
          //     .map((item) => item.permissionsId ===
          //  ContactsPermissions.ReadContacts.permissionsId)
          //     .includes(true) &&
          activeActionType === ViewTypesEnum.tableView.key && (
            <PermissionsComponent
              permissionsList={Object.values(ContactsPermissions)}
              permissionsId={ContactsPermissions.ViewAndSearchContacts.permissionsId}
            >
              <ContactsTableComponent
                filter={filter}
                pathName={pathName}
                reloadData={reloadData}
                onRowClick={onRowClicked}
                checkedCards={checkedCards}
                setCheckedCards={setCheckedCards}
                checkedCardsIds={checkedCardsIds}
                onActionClicked={detailedCardActionClicked}
                contactTableFilter={contactTableFilter}
                onFilterValuesChanged={onFilterValuesChanged}
                onPageSizeChanged={onPageSizeChanged}
                setCheckedCardsIds={setCheckedCardsIds}
                onPageIndexChanged={onPageIndexChanged}
                detailsContactsList={detailsContactsList}
                activeSelectedAction={activeSelectedAction}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
              />
            </PermissionsComponent>
          )
        }
      </div>
      <ContactsImportDialog
        isOpen={isOpenImportDialog}
        isOpenChanged={() => setIsOpenImportDialog(false)}
      />
      <ContactsActionDialogsComponent
        isOpen={isOpenContactsActionDialog}
        isOpenChanged={() => setisOpenContactsActionDialog(false)}
        actionEnum={detailedCardAction.actionEnum}
        item={detailedCardAction.item}
        translationPath=''
        parentTranslationPath='ContactsView'
      />
    </div>
  );
};
