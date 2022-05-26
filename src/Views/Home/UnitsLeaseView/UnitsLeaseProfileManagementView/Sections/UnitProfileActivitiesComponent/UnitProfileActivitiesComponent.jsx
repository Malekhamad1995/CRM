import React, {
  useState, useRef, useEffect, useCallback
} from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  Inputs, Spinner, SwitchComponent, Tables
} from '../../../../../../Components';
import { useTitle } from '../../../../../../Hooks';
import { TableActions } from '../../../../../../Enums';
import { ActivitiesManagementDialog } from './ActivitiesViewUtilities/Dialogs/ActivitiesManagementDialog';
import {
  GetActivityById,
  GetAllActivitiesByUnitId,
} from '../../../../../../Services';
import { ActivityDeleteDialog } from './ActivitiesViewUtilities';
import { GetParams } from '../../../../../../Helper';

const parentTranslationPath = 'ActivitiesView';
const translationPath = '';

export const UnitProfileActivitiesComponent = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [searchedItem, setSearchedItem] = useState('');
  const [activeItem, setActiveItem] = useState(null);
  const [activities, setActivities] = useState({
    result: [],
    totalCount: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const searchTimer = useRef(null);
  const [filter, setFilter] = useState({
    contactId: +GetParams('id'),
    pageSize: 25,
    pageIndex: 0,
    search: ''
  });
  const [isEdit, setisEdit] = useState(false);
  useTitle(t(`${translationPath}activities`));

  const getAllActivities = useCallback(async () => {
    setIsLoading(true);
    const res =
      (await GetAllActivitiesByUnitId(filter));
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
    setIsLoading(false);
  }, [filter]);

  useEffect(() => {
    getAllActivities();
  }, [getAllActivities]);

  const GetActivityAPI = useCallback(async (activityId) => {
    const res = await GetActivityById(activityId);
    if (!(res && res.status && res.status !== 200)) setActiveItem(res);
  }, []);

  const searchHandler = (event) => {
    const { value } = event.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({ ...item, search: value }));
    }, 700);
  };
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
        setOpenConfirmDialog(true);
        setActiveItem(item);
      } else if (actionEnum === TableActions.editText.key) {
        GetActivityAPI(item.activityId);
        setOpenDialog(true);
        setisEdit(true);
      }
    },
    [GetActivityAPI]
  );

  const addNewHandler = () => {
    setOpenDialog(true);
  };

  return (
    <div className='view-wrapper activities-view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section px-2 mt-3'>
            <div className='section'>
              <ButtonBase className='btns theme-solid px-3' onClick={addNewHandler}>
                <span className='mdi mdi-plus' />
                {t(`${translationPath}add-new`)}
              </ButtonBase>
            </div>
            <div className='section px-2'>
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
        </div>
        <div className='w-100 px-3'>
          {!isLoading && (
            <Tables
              data={activities.result}
              headerData={[
                {
                  id: 1,
                  label: 'date',
                  input: 'activityDate',
                  isDate: true,
                  isSortable:true,
                },
                {
                  id: 2,
                  label: 'related-to',
                  input: 'relatedTo',
                  component: (item) => (
                    <span className='c-primary'>
                      {(item.relatedLeadNumberId && t(`${translationPath}lead`)) ||
                        (item.relatedMaintenanceContractId &&
                          t(`${translationPath}MaintenanceContract`)) ||
                        (item.relatedPortfolioName && t(`${translationPath}Portfolio`)) ||
                        (item.relatedWorkOrderRefNumber && t(`${translationPath}WorkOrder`)) ||
                        (item.relatedUnitPropertyName && t(`${translationPath}Property`)) ||
                        (item.relatedPortfolioId && t(`${translationPath}Portfolio`)) ||
                        (item.relatedUnitNumberId && t(`${translationPath}unit`)) ||
                        (item.relatedWorkOrderId && t(`${translationPath}WorkOrder`)) ||
                        'N/A'}
                    </span>
                  ),
                  isSortable:true,
                },
                {
                  id: 3,
                  label: 'related-to-number',
                  input: 'relatedToName',
                  component: (item) => (
                    <span className='c-primary'>
                      {(item.relatedLeadNumberId && item.contactName) ||
                        (item.relatedMaintenanceContractId && item.relatedMaintenanceContractId) ||
                        (item.relatedWorkOrderRefNumber && item.relatedWorkOrderRefNumber) ||
                        (item.relatedPortfolioName && item.relatedPortfolioName) ||
                        (item.relatedUnitNumberId && item.relatedUnitNumber) ||
                        (item.relatedUnitNumber && item.relatedUnitNumber) ||
                        (item.relatedUnitPropertyName && item.relatedUnitNumber) ||
                        (item.relatedPortfolioId && item.item.relatedPortfolioName) ||
                        (item.relatedWorkOrderId && item.relatedWorkOrderRefNumber) ||
                        'N/A'}
                    </span>
                  ),
                  isSortable:true,
                },
                {
                  id: 4,
                  label: 'stage',
                  input: 'stage',
                  component: (item) => (
                    <span>
                      {item.activityType.leadStageName || t(`${translationPath}not-contacted`)}
                    </span>
                  ),
                  isSortable:true,
                },
                {
                  id: 5,
                  label: 'assign-to',
                  input: 'agentName',
                  isSortable:true,
                },

                {
                  id: 6,
                  label: 'category',
                  input: 'categoryName',
                  component: (item)=>(
                    <span>{item.activityType&&item.activityType.categoryName||''}</span>
                  ),
                  isSortable:true,
                },
                {
                  id: 7,
                  label: 'activity-type',
                  input: 'activityType',
                  component: (item)=>(
                    <span>{item.activityType&&item.activityType.activityTypeName||''}</span>
                  ),
                  isSortable:true,
                },
                {
                  id: 8,
                  label: 'subject',
                  input: 'subject',
                  component: (item) => <span>{(item.subject && item.subject) || 'N/A'}</span>,
                  isSortable:true,
                },
                {
                  id: 9,
                  label: 'status',
                  input: 'isOpen',
                  cellClasses: 'py-0',
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
                  isSortable:true,
                }, {
                  id: 13,
                  label: 'comments',
                  input: 'comments',
                  isDefaultFilterColumn: true,
                  isSortable:true,
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
          )}
        </div>
      </div>
      {openDialog && (
        <ActivitiesManagementDialog
          open={openDialog}
          activeItem={activeItem}
          isEdit={isEdit}
          onSave={() => {
            setOpenDialog(false);
            setActiveItem(null);
            onPageIndexChanged(0);
            setisEdit(false);
          }}
          close={() => {
            setActiveItem(null);
            setOpenDialog(false);
            setisEdit(false);
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {openConfirmDialog && (
        <ActivityDeleteDialog
          isOpen={openConfirmDialog}
          activeItem={activeItem}
          reloadData={() => {
            setOpenDialog(false);
            setActiveItem(null);
            onPageIndexChanged(0);
          }}
          isOpenChanged={() => {
            setActiveItem(null);
            setOpenDialog(false);
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};
