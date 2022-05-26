import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Spinner, Tables } from '../../../../../../Components';
import { TableActions } from '../../../../../../Enums';
import { GetAllWorkOrderByMaintenanceContractId } from '../../../../../../Services';
import { WorkOrdersManagementDialog } from './Dialogs';
import { WorkOrderDeleteDialog } from '../../../../WorkOrdersView/Dialogs';

const parentTranslationPath = 'WorkOrdersView';
const translationPath = '';
export const MaintenanceContractWorkOrderComponent = ({ maintenanceContractId }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenWorkOrderDialog, setIsOpenWorkOrderDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [workOrder, setWorkOrders] = useState({
    result: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const tableActionClicked = useCallback((actionEnum, item) => {
    if (actionEnum === TableActions.editText.key) {
      setActiveItem(item);
      setIsOpenWorkOrderDialog(true);
    } else if (actionEnum === TableActions.deleteText.key) {
      setActiveItem(item);
      setIsOpenConfirm(true);
    }
  }, []);
  const isOpenManagementDialogChanged = () => {
    setIsOpenWorkOrderDialog(false);
    setActiveItem(null);
  };
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const getAllWorkOrderByMaintenanceContractId = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllWorkOrderByMaintenanceContractId(maintenanceContractId, filter);
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
  }, [filter, maintenanceContractId]);
  useEffect(() => {
    if (maintenanceContractId) getAllWorkOrderByMaintenanceContractId();
  }, [getAllWorkOrderByMaintenanceContractId, maintenanceContractId]);
  return (
    <div className='maintenance-contract-work-order-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='d-flex mb-3'>
        <ButtonBase
          className='btns theme-solid mx-2'
          onClick={() => setIsOpenWorkOrderDialog(true)}
        >
          <span className='mdi mdi-plus' />
          <span className='px-1'>{t(`${translationPath}add-work-order`)}</span>
        </ButtonBase>
      </div>
      <Tables
        data={workOrder.result || []}
        headerData={[
          {
            id: 1,
            isSortable: true,
            label: 'entered-on',
            input: 'enteredOn',
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
          },
          {
            id: 11,
            isSortable: true,
            label: 'remarks',
            input: 'remarks',
          },
        ]}
        actionsOptions={{
          onActionClicked: tableActionClicked,
        }}
        defaultActions={[
          {
            enum: TableActions.editText.key,
          },
          {
            enum: TableActions.deleteText.key,
          },
        ]}
        activePage={filter.pageIndex}
        itemsPerPage={filter.pageSize}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        totalItems={workOrder.totalCount}
      />
      {isOpenWorkOrderDialog && (
        <WorkOrdersManagementDialog
          id={(activeItem && activeItem.workOrderId) || null}
          maintenanceContractId={maintenanceContractId}
          //   activeItem={activeItem}
          isOpen={isOpenWorkOrderDialog}
          reloadData={() => {
            setFilter((item) => ({ ...item, pageIndex: 0 }));
            isOpenManagementDialogChanged();
          }}
          isOpenChanged={isOpenManagementDialogChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {activeItem && (
        <WorkOrderDeleteDialog
          activeItem={activeItem}
          isOpen={isOpenConfirm}
          isOpenChanged={() => {
            setIsOpenConfirm(false);
            setActiveItem(null);
          }}
          reloadData={() => {
            setFilter((item) => ({ ...item, pageIndex: 0 }));
            setActiveItem(null);
            setIsOpenConfirm(false);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};
MaintenanceContractWorkOrderComponent.propTypes = {
  maintenanceContractId: PropTypes.number,
};
MaintenanceContractWorkOrderComponent.defaultProps = {
  maintenanceContractId: null,
};
