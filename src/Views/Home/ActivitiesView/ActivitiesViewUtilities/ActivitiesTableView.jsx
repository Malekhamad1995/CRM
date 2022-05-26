import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { Tables, SwitchComponent, TableColumnsFilterComponent } from '../../../../Components';
import { TableActions, ColumnsFilterPagesEnum, TableFilterTypesEnum } from '../../../../Enums';
import { TableColumnsFilterActions } from '../../../../store/TableColumnsFilter/TableColumnsFilterActions';
import {
  GetActivityById, GetAllRelatedActivitiesByActivityId
} from '../../../../Services';
import { ActivityDeleteDialog } from './Dialogs/ActivityDeleteDialog/ActivityDeleteDialog';
import { ActivityHistory } from '../ActivityHistory/ActivityHistory';
import { isEmptyObject } from '../../../../Helper';
import { ReplyActivityDialog } from '../ReplyActivitesView/ReplyActivityDialog';
import { ActivitiesManagementDialog } from './Dialogs/ActivitiesManagementDialog';

const parentTranslationPath = 'ActivitiesView';
const translationPath = '';

export const ActivitiesTableView = ({
  data,
  onPageIndexChanged,
  onPageSizeChanged,
  filter,
  activitiesCount,
  isTableRelatedView,
  isLoading,
  setIsLoading,
  getTableActionsByPermissions,
  setSortBy,
  pathName,
  activeActionType
}) => {
  const { t } = useTranslation(parentTranslationPath);
  let listflattenObject = [];

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openReplyActivityDialog, setOpenReplyActivityDialog] = useState(false);
  const [activitesRelatedChildren, setActivitesRelatedChildren] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openActivityHistoryDialog, setOpenActivityHistoryDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const tableColumnsFilterResponse = useSelector((state) => state.TableColumnsFilterReducer);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableFilterData, setTableFilterData] = useState([]);

  const dispatch = useDispatch();
  const [currentActivityEnum, setCurrentActivityEnum] = useState(['activityManagmentRelated', 'activityManagmentAll']);
  const GetActivityAPI = useCallback(async (activityId) => {
    const res = await GetActivityById(activityId);
    if (!(res && res.status && res.status !== 200)) setActiveItem(res);
  }, []);
  const flattenObject = (obj) => {
    // eslint-disable-next-line prefer-const
    const flattened = {};
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null && key === 'relatedActivityTo') {
        if (obj[key]) {
          if (!isEmptyObject(obj[key]))
            listflattenObject.push({ ...obj[key] });
          Object.assign(flattened, flattenObject(obj[key]));
        }
      } else
        flattened[key] = obj[key];
    });
  };

  const GetRelatedActivitiesByActivityId = useCallback(async (activityId) => {
    setIsLoading(true);
    const res = await GetAllRelatedActivitiesByActivityId(activityId);
    if (!(res && res.status && res.status !== 200)) {
      listflattenObject = [];
      flattenObject(res);
      setActivitesRelatedChildren(listflattenObject.filter((item) => item.activityId));
    } else setActivitesRelatedChildren([]);
    setIsLoading(false);
  }, [activeItem]);
  const tableActionClicked = useCallback((actionEnum, item, focusedRow, event) => {
    event.stopPropagation();
    event.preventDefault();
    if (actionEnum === TableActions.deleteText.key) {
      setOpenConfirmDialog(true);
      setActiveItem(item);
    } else if (actionEnum === TableActions.editText.key) {
      GetActivityAPI(item.activityId);
      setOpenDialog(true);
    } else if (actionEnum === TableActions.replyText.key) {
      setActiveItem(item);
      setOpenReplyActivityDialog(true);
    }
  }, [GetActivityAPI]);

  const allActivitiesTableHeaderData = [
    {
      id: 1,
      label: 'activity-Date',
      input: 'activityDate',
      isDate: true,
      isSortable: true,
      dateFormat: 'DD/MM/YYYY',
      isDefaultFilterColumn: true,
    },
    {
      id: 2,
      label: 'created-Date',
      isDate: true,
      isSortable: true,
      input: 'createdOn',
      dateFormat: 'DD/MM/YYYY',
      isDefaultFilterColumn: true,
    },
    {
      id: 3,
      label: 'created-By',
      input: 'createdBy',
      component: (item)=>(
        <span>{item.createdByName}</span>
      ),
      isDefaultFilterColumn: true,
      isSortable: true,
    },
    {
      id: 4,
      label: 'related-to',
      input: 'relatedTo',
      component: (item) => (
        <span className='c-primary'>
          {(item.relatedLeadNumberId && t(`${translationPath}lead`)) ||
            (item.relatedMaintenanceContractId &&
              t(`${translationPath}MaintenanceContract`)) ||
            (item.relatedUnitNumberId && t(`${translationPath}unit`)) ||
            (item && (item.relatedPortfolioId) && t(`${translationPath}Portfolio`)) ||
            (item.relatedWorkOrderRefNumber && t(`${translationPath}WorkOrder`)) ||
            (item.relatedUnitPropertyName && t(`${translationPath}Property`)) ||

            'N/A'}
        </span>
      ),
      isDefaultFilterColumn: true,
      isSortable: true,
    }, {
      id: 5,
      label: 'Related-to-Id',
      component: (item) => (
        <span className='c-primary'>
          {(item.relatedLeadNumberId) ||
            (item.relatedMaintenanceContractId) ||
            (item.relatedWorkOrderRefNumber) ||
            (item.relatedUnitNumberId) ||
            (item.relatedUnitNumber) ||
            (item.relatedUnitPropertyName) ||
            (item.relatedPortfolioId) ||
            (item.relatedWorkOrderId) ||
            'N/A'}
        </span>
      ),
      isDefaultFilterColumn: true,
    }, {
      id: 6,
      label: 'related-to-number',
      input: 'relatedToName',
      component: (item) => (
        <span className='c-primary'>
          {(item.relatedLeadNumberId && item.contactName) ||
            (item.relatedMaintenanceContractId && item.relatedMaintenanceContractId) ||
            (item.relatedWorkOrderRefNumber && item.relatedWorkOrderRefNumber) ||
            (item.relatedUnitNumberId && item.relatedUnitNumber) ||
            (item.relatedUnitNumber && item.relatedUnitNumber) ||
            (item.relatedUnitPropertyName && item.relatedUnitNumber) ||
            (item.relatedPortfolioId && item.relatedPortfolioName) ||
            (item.relatedWorkOrderId && item.relatedWorkOrderRefNumber) ||
            'N/A'}
        </span>
      ),
      isDefaultFilterColumn: true,
      isSortable: true,
    },
    {
      id: 7,
      label: 'assign-to',
      input: 'agentName',
      isDefaultFilterColumn: true,
      isSortable: true,
    },
    {
      id: 8,
      label: 'stage',
      input: 'stage',
      component: (item) => (
        <span>
          {item.activityType.leadStageName || t(`${translationPath}not-contacted`)}
        </span>
      ),
      isDefaultFilterColumn: true,
      isSortable: true,
    },
    {
      id: 9,
      label: 'category',
      input: 'categoryName',
      component: (item)=>(
        <span>{item.activityType&&item.activityType.categoryName||''}</span>
      ),
      isDefaultFilterColumn: true,
      isSortable: true,
    },

    {
      id: 10,
      label: 'activity-type',
      input: 'activityType',
      component: (item)=>(
        <span>{item.activityType&&item.activityType.activityTypeName||''}</span>
      ),
      isDefaultFilterColumn: true,
      isSortable: true,
    },
    {
      id: 11,
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
      isDefaultFilterColumn: true,
      isSortable: true,
    },
    {
      id: 12,
      label: 'Copy-To',
      input: 'copyTo',
      isDefaultFilterColumn: true,
      isSortable: true,
    }
  ];

  const relatedActivitiesTableHeaderData = [
    {
      id: 1,
      label: 'history',
      input: 'hasParent',
      cellClasses: 'py-0',
      component: (item) => (
        item.hasParent && (
          <ButtonBase
            className='MuiButtonBase-root btns-icon  mt-1 mx-2'
            onClick={() => {
              GetRelatedActivitiesByActivityId(item.activityId);
              setActiveItem(item);
              setOpenActivityHistoryDialog(true);
            }}
          >
            <span className='table-action-icon mdi mdi-undo-variant' />
            <span className='MuiTouchRipple-root' />

          </ButtonBase>
        )
      ),
      isDefaultFilterColumn: true,
    },
    {
      id: 2,
      isSortable: true,
      label: 'activity-Date',
      input: 'activityDate',
      isDate: true,
      dateFormat: 'DD/MM/YYYY',
      isDefaultFilterColumn: true,
    },
    {
      id: 3,
      label: 'created-Date',
      isDate: true,
      input: 'createdOn',
      isSortable: true,
      dateFormat: 'DD/MM/YYYY',
      isDefaultFilterColumn: true,
    },
    {
      id: 4,
      label: 'created-By',
      input: 'createdBy',
      component: (item)=>(
        <span>{item.createdByName}</span>
      ),
      isDefaultFilterColumn: true,
      isSortable: true,
    },
    {
      id: 5,
      label: 'related-to',
      input: 'relatedTo',
      component: (item) => (
        <span className='c-primary'>
          {(item.relatedLeadNumberId && t(`${translationPath}lead`)) ||
            (item.relatedMaintenanceContractId &&
              t(`${translationPath}MaintenanceContract`)) ||
            (item.relatedUnitNumberId && t(`${translationPath}unit`)) ||
            (item.relatedWorkOrderRefNumber && t(`${translationPath}WorkOrder`)) ||
            (item.relatedUnitPropertyName && t(`${translationPath}Property`)) ||
            (item.relatedPortfolioId && t(`${translationPath}Portfolio`)) ||
            (item.relatedWorkOrderId && t(`${translationPath}WorkOrder`)) ||
            'N/A'}
        </span>
      ),
      isDefaultFilterColumn: true,
      isSortable: true,
    }, {
      id: 6,
      label: 'Related-to-Id',
      component: (item) => (
        <span className='c-primary'>
          {(item.relatedLeadNumberId) ||
            (item.relatedMaintenanceContractId) ||
            (item.relatedWorkOrderRefNumber) ||
            (item.relatedPortfolioName) ||
            (item.relatedUnitNumberId) ||
            (item.relatedUnitNumber) ||
            (item.relatedUnitPropertyName) ||
            (item.relatedPortfolioId) ||
            (item.relatedWorkOrderId) ||
            'N/A'}
        </span>
      ),
      isDefaultFilterColumn: true,
    }, {
      id: 7,
      label: 'related-to-number',
      input: 'relatedToName',
      component: (item) => (
        <span className='c-primary'>
          {(item.relatedLeadNumberId && item.contactName) ||
            (item.relatedMaintenanceContractId && item.relatedMaintenanceContractId) ||
            (item.relatedWorkOrderRefNumber && item.relatedWorkOrderRefNumber) ||
            (item.relatedUnitNumberId && item.relatedUnitNumber) ||
            (item.relatedUnitNumber && item.relatedUnitNumber) ||
            (item.relatedUnitPropertyName && item.relatedUnitNumber) ||
            (item.relatedPortfolioId && item.relatedPortfolioName) ||
            (item.relatedWorkOrderId && item.relatedWorkOrderRefNumber) ||
            'N/A'}
        </span>
      ),
      isDefaultFilterColumn: true,
      isSortable: true,
    },
    {
      id: 8,
      label: 'assign-to',
      input: 'agentName',
      isDefaultFilterColumn: true,
      isSortable: true,
    },
    {
      id: 9,
      label: 'stage',
      input: 'stage',
      component: (item) => (
        <span>
          {item.activityType.leadStageName || t(`${translationPath}not-contacted`)}
        </span>
      ),
      isDefaultFilterColumn: true,
      isSortable: true,
    },
    {
      id: 10,
      label: 'category',
      input: 'categoryName',
      component: (item)=>(
        <span>{item.activityType&&item.activityType.categoryName||''}</span>
      ),
      isDefaultFilterColumn: true,
      isSortable: true,
    },

    {
      id: 11,
      label: 'activity-type',
      input: 'activityType',
      component: (item)=>(
        <span>{item.activityType&&item.activityType.activityTypeName||''}</span>
      ),
      isDefaultFilterColumn: true,
      isSortable: true,
    },
    {
      id: 12,
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
      isDefaultFilterColumn: true,
      isSortable: true,
    }, {
      id: 13,
      label: 'comments',
      input: 'comments',
      isDefaultFilterColumn: true,
      isSortable: true,
    },
    {
      id: 14,
      label: 'Copy-To',
      input: 'copyTo',
      isDefaultFilterColumn: true,
      isSortable: true,
    }

  ];

  useEffect(() => {
    if (pathName === 'activities-management')
      setCurrentActivityEnum(['activityManagmentRelated', 'activityManagmentAll']);
    else if (pathName === 'Activities')
      setCurrentActivityEnum(['activityCallCenterRelated', 'activityCallCenterAll']);
  }, [pathName]);

  const [activitiesTableHeaderData, setActivitiesTableHeaderData] = useState(relatedActivitiesTableHeaderData);

  const [selectedTableFilterColumns, setSelectedTableFilterColumns] = useState({
    tableRelatedView: relatedActivitiesTableHeaderData.filter((item) => item.isDefaultFilterColumn).map((column) => column.id),
    tableView: allActivitiesTableHeaderData.filter((item) => item.isDefaultFilterColumn).map((column) => column.id),
  });

  useEffect(() => {
    if (activeActionType && activeActionType === 'tableRelatedView')
      setActivitiesTableHeaderData(relatedActivitiesTableHeaderData);
    else if (activeActionType && activeActionType === 'tableView')
      setActivitiesTableHeaderData(allActivitiesTableHeaderData);
  }, [activeActionType]);

  useEffect(() => {
    setTableColumns([
      ...activitiesTableHeaderData.filter(
        (item) => selectedTableFilterColumns[activeActionType].findIndex((element) => element === item.id) !== -1
      )
    ]);
  }, [selectedTableFilterColumns, activeActionType, activitiesTableHeaderData]);

  useEffect(() => {
    if (activeActionType == 'tableRelatedView' &&
      tableColumnsFilterResponse &&
      tableColumnsFilterResponse[ColumnsFilterPagesEnum[currentActivityEnum[0]].key]
    )
      setSelectedTableFilterColumns({ ...selectedTableFilterColumns, tableRelatedView: tableColumnsFilterResponse[ColumnsFilterPagesEnum[currentActivityEnum[0]].key] });

    else if (activeActionType == 'tableView' && tableColumnsFilterResponse &&
      tableColumnsFilterResponse[ColumnsFilterPagesEnum[currentActivityEnum[1]].key])
      setSelectedTableFilterColumns({ ...selectedTableFilterColumns, tableView: tableColumnsFilterResponse[ColumnsFilterPagesEnum[currentActivityEnum[1]].key] });
  }, [tableColumnsFilterResponse, activeActionType]);
  return (
    <div className='w-100 px-2'>

      <div className='w-100 px-3'>

        <TableColumnsFilterComponent
          columns={activitiesTableHeaderData.map((item) => ({
            key: item.formFieldId || item.id,
            value: (item.formFieldTitle && item.formFieldTitle.replace('*', '')) || item.label,
          }))}

          isLoading={isLoading}
          selectedColumns={selectedTableFilterColumns[activeActionType]}

          onSelectedColumnsChanged={(newValue) => {
            let localTableColumnsFilterResponse = tableColumnsFilterResponse;

            setSelectedTableFilterColumns({ ...selectedTableFilterColumns, [activeActionType]: newValue });

            if (localTableColumnsFilterResponse) {
              if (activeActionType && activeActionType === 'tableRelatedView') localTableColumnsFilterResponse[ColumnsFilterPagesEnum[currentActivityEnum[0]].key] = newValue;
              else if (activeActionType && activeActionType === 'tableView') localTableColumnsFilterResponse[ColumnsFilterPagesEnum[currentActivityEnum[1]].key] = newValue;
            } else if (activeActionType && activeActionType === 'tableRelatedView') {
              localTableColumnsFilterResponse = {
                [ColumnsFilterPagesEnum[currentActivityEnum[0]].key]: newValue,
              };
            } else if (activeActionType && activeActionType === 'tableView') {
              localTableColumnsFilterResponse = {
                [ColumnsFilterPagesEnum[currentActivityEnum[1]].key]: newValue,
              };
            }

            dispatch(
              TableColumnsFilterActions.TableColumnsFilterRequest(localTableColumnsFilterResponse)
            );
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath=''
        />

        {!isTableRelatedView && (
          <Tables
            data={data}
            headerData={tableColumns}
            setSortBy={setSortBy}
            actionsOptions={{
              onActionClicked: tableActionClicked,
            }}
            defaultActions={
              getTableActionsByPermissions || []
            }
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
            itemsPerPage={filter.pageSize}
            activePage={filter.pageIndex}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            totalItems={activitiesCount}
          />

        )}

        {isTableRelatedView && (
          <Tables
            data={data}
            headerData={tableColumns}
            actionsOptions={{
              onActionClicked: tableActionClicked,
            }}
            defaultActions={
              getTableActionsByPermissions || []
            }
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
            itemsPerPage={filter.pageSize}
            activePage={filter.pageIndex}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            totalItems={activitiesCount}
            setSortBy={setSortBy}
          />

        )}

      </div>
      {openDialog && (
        <ActivitiesManagementDialog
          open={openDialog}
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
      {openActivityHistoryDialog && (
        <ActivityHistory
          isLoading={isLoading}
          open={openActivityHistoryDialog}
          close={() => {
            listflattenObject = [];
            setActivitesRelatedChildren([]);
            setOpenActivityHistoryDialog(false);
          }}
          data={activitesRelatedChildren.reverse()}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {openReplyActivityDialog && (
        <ReplyActivityDialog
          open={openReplyActivityDialog}
          close={() => {
            setActiveItem(null);
            setOpenReplyActivityDialog(false);
          }}
          activeItem={activeItem}
          onSave={() => {
            setOpenReplyActivityDialog(false);
            setActiveItem(null);
            onPageIndexChanged(0);
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}

    </div>
  );
};

ActivitiesTableView.propTypes = {
  data: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  onPageIndexChanged: PropTypes.string.isRequired,
  onPageSizeChanged: PropTypes.string.isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  activitiesCount: PropTypes.number.isRequired,
  isTableRelatedView: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  getTableActionsByPermissions: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  setSortBy: PropTypes.func.isRequired,

};

ActivitiesTableView.defaultProps = {
  isTableRelatedView: false,
};
