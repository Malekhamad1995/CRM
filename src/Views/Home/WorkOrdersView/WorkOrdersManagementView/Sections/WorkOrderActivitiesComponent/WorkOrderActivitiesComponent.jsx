import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { TableActions } from '../../../../../../Enums';
import { Spinner, SwitchComponent, Tables } from '../../../../../../Components';
import { GetActivityById, GetAllActivitiesByWorkOrderId } from '../../../../../../Services';
import { ActivitiesManagementDialog, ActivityDeleteDialog } from './Dialogs';

export const WorkOrderActivitiesComponent = ({
  id,
  toParentSender,
  parentTranslationPath,
  translationPath,
}) => {
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
    pageSize: 25,
    pageIndex: 0,
  });

  const getAllActivities = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllActivitiesByWorkOrderId(id, filter);
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
  }, [filter, id]);

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
      }
    },
    [GetActivityAPI]
  );
  useEffect(() => {
    if (toParentSender) toParentSender('filter', filter);
  }, [filter, toParentSender]);
  useEffect(() => {
    if (toParentSender) toParentSender('setFilter', setFilter);
  }, [toParentSender]);
  useEffect(
    () => () => {
      if (toParentSender) toParentSender('filter', null);
      if (toParentSender) toParentSender('setFilter', null);
    },
    [toParentSender]
  );
  return (
    <div className='work-order-activities-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='d-flex mb-3'>
        {/* disabled={!id} */}
        <ButtonBase className='btns theme-solid mx-2' onClick={() => setOpenDialog(true)}>
          <span className='mdi mdi-plus' />
          <span className='px-1'>{t(`${translationPath}add-activity`)}</span>
        </ButtonBase>
      </div>
      <div className='w-100 px-2'>
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
                    (item.relatedUnitNumberId && t(`${translationPath}unit`)) ||
                    (item.relatedPortfolioName && t(`${translationPath}Portfolio`)) ||
                    (item.relatedWorkOrderRefNumber && t(`${translationPath}WorkOrder`)) ||
                    (item.relatedUnitPropertyName && t(`${translationPath}Property`)) ||
                    (item.relatedPortfolioId && t(`${translationPath}Portfolio`)) ||
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
              id: 5,
              label: 'stage',
              component: (item) => (
                <span>
                  {item.activityType.leadStageName || t(`${translationPath}not-contacted`)}
                </span>
              ),
            },
            {
              id: 6,
              label: 'category',
              input: 'activityType.categoryName',
            },
            {
              id: 7,
              label: 'activity-type',
              input: 'activityType.activityTypeName',
            },
            {
              id: 8,
              label: 'subject',
              component: (item) => <span>{(item.subject && item.subject) || 'N/A'}</span>,
            },
            {
              id: 10,
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
            {
              enum: TableActions.deleteText.key,
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
        />
      </div>
      {openDialog && (
        <ActivitiesManagementDialog
          open={openDialog}
          id={id}
          activeItem={activeItem}
          onSave={() => {
            setOpenDialog(false);
            setActiveItem(null);
            onPageIndexChanged(0);
          }}
          close={() => {
            setActiveItem(null);
            setOpenDialog(false);
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
WorkOrderActivitiesComponent.propTypes = {
  id: PropTypes.number,
  toParentSender: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
WorkOrderActivitiesComponent.defaultProps = {
  id: undefined,
  toParentSender: undefined,
};
