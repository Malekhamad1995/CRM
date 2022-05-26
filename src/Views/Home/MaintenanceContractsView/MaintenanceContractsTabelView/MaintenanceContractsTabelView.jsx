import React, { useCallback, useEffect, useState } from 'react';
import {useDispatch} from "react-redux";
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  DialogComponent, PaginationComponent, Spinner, Tables
} from '../../../../Components';
import { TableActions } from '../../../../Enums';
import {
  bottomBoxComponentUpdate,
  GlobalHistory, showSuccess,
  returnPropsByPermissions,
  returnPropsByPermissions2
} from '../../../../Helper';
import {
  DeleteMaintenanceContract,
  GetAllMaintenanceContract,
} from '../../../../Services/MaintenanceContractsServices';
import { NumberOfServices } from '../../../../Enums/NumberOfServices.Enum';
import { AmountPaidBy } from '../../../../Enums/AmountPaidBy.Enum';
import { TermOfPayment } from '../../../../Enums/TermOfPayment.Enum';
import { Status } from '../../../../Enums/Status.Enum';
import { MaintenanceContractsPermissions } from '../../../../Permissions';
import {ActiveItemActions} from '../../../../store/ActiveItem/ActiveItemActions'

export const MaintenanceContractsTabelView = ({
  search,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch=useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [openDialogDlete, setOpenDialogDlete] = useState(false);
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
    search,
    filterBy: null,
    orderBy: null

  });
  const [response, setresponse] = useState({
    result: [],
    totalCount: 0,
  });

  const GetAllMaintenanceContractAPI = useCallback(async () => {
    setIsLoading(true);
    const result = await GetAllMaintenanceContract(filter);
    if (!(result && result.status && result.status !== 200)) {
      setresponse({
        result: (result && result.result) || [],
        totalCount: (result && result.totalCount) || 0,
      });
    } else {
      setresponse({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);

  const tableActionClicked = useCallback((actionEnum, item) => {
    dispatch(ActiveItemActions.activeItemRequest(item));      
    if (actionEnum === TableActions.delete.key) {
      setActiveItem(item);
      setOpenDialogDlete(true);
    } else if (actionEnum === TableActions.edit.key)
      GlobalHistory.push(`/home/Maintenance-Contracts/edit?id=${item.maintenanceContractId}`);
  }, []);

  useEffect(() => {
    GetAllMaintenanceContractAPI();
  }, [GetAllMaintenanceContractAPI, filter]);

  useEffect(() => {
   if (sortBy)
   setFilter((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);

  const DleteMaintenanceContract = useCallback(
    async (item) => {
      await DeleteMaintenanceContract(item.maintenanceContractId);
      showSuccess(t(`${translationPath}SuccessDlete`));
      setOpenDialogDlete(false);
      GetAllMaintenanceContractAPI();
    },
    [GetAllMaintenanceContractAPI, t, translationPath]
  );
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  useEffect(() => {
    if (search !== '')
    setFilter((item) => ({ ...item, pageIndex: 0, search }));
  }, [search]);
  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={response.totalCount}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
    );
  });
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );
  const getTableActionsByPermissions = () => {
    const list = [];
    if (returnPropsByPermissions2(MaintenanceContractsPermissions.UpdateMaintenanceContract.permissionsId, MaintenanceContractsPermissions.DeleteMaintenanceContract.permissionsId)) {
      list.push(
        {
          enum: TableActions.edit.key,
          isDisabled: false,
          externalComponent: null,
        },
        {
          enum: TableActions.delete.key,
          isDisabled: false,
          externalComponent: null,
        },
      );
      return list;
    }
    if (returnPropsByPermissions(MaintenanceContractsPermissions.UpdateMaintenanceContract.permissionsId)) {
      list.push(
        {
          enum: TableActions.edit.key,
          isDisabled: false,
          externalComponent: null,
        },
      );
      return list;
    }
    if (returnPropsByPermissions(MaintenanceContractsPermissions.DeleteMaintenanceContract.permissionsId)) {
      list.push(
        {
          enum: TableActions.delete.key,
          isDisabled: false,
          externalComponent: null,
        },
      );
      return list;
    }
    return list;
  };
  return (
    <div className='Maintenance-ContractsTabelView-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='filter-section-item' />
      <div className='w-100 px-2'>
        <Tables
          data={response.result}
          headerData={[
            {
              id: 1,
              isSortable: true,
              label: t(`${translationPath}ref-no`),
              input: 'maintenanceContractId',
            },
            {
              id: 2,
              label: t(`${translationPath}maintenanceCompany`),
              input: 'contactName',
              component: (item) => (
                // eslint-disable-next-line quotes
                <span>{(item && item.contactName) || 'N/A'}</span>
              ),
            },
            {
            id: 3,
             label: t(`${translationPath}propertyname`),
             input: 'propertyName',
            },
            {
               id: 4,
                label: t(`${translationPath}portfolioname`),
                 input: 'portfolioName',
            },
            {
              id: 5,
              label: t(`${translationPath}amount`),
              input: 'amount',
              isSortable: true,
            },
            {
              id: 6,
              label: t(`${translationPath}amountType`),
              component: (item) => (
                <span>
                  {(item && item.amountType === 1 ?
                    t(`${translationPath}FixedAmount`) :
                    t(`${translationPath}PercentageAmount`)) || 'N/A'}
                </span>
              ),
            },
            {
              id: 7,
              label: t(`${translationPath}contractDate`),
              isDate: true,
              isSortable: true,
              input: 'contractDate',
            },
            {
              id: 8,
              isDate: true,
              label: t(`${translationPath}StartDate`),
              input: 'startDate',
              isSortable: true,
            },
            {
              id: 9,
              isDate: true,
              label: t(`${translationPath}EndDate`),
              input: 'endDate',
              isSortable: true,
            },
            {
              id: 10,
              label: t(`${translationPath}amountPaidBy`),
              component: (item) => (
                <span>
                  {t(
                    `${translationPath}${Object.values(AmountPaidBy).findIndex(
                      (element) => element.value === item.amountPaidBy
                    ) !== -1 &&
                    Object.values(AmountPaidBy).find(
                      (element) => element.value === item.amountPaidBy
                    ).name
                    }`
                  ) || 'N/A'}
                </span>
              ),
            },
            {
              id: 11,
              label: t(`${translationPath}numberOfServices`),
              component: (item) => (
                <span>
                  {t(
                    `${translationPath}${Object.values(NumberOfServices).findIndex(
                      (element) => element.value === item.numberOfServices
                    ) !== -1 &&
                    Object.values(NumberOfServices).find(
                      (element) => element.value === item.numberOfServices
                    ).name
                    }`
                  ) || 'N/A'}
                </span>
              ),
            },
            {
              id: 12,
              label: t(`${translationPath}termOfPayment`),
              component: (item) => (
                <span>
                  {t(
                    `${translationPath}${Object.values(TermOfPayment).findIndex(
                      (element) => element.value === item.termOfPayment
                    ) !== -1 &&
                    Object.values(TermOfPayment).find(
                      (element) => element.value === item.termOfPayment
                    ).name
                    }`
                  ) || 'N/A'}
                </span>
              ),
            },
            {
              id: 13,
              label: t(`${translationPath}notes`),
              input: 'notes',
              isSortable: true,
            },
            {
              id: 14,
              label: t(`${translationPath}statuslabel`),
              component: (item) => (
                <span>
                  {t(
                    `${translationPath}${Object.values(Status).findIndex(
                      (element) => element.value === item.status
                    ) !== -1 &&
                    Object.values(Status).find((element) => element.value === item.status).name
                    }`
                  ) || 'N/A'}
                  {' '}
                  <span
                    className={
                      (item.status === 1 && 'state-Circle-online') ||
                      (item.status === 2 && 'state-Circle-offline') ||
                      'state-Circle-pending'
                    }
                  />
                </span>
              ),
            },
          ]}
          setSortBy={setSortBy}
          defaultActions={
            getTableActionsByPermissions()
          }
          actionsOptions={{
            onActionClicked: tableActionClicked,
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          totalItems={response.totalCount}
          itemsPerPage={filter.pageSize}
          activePage={filter.pageIndex}
        />
      </div>
      <DialogComponent
        isOpen={openDialogDlete}
        onCancelClicked={() => setOpenDialogDlete(false)}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        itemsPerPage={filter.pageSize}
        activePage={filter.pageIndex}
        totalItems={response.totalCount}
        titleText='MaintenanceContractsTabelViewDelte'
        onSubmit={(e) => {
          e.preventDefault();
          DleteMaintenanceContract(activeItem);
        }}
        maxWidth='sm'
        dialogContent={
          <span>{t(`${translationPath}delete-Maintenance-Contracts-description`)}</span>
        }
      />
    </div>
  );
};
MaintenanceContractsTabelView.propTypes = {
  search: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
