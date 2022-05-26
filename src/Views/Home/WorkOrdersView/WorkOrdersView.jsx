import { ButtonBase } from '@material-ui/core';
import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Inputs, SelectComponet, Spinner, Tables, PermissionsComponent
} from '../../../Components';
import { TableActions } from '../../../Enums';
import { GlobalHistory } from '../../../Helper';
import { GetAllWorkOrder, lookupItemsGetId } from '../../../Services';
import { WorkOrderDeleteDialog } from './Dialogs';
import { WorkOrderStatus } from '../../../assets/json/StaticLookupsIds.json';
import { WorkOrdersPermissions } from '../../../Permissions/PropertyManagement/WorkOrders.Permissions';
import { returnPropsByPermissions, returnPropsByPermissions2 } from '../../../Helper/ReturnPropsByPermissions.Helper';

const parentTranslationPath = 'WorkOrdersView';
const translationPath = '';
export const WorkOrdersView = () => {
  const { t } = useTranslation([parentTranslationPath]);
  const searchTimer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [Statuses, setStatuses] = useState([]);
  const [isLoadingstatus, setIsLoadingstatus] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [filterBy, setFilterBy] = useState(0);
  const [sortBy, setSortBy] = useState(null);
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
    search: '',
    status: filterBy,
    filterBy: null,
    orderBy: null

  });
  const [workOrders, setWorkOrders] = useState({
    result: [],
    totalCount: 0,
  });
  const searchHandler = (event) => {
    const { value } = event.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({ ...item, pageIndex: 0, search: value }));
    }, 700);
  };
  const tableActionClicked = useCallback(
    (actionEnum, item, focusedRow, event) => {
      event.stopPropagation();
      event.preventDefault();
      if (actionEnum === TableActions.deleteText.key) {
        setIsOpenConfirmDialog(true);
        setActiveItem(item);
      } else if (actionEnum === TableActions.editText.key)
        GlobalHistory.push(`/home/work-orders/edit?id=${item.workOrderId}`);
    },
    []
  );
  const addNewWorkOrder = () => {
    GlobalHistory.push('/home/work-orders/add');
  };
  const getAllworkOrders = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllWorkOrder({ ...filter });
    if (!(res && res.status && res.status !== 200)) {
      setWorkOrders({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setWorkOrders({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  useEffect(() => {
    getAllworkOrders();
  }, [getAllworkOrders, filter]);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );

  const getAllWorkOrderStatuses = useCallback(async () => {
    setIsLoadingstatus(false);
    const res = await lookupItemsGetId({
      lookupTypeId: WorkOrderStatus,
    });
    if (!(res && res.status && res.status !== 200)) setStatuses(res || []);
    else setStatuses([]);
    setIsLoadingstatus(false);
  }, []);

  useEffect(() => {
    getAllWorkOrderStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sortBy)
    setFilter((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);

  const SelectStatusChanged = (newValue) => {
    setFilterBy(newValue);
    setFilter((item) => ({ ...item, status: newValue }));
  };
  const getTableActionsByPermissions = () => {
    const list = [];
    if (returnPropsByPermissions2(WorkOrdersPermissions.EditWorkOrder.permissionsId, WorkOrdersPermissions.DeleteWorkOrder.permissionsId)) {
      list.push(
        { enum: TableActions.editText.key },
        {
          enum: TableActions.deleteText.key
        }
      );
      return list;
    }
    if (returnPropsByPermissions(WorkOrdersPermissions.EditWorkOrder.permissionsId)) {
      list.push(
        { enum: TableActions.editText.key },
      );
      return list;
    }
    if (returnPropsByPermissions(WorkOrdersPermissions.DeleteWorkOrder.permissionsId)) {
      list.push(
        { enum: TableActions.delete.key },
      );
      return list;
    }
    return list;
  };

  return (
    <div className='work-orders-view-wrapper view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section'>
              <PermissionsComponent
                permissionsList={Object.values(WorkOrdersPermissions)}
                permissionsId={WorkOrdersPermissions.CreateOrUpdateWorkOrder.permissionsId}
              >
                <ButtonBase
                  className='btns theme-solid px-3 mx-3'
                  onClick={addNewWorkOrder}
                >
                  <span className='mdi mdi-plus' />
                  {t(`${translationPath}add-new`)}
                </ButtonBase>
              </PermissionsComponent>
            </div>
            <PermissionsComponent
              permissionsList={Object.values(WorkOrdersPermissions)}
              permissionsId={WorkOrdersPermissions.ViewAndSearchInPropertyManagementWorkOrders.permissionsId}
            >
              <div className='section autocomplete-section'>
                <div className='d-flex-column px-2 w-100 p-relative'>
                  <div className='w-100 p-relative'>
                    <Inputs
                      idRef='workOrderSearchRef'
                      label='filter'
                      beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                      onInputChanged={searchHandler}
                      inputPlaceholder='search-work-orders'
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                    />
                  </div>
                  <div className='d-inline-flex pl-5-reversed'>
                    <SelectComponet
                      data={Statuses || []}
                      emptyItem={{
                        value: '',
                        text: 'select-status',
                        isDisabled: false,
                      }}
                      value={filterBy}
                      selectAllItem={{
                        value: 0,
                        text: 'select-all',
                        isDisabled: false,
                      }}
                      valueInput='lookupItemId'
                      textInput='lookupItemName'
                      isLoading={isLoadingstatus}
                      onSelectChanged={(newValue) =>
                        SelectStatusChanged(newValue)}
                      wrapperClasses='w-auto'
                      themeClass='theme-transparent'
                      idRef='sstatusFilterRef'
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      translationPathForData={translationPath}
                    />
                  </div>
                </div>
                {/* <ViewTypes
                onTypeChanged={onTypeChanged}
                activeTypes={[ViewTypesEnum.tableView.key, ViewTypesEnum.cards.key]}
                className="mb-3"
              /> */}
              </div>
            </PermissionsComponent>
          </div>
        </div>
        <PermissionsComponent
          permissionsList={Object.values(WorkOrdersPermissions)}
          permissionsId={WorkOrdersPermissions.ViewAndSearchInPropertyManagementWorkOrders.permissionsId}
        >
          <div className='w-100 px-3'>
            <Tables
              data={workOrders.result}
              headerData={[
                {
                  id: 1,
                  isSortable: true,
                  label: 'entered-on',
                  input: 'createdOn',
                  isDate: true,
                },
                {
                  id: 2,
                  isSortable: true,
                  label: 'category',
                  input: 'category',
                },
                {
                  id: 4,
                  isSortable: true,
                  label: 'portfolio',
                  input: 'portfolio',
                },
                {
                  id: 5,
                  isSortable: true,
                  label: 'property',
                  input: 'property',
                },
                {
                  id: 6,
                  isSortable: true,
                  label: 'unit',
                  input: 'unit',
                },
                {
                  id: 7,
                  isSortable: true,
                  label: 'ref-no',
                  input: 'referenceNo',
                },
                {
                  id: 8,
                  isSortable: true,
                  label: 'status',
                  input: 'status',
                },
                {
                  id: 9,
                  isSortable: true,
                  label: 'service-type',
                  input: 'serviceType',
                },
                {
                  id: 10,
                  isSortable: true,
                  label: 'common-area',
                  input: 'commonArea',
                  // cellClasses: 'py-0'
                },
                {
                  id: 11,
                  isSortable: true,
                  label: 'remarks',
                  input: 'remarks',
                  // cellClasses: 'py-0'
                },
              ]}
              defaultActions={
                getTableActionsByPermissions()
              }

              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              actionsOptions={{
                onActionClicked: tableActionClicked,
              }}
              itemsPerPage={filter.pageSize}
              activePage={filter.pageIndex}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              totalItems={workOrders.totalCount}
              setSortBy={setSortBy}
            />
          </div>
        </PermissionsComponent>
        {activeItem && (
          <WorkOrderDeleteDialog
            activeItem={activeItem}
            isOpen={isOpenConfirmDialog}
            isOpenChanged={() => {
              setIsOpenConfirmDialog(false);
              setActiveItem(null);
            }}
            reloadData={() => {
              setFilter((item) => ({ ...item, pageIndex: 0 }));
              setIsOpenConfirmDialog(null);
              isOpenConfirmDialog(false);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
      </div>
    </div>
  );
};
