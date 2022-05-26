import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Tables, Spinner } from '../../../../../../Components'
import { GetAllRelatedActivities } from '../../../../../../Services'
import { useTranslation } from 'react-i18next';
import { SwitchComponent } from '../../../../../../Components/Controls'
import { useTitle } from '../../../../../../Hooks';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { ButtonBase } from '@material-ui/core';
import { GlobalOrderFilterActions } from '../../../../../../store/GlobalOrderFilter/GlobalOrderFilterActions';
import { Inputs } from '../../../../../../Components/Controls/Inputs/Inputs'
import { ActivitiesManagementDialog } from './Dialogs/ActivitiesManagementDialog';
import { TableActions } from '../../../../../../Enums';
import { GetParams} from '../../../../../../Helper';
const parentTranslationPath = 'LeadsProfileManagementView';
const translationPath = '';


export const LeadActivitiesComponent = () => {

  const [openDialog, setOpenDialog] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  const addNewHandler = () => {
    setOpenDialog(true);
  };
  const dispatch = useDispatch();
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);

  const [activities, setActivities] = useState({
    result: [],
    totalCount: 0,
  });
  const [activeItem, setActiveItem] = useState(null);
  const [searchedItem, setSearchedItem] = useState('');
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
    agentId: null,
    relatedUnitNumberId: null,
    relatedLeadNumberId: null,
  });
  const [orderBy, setOrderBy] = useState({ filterBy: null, orderBy: null });
  const [sortBy, setSortBy] = useState(null);


  
  
  
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}activities`));
  
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({
      ...item,
      pageIndex,
      search: '',
      agentId: null,
      relatedUnitNumberId: null,
      relatedLeadNumberId: null
    }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({
      ...item,
      pageIndex: 0,
      pageSize,
      search: '',
      agentId: null,
      relatedUnitNumberId: null,
      relatedLeadNumberId: null,
    }));
  };

  useEffect(() => {
      if (sortBy) {
      setOrderBy((item) => ({
       ...item,
          filterBy: sortBy.filterBy,
          orderBy: sortBy.orderBy,
       }));
       dispatch(
        GlobalOrderFilterActions.globalOrderFilterRequest({
          ...orderFilter,
          SaleLeadsActivitiesFilter: {
            filterBy: sortBy.filterBy,
            orderBy: sortBy.orderBy,
          },
        })
      );
      setOrderBy((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
      }
    }, [sortBy]);
  const searchTimer = useRef(null);


  const searchHandler = (event) => {
    const { value } = event.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({
        ...item,
        search: value,
        pageIndex: 0,
        agentId: null,
        relatedUnitNumberId: null,
        relatedLeadNumberId: null
      }));
    }, 700);
  };

  const tableActionClicked = useCallback(
    (actionEnum, item, focusedRow, event) => {
      event.stopPropagation();
      event.preventDefault();
      if (actionEnum === TableActions.editText.key) {
        setActiveItem(item);
        setOpenDialog(true);
      }
    },
    []
  );

  const getAllActivities = async () => {

    setIsLoadingActivities(true);

    const relatedLeadId = +GetParams('id');

    const body = {
      ...filter, pageIndex: filter.pageIndex + 1, relatedLeadNumberId: relatedLeadId,  filterBy: orderBy.filterBy, orderBy: orderBy.orderBy,
    }

    const res = await GetAllRelatedActivities(body);

    if (!(res && res.status && res.status !== 200)) {

      setActivities({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setActivities({
        result: [],
        totalCount: 0,
      });
    }

    setIsLoadingActivities(false);

  }



  useEffect(() => {
    getAllActivities()
  }, [filter,orderBy])

  return (
    <div className='view-wrapper'>{console.log(activities)}
      <Spinner isActive={isLoadingActivities} />
      <div className='d-flex-column'>
          <div className='activities-top-section'>
            {/* <PermissionsComponent
                  permissionsList={Object.values(ActivitiesSalesPermissions)}
                  permissionsId={ActivitiesSalesPermissions.AddNewActivity.permissionsId}
                > */}
            <div>
              <ButtonBase className='btns theme-solid' onClick={addNewHandler}>
                <span className='mdi mdi-plus' />
                {t(`${translationPath}add-new`)}
              </ButtonBase>
              {/* </PermissionsComponent> */}
            </div>

            <div className='d-flex-column'>
              <Inputs
                value={searchedItem}
                onKeyUp={searchHandler}
                idRef='activitiesSearchRef'
                label={t(`${translationPath}search-activity`)}
                onInputChanged={(e) => setSearchedItem(e.target.value)}
                inputPlaceholder={t(`${translationPath}search-activity`)}
                beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
              />
            </div>

          </div>
          <div className='w-100 px-3'>
            <Tables
              data={activities.result}
              headerData={[
                {
                  id: 1,
                  isSortable: true,
                  label: 'date',
                  input: 'activityDate',
                  isDate: true,
                },
                {
                  id: 11,
                  isSortable: true,
                  label: 'created-By-Name',
                  input: 'createdBy',
                  component: (item) => (
                    <span className='c-primary'>
                      {(item.createdByName ||
                        'N/A')}
                    </span>
                  ),
                },
                {
                  id: 2,
                  label: 'related-to',
                  component: (item) => (
                    <span className='c-primary'>
                      {(item.relatedLeadNumberId &&
                        t(`${translationPath}lead`)) ||
                        (item.relatedMaintenanceContractId &&
                          t(`${translationPath}MaintenanceContract`)) ||
                        (item.relatedUnitNumberId &&
                          t(`${translationPath}unit`)) ||
                        (item.relatedPortfolioName &&
                          t(`${translationPath}Portfolio`)) ||
                        (item.relatedWorkOrderRefNumber &&
                          t(`${translationPath}WorkOrder`)) ||
                        (item.relatedUnitPropertyName &&
                          t(`${translationPath}Property`)) ||
                        (item.relatedPortfolioId &&
                          t(`${translationPath}Portfolio`)) ||
                        (item.relatedWorkOrderId &&
                          t(`${translationPath}WorkOrder`)) ||
                        'N/A'}
                    </span>
                  ),
                },
                {
                  id: 3,
                  label: 'related-to-number',
                  component: (item) => (
                    <span className='c-primary'>
                      {(item.relatedLeadNumberId ||
                        'N/A')}
                    </span>
                  ),
                },
                {
                  label: 'related-to-name',
                  component: (item) => (
                    <span className='c-primary'>
                      {(item.contactName ||
                        'N/A')}
                    </span>
                  ),
                },
                {
                  id: 4,
                  isSortable: true,
                  label: 'status',
                  input: 'isOpen',
                  component: (item, index) => (
                    <SwitchComponent
                      idRef={`isOpenRef${index + 1}`}
                      isChecked={item.isOpen}
                      labelClasses='px-0'
                      themeClass='theme-line'
                      labelValue={(item.isOpen && 'open') || 'closed'}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  ),
                  isSortable: true,
                },
                {
                  id: 5,
                  label: 'assigned-to',
                  input: 'agentName',
                  isSortable: true,
                },
                {
                  id: 6,
                  label: 'contact-name',
                  input: 'contactName',
                },
                {
                  id: 7,
                  isSortable: true,
                  label: 'stage',
                  input:'stage',
                  component: (item) => (
                    <span>
                      {item.activityType&&item.activityType.leadStageName ||
                        t(`${translationPath}not-contacted`)}
                    </span>
                  ),
                  isSortable: true,
                },
                {
                  id: 8,
                  isSortable: true,
                  label: 'category',
                  input: 'categoryName',
                  component: (item) => (
                    <span>
                      {item.activityType.categoryName ||''}
                    </span>
                  ),
                  isSortable: true,
                },
                {
                  id: 9,
                  isSortable: true,
                  label: 'activity-type',
                  input: 'activityType',
                  component: (item) => (
                    <span>
                      {item.activityType&&item.activityType.activityTypeName ||''}
                    </span>
                  ),
                },
                {
                  id: 10,
                  isSortable: true,
                  label: 'subject',
                  input: 'subject',
                },
              ]}
              defaultActions={[
                {
                  enum: TableActions.editText.key,
                },
              ]}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              actionsOptions={{
                onActionClicked: tableActionClicked,
              }}

              itemsPerPage={filter.pageSize}
              activePage={filter.pageIndex}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              totalItems={activities.totalCount}
              setSortBy={setSortBy}
            />

            {
              openDialog && (
                <ActivitiesManagementDialog
                  activeItem={activeItem}
                  open={openDialog}
                  onSave={() => {
                    setOpenDialog(false);
                    onPageIndexChanged(0);
                    setActiveItem(null)
                  }}
                  close={() => {
                    setOpenDialog(false);
                    setActiveItem(null);
                  }}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                />
              )
            }
          </div>
      </div>
    </div>
  )
}
