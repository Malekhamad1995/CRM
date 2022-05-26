/* eslint-disable curly */
/* eslint-disable space-before-blocks */
import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { ButtonBase } from '@material-ui/core';
import { Button } from 'react-bootstrap/lib/InputGroup';
import moment from 'moment';
import {
  sideMenuIsOpenUpdate,
  sideMenuComponentUpdate,
  GlobalHistory,
  bottomBoxComponentUpdate,
} from '../../../Helper';
import {
  ActionsButtonsComponent,
  ViewTypes,
  AutocompleteComponent,
  SelectComponet,
  Spinner,
} from '../../../Components';
import {
  ActionsEnum,
  ViewTypesEnum,
  TableActions,
  ActionsButtonsEnum,
  FormsIdsEnum,
  UnitsFilterStatusEnum,
  TableFilterOperatorsEnum,
  TableFilterTypesEnum,
  ArrayOFSearchableFormFields,
} from '../../../Enums';
import {
  CardDetailsComponent,
  UnitsCardsComponent,
  UnitsLeaseTableComponent,
} from './UnitsLeaseUtilities';
import {
  GetAdvanceSearchLeaseUnits,
  GetAllSearchableFormFieldsByFormId,
  GetAdvanceSearchLeaseUnitsPropertyManagement,
} from '../../../Services';
import { PaginationComponent } from '../../../Components/PaginationComponent/PaginationComponent';
import { UnitsImportDialog } from './UnitsLeaseUtilities/Dialogs/UnitsImportDialog/UnitsImportDialog';
import { UnitMapper } from './UnitLeaseMapper';
import { ActiveItemActions } from '../../../store/ActiveItem/ActiveItemActions';
import { useTitle } from '../../../Hooks';
import { GlobalOrderFilterActions } from '../../../store/GlobalOrderFilter/GlobalOrderFilterActions';
import { DateRangePickerComponent } from '../../../Components/Controls/DateRangePickerComponent/DateRangePickerComponent';
import { UnitsLeasePermissions } from '../../../Permissions/Lease/UnitsLeasePermissions';
import { UnitPermissions } from '../../../Permissions/PropertyManagement';
import { PermissionsComponent } from '../../../Components/PermissionsComponent/PermissionsComponent';
import { getIsAllowedPermission } from '../../../Helper/Permissions.Helper';

const parentTranslationPath = 'UnitsView';
const translationPath = '';

export const UnitsLeaseView = () => {
  const dateRangeDefault = {
    startDate: null,
    endDate: null,
    key: 'selection',
  };
  const [isPropertyManagementView, setIsPropertyManagementView] =
    useState(false);
  const pathName = window.location.pathname
    .split('/home/')[1]
    .split('/view')[0];
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  const [unitsTableFilter, setUnitsTableFilter] = useState(null);
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [activeActionType, setActiveActionType] = useState(
    ViewTypesEnum.cards.key
  );
  const [isExpanded, setIsExpanded] = useState(
    activeActionType === ViewTypesEnum.cardsExpanded.key
  );
  const [, setOrderByToggler] = useState(false);
  const [unitStatus, setUnitStatus] = useState(orderFilter.UnitsLeaseStatus || [0]);
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const [checkedCards, setCheckedCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [isOpenImportDialog, setIsOpenImportDialog] = useState(false);
  const [selectedOrderBy, setSelectedOrderBy] = useState({
    filterBy: orderFilter.unitsLeaseFilter.filterBy,
    orderBy: orderFilter.unitsLeaseFilter.orderBy,
  });
  const [orderBy, setOrderBy] = useState(

    selectedOrderBy.filterBy ? selectedOrderBy : {}
  );

  const [dateFilter, setDateFilter] = useState(

    (orderFilter && orderFilter.UnitsleaseDate && orderFilter.UnitsleaseDate.startDate && orderFilter.UnitsleaseDate.endDat !== null) &&
    (
      {
        startDate: new Date(orderFilter && orderFilter.UnitsleaseDate && orderFilter.UnitsleaseDate.startDate || null),
        endDate: new Date(orderFilter && orderFilter.UnitsleaseDate && orderFilter.UnitsleaseDate.endDate || null),
        key: new Date(orderFilter && orderFilter.UnitsleaseDate && orderFilter.UnitsleaseDate.key || null),
      }) || dateRangeDefault
  );

  const [checkedDetailedCards, setCheckedDetailedCards] = useState([]);
  const [detailsUnitsList, setDetailsUnitsList] = useState(() => ({
    result: [],
    totalCount: 0,
  }));
  const [searchableFormFields, setSearchableFormFields] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [activeSelectedAction, setActiveSelectedAction] = useState('');
  const [filterSearchDto, setFilterSearchDto] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
  });
  const [isFirst, setFirst] = useState(false);
  const [isFirst1, setFirst1] = useState(false);
  useTitle(t(`${translationPath}units`));
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

  const DataChecker = (item) => {
    if ((item && item.displayPath) === ('listing_date') || (item && item.displayPath) === ('rent_listing_date')){
      return 2;
    }
    return item.operator;
  };

  const filterOnChange = (event, newValue) => {
    const emptyKeyIndex = newValue.findIndex((item) => !item.value);
    if (!searchInputValue && emptyKeyIndex !== -1) {
      newValue.splice(emptyKeyIndex, 1);
      return;
    }
    if (emptyKeyIndex !== -1) newValue[emptyKeyIndex].value = searchInputValue;
    if (
      filterSearchDto &&
      Object.keys(filterSearchDto).length > 0 &&
      newValue.length === 0
    ) {
      onPageIndexChanged(0);
      setFilterSearchDto(null);
    }
    setSearchData([...newValue]);
  };
  const getAllSearchableFormFieldsByFormId = useCallback(async () => {
    const result = await GetAllSearchableFormFieldsByFormId(
      FormsIdsEnum.units.id
    );
    if (
      !(result && result.data && result.data.ErrorId) &&
      result &&
      Array.isArray(result)
    ) {
      setSearchableFormFields(
        result
          .filter((item) => item.isSearchable)
          .map((item) => ({
            key: item.searchableKey,
            title: item.formFieldTitle,
          })).concat(ArrayOFSearchableFormFields)
      );
    } else setSearchableFormFields([]);
  }, []);
  const getUnitsData = useCallback(
    async (f) => {
      setIsLoading(true);
      const index = unitStatus.findIndex((el) => el === 0);
      if (index !== -1) unitStatus.splice(index, 1);
      if (unitStatus.length === 0) unitStatus.push(0);
      const localFilterDto = f || filterSearchDto || {};
      if (unitStatus && unitStatus.length >= 1 && unitStatus[0] !== 0) {
        if (pathName === 'units-lease') {
          localFilterDto.lease_status = unitStatus.map((item) => ({
            searchType: TableFilterOperatorsEnum.equal.key,
            value: (item || '').toLowerCase(),
          }));
        } else {
          localFilterDto.status = unitStatus.map((item) => ({
            searchType: TableFilterOperatorsEnum.equal.key,
            value: (item || '').toLowerCase(),
          }));
        }
      }
      if (unitsTableFilter) {
        Object.values(unitsTableFilter)
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
                  searchType: item && item.operator ? DataChecker(item) : item.operator,
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

      const res =
        pathName === 'units-property-management' ?
          await GetAdvanceSearchLeaseUnitsPropertyManagement(filter, body) :
          await GetAdvanceSearchLeaseUnits(filter, body);

      if (!(res && res.status && res.status !== 200)) {
        setDetailsUnitsList({
          result: ((res && res.result) || []).map((item) => UnitMapper(item)),
          totalCount: (res && res.totalCount) || 0,
        });
      } else {
        setDetailsUnitsList({
          result: [],
          totalCount: 0,
        });
      }
      setIsLoading(false);
    },
    [
      dateFilter,
      filter,
      filterSearchDto,
      orderBy,
      pathName,
      unitStatus,
      unitsTableFilter,
    ]
  );
  const searchClicked = async () => {
    if (searchData.length === 0) return;
    localStorage.setItem('UnitsLeaseFilter', JSON.stringify(searchData));
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
              searchType:
                TableFilterTypesEnum.textInput.defaultSelectedOperator,
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
    getUnitsData(oldfilter);
  };

  const tableActionClicked = useCallback(
    (actionEnum, item) => {
      dispatch(ActiveItemActions.activeItemRequest(item));
      if (actionEnum === TableActions.openFile.key) {
        if (pathName === 'units-property-management') {
          GlobalHistory.push(
            `/home/units-property-management/unit-profile-edit?formType=${item.unitTypeId}&id=${item.id}&operationType=${item.operationType}`
          );
        } else if (pathName === 'units-lease') {
          GlobalHistory.push(
            `/home/units-lease/unit-profile-edit?formType=${item.unitTypeId}&id=${item.id}&operationType=${item.operationType}`
          );
        }
      } else if (actionEnum === TableActions.editText.key) {
        if (pathName === 'units-property-management') {
          GlobalHistory.push(
            `/home/units-property-management/edit?formType=${item.unitTypeId}&id=${item.id}`
          );
        } else if (pathName === 'units-lease') {
          GlobalHistory.push(
            `/home/units-lease/edit?formType=${item.unitTypeId}&id=${item.id}`
          );
        }
      }
    },
    [dispatch, pathName]
  );
  const displayedLabel = (option) => `${option.title}: ${searchInputValue}`;
  const disabledOptions = (option) => option.disabledOnSelect;
  const chipsLabel = (option) => `${option.title}: ${option.value}`;
  const inputValueChanged = (event, newInputValue) => {
    setSearchInputValue(newInputValue);
  };
  const onActionButtonChanged = (activeAction) => {
    setActiveSelectedAction(activeAction);
    setCheckedCards([]);
  };
  const onActionsButtonClicked = useCallback(
    (activeAction) => {
      if (activeAction === ActionsButtonsEnum[3].id)
        setIsOpenImportDialog(true);
      if (activeAction === ActionsButtonsEnum[1].id) {
        if (pathName === 'units-property-management')
          GlobalHistory.push('/home/units-property-management/add?formType=1');
        else if (pathName === 'units-lease')
          GlobalHistory.push('/home/units-lease/add?formType=1');
      }
      if (activeAction === ActionsButtonsEnum[4].id)
        GlobalHistory.push('/home/units-lease/unit-bulk-update');
    },
    [pathName]
  );

  const detailedCardSideActionClicked = useCallback(
    (actionEnum, activeData) => async (event) => {
      dispatch(ActiveItemActions.activeItemRequest(activeData));
      event.stopPropagation();
      if (actionEnum === ActionsEnum.reportEdit.key) {
        if (pathName === 'units-property-management') {
          GlobalHistory.push(
            `/home/units-property-management/edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        } else if (pathName === 'units-lease') {
          GlobalHistory.push(
            `/home/units-lease/edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        }
      } else if (actionEnum === ActionsEnum.folder.key) {
        if (pathName === 'units-property-management') {
          GlobalHistory.push(
            `/home/units-property-management/unit-profile-edit?formType=${activeData.unitTypeId}&id=${activeData.id}&operationType=${activeData.operationType}`
          );
        } else if (pathName === 'units-lease') {
          GlobalHistory.push(
            `/home/units-lease/unit-profile-edit?formType=${activeData.unitTypeId}&id=${activeData.id}&operationType=${activeData.operationType}`
          );
        }
      } else if (actionEnum === ActionsEnum.matching.key) {
        if (pathName === 'units-property-management') {
          GlobalHistory.push(
            `/home/units-property-management/unit-profile-edit?formType=${activeData.unitTypeId
            }&id=${activeData.id}&operationType=${activeData.operationType
            }&matching=${true}`
          );
        } else if (pathName === 'units-lease') {
          GlobalHistory.push(
            `/home/units-lease/unit-profile-edit?formType=${activeData.unitTypeId
            }&id=${activeData.id}&operationType=${activeData.operationType
            }&matching=${true}`
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
    dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        unitsLeaseFilter: {
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

  useEffect(() => {
    dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        UnitsleaseDate: dateFilter || dateRangeDefault
      })
    );
  }, [dateFilter]);

  const cardCheckboxClicked = useCallback((itemIndex, element) => {
    setCheckedDetailedCards((items) => {
      const index = items.findIndex((item) => item === itemIndex);
      if (index !== -1) items.splice(index, 1);
      else items.push(itemIndex);
      return [...items];
    });
    setCheckedCards((items) => {
      const index = items.findIndex((item) => item.id === element.id);
      if (index !== -1) items.splice(index, 1);
      else items.push(element);
      return [...items];
    });
  }, []);
  useEffect(() => {
    localStorage.setItem('bulk-assign-ids', JSON.stringify(checkedCards));
  }, [checkedCards]);
  const reloadData = useCallback(() => {
    setFilter((item) => ({ ...item, pageIndex: 0 }));
    setActiveCard(null);
    sideMenuComponentUpdate(null);
    sideMenuIsOpenUpdate(false);
    getUnitsData();
  }, [getUnitsData]);
  const onCardClick = useCallback(
    (item, selectedIndex) => (event) => {
      dispatch(ActiveItemActions.activeItemRequest(item));
      event.stopPropagation();
      event.preventDefault();
      setActiveCard(item);
      sideMenuComponentUpdate(
        <CardDetailsComponent
          activeData={detailsUnitsList.result[selectedIndex]}
          cardDetailsActionClicked={detailedCardSideActionClicked}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          reloadData={reloadData}
        />
      );
      sideMenuIsOpenUpdate(true);
    },
    [detailedCardSideActionClicked, detailsUnitsList.result, reloadData]
  );
  const focusedRowChanged = useCallback(
    (rowIndex) => {
      if (rowIndex !== -1) {
        sideMenuComponentUpdate(
          <CardDetailsComponent
            activeData={detailsUnitsList.result[rowIndex]}
            cardDetailsActionClicked={detailedCardSideActionClicked}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            reloadData={reloadData}
          />
        );
        sideMenuIsOpenUpdate(true);
      } else {
        sideMenuComponentUpdate(<></>);
        sideMenuIsOpenUpdate(false);
      }
    },
    [detailedCardSideActionClicked, detailsUnitsList.result, reloadData]
  );
  // const onFormTypeSelectChanged = (activeFormType) => {
  //   GlobalHistory.push(`/home/units/add`);
  // };
  const onFilterValuesChanged = (newValue) => {
    setUnitsTableFilter(newValue);
  };

  useEffect(() => {
    getAllSearchableFormFieldsByFormId();
  }, [getAllSearchableFormFieldsByFormId]);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={detailsUnitsList.totalCount}
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

  const changeActiveUnitStatus = (value) => {
    setUnitStatus(value);
    dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        UnitsLeaseStatus: value
      })
    );
  };
  const checkBulkDesabled = (enums) => {
    if (enums === ActionsButtonsEnum[4].id)
      return !(checkedCards && checkedCards.length >= 2);

    return false;
  };
  useEffect(() => {
    const data = localStorage.getItem('UnitsLeaseFilter');

    if (data) {
      setSearchData(JSON.parse(data));
      searchchachedClickedWithoutFilter(JSON.parse(data));
    } else getUnitsData();
    if (pathName === 'units-property-management')
      setIsPropertyManagementView(true);
    else setIsPropertyManagementView(false);
  }, []);

  useEffect(() => {
    if (isFirst1) {
      if (searchData && searchData.length === 0) {
        localStorage.removeItem('UnitsLeaseFilter');
        getUnitsData();
      } else
        localStorage.setItem('UnitsLeaseFilter', JSON.stringify(searchData));
    } else setFirst1(true);
  }, [searchData]);

  useEffect(() => {
    if (!isFirst) setFirst(true);
    else {
      const data = localStorage.getItem('UnitsLeaseFilter');
      if (data) searchchachedClickedWithoutFilter(JSON.parse(data));
      else getUnitsData();
    }
  }, [
    filterSearchDto,
    filter,
    unitStatus,
    orderBy,
    dateFilter,
    unitsTableFilter,
    pathName,
  ]);

  return (
    <div className='view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section'>
              <ActionsButtonsComponent
                permissionsList={
                  !isPropertyManagementView ?
                    Object.values(UnitsLeasePermissions) :
                    Object.values(UnitPermissions)
                }
                addPermissionsId={
                  !isPropertyManagementView ?
                    UnitsLeasePermissions.AddNewUnit.permissionsId :
                    UnitPermissions.AddNewUnit.permissionsId
                }
                selectPermissionsId={
                  !isPropertyManagementView ?
                    [
                      UnitsLeasePermissions.ImportUnits.permissionsId,
                      UnitsLeasePermissions.UnitBulkUpdate.permissionsId,
                    ] :
                    [
                      UnitPermissions.ImportUnit.permissionsId,
                      UnitPermissions.UnitBulkUpdate.permissionsId,
                    ]
                }
                onActionsButtonClicked={onActionsButtonClicked}
                onActionButtonChanged={onActionButtonChanged}
                // enableBulk={
                //   !isPropertyManagementView ?
                //     getIsAllowedPermission(
                //       Object.values(UnitsLeasePermissions),
                //       loginResponse,
                //       UnitsLeasePermissions.UnitBulkUpdate.permissionsId
                //     ) :
                //     getIsAllowedPermission(
                //       Object.values(UnitPermissions),
                //       loginResponse,
                //       UnitPermissions.UnitBulkUpdate.permissionsId
                //     )
                // }
                checkDisable={checkBulkDesabled}
                enableImport={
                  !isPropertyManagementView ?
                    getIsAllowedPermission(
                      Object.values(UnitsLeasePermissions),
                      loginResponse,
                      UnitsLeasePermissions.ImportUnits.permissionsId
                    ) :
                    getIsAllowedPermission(
                      Object.values(UnitPermissions),
                      loginResponse,
                      UnitPermissions.ImportUnit.permissionsId
                    )
                }
              />
            </div>
            <PermissionsComponent
              permissionsList={
                !isPropertyManagementView ?
                  Object.values(UnitsLeasePermissions) :
                  Object.values(UnitPermissions)
              }
              permissionsId={
                !isPropertyManagementView ?
                  UnitsLeasePermissions.ViewAndSearchInLeaseUnits
                    .permissionsId :
                  UnitPermissions.ViewAndSearchInPropertyManagementUnits
                    .permissionsId
              }
            >
              <div className='section autocomplete-section'>
                <div className='d-flex-column px-2 w-100 p-relative'>
                  <div className='d-flex-column w-100'>
                    <AutocompleteComponent
                      data={searchableFormFields.map((item) => ({
                        key: item.key,
                        title: item.title,
                      }))}
                      selectedValues={searchData}
                      parentTranslationPath={parentTranslationPath}
                      displayLabel={displayedLabel}
                      disabledOptions={disabledOptions}
                      onChange={filterOnChange}
                      searchClicked={searchClicked}
                      chipsLabel={chipsLabel}
                      getOptionSelected={(option) =>
                        searchData.findIndex(
                          (item) =>
                            item.key === option.key &&
                            item.value === searchInputValue
                        ) !== -1}
                      tagValues={searchData}
                      inputValue={searchInputValue}
                      onInputChange={inputValueChanged}
                      inputLabel='filter'
                      inputPlaceholder='search-units'
                    />
                  </div>
                  <div className='d-inline-flex pl-5-reversed'>
                    <div className='dateLeasDiv'>
                      <SelectComponet
                        data={Object.values(UnitsFilterStatusEnum.lease)}
                        emptyItem={{
                          value: 0,
                          text: 'select-status',
                          isDisabled: true,
                          isHiddenOnOpen: true,
                        }}
                        value={unitStatus}
                        valueInput='value'
                        textInput='title'
                        multiple
                        onSelectChanged={changeActiveUnitStatus}
                        wrapperClasses='w-auto'
                        themeClass='theme-transparent'
                        idRef='activeFormTypeRef'
                        startAdornment={(((unitStatus.findIndex((item) => item === 0)) === -1) &&
                          (
                            <Button
                              title='Remove Filter'
                              className='mdi mdi-filter-off mr-4 c-warning'
                              onClick={() => changeActiveUnitStatus([])}
                            />
                          )) || ''}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        translationPathForData={translationPath}
                      />
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
                </div>
                <ViewTypes onTypeChanged={onTypeChanged} className='mb-3' />
              </div>
            </PermissionsComponent>
          </div>
          <PermissionsComponent
            permissionsList={
              !isPropertyManagementView ?
                Object.values(UnitsLeasePermissions) :
                Object.values(UnitPermissions)
            }
            permissionsId={
              !isPropertyManagementView ?
                UnitsLeasePermissions.ViewAndSearchInLeaseUnits.permissionsId :
                UnitPermissions.ViewAndSearchInPropertyManagementUnits
                  .permissionsId
            }
          >
            <div className='d-flex px-2'>
              <span className='mx-2 mt-1'>{t(`${translationPath}units`)}</span>
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
                    disabled={
                      !selectedOrderBy.filterBy || !selectedOrderBy.orderBy
                    }
                  >
                    <span>{t(`${translationPath}apply`)}</span>
                  </ButtonBase>
                </div>
              </span>
            </div>
          </PermissionsComponent>
        </div>
        {activeActionType !== ViewTypesEnum.tableView.key && (
          <>
            <div className='body-section'>
              <PermissionsComponent
                permissionsList={
                  !isPropertyManagementView ?
                    Object.values(UnitsLeasePermissions) :
                    Object.values(UnitPermissions)
                }
                permissionsId={
                  !isPropertyManagementView ?
                    UnitsLeasePermissions.ViewAndSearchInLeaseUnits
                      .permissionsId :
                    UnitPermissions.ViewAndSearchInPropertyManagementUnits
                      .permissionsId
                }
              >
                <UnitsCardsComponent
                  data={detailsUnitsList}
                  isExpanded={isExpanded}
                  onCardClicked={onCardClick}
                  onFooterActionsClicked={detailedCardSideActionClicked}
                  checkedDetailedCards={checkedDetailedCards}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onCardCheckboxClick={cardCheckboxClicked}
                  activeCard={activeCard}
                  withCheckbox={activeSelectedAction === 'bulk-update'}
                />
              </PermissionsComponent>
            </div>
          </>
        )}

        {activeActionType === ViewTypesEnum.tableView.key && (
          <PermissionsComponent
            permissionsList={
              !isPropertyManagementView ?
                Object.values(UnitsLeasePermissions) :
                Object.values(UnitPermissions)
            }
            permissionsId={
              !isPropertyManagementView ?
                UnitsLeasePermissions.ViewAndSearchInLeaseUnits.permissionsId :
                UnitPermissions.ViewAndSearchInPropertyManagementUnits
                  .permissionsId
            }
          >
            <UnitsLeaseTableComponent
              detailsUnitsList={detailsUnitsList}
              tableActionClicked={tableActionClicked}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              unitsTableFilter={unitsTableFilter}
              onFilterValuesChanged={onFilterValuesChanged}
              filter={filter}
              parentTranslationPath={parentTranslationPath}
              focusedRowChanged={focusedRowChanged}
            />
          </PermissionsComponent>
        )}
      </div>
      <UnitsImportDialog
        isOpen={isOpenImportDialog}
        isOpenChanged={() => setIsOpenImportDialog(false)}
      />
    </div>
  );
};
