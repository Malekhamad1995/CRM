import React, {
  useState, useEffect, useCallback
} from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Spinner, SwitchComponent, Tables
} from '../../../../../../Components';
import { useTitle } from '../../../../../../Hooks';
import { TableActions } from '../../../../../../Enums';
import { ActivitiesManagementDialog } from './ActivitiesViewUtilities/Dialogs/ActivitiesManagementDialog';
import { GetActivityById, GetAllActivitiesByUnitId } from '../../../../../../Services';
import { ActivityDeleteDialog } from './ActivitiesViewUtilities';
import { GetParams } from '../../../../../../Helper';

export const UnitProfileActivitiesComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [activities, setActivities] = useState({
    result: [],
    totalCount: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState({
    contactId: +GetParams('id'),
    pageSize: 25,
    pageIndex: 0,
  });
  const [isEdit, setisEdit] = useState(false);
  useTitle(t(`${translationPath}activities`));

  const getAllActivities = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllActivitiesByUnitId(filter);
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
          <div className='activities-filter-wrapper'>
            <div className='cards-filter-section px-2 mb-2'>
              <div className='section px-2'>
                <ButtonBase className='btns theme-solid px-3' onClick={addNewHandler}>
                  <span className='mdi mdi-plus' />
                  {t(`${translationPath}add-new`)}
                </ButtonBase>
              </div>
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
                },
                {
                  id: 2,
                  label: 'related-to',
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
                },
                {
                  id: 3,
                  label: 'related-to-number',
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
                },
                {
                  id: 4,
                  label: 'stage',
                  component: (item) => (
                    <span>
                      {item.activityType.leadStageName || t(`${translationPath}not-contacted`)}
                    </span>
                  ),
                },
                {
                  id: 5,
                  label: 'category',
                  input: 'activityType.categoryName',
                },
                {
                  id: 6,
                  label: 'activity-type',
                  input: 'activityType.activityTypeName',
                },
                {
                  id: 7,
                  label: 'subject',
                  component: (item) => <span>{(item.subject && item.subject) || 'N/A'}</span>,
                },
                {
                  id: 8,
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
                }, {
                  id: 13,
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

UnitProfileActivitiesComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
