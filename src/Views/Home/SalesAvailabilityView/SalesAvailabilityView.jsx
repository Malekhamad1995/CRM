import { ButtonBase } from '@material-ui/core';
import React, {
 useCallback, useEffect, useRef, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Spinner } from '../../../Components';
import { FormsIdsEnum } from '../../../Enums';
import { useTitle } from '../../../Hooks';
import {
  GetAllSearchableFormFieldsByFormId,
  GetAllSaleAvailableUnitsAdvanceSearch,
} from '../../../Services';
import { MyLeadAdvancedSearch, MyLeadOrderByComponent } from '../MyLeadsView/MyLeadsUtilities';
import { UnitMapper } from '../UnitsView/UnitMapper';
import { SalesAvailabilityTableView, UntZeroMatchingDialog } from './MyLeadsUtilities';

const parentTranslationPath = 'SalesAvailabilityView';
const translationPath = '';
export const SalesAvailabilityView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const searchTimer = useRef(null);
  const [isZeroMatchingOpen, setIsZeroMatchingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchableFormFields, setSearchableFormFields] = useState([]);
  const [filterSearchDto, setFilterSearchDto] = useState(null);
  const [activeFormType, setActiveFormType] = useState(0);
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const [selectedOrderBy, setSelectedOrderBy] = useState({
    filterBy: orderFilter.SalesAvailabilityFilter.filterBy,
    orderBy: orderFilter.SalesAvailabilityFilter.orderBy,
  });
  const [orderBy, setOrderBy] = useState(selectedOrderBy.filterBy ? selectedOrderBy : {});
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
    search: '',
  });
  const [detailsLeadsList, setDetailsLeadsList] = useState(() => ({
    result: [],
    totalCount: 0,
  }));
  const getAllSearchableFormFieldsByFormId = useCallback(async () => {
    const result = await GetAllSearchableFormFieldsByFormId(FormsIdsEnum.units.id);
    if (!(result && result.status && result.status !== 200)) {
      setSearchableFormFields(
        result &&
          result
            .filter((item) => item.isSearchable)
            .map((item) => ({ key: item.searchableKey, title: item.formFieldTitle }))
      );
    } else setSearchableFormFields([]);
  }, []);
  useEffect(() => {
    getAllSearchableFormFieldsByFormId();
  }, [getAllSearchableFormFieldsByFormId]);
  useTitle(t(`${translationPath}sales-availability`));
  const getAllMySale = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllSaleAvailableUnitsAdvanceSearch(filter, {
      criteria:
        (filterSearchDto &&
          ((Object.keys(filterSearchDto).length > 0 &&
            activeFormType && {
              ...filterSearchDto,
              'operation_type.lookupItemName': activeFormType,
            }) ||
            filterSearchDto)) ||
        (activeFormType && { 'operation_type.lookupItemName': activeFormType }) ||
        {},
      ...orderBy,
    });
    if (!(res && res.status && res.status !== 200)) {
      setDetailsLeadsList({
        result: ((res && res.result) || []).map((item) => UnitMapper(item, res, t)),
      });
    } else {
      setDetailsLeadsList({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [activeFormType, filter, filterSearchDto, orderBy, t]);
  useEffect(() => {
    getAllMySale();
  }, [filter, getAllMySale]);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  return (
    <div className='my-leads-wrapper view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section px-1'>
            <div className='section'>
              <ButtonBase
                className='btns theme-solid px-4 mx-3'
                onClick={() => setIsZeroMatchingOpen(true)}
              >
                {t(`${translationPath}zero-matching`)}
              </ButtonBase>
            </div>
            <MyLeadAdvancedSearch
              setFilter={setFilter}
              activeFormType={activeFormType}
              filterSearchDto={filterSearchDto}
              setActiveFormType={setActiveFormType}
              setFilterSearchDto={setFilterSearchDto}
              searchableFormFields={searchableFormFields}
            />
          </div>
          <div className='section pl-2 pr-2'>
            <MyLeadOrderByComponent
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              orderFilter={orderFilter}
              selectedOrderBy={selectedOrderBy}
              setSelectedOrderBy={setSelectedOrderBy}
            />
          </div>
        </div>
        <SalesAvailabilityTableView
          filter={filter}
          myLeads={detailsLeadsList}
          setFilter={setFilter}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      </div>
      {isZeroMatchingOpen && (
        <UntZeroMatchingDialog
          isOpen={isZeroMatchingOpen}
          reloadData={() => setIsZeroMatchingOpen(false)}
          isOpenChanged={() => setIsZeroMatchingOpen(false)}
        />
      )}
    </div>
  );
};
