import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { ButtonBase } from '@material-ui/core';
import {
  sideMenuIsOpenUpdate,
  sideMenuComponentUpdate,
  GlobalHistory,
  bottomBoxComponentUpdate,
  getIsAllowedPermission,
} from '../../../Helper';
import {
  ActionsButtonsComponent,
  ViewTypes,
  AutocompleteComponent,
  SelectComponet,
  Spinner,
  PaginationComponent,
  PermissionsComponent,
} from '../../../Components';
import {
  ActionsEnum,
  ViewTypesEnum,
  ContactTypeEnum,
  ActionsButtonsEnum,
  TableActions,
  PropertyStatusEnum,
  TableFilterTypesEnum,
  TableFilterOperatorsEnum,
} from '../../../Enums';
import {
  CardDetailsComponent,
  PropertiesCardsComponent,
  PropertiesTableComponent,
} from './PropertiesUtilities';
import {
  GetAllSearchableFormFieldsByFormId,
  GetAdvanceSearchProperties,
  GetAdvanceSearchPropertyManagement,
} from '../../../Services';
import { PropertiesImportDialog } from './PropertiesUtilities/Dialogs/PropertiesImportDialog/PropertiesImportDialog';
import { ActiveItemActions } from '../../../store/ActiveItem/ActiveItemActions';
import { useTitle } from '../../../Hooks';
import { GlobalOrderFilterActions } from '../../../store/GlobalOrderFilter/GlobalOrderFilterActions';
import { PropertiesPermissionsCRM } from '../../../Permissions/PropertiesPermissions';
import { PropertyManagementListPermissions } from '../../../Permissions/PropertyManagement/PropertyManagementList.Permissions';

const parentTranslationPath = 'PropertiesView';
const translationPath = '';

export const PropertiesView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];
  const isPropertyManagementView = pathName === 'properties';
  const dispatch = useDispatch();
  const [propertiesTableFilter, setPropertiesTableFilter] = useState(null);
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirst, setFirst] = useState(false);
  const [isFirst1, setFirst1] = useState(false);
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const [activeActionType, setActiveActionType] = useState(ViewTypesEnum.cards.key);
  const [isExpanded, setIsExpanded] = useState(
    activeActionType === ViewTypesEnum.cardsExpanded.key
  );
  const [, setOrderByToggler] = useState(false);
  const [isSelect] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [isOpenImportDialog, setIsOpenImportDialog] = useState(false);
  const [selectedOrderBy, setSelectedOrderBy] = useState(
    (pathName === 'properties-lease' && {
      filterBy: orderFilter.propertiesLeaseFilter.filterBy,
      orderBy: orderFilter.propertiesLeaseFilter.orderBy,
    }) ||
    (pathName === 'properties-sales' && {
      filterBy: orderFilter.propertiesSalesFilter.filterBy,
      orderBy: orderFilter.propertiesSalesFilter.orderBy,
    }) ||
    (pathName === 'properties' && {
      filterBy: orderFilter.propertiesSalesFilter.filterBy,
      orderBy: orderFilter.propertiesSalesFilter.orderBy,
    }) ||
    (pathName === 'Properties-CRM' && {
      filterBy: orderFilter.propertiesCrmFilter.filterBy,
      orderBy: orderFilter.propertiesCrmFilter.orderBy,
    })
  );

  const [orderBy, setOrderBy] = useState(selectedOrderBy.filterBy ? selectedOrderBy : {});
  const [checkedDetailedCards, setCheckedDetailedCards] = useState([]);
  const [detailsPropertiesList, setDetailsPropertiesList] = useState(() => ({
    result: [],
    totalCount: 0,
  }));
  const [searchableFormFields, setSearchableFormFields] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [filterSearchDto, setFilterSearchDto] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [activeFormType, setActiveFormType] = useState(0);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
  });
  // End New Code
  useTitle(t(`${translationPath}properties`));

  const changeActiveFormType = (value) => {
    setActiveFormType(value);
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

  const getAllSearchableFormFieldsByFormId = useCallback(async () => {
    const result = await GetAllSearchableFormFieldsByFormId(3);
    if (!(result && result.status && result.status !== 200)) {
      const list = [];
      list.push({ key: 'Ids', title: 'Propertie Id' });
      result.filter((item) => item.isSearchable)
        .map((item) => (
          list.push({
            key: item.searchableKey,
            title: item.formFieldTitle,
          })));
      setSearchableFormFields(list);
    } else setSearchableFormFields([]);
  }, []);
  const getPropertiesData = useCallback(async (f) => {
    setIsLoading(true);
    const localFilterDto = f || filterSearchDto || {};
    if (activeFormType) {
      localFilterDto['property_plan.lookupItemId'] = [
        { searchType: TableFilterOperatorsEnum.equal.key, value: activeFormType },
      ];
    }
    if (propertiesTableFilter) {
      Object.values(propertiesTableFilter)
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
    const res =
      pathName === 'properties' ?
        await GetAdvanceSearchPropertyManagement(filter, {
          criteria: localFilterDto,
          ...orderBy,
        }) :
        await GetAdvanceSearchProperties(filter, {
          criteria: localFilterDto,
          ...orderBy,
        });
    if (!(res && res.status && res.status !== 200)) {
      setDetailsPropertiesList({
        result: ((res && res.result) || []).map((item) => {
          const { property } = item;
          return {
            id: item.propertyId,
            imagePath: property.property_images && property.property_images['Cover Images'],
            name: `${property.property_name}`,
            updateDate: item.updateOn,
            type: ContactTypeEnum.corporate.value,
            propertyTypeId: property.property_type && property.property_type.lookupItemId,
            propertyType: property.property_type ? property.property_type.lookupItemName : '',
            progress:
              typeof property.data_completed === 'string' && property.data_completed.includes('%') ?
                +property.data_completed.substr(0, property.data_completed.length - 1) :
                +property.data_completed,
            progressWithPercentage:
              typeof property.data_completed !== 'string' ?
                `${property.data_completed}%` :
                property.data_completed,
            propertyStatus:
              (property.property_plan &&
                PropertyStatusEnum[property.property_plan.lookupItemName]) ||
              'N/A',
            creationDate: item.createdOn,
            allpropertyImages: item.propertyImages,
            details: [
              {
                iconClasses: 'mdi mdi-account-circle',
                title: 'property-owner',
                value: property.property_owner ? property.property_owner.name : 'N/A',
              },
              {
                iconClasses: 'mdi mdi-domain',
                title: 'property-type',
                value: property.property_type ? property.property_type.lookupItemName : 'N/A',
              },
              {
                iconClasses: 'mdi mdi-point-of-sale',
                title: 'city',
                value: property.city ? property.city.lookupItemName : 'N/A',
              },
              {
                iconClasses: 'mdi mdi-domain',
                title: 'community',
                value: property.community ? property.community.lookupItemName : 'N/A',
              },
              {
                iconClasses: 'mdi mdi-domain',
                title: 'property-usage',
                value: property.property_usage ? property.property_usage.lookupItemName : 'N/A',
              },
              {
                iconClasses: 'mdi mdi-domain',
                title: 'district',
                value: property.district ? property.district.lookupItemName : 'N/A',
              },
              {
                iconClasses: 'mdi mdi-domain',
                title: 'number-of-floors',
                value: property.number_of_floors ? property.number_of_floors : 'N/A',
              },
              {
                iconClasses: 'mdi mdi-domain',
                title: 'builtup-area',
                value: property.builtup_area_sqft ? property.builtup_area_sqft : 'N/A',
              },
              {
                iconClasses: 'mdi mdi-domain',
                title: 'completion-date',
                value: property.completion_date ?
                  moment(property.completion_date).format('DD/MM/YYYY') :
                  'N/A',
              },
              {
                iconClasses: 'mdi mdi-domain',
                title: 'master-developer',
                value: property.master_developer ? property.master_developer.name : 'N/A',
              },
            ],
            ...property,
          };
        }),
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setDetailsPropertiesList({
        result: [],
        totalCount: 0,
      });
    }

    setIsLoading(false);
  }, [activeFormType, filter, filterSearchDto, orderBy, pathName, propertiesTableFilter]);
  const searchClicked = async () => {
    if (searchData.length === 0) return;
    localStorage.setItem('PropertiesFilter', JSON.stringify(searchData));
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
    getPropertiesData(oldfilter);
  };

  const tableActionClicked = useCallback(
    (actionEnum, item) => {
      dispatch(ActiveItemActions.activeItemRequest(item));
      if (actionEnum === TableActions.openFile.key) {
        if (pathName === 'properties-sales') {
          GlobalHistory.push(
            `/home/properties-sales/property-profile-edit?formType=${item.propertyTypeId}&id=${item.id}`
          );
        } else if (pathName === 'properties-lease') {
          GlobalHistory.push(
            `/home/properties-lease/property-profile-edit?formType=${item.propertyTypeId}&id=${item.id}`
          );
        } else if (pathName === 'Properties-CRM') {
          GlobalHistory.push(
            `/home/Properties-CRM/property-profile-edit?formType=${item.propertyTypeId}&id=${item.id}`
          );
        }
      } else if (actionEnum === TableActions.editText.key) {
        if (pathName === 'properties-sales') {
          GlobalHistory.push(
            `/home/properties-sales/edit?formType=${item.propertyTypeId}&id=${item.id}`
          );
        } else if (pathName === 'properties-lease') {
          GlobalHistory.push(
            `/home/properties-lease/edit?formType=${item.propertyTypeId}&id=${item.id}`
          );
        } else if (pathName === 'Properties-CRM') {
          GlobalHistory.push(
            `/home/Properties-CRM/edit?formType=${item.propertyTypeId}&id=${item.id}`
          );
        }
      }
    },
    [dispatch, pathName]
  );
  const displayedLabel = (option) => `${option.title}: ${searchInputValue}`;
  const disabledOptions = (option) => option.disabledOnSelect;
  const chipsLabel = (option) => `${option.title}: ${option.value}`;
  // const chipsDisabled = (option) => option.disabledOnTag;
  const inputValueChanged = (event, newInputValue) => {
    setSearchInputValue(newInputValue);
  };
  const onActionsButtonClicked = (activeAction) => {
    if (activeAction === ActionsButtonsEnum[3].id) setIsOpenImportDialog(true);
    if (activeAction === ActionsButtonsEnum[1].id) {
      if (pathName === 'properties-sales') GlobalHistory.push('/home/properties-sales/add');
      else if (pathName === 'properties') GlobalHistory.push('/home/properties/add');
      else if (pathName === 'Properties-CRM') GlobalHistory.push('/home/Properties-CRM/add');
      else GlobalHistory.push('/home/properties-lease/add');
    }
  };
  const onActionButtonChanged = () => { };
  const detailedCardSideActionClicked = useCallback(
    (actionEnum, activeData) => async (event) => {
      event.stopPropagation();
      dispatch(ActiveItemActions.activeItemRequest(activeData));
      if (actionEnum === ActionsEnum.reportEdit.key) {
        if (pathName === 'properties-sales') {
          GlobalHistory.push(
            `/home/properties-sales/edit?formType=${activeData.propertyTypeId}&id=${activeData.id}`
          );
        } else if (pathName === 'properties') {
          GlobalHistory.push(
            `/home/properties/edit?formType=${activeData.propertyTypeId}&id=${activeData.id}`
          );
        } else if (pathName === 'Properties-CRM') {
          GlobalHistory.push(
            `/home/Properties-CRM/edit?formType=${activeData.propertyTypeId}&id=${activeData.id}`
          );
        } else {
          GlobalHistory.push(
            `/home/properties-lease/edit?formType=${activeData.propertyTypeId}&id=${activeData.id}`
          );
        }
      } else if (actionEnum === ActionsEnum.folder.key) {
        if (pathName === 'properties-sales') {
          GlobalHistory.push(
            `/home/properties-sales/property-profile-edit?formType=${activeData.propertyTypeId}&id=${activeData.id}`
          );
        } else if (pathName === 'properties') {
          GlobalHistory.push(
            `/home/properties/property-profile-edit?formType=${activeData.propertyTypeId}&id=${activeData.id}`
          );
        } else if (pathName === 'Properties-CRM') {
          GlobalHistory.push(
            `/home/Properties-CRM/property-profile-edit?formType=${activeData.propertyTypeId}&id=${activeData.id}`
          );
        } else {
          GlobalHistory.push(
            `/home/properties-lease/property-profile-edit?formType=${activeData.propertyTypeId}&id=${activeData.id}`
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
  const orderBySubmitted = (event) => {
    event.preventDefault();
    if (!selectedOrderBy.filterBy || !selectedOrderBy.orderBy) {
      if (orderBy.filterBy || orderBy.orderBy) setOrderBy({});
      return;
    }
    if (pathName === 'properties-sales') {
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          propertiesSalesFilter: {
            filterBy: selectedOrderBy.filterBy,
            orderBy: selectedOrderBy.orderBy,
          },
        })
      );
    } else if (pathName === 'properties-lease') {
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          propertiesLeaseFilter: {
            filterBy: selectedOrderBy.filterBy,
            orderBy: selectedOrderBy.orderBy,
          },
        })
      );
    } else if (pathName === 'properties') {
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          propertiesLeaseFilter: {
            filterBy: selectedOrderBy.filterBy,
            orderBy: selectedOrderBy.orderBy,
          },
        })
      );
    } else if (pathName === 'Properties-CRM') {
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          propertiesCrmFilter: {
            filterBy: selectedOrderBy.filterBy,
            orderBy: selectedOrderBy.orderBy,
          },
        })
      );
    } else {
      dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          propertiesFilter: {
            filterBy: selectedOrderBy.filterBy,
            orderBy: selectedOrderBy.orderBy,
          },
        })
      );
    }
    setOrderBy({
      filterBy: selectedOrderBy.filterBy,
      orderBy: selectedOrderBy.orderBy,
    });
    setOrderByToggler(false);
  };
  const cardCheckboxClicked = useCallback((itemIndex) => {
    setCheckedDetailedCards((items) => {
      const index = items.findIndex((item) => item === itemIndex);
      if (index !== -1) items.splice(index, 1);
      else items.push(itemIndex);
      return [...items];
    });
  }, []);
  const reloadData = useCallback(() => {
    setFilter((item) => ({ ...item, pageIndex: 0 }));
    setActiveCard(null);
    getPropertiesData();
  }, [getPropertiesData]);
  const onCardClick = useCallback(
    (item, selectedIndex) => (event) => {
      event.stopPropagation();
      event.preventDefault();
      setActiveCard(item);
      dispatch(ActiveItemActions.activeItemRequest(item));
      sideMenuComponentUpdate(
        <CardDetailsComponent
          activeData={detailsPropertiesList.result[selectedIndex]}
          cardDetailsActionClicked={detailedCardSideActionClicked}
          loginResponse={loginResponse}
          relodedata={reloadData}
        />
      );
      sideMenuIsOpenUpdate(true);
    },
    [detailedCardSideActionClicked, detailsPropertiesList.result, loginResponse, reloadData]
  );
  const onFilterValuesChanged = (newValue) => {
    setPropertiesTableFilter(newValue);
  };
  const focusedRowChanged = useCallback(
    (rowIndex) => {
      if (rowIndex !== -1) {
        sideMenuComponentUpdate(
          <CardDetailsComponent
            activeData={detailsPropertiesList.result[rowIndex]}
            cardDetailsActionClicked={detailedCardSideActionClicked}
            loginResponse={loginResponse}
            relodedata={reloadData}
          />
        );
        sideMenuIsOpenUpdate(true);
      } else {
        sideMenuComponentUpdate(<></>);
        sideMenuIsOpenUpdate(false);
      }
    },
    [detailedCardSideActionClicked, detailsPropertiesList.result, loginResponse, reloadData]
  );

  useEffect(() => {
    if (pathName === 'Properties-CRM')
      localStorage.setItem('PropertiesPropertyManagement', false);
    else if (pathName === 'properties')
      localStorage.setItem('PropertiesPropertyManagement', true);
  }, [pathName]);

  useEffect(() => {
    getAllSearchableFormFieldsByFormId();
  }, [getAllSearchableFormFieldsByFormId]);
  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={detailsPropertiesList.totalCount}
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
    const data = localStorage.getItem('PropertiesFilter');

    if (data) {
      setSearchData(JSON.parse(data));
      searchchachedClickedWithoutFilter(JSON.parse(data));
    } else
      getPropertiesData();
  }, []);

  useEffect(() => {
    if (isFirst1) {
      if (searchData && searchData.length === 0) {
        localStorage.removeItem('PropertiesFilter');
        getPropertiesData();
      } else
        localStorage.setItem('PropertiesFilter', JSON.stringify(searchData));
    } else
      setFirst1(true);
  }, [searchData]);

  useEffect(() => {
    if (!isFirst) setFirst(true);
    else {
      const data = localStorage.getItem('PropertiesFilter');
      if (data)
        searchchachedClickedWithoutFilter(JSON.parse(data));
      else
        getPropertiesData();
    }
  }, [activeFormType, filter, filterSearchDto, orderBy, pathName, propertiesTableFilter]);
  return (
    <div className='view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section'>
              <ActionsButtonsComponent
                permissionsList={!isPropertyManagementView ? Object.values(PropertiesPermissionsCRM) : Object.values(PropertyManagementListPermissions)}
                addPermissionsId={!isPropertyManagementView ? PropertiesPermissionsCRM.AddNewProperty.permissionsId : PropertyManagementListPermissions.AddNewProperty.permissionsId}
                selectPermissionsId={!isPropertyManagementView ? [PropertiesPermissionsCRM.ImportProperty.permissionsId] : [PropertyManagementListPermissions.ImportProperty.permissionsId]}
                enableImport={!isPropertyManagementView ? getIsAllowedPermission(
                  Object.values(PropertiesPermissionsCRM),
                  loginResponse,
                  PropertiesPermissionsCRM.ImportProperty.permissionsId
                ) : getIsAllowedPermission(
                  Object.values(PropertyManagementListPermissions),
                  loginResponse,
                  PropertyManagementListPermissions.ImportProperty.permissionsId
                )}
                onActionsButtonClicked={onActionsButtonClicked}
                onActionButtonChanged={onActionButtonChanged}

              />
            </div>
            <div className='section autocomplete-section'>
              <PermissionsComponent
                permissionsList={!isPropertyManagementView ? Object.values(PropertiesPermissionsCRM) : Object.values(PropertyManagementListPermissions)}
                permissionsId={!isPropertyManagementView ? PropertiesPermissionsCRM.ViewAndSearchProperties.permissionsId : PropertyManagementListPermissions.ViewandsearchinPropertyManagementProperties.permissionsId}
              >
                <div className='d-flex-column px-2 w-100 p-relative'>
                  <div className='d-flex-column w-100'>
                    <AutocompleteComponent
                      data={searchableFormFields.map((item) => ({
                        key: item.key,
                        title: item.title,
                      }))}
                      selectedValues={searchData}
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
                      translationPath={translationPath}
                      translationPathForData={translationPath}
                      parentTranslationPath={parentTranslationPath}
                      inputPlaceholder='search-properties'
                    />
                  </div>
                  <div className='d-inline-flex pl-5-reversed'>
                    <SelectComponet
                      data={Object.values(PropertyStatusEnum)}
                      emptyItem={{ value: 0, text: 'select-type', isDisabled: false }}
                      value={activeFormType}
                      valueInput='id'
                      textInput='value'
                      onSelectChanged={changeActiveFormType}
                      wrapperClasses='w-auto'
                      themeClass='theme-transparent'
                      idRef='activeFormTypeRef'
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      translationPathForData={translationPath}
                    />
                  </div>
                </div>
                <ViewTypes onTypeChanged={onTypeChanged} className='mb-3' />
              </PermissionsComponent>
            </div>

          </div>
          <PermissionsComponent
            permissionsList={!isPropertyManagementView ? Object.values(PropertiesPermissionsCRM) : Object.values(PropertyManagementListPermissions)}
            permissionsId={!isPropertyManagementView ? PropertiesPermissionsCRM.ViewAndSearchProperties.permissionsId : PropertyManagementListPermissions.ViewandsearchinPropertyManagementProperties.permissionsId}
          >
            <div className='d-flex px-2'>
              <span className='mx-2 mt-1'>{t(`${translationPath}properties`)}</span>
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
            permissionsList={!isPropertyManagementView ? Object.values(PropertiesPermissionsCRM) : Object.values(PropertyManagementListPermissions)}
            permissionsId={!isPropertyManagementView ? PropertiesPermissionsCRM.ViewAndSearchProperties.permissionsId : PropertyManagementListPermissions.ViewandsearchinPropertyManagementProperties.permissionsId}
          >

            <div className='body-section'>
              <PropertiesCardsComponent
                data={detailsPropertiesList}
                isExpanded={isExpanded}
                onCardClicked={onCardClick}
                onFooterActionsClicked={detailedCardSideActionClicked}
                checkedDetailedCards={checkedDetailedCards}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                withCheckbox={isSelect}
                onCardCheckboxClick={cardCheckboxClicked}
                activeCard={activeCard}
              />
            </div>
          </PermissionsComponent>
        )}
        {activeActionType === ViewTypesEnum.tableView.key && (

          <PermissionsComponent
            permissionsList={!isPropertyManagementView ? Object.values(PropertiesPermissionsCRM) : Object.values(PropertyManagementListPermissions)}
            permissionsId={!isPropertyManagementView ? PropertiesPermissionsCRM.ViewAndSearchProperties.permissionsId : PropertyManagementListPermissions.ViewandsearchinPropertyManagementProperties.permissionsId}
          >
            <PropertiesTableComponent
              detailsPropertiesList={detailsPropertiesList}
              tableActionClicked={tableActionClicked}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              propertiesTableFilter={propertiesTableFilter}
              onFilterValuesChanged={onFilterValuesChanged}
              filter={filter}
              parentTranslationPath={parentTranslationPath}
              focusedRowChanged={focusedRowChanged}
            />
          </PermissionsComponent>

        )}
      </div>
      <PropertiesImportDialog
        isOpen={isOpenImportDialog}
        isOpenChanged={() => setIsOpenImportDialog(false)}
      />
    </div>
  );
};
