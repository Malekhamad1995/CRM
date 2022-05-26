import React, {
  useState, useRef, useEffect, useCallback
} from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  Inputs, Spinner, Tables, PermissionsComponent
} from '../../../Components';
import { useTitle } from '../../../Hooks';
import { MonthsEnum, TableActions } from '../../../Enums';
import { GetAllOperatingCosts } from '../../../Services';
import { OperatingCostsDeleteDialog } from './OperatingCostsViewManagement/Dialogs/ActivityDeleteDialog/OperatingCostsDeleteDialog';
import { GlobalHistory, returnPropsByPermissions2, returnPropsByPermissions } from '../../../Helper';
import { OperatingCostsPermissions } from '../../../Permissions/PropertyManagement/OperatingCosts.Permissions';

const parentTranslationPath = 'OperatingCostsView';
const translationPath = '';

export const OperatingCostsView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [searchedItem, setSearchedItem] = useState('');
  const [activeItem, setActiveItem] = useState(null);
  const [operatingCosts, setOperatingCosts] = useState({
    result: [],
    totalCount: 0,
  });
  const searchTimer = useRef(null);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
  });
  const [sortBy, setSortBy] = useState(null);
  useTitle(t(`${translationPath}operating-costs`));

  const getAllOperatingCosts = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllOperatingCosts(filter);
    if (!(res && res.status && res.status !== 200)) {
      setOperatingCosts({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setOperatingCosts({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);

  useEffect(() => {
    getAllOperatingCosts();
  }, [getAllOperatingCosts, filter]);

  const searchHandler = (event) => {
    const { value } = event.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({ ...item, pageIndex: 0, search: value }));
    }, 700);
  };
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const tableActionClicked = useCallback((actionEnum, item, focusedRow, event) => {
    event.stopPropagation();
    event.preventDefault();
    if (actionEnum === TableActions.deleteText.key) {
      setOpenConfirmDialog(true);
      setActiveItem(item);
    } else if (actionEnum === TableActions.editText.key)
      GlobalHistory.push(`/home/operating-costs/edit?id=${item.operatingCostId}`);
  }, []);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  const getTableActionsByPermissions = () => {
    const list = [];
    if (returnPropsByPermissions2(OperatingCostsPermissions.EditOperatingCosts.permissionsId, OperatingCostsPermissions.DeleteOperatingCost.permissionsId)) {
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
    if (returnPropsByPermissions(OperatingCostsPermissions.EditOperatingCosts.permissionsId)) {
      list.push(
        {
          enum: TableActions.edit.key,
          isDisabled: false,
          externalComponent: null,
        },
      );
      return list;
    }
    if (returnPropsByPermissions(OperatingCostsPermissions.DeleteOperatingCost.permissionsId)) {
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

  useEffect(() => {
    if (sortBy)
    setFilter((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);

  return (
    <div className='view-wrapper operating-costs-view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section px-2'>
            <div className='section'>
              <PermissionsComponent
                permissionsList={Object.values(OperatingCostsPermissions)}
                permissionsId={OperatingCostsPermissions.CreateOpertaingCosts.permissionsId}
              >
                <ButtonBase
                  className='btns theme-solid px-3'
                  onClick={() => GlobalHistory.push('/home/operating-costs/add')}
                >
                  <span className='mdi mdi-plus' />
                  {t(`${translationPath}add-new`)}
                </ButtonBase>
              </PermissionsComponent>
            </div>
            <PermissionsComponent
              permissionsList={Object.values(OperatingCostsPermissions)}
              permissionsId={OperatingCostsPermissions.ViewandsearchinPropertyManagementOperatingCosts.permissionsId}
            >
              <div className='section px-2'>
                <Inputs
                  value={searchedItem}
                  onKeyUp={searchHandler}
                  idRef='activitiesSearchRef'
                  label={t(`${translationPath}search-operating-costs`)}
                  onInputChanged={(e) => setSearchedItem(e.target.value)}
                  inputPlaceholder={t(`${translationPath}search-operating-costs-description`)}
                  beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                />
              </div>
            </PermissionsComponent>
          </div>

        </div>
        <PermissionsComponent
          permissionsList={Object.values(OperatingCostsPermissions)}
          permissionsId={OperatingCostsPermissions.ViewandsearchinPropertyManagementOperatingCosts.permissionsId}
        >
          <div className='w-100 px-3'>
            <Tables
              data={operatingCosts.result}
              headerData={[
                  {
                    id: 1,
                    isSortable: true,
                    label: 'portfolio',
                    input: 'portfolioName',
                    component: (item) => (
                      <span>{(item.portfolioName) || 'N/A'}</span>
                    ),
                  },
                  {
                    id: 2,
                    isSortable: true,
                    label: 'property',
                    input: 'propertyName',
                    component: (item) => (
                      <span>{(item.propertyName) || 'N/A'}</span>
                    ),
                  },
                  {
                    id: 3,
                    isSortable: true,
                    label: 'billed-to',
                    input: 'billingToId',
                    component: (item) => (
                      <span>{(item.billingToId) || 'N/A'}</span>
                    ),
                  },
                  {
                    id: 4,
                    label: 'month',
                    component: (item) => (
                      <span>
                        {MonthsEnum.map(
                          (el) => el.key === item.month && t(`${translationPath}${el.value}`)
                        ) || 'N/A'}
                      </span>
                    ),
                  },
                  {
                    id: 5,
                    label: 'grand-total',
                    component: (item) => (
                      <span>
                        {item.buildingInsuranceTotalAmount +
                          item.internetTotalAmount +
                          item.othersTotalAmount +
                          item.staffCostTotalAmount +
                          item.telePhoneTotalAmount +
                          item.waterElectricityAmountTotalAmount || 'N/A'}
                      </span>
                    ),
                  },
                  {
                    id: 6,
                    isSortable: true,
                    label: 'remarks',
                    input: 'remark',
                    component: (item) => <span>{(item.remark) || 'N/A'}</span>,
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
              totalItems={operatingCosts.totalCount}
              setSortBy={setSortBy}
            />
          </div>
        </PermissionsComponent>
      </div>
      {openConfirmDialog && (
        <OperatingCostsDeleteDialog
          isOpen={openConfirmDialog}
          activeItem={activeItem}
          reloadData={() => {
            setActiveItem(null);
            onPageIndexChanged(0);
            setOpenConfirmDialog(false);
          }}
          isOpenChanged={() => {
            setActiveItem(null);
            setOpenConfirmDialog(false);
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};
