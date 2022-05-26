import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { Spinner, Tables, PermissionsComponent } from '../../../../../../../../Components';
import { TableActions } from '../../../../../../../../Enums';
import { GetAllChequeRequestsUnitTransactionId } from '../../../../../../../../Services';
import { ChequeRequestsManagementDialog, ChequeRequestsDelete } from './Dialogs';
import { SalesTransactionsPermissions } from '../../../../../../../../Permissions';

export const ChequeRequests = ({
  unitTransactionId,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenChequeRequestsDialog, setIsOpenChequeRequestsDialog] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [chequeRequests, setChequeRequests] = useState({
    result: [],
    totalCount: 0,
  });
  const tableActionClicked = useCallback((actionEnum, item) => {
    if (actionEnum === TableActions.editText.key) {
      setActiveItem(item);
      setIsOpenChequeRequestsDialog(true);
    } else if (actionEnum === TableActions.deleteText.key) {
      setActiveItem(item);
      setIsOpenConfirm(true);
    }
  }, []);
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const getAllChequeRequestsUnitTransactionId = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllChequeRequestsUnitTransactionId(unitTransactionId, filter);
    if (!((res && res.data && res.data.ErrorId) || !res)) {
      setChequeRequests({
        result: res.result || [],
        totalCount: res.totalCount || 0,
      });
    } else {
      setChequeRequests({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter, unitTransactionId]);
  useEffect(() => {
    if (unitTransactionId) getAllChequeRequestsUnitTransactionId();
  }, [getAllChequeRequestsUnitTransactionId, unitTransactionId]);
  return (
    <div className='cheque-requests-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='title-wrapper'>
        <span className='title-text'>{t(`${translationPath}cheque-requests`)}</span>
      </div>
      <div className='d-flex mb-3'>
        <PermissionsComponent
          permissionsList={Object.values(SalesTransactionsPermissions)}
          permissionsId={SalesTransactionsPermissions.AddChequeRequestForm.permissionsId}
        >
          <ButtonBase
            className='btns theme-solid mx-2'
            onClick={() => setIsOpenChequeRequestsDialog(true)}
          >
            <span className='mdi mdi-plus' />
            <span className='px-1'>{t(`${translationPath}add-new`)}</span>
          </ButtonBase>
        </PermissionsComponent>
      </div>
      <PermissionsComponent
        permissionsList={Object.values(SalesTransactionsPermissions)}
        permissionsId={SalesTransactionsPermissions.ViewAllChequeRequest.permissionsId}
      >
        <Tables
          data={chequeRequests.result}
          idRef='chequeRequestsTableRef'
          headerData={[
            {
              id: 1,
              label: 'bank-name',
              input: 'bankName',
            },
            {
              id: 2,
              label: 'account-name',
              input: 'accountName',
            },
            {
              id: 3,
              label: 'amount',
              input: 'amount',
            },
            {
              id: 4,
              label: 'cheque-no',
              input: 'chequeNumber',
            },
            {
              id: 5,
              label: 'date',
              input: 'date',
              isDate: true,
            },
            {
              id: 6,
              label: 'cheque-type',
              input: 'chequeTypeName',
            },
            {
              id: 7,
              label: 'status',
              input: 'status',
            },
            {
              id: 8,
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
          totalItems={chequeRequests.totalCount}
        />
      </PermissionsComponent>
      {isOpenChequeRequestsDialog && (
        <ChequeRequestsManagementDialog
          unitTransactionId={unitTransactionId}
          activeItem={activeItem}
          isOpen={isOpenChequeRequestsDialog}
          reloadData={() => {
            setFilter((item) => ({ ...item, pageIndex: 0 }));
            setIsOpenChequeRequestsDialog(false);
            setActiveItem(null);
          }}
          isOpenChanged={() => {
            setIsOpenChequeRequestsDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {activeItem && (
        <ChequeRequestsDelete
          activeItem={activeItem}
          isOpen={isOpenConfirm}
          isOpenChanged={() => {
            setIsOpenConfirm(false);
            setActiveItem(null);
          }}
          reloadData={() => {
            // setFilter((item) => ({ ...item, pageIndex: 0 }));
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

ChequeRequests.propTypes = {
  unitTransactionId: PropTypes.number,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
ChequeRequests.defaultProps = {
  unitTransactionId: null,
};
