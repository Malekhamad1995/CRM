import React, { useState, useCallback, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
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
  Tables,
  SelectComponet,
  CollapseComponent,
  Spinner,
} from '../../../Components';
import {
  ActionsEnum,
  ViewTypesEnum,
  // ActionsButtonsEnum,
  UnitsOperationTypeEnum,
  TableActions,
  ActionsButtonsEnum,
  FormsIdsEnum,
  UnitsStatusEnum,
} from '../../../Enums';
import { CardDetailsComponent, UnitsCardsComponent } from './UnitsUtilities';
import { GetAdvanceSearchUnits, GetAllSearchableFormFieldsByFormId } from '../../../Services';
import { PaginationComponent } from '../../../Components/PaginationComponent/PaginationComponent';
import { UnitsImportDialog } from './UnitsUtilities/Dialogs/UnitsImportDialog/UnitsImportDialog';
import { UnitMapper } from './UnitMapper';
import { ActiveItemActions } from '../../../store/ActiveItem/ActiveItemActions';
import { useTitle } from '../../../Hooks';
import { GlobalOrderFilterActions } from '../../../store/GlobalOrderFilter/GlobalOrderFilterActions';

const parentTranslationPath = 'UnitsView';
const translationPath = '';

export const UnitsView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [activeActionType, setActiveActionType] = useState(ViewTypesEnum.cards.key);
  const [isExpanded, setIsExpanded] = useState(
    activeActionType === ViewTypesEnum.cardsExpanded.key
  );
  // const [isHidden, setIsHidden] = useState(false);

  const [isFirst, setFirst] = useState(false);
  const [isFirst1, setFirst1] = useState(false);
  const [orderByToggler, setOrderByToggler] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [activeFormType, setActiveFormType] = useState(0);
  const [unitStatus, setUnitStatus] = useState([0]);
  const [activeCard, setActiveCard] = useState(null);
  const [isOpenImportDialog, setIsOpenImportDialog] = useState(false);
  const [selectedOrderBy, setSelectedOrderBy] = useState({
    filterBy: orderFilter.unitsFilter.filterBy,
    orderBy: orderFilter.unitsFilter.orderBy,
  });
  const [orderBy, setOrderBy] = useState(selectedOrderBy.filterBy ? selectedOrderBy : {});
  const [checkedDetailedCards, setCheckedDetailedCards] = useState([]);
  const [detailsUnitsList, setDetailsUnitsList] = useState(() => ({
    result: [],
    totalCount: 0,
  }));
  const [searchableFormFields, setSearchableFormFields] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [filterSearchDto, setFilterSearchDto] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState('');
  // Start New Code states
  // const [unitsRes, setUnitsRes] = useState({
  //   result: [],
  //   totalCount: 0,
  // });
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
  });
  // End New Code
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
    const result = await GetAllSearchableFormFieldsByFormId(FormsIdsEnum.units.id);
    if (!(result && result.status && result.status !== 200) && result && Array.isArray(result)) {
      setSearchableFormFields(
        result
          .filter((item) => item.isSearchable)
          .map((item) => ({ key: item.searchableKey, title: item.formFieldTitle }))
      );
    } else setSearchableFormFields([]);
  }, []);
  const getUnitsData = useCallback(async (f) => {
    setIsLoading(true);
    const res = await GetAdvanceSearchUnits(filter, {
      criteria: f ||
        (filterSearchDto &&
          ((Object.keys(filterSearchDto).length > 0 &&
            activeFormType && {
            ...filterSearchDto,
            'operation_type.lookupItemName': activeFormType,
          }) ||
            filterSearchDto)) ||
        (activeFormType && { 'operation_type.lookupItemName': activeFormType }) ||
        (unitStatus.length > 1 && { status: unitStatus }) ||
        {},
      ...orderBy,
    });
    if (!(res && res.status && res.status !== 200) && res && res.result) {
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
  }, [activeFormType, filter, filterSearchDto, orderBy, unitStatus]);
  const searchClicked = async () => {
    if (searchData.length === 0) return;
    localStorage.setItem('UnitFilter', JSON.stringify(searchData));

    setFilterSearchDto(
      searchData.reduce((total, item) => {
        if (total[item.key]) total[item.key].push(item.value);
        else total[item.key] = [item.value];
        return total;
      }, {})
    );
    onPageIndexChanged(0);
  };
  const searchchachedClickedWithoutFilter = async (data) => {
    if (data.length === 0) return;
    const oldfilter = data.reduce((total, item) => {
      if (total[item.key]) total[item.key].push(item.value);
      else total[item.key] = [item.value];
      return total;
    }, {});
    getUnitsData(oldfilter);
  };
  const tableActionClicked = useCallback(
    (actionEnum, item) => {
      dispatch(ActiveItemActions.activeItemRequest(item));
      if (actionEnum === TableActions.openFile.key) {
        GlobalHistory.push(
          `/home/units/unit-profile-edit?formType=${item.unitTypeId}&id=${item.id}&operationType=${item.operationType}`
        );
      } else if (actionEnum === TableActions.editText.key)
        GlobalHistory.push(`/home/units/edit?formType=${item.unitTypeId}&id=${item.id}`);
    },
    [dispatch]
  );
  const displayedLabel = (option) => `${option.title}: ${searchInputValue}`;
  const disabledOptions = (option) => option.disabledOnSelect;
  const chipsLabel = (option) => `${option.title}: ${option.value}`;
  // const chipsDisabled = (option) => option.disabledOnTag;
  const inputValueChanged = (event, newInputValue) => {
    setSearchInputValue(newInputValue);
  };
  const onActionButtonChanged = () => { };
  const onActionsButtonClicked = useCallback((activeAction) => {
    if (activeAction === ActionsButtonsEnum[3].id) setIsOpenImportDialog(true);
    if (activeAction === ActionsButtonsEnum[1].id) GlobalHistory.push('/home/units/add?formType=1');
  }, []);
  const detailedCardSideActionClicked = useCallback(
    (actionEnum, activeData) => async (event) => {
      dispatch(ActiveItemActions.activeItemRequest(activeData));
      event.stopPropagation();
      if (actionEnum === ActionsEnum.reportEdit.key) {
        GlobalHistory.push(
          `/home/units/edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
        );
      } else if (actionEnum === ActionsEnum.folder.key) {
        GlobalHistory.push(
          `/home/units/unit-profile-edit?formType=${activeData.unitTypeId}&id=${activeData.id}&operationType=${activeData.operationType}`
        );
        // setSelectedDetailsUnitItem(activeData);
        // setOpenFileIsOpen(true);
      } else if (actionEnum === ActionsEnum.matching.key) {
        GlobalHistory.push(
          `/home/units/unit-profile-edit?formType=${activeData.unitTypeId}&id=${activeData.id
          }&operationType=${activeData.operationType}&matching=${true}`
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
        unitsFilter: {
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
    sideMenuComponentUpdate(null);
    sideMenuIsOpenUpdate(false);
    getUnitsData();
  }, [getUnitsData]);
  const onCardClick = useCallback(
    (item, selectedIndex) => (event) => {
      event.stopPropagation();
      event.preventDefault();
      setActiveCard(item);
      dispatch(ActiveItemActions.activeItemRequest(item));
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
  // useEffect(() => {
  //   getUnitsData();
  // }, [getUnitsData]);
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
  const changeActiveFormType = (value) => {
    setActiveFormType(value);
  };
  const changeActiveUnitStatus = (value) => {
    const index = value.findIndex((el) => el === 0);
    if (index !== -1) value.splice(index, 1);
    if (value.length === 0) value.push(0);
    setUnitStatus(value);
  };
  useEffect(() => {
    const data = localStorage.getItem('UnitFilter');

    if (data) {
      setSearchData(JSON.parse(data));
      searchchachedClickedWithoutFilter(JSON.parse(data));
    } else
      getUnitsData();
  }, []);

  useEffect(() => {
    if (isFirst1) {
      if (searchData && searchData.length === 0) {
        localStorage.removeItem('UnitFilter');
        getUnitsData();
      } else
        localStorage.setItem('UnitFilter', JSON.stringify(searchData));
    } else
      setFirst1(true);
  }, [searchData]);

  useEffect(() => {
    if (!isFirst) setFirst(true);
    else {
      const data = localStorage.getItem('UnitFilter');
      if (data)
        searchchachedClickedWithoutFilter(JSON.parse(data));
      else
        getUnitsData();
    }
  }, [activeFormType, filter, filterSearchDto, orderBy, unitStatus]);

  return (
    <div className='view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section'>
              <ActionsButtonsComponent
                onActionsButtonClicked={onActionsButtonClicked}
                onActionButtonChanged={onActionButtonChanged}
              />
            </div>
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
                        (item) => item.key === option.key && item.value === searchInputValue
                      ) !== -1}
                    tagValues={searchData}
                    inputValue={searchInputValue}
                    onInputChange={inputValueChanged}
                    inputLabel='filter'
                    inputPlaceholder='search-units'
                  />
                </div>
                <div className='d-inline-flex pl-5-reversed'>
                  <SelectComponet
                    data={[
                      { id: 'Sale', name: 'sale' },
                      { id: 'Rent', name: 'rent' },
                    ]}
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
                  <SelectComponet
                    data={Object.values(UnitsStatusEnum)}
                    emptyItem={{
                      value: 0,
                      text: 'select-status',
                      isDisabled: true,
                      isHiddenOnOpen: true,
                    }}
                    value={unitStatus}
                    valueInput='value'
                    textInput='value'
                    multiple
                    onSelectChanged={changeActiveUnitStatus}
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
            </div>
          </div>
        </div>
        {activeActionType !== ViewTypesEnum.tableView.key && (
          <>
            <div className='cards-filter-section px-2'>
              <span className='mx-2'>{t(`${translationPath}units`)}</span>
              <span className='separator-v s-primary s-reverse s-h-25px' />
              {/* <CheckboxesComponent
                idRef='selectCheckboxRef'
                onSelectedCheckboxChanged={(event, checked) => {
                  setIsSelect(checked);
                }}
                label={t(`${translationPath}select`)}
              /> */}
              <span className='mx-2'>
                <span>
                  {t(`${translationPath}order-by`)}
                  :
                </span>
                <span className='p-relative'>
                  <Button
                    className='btns theme-transparent'
                    onClick={() => setOrderByToggler((item) => !item)}
                  >
                    <span>{t(`${translationPath}${orderByToggler ? 'show' : 'hide'}`)}</span>
                    <span />
                    <span className={`mdi mdi-menu-${orderByToggler ? 'down' : 'up'}`} />
                  </Button>

                  <CollapseComponent
                    isOpen={orderByToggler}
                    top={23}
                    isCentered
                    onClickOutside={(event) => {
                      if (
                        orderByToggler &&
                        event.target.className &&
                        !event.target.className.includes('MuiListItem-root')
                      )
                        setOrderByToggler(false);
                    }}
                    component={(
                      <div className='cards'>
                        <div className='card-header'>
                          <span className='texts-large'>{t(`${translationPath}order-by`)}</span>
                        </div>
                        <form noValidate onSubmit={orderBySubmitted} className='card-content'>
                          <div>
                            <SelectComponet
                              idRef='filterByRef'
                              data={[
                                { id: 'createdOn', filterBy: 'created-on' },
                                { id: 'updateOn', filterBy: 'last-updated' },
                              ]}
                              value={selectedOrderBy.filterBy}
                              onSelectChanged={filterByChanged}
                              wrapperClasses='mb-3'
                              themeClass='theme-underline'
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
                          <div>
                            <SelectComponet
                              idRef='orderByRef'
                              data={[
                                { id: 1, orderBy: 'ascending' },
                                { id: 2, orderBy: 'descending' },
                              ]}
                              value={selectedOrderBy.orderBy}
                              onSelectChanged={orderByChanged}
                              wrapperClasses='mb-3'
                              themeClass='theme-underline'
                              isRequired
                              valueInput='id'
                              textInput='orderBy'
                              emptyItem={{ value: null, text: 'select-sort-by', isDisabled: false }}
                              parentTranslationPath={parentTranslationPath}
                              translationPath={translationPath}
                              translationPathForData={translationPath}
                            />
                          </div>
                          <div className='d-flex-center mb-3'>
                            <Button
                              className='btns theme-solid'
                              type='submit'
                              disabled={!selectedOrderBy.filterBy || !selectedOrderBy.orderBy}
                            >
                              <span>{t(`${translationPath}apply`)}</span>
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
                  />
                </span>
              </span>
            </div>
            <div className='body-section'>
              <UnitsCardsComponent
                data={detailsUnitsList}
                isExpanded={isExpanded}
                onCardClicked={onCardClick}
                onFooterActionsClicked={detailedCardSideActionClicked}
                // onActionClicked={detailedCardActionClicked}
                checkedDetailedCards={checkedDetailedCards}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                withCheckbox={isSelect}
                onCardCheckboxClick={cardCheckboxClicked}
                activeCard={activeCard}
              />
            </div>
          </>
        )}

        {activeActionType === ViewTypesEnum.tableView.key && (
          <div className='w-100 px-3'>
            <Tables
              data={detailsUnitsList.result}
              headerData={[
                { id: 1, label: 'name', input: 'name' },
                { id: 2, label: 'type', input: 'unitType' },
                {
                  id: 4,
                  label: 'creation',
                  input: 'creationDate',
                  isDate: true,
                },

                { id: 5, label: 'progress', input: 'progressWithPercentage' },
                {
                  id: 6,
                  label: 'status',
                  component: (item) => (
                    <div>
                      {item.unit &&
                        item.unit.operation_type.lookupItemId === UnitsOperationTypeEnum.rent.key ?
                        t('Shared:actions-buttons.rent') :
                        t('Shared:actions-buttons.sale')}
                    </div>
                  ),
                },
                {
                  id: 7,
                  label: 'price',
                  component: (item) => <div>{item.price}</div>,
                },
                {
                  id: 8,
                  label: 'id',
                  component: (item) => <div>{item.id}</div>,
                },
                {
                  id: 9,
                  label: 'lead-owner',
                  component: (item) => (
                    <div>
                      {item.lead_owner && item.lead_owner.name}
                    </div>
                  ),
                },
                {
                  id: 10,
                  label: 'furnished',
                  component: (item) => (
                    <div>
                      {detailsUnitsList.result.map((el) =>
                        (el.name === item.name ? el.details[2].value : ''))}
                    </div>
                  ),
                },
                {
                  id: 11,
                  label: 'listing-agent',
                  component: (item) => (
                    <div>
                      {detailsUnitsList.result.map((el) =>
                        (el.name === item.name ? el.details[3].value : ''))}
                    </div>
                  ),
                },
              ]}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              actionsOptions={{
                onActionClicked: tableActionClicked,
              }}
              defaultActions={[
                {
                  enum: TableActions.openFile.key,
                },
                {
                  enum: TableActions.editText.key,
                },
              ]}
              parentTranslationPath={parentTranslationPath}
              itemsPerPage={filter.pageSize}
              activePage={filter.pageIndex}
              focusedRowChanged={focusedRowChanged}
              totalItems={detailsUnitsList ? detailsUnitsList.totalCount : 0}
            />
          </div>
        )}
      </div>
      <UnitsImportDialog
        isOpen={isOpenImportDialog}
        isOpenChanged={() => setIsOpenImportDialog(false)}
      />
    </div>
  );
};
