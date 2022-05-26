import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Spinner } from '../../../Components';
import { FormsIdsEnum } from '../../../Enums';
import { useTitle } from '../../../Hooks';
import { sideMenuIsOpenUpdate, sideMenuComponentUpdate } from '../../../Helper';
import {
  GetAllSearchableFormFieldsByFormId,
  GetAllMReferredLeadAdvanceSearch,
} from '../../../Services';
import { LeadsMapper } from '../LeadsView/LeadsUtilities/LeadsMapper/LeadsMapper';
import { MyLeadAdvancedSearch, MyLeadOrderByComponent } from '../MyLeadsView/MyLeadsUtilities';
import {
  MyReferralsCardDetailsComponent,
  MyReferralsTableView,
  UpdateActivityDialog,
} from './MyReferralsUtilities';

const parentTranslationPath = 'MyReferralsView';
const translationPath = '';
export const MyReferralsView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const searchTimer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [searchableFormFields, setSearchableFormFields] = useState([]);
  const [filterSearchDto, setFilterSearchDto] = useState(null);
  const [activeFormType, setActiveFormType] = useState(0);
  const [leadType, setLeadType] = useState(0);
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const [selectedOrderBy, setSelectedOrderBy] = useState({
    filterBy: orderFilter.MyReferralsFilter.filterBy,
    orderBy: orderFilter.MyReferralsFilter.orderBy,
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
    const result = await GetAllSearchableFormFieldsByFormId(FormsIdsEnum.leadsOwner.id);
    if (!(result && result.status && result.status !== 200)) {
      setSearchableFormFields(
        result &&
        result
          .filter((item) => item.isSearchable)
          .map((item) => ({ key: item.searchableKey, title: item.formFieldTitle }))
      );
    } else setSearchableFormFields([]);
  }, []);
  const focusedRowChanged = useCallback(
    (rowIndex) => {
      setActiveItem(detailsLeadsList.result[rowIndex]);
      if (rowIndex !== -1) {
        sideMenuComponentUpdate(
          <MyReferralsCardDetailsComponent
            translationPath={translationPath}
            setOpenConfirmDialog={setOpenConfirmDialog}
            parentTranslationPath={parentTranslationPath}
            activeData={detailsLeadsList.result[rowIndex]}
          />
        );
        sideMenuIsOpenUpdate(true);
      } else {
        sideMenuComponentUpdate(<></>);
        sideMenuIsOpenUpdate(false);
      }
    },
    [detailsLeadsList.result]
  );
  useEffect(
    () => () => {
      sideMenuComponentUpdate(null);
      sideMenuIsOpenUpdate(false);
    },
    []
  );
  useEffect(() => {
    getAllSearchableFormFieldsByFormId();
  }, [getAllSearchableFormFieldsByFormId]);
  useTitle(t(`${translationPath}my-referrals`));
  const getAllMyReferrals = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllMReferredLeadAdvanceSearch(filter, {
      criteria:
        (filterSearchDto &&
          ((Object.keys(filterSearchDto).length > 0 &&
            activeFormType && {
            ...filterSearchDto,
            lead_type_id: activeFormType,
            leadClass: leadType,
          }) ||
            filterSearchDto)) ||
        (leadType && { leadClass: leadType }) ||
        (activeFormType && { lead_type_id: activeFormType }) ||
        {},
      ...orderBy,
    });
    if (!(res && res.status && res.status !== 200)) {
      setDetailsLeadsList({
        result: ((res && res.result) || []).map((item) => LeadsMapper(item, res, t)),
      });
    } else {
      setDetailsLeadsList({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [activeFormType, filter, filterSearchDto, leadType, orderBy, t]);
  useEffect(() => {
    getAllMyReferrals();
  }, [filter, getAllMyReferrals]);
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
            <div className='section pt-3'>
              <MyLeadOrderByComponent
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                orderFilter={orderFilter}
                selectedOrderBy={selectedOrderBy}
                setSelectedOrderBy={setSelectedOrderBy}
              />
            </div>
            <MyLeadAdvancedSearch
              leadType={leadType}
              setFilter={setFilter}
              setLeadType={setLeadType}
              activeFormType={activeFormType}
              filterSearchDto={filterSearchDto}
              setActiveFormType={setActiveFormType}
              setFilterSearchDto={setFilterSearchDto}
              searchableFormFields={searchableFormFields}
            />
          </div>
        </div>
        <MyReferralsTableView
          filter={filter}
          myLeads={detailsLeadsList}
          setFilter={setFilter}
          focusedRowChanged={focusedRowChanged}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      </div>
      {openConfirmDialog && (
        <UpdateActivityDialog
          isOpen={openConfirmDialog}
          activeItem={activeItem}
          reloadData={() => {
            setActiveItem(null);
            setOpenConfirmDialog(false);
            sideMenuComponentUpdate(null);
            sideMenuIsOpenUpdate(false);
          }}
          isOpenChanged={() => {
            setActiveItem(null);
            setOpenConfirmDialog(false);
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};
