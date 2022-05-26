import React, { useState, useEffect, useCallback } from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Spinner, Tables } from '../../../../../../Components';
import { useTitle } from '../../../../../../Hooks';
import { TableActions } from '../../../../../../Enums';
import { GetParams, GlobalHistory } from '../../../../../../Helper';
import { OperatingCostsDeleteDialog } from '../../../../OperatingCosts/OperatingCostsViewManagement/Dialogs/ActivityDeleteDialog/OperatingCostsDeleteDialog';
import { GetAllOperatingCostsByPortfolioId } from '../../../../../../Services';
import { OperatingCostsAddManagementDialog } from './OperatingCostsViewUtilities/ManagementDialog/OperatingCostsAddManagementDialog';

const parentTranslationPath = 'OperatingCostsView';
const translationPath = '';

export const OperatingCostsViewComponent = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [operatingCosts, setOperatingCosts] = useState({
    result: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });

  useTitle(t(`${translationPath}operating-costs`));

  const getAllOperatingCosts = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllOperatingCostsByPortfolioId(+GetParams('id'), filter);
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
  }, [getAllOperatingCosts]);

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

  return (
    <div className='view-wrapper associated-contacts-wrapper childs-wrapper activities-view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='title-section'>
        <span>{t(`${translationPath}operating-costs`)}</span>
      </div>
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section px-2'>
            <div className='section'>
              <ButtonBase className='btns theme-solid px-3' onClick={() => setOpenAddDialog(true)}>
                <span className='mdi mdi-plus' />
                {t(`${translationPath}add-new`)}
              </ButtonBase>
            </div>
            <div className='section px-2' />
          </div>
        </div>
      </div>
      <div className='w-100 px-3'>
        {!isLoading && (
          <Tables
            data={operatingCosts.result}
            headerData={[
              {
                id: 1,
                isSortable: true,
                label: 'portfolio',
                component: (item) => (
                  <span>{(item.portfolioName && item.portfolioName) || 'N/A'}</span>
                ),
              },
              {
                id: 2,
                isSortable: true,
                label: 'property',
                component: (item) => (
                  <span>{(item.propertyName && item.propertyName) || 'N/A'}</span>
                ),
              },
              {
                id: 3,
                isSortable: true,
                label: 'billed-to',
                component: (item) => <span>{(item.billingToId && item.billingToId) || 'N/A'}</span>,
              },
              {
                id: 4,
                isSortable: true,
                label: 'month',
                component: (item) => <span>{(item.month && item.month) || 'N/A'}</span>,
              },
              {
                id: 5,
                isSortable: true,
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
                component: (item) => <span>{(item.remark && item.remark) || 'N/A'}</span>,
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
            totalItems={operatingCosts.totalCount}
          />
        )}
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
      {openAddDialog && (
        <OperatingCostsAddManagementDialog
          isOpen={openAddDialog}
          activeItem={activeItem}
          reloadData={() => {
            setActiveItem(null);
            onPageIndexChanged(0);
            setOpenAddDialog(false);
          }}
          isOpenChanged={() => {
            setActiveItem(null);
            setOpenAddDialog(false);
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};
