import React, {
  useState, useEffect, useCallback, useRef
} from 'react';
import './ContactProfileActivitiesComponentStyle.scss';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Inputs, Spinner, SwitchComponent, Tables, AutocompleteComponent
} from '../../../../../../Components';
import { useTitle } from '../../../../../../Hooks';
import { TableActions } from '../../../../../../Enums';
import { ActivitiesManagementDialog } from './ActivitiesViewUtilities/Dialogs/ActivitiesManagementDialog';
import { GetAllActivitiesByContactId, GetAllLeadsByContactId, OrganizationUserSearch } from '../../../../../../Services';
import { ActivityDeleteDialog } from './ActivitiesViewUtilities';
import { GetParams } from '../../../../../../Helper';
import { LeadsMapper } from '../../../../LeadsView/LeadsUtilities/LeadsMapper/LeadsMapper';

export const ContactProfileActivitiesComponent = ({
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  // const [isLoading, setIsLoading] = useState(false);
  const [isLoadings, setIsLoadings] = useState({
    allAgentsLoading: false,
    allLeadsLoading: false,
    allActivitiesLoading: false,
  });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [searchedItem, setSearchedItem] = useState('');
  const [agentName, setAgentName] = useState('');
  const searchTimer = useRef(null);
  const [activities, setActivities] = useState({
    result: [],
    totalCount: 0,
  });
  const [contactLeadsList, setContactLeadsList] = useState({
    result: [],
    totalCount: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState({
    contactId: +GetParams('id'),
    pageSize: 25,
    pageIndex: 0,
    search: '',
    leadId: null,
    orderBy: 1,
    filterBy: 'ActivityDate',
    userId: ''
  });
  const [sortBy, setSortBy] = useState(null);

  useTitle(t(`${translationPath}activities`));

  const getAllActivities = useCallback(async () => {
    setIsLoadings((loading) => ({ ...loading, allActivitiesLoading: true }));
    const res = await GetAllActivitiesByContactId({
      contactId: filter.contactId,
      pageSize: filter.pageSize,
      pageIndex: filter.pageIndex + 1,
      search: filter.search || '',
      leadId: filter.leadId,
      orderBy: filter.orderBy,
      filterBy: filter.filterBy,
      userId: filter.userId

    });
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
    setIsLoadings((loading) => ({ ...loading, allActivitiesLoading: false }));
  }, [filter]);

  const getAllLeadsRelateWithContactId = useCallback(async () => {
    setIsLoadings((loading) => ({ ...loading, allLeadsLoading: true }));
    const res = await GetAllLeadsByContactId({ pageIndex: 0, pageSize: 1000 }, +GetParams('id'));
    if (!(res && res.status && res.status !== 200)) {
      setContactLeadsList({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setContactLeadsList({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoadings((loading) => ({ ...loading, allLeadsLoading: false }));
  }, []);

  useEffect(() => {
    getAllActivities();
    getAllLeadsRelateWithContactId();
  }, [getAllActivities, getAllLeadsRelateWithContactId]);
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const tableActionClicked = useCallback(
    (actionEnum, item, focusedRow, event) => {
      event.stopPropagation();
      event.preventDefault();
      if (actionEnum === TableActions.deleteText.key) {
        setActiveItem(item);
        setOpenConfirmDialog(true);
      } else if (actionEnum === TableActions.editText.key) {
        setActiveItem(item);
        setOpenDialog(true);
      }
    },
    []
  );
  const getAllAgents = useCallback(async (searchValue) => {
    setIsLoadings((loading) => ({ ...loading, allAgentsLoading: true }));
    const res = await OrganizationUserSearch({ pageIndex: 0, pageSize: 10, name: searchValue });
    if (!(res && res.status && res.status !== 200)) {
      setAgentName({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setAgentName({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoadings((loading) => ({ ...loading, allAgentsLoading: false }));
  }, []);
  const searchHandler = (event) => {
    const { value } = event.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({ ...item, search: value }));
    }, 700);
  };

  const addNewHandler = () => {
    setOpenDialog(true);
  };

  useEffect(() => {
    if (sortBy)
      setFilter((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);

  useEffect(() => {
    getAllAgents();
  }, [getAllAgents]);
  return (
    <div className='view-wrapper activities-view-wrapper'>
      <Spinner isActive={isLoadings.allActivitiesLoading} />
      <div className='d-flex-column'>
        <div className='header-section-Contact-Activity'>
          <div className='filter-section px-2 content'>
            <div className='sectionx'>
              <ButtonBase className='btns theme-solid px-3' onClick={addNewHandler}>
                <span className='mdi mdi-plus' />
                {t(`${translationPath}add-new`)}
              </ButtonBase>
            </div>
            <div className='fieldsSearchInContactActivity'>

              <div className='d-flex-v-center-h-between pl-5-reverse'>
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
              <div className='w-100 p-relative'>
                <AutocompleteComponent
                  idRef='agentNameRef'
                  inputPlaceholder={t(`${translationPath}agent-name`)}
                  data={(agentName && agentName.result) || []}
                  multiple={false}
                  displayLabel={(option) =>
                    (option && option.fullName) || ''}
                  chipsLabel={(option) => (option && option.fullName) || ''}
                  withoutSearchButton
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onChange={(event, newValue) => {
                    setFilter((item) => ({ ...item, userId: (newValue && newValue.id) }));
                  }}
                  onInputKeyUp={(e) => {
                    const { value } = e.target;
                    if (searchTimer.current) clearTimeout(searchTimer.current);
                    searchTimer.current = setTimeout(() => {
                      getAllAgents(value);
                    }, 500);
                  }}
                  isLoading={isLoadings.allAgentsLoading}
                />

              </div>
              <div className='w-100 p-relative'>
                <AutocompleteComponent
                  idRef='leadIdRef'
                  multiple={false}
                  inputPlaceholder={t(`${translationPath}Lead`)}
                  data={(contactLeadsList && contactLeadsList.result) || []}
                  displayLabel={(option) =>
                    (option && `${option.lead.leadClass} ${option.leadId}`) || ''}
                  chipsLabel={(option) => (option && option.lead && `${option.lead.leadClass} ${option.leadId}`) || ''}
                  withoutSearchButton
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onChange={(event, newValue) => {
                    setFilter((item) => ({ ...item, leadId: newValue && newValue.leadId }));
                  }}
                  isLoading={isLoadings.allLeadsLoading}

                />
              </div>
            </div>
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
              },
              {
                id: 2,
                isSortable: true,
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
                input: 'RelatedTo'
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
              },
              {
                id: 5,
                label: 'assigned-to',
                input: 'agentName',
                isSortable: true,
              },
              {
                id: 6,
                isSortable: true,
                label: 'contact-name',
                input: 'contactName',
              },
              {
                id: 7,
                isSortable: true,
                label: 'stage',
                input: 'LeadStageName',
                component: (item) => (
                  <span>
                    {item.activityType.leadStageName ||
                      t(`${translationPath}not-contacted`)}
                  </span>
                ),
              },
              {
                id: 8,
                isSortable: true,
                label: 'category',
                input: 'CategoryName',
                component: (item) => (
                  <span>
                    {item.activityType.categoryName ||
                      t(`${translationPath}not-contacted`)}
                  </span>
                ),
              },
              {
                id: 9,
                isSortable: true,
                label: 'activity-type',
                input: 'ActivityTypeName',
                component: (item) => (
                  <span>
                    {item.activityType.activityTypeName ||
                      t(`${translationPath}not-contacted`)}
                  </span>
                ),
              },
              {
                id: 10,
                isSortable: true,
                label: 'subject',
                input: 'subject',
              },
              {
                id: 11,
                isSortable: true,
                label: 'copy-to',
                input: 'copyTo',
              }, {
                id: 12,
                label: 'comments',
                input: 'comments',
                isDefaultFilterColumn: true,
              },
            ]}
            defaultActions={[
              {
                enum: TableActions.editText.key,
              },
              // {
              //   enum: TableActions.deleteText.key,
              // },
            ]}
            setSortBy={setSortBy}
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
          />
        </div>
      </div>
      {
        openDialog && (
          <ActivitiesManagementDialog
            open={openDialog}
            activeItem={activeItem}
            onSave={() => {
              setOpenDialog(false);
              onPageIndexChanged(0);
              setActiveItem(null);
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
      {
        openConfirmDialog && (
          <ActivityDeleteDialog
            isOpen={openConfirmDialog}
            activeItem={activeItem}
            reloadData={() => {
              setOpenDialog(false);
              onPageIndexChanged(0);
              getAllActivities();
            }}
            isOpenChanged={() => setOpenDialog(false)}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
        )
      }
    </div>
  );
};

ContactProfileActivitiesComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
