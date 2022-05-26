import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ActionsButtonsComponent, Spinner } from '../../../Components';
import { FormsIdsEnum, MyLeadsTypesEnum } from '../../../Enums';
import { useTitle } from '../../../Hooks';
import {
  GetMyLeadAdvanceSearch,
  GetAllSearchableFormFieldsByFormId,
} from '../../../Services';
import { LeadsMapper } from '../LeadsView/LeadsUtilities/LeadsMapper/LeadsMapper';
import {
  MyLeadsTable,
  AddNewLeadDialog,
  MyLeadAdvancedSearch,
  MyLeadOrderByComponent,
  MyLeadFieldsValidations,
} from './MyLeadsUtilities';

const parentTranslationPath = 'MyLeadView';
const translationPath = '';
export const MyLeadsView = () => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const searchTimer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchableFormFields, setSearchableFormFields] = useState([]);
  const [formType, setFormType] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [filterSearchDto, setFilterSearchDto] = useState(null);
  const [activeFormType, setActiveFormType] = useState(0);
  const [leadType, setLeadType] = useState(0);
  const [schema, setSchema] = useState({});
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const [selectedOrderBy, setSelectedOrderBy] = useState({
    filterBy: orderFilter.MyLeadFilter.filterBy,
    orderBy: orderFilter.MyLeadFilter.orderBy,
  });
  const [orderBy, setOrderBy] = useState(
    selectedOrderBy.filterBy ? selectedOrderBy : {}
  );
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
    const result = await GetAllSearchableFormFieldsByFormId(
      FormsIdsEnum.leadsOwner.id
    );
    if (!(result && result.status && result.status !== 200)) {
      setSearchableFormFields(
        result &&
        result
          .filter((item) => item.isSearchable)
          .map((item) => ({
            key: item.searchableKey,
            title: item.formFieldTitle,
          }))
      );
    } else setSearchableFormFields([]);
  }, []);
  useEffect(() => {
    getAllSearchableFormFieldsByFormId();
  }, [getAllSearchableFormFieldsByFormId]);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  useTitle(t(`${translationPath}my-leads`));
  const defaultState = {
    leadClassId: null,
    salutationId: null,
    firstName: null,
    lastName: null,
    mobileNumbers: [],
    emailAddresses: [],
    languageId: null,
    nationalityId: null,
    cityId: null,
    districtId: null,
    communityId: null,
    propertyId: null,
    unitTypeId: null,
    numberOfBedroom: null,
    numberOfBathroom: null,
    priceFrom: null,
    priceTo: null,
    areaFrom: null,
    areaTo: null,
    leadStatusId: null,
    leadRatingId: null,
    sourceOfClientId: null,
  };
  const [state, setState] = useReducer(reducer, defaultState);
  const deafultSelected = {
    nationality: null,
    property: null,
    unitType: null,
    leadStatus: null,
    leadRating: null,
    clientSource: null,
  };
  const [selected, setSelected] = useReducer(reducer, deafultSelected);
  const onSelectedChangeHandler = (valueId, newValue) => {
    setSelected({ id: valueId, value: newValue });
  };
  const getAllMyLeads = useCallback(async () => {
    setIsLoading(true);
    const res = await GetMyLeadAdvanceSearch(filter, {
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
        result: ((res && res.result) || []).map((item) =>
          LeadsMapper(item, res, t)),
        totalCount: (res && res.totalCount) || 0,
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
    getAllMyLeads();
  }, [filter]);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  const onFormTypeSelectChanged = (form) => {
    setState({ id: 'leadClassId', value: form });
    setFormType(form);
    setIsOpenConfirmDialog(true);
  };
  useEffect(() => {
    setSchema(MyLeadFieldsValidations(state, translationPath, t));
  }, [state, t]);
  return (
    <div className='my-leads-wrapper view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section'>
              <ActionsButtonsComponent
                withType
                typeData={MyLeadsTypesEnum}
                onFormTypeSelectChanged={onFormTypeSelectChanged}
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
          <MyLeadOrderByComponent
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            orderFilter={orderFilter}
            selectedOrderBy={selectedOrderBy}
            setSelectedOrderBy={setSelectedOrderBy}
          />
        </div>
        <MyLeadsTable
          filter={filter}
          setFilter={setFilter}
          myLeads={detailsLeadsList}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          setIsOpenConfirmDialog={setIsOpenConfirmDialog}
        />
      </div>
      <AddNewLeadDialog
        isOpenChanged={() => {
          setFormType(null);
          setActiveItem(null);
          setIsOpenConfirmDialog(false);
          setState({ id: 'edit', value: defaultState });
          setSelected({ id: 'edit', value: defaultState });
        }}
        reloadData={() => {
          setFormType(null);
          setIsOpenConfirmDialog(false);
          setState({ id: 'edit', value: defaultState });
          setSelected({ id: 'edit', value: defaultState });
          setFilter((item) => ({ ...item, pageIndex: 0 }));
        }}
        state={state}
        schema={schema}
        selected={selected}
        formType={formType}
        setState={setState}
        activeItem={activeItem}
        isOpen={isOpenConfirmDialog}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        onSelectedChangeHandler={onSelectedChangeHandler}
      />
    </div>
  );
};
