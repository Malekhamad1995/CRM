import React, { useState, useEffect, useCallback } from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { PermissionsComponent, Spinner, Tables } from '../../../../../../Components';
import { TableActions, AmountNatureType, FrequencyType } from '../../../../../../Enums';
import { GetAllUnitPaymentPlanByUnitId } from '../../../../../../Services';
import { GetParams } from '../../../../../../Helper';
import { PaymentPlanManagementDialog, PaymentPlanDeleteDialog } from './PaymentPlanViewUtilities';
import { UnitsSalesPermissions } from '../../../../../../Permissions/Sales/UnitsSalesPermissions';
import { getIsAllowedPermission } from '../../../../../../Helper/Permissions.Helper';

export const UnitProfilePaymentPlanComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [paymentPlans, setPaymentPlans] = useState({
    result: [],
    totalCount: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState({
    unitId: +GetParams('id'),
    pageSize: 25,
    pageIndex: 0,
  });

  const getAllPaymentTypes = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllUnitPaymentPlanByUnitId(filter);
    if (!(res && res.status && res.status !== 200)) {
      setPaymentPlans({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setPaymentPlans({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);

  useEffect(() => {
    getAllPaymentTypes();
  }, [getAllPaymentTypes]);
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
    } else if (actionEnum === TableActions.editText.key) {
      setActiveItem(item);
      setOpenDialog(true);
    }
  }, []);

  const addNewHandler = () => {
    setActiveItem(null);
    setOpenDialog(true);
  };

  return (
    <div className='view-wrapper activities-view-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='d-flex-column mt-3'>
        <div className='header-section'>
          <div className='activities-filter-wrapper'>
            <div className='cards-filter-section px-2 mb-2'>
              <div className='section px-2'>
                <PermissionsComponent
                  permissionsList={Object.values(UnitsSalesPermissions)}
                  permissionsId={UnitsSalesPermissions.AddPaymentPlanOnUnit.permissionsId}
                >
                  <ButtonBase className='btns theme-solid px-3' onClick={addNewHandler}>
                    <span className='mdi mdi-plus' />
                    {t(`${translationPath}add-new`)}
                  </ButtonBase>
                </PermissionsComponent>
              </div>
            </div>
          </div>
        </div>
        <div className='w-100 px-3'>
          <Tables
            data={paymentPlans.result}
            headerData={[
              {
                id: 1,
                isSortable: true,
                label: 'number',
                input: 'installmentNo',
              },
              {
                id: 2,
                isSortable: true,
                label: 'type',
                input: 'paymentTypeName',
              },
              {
                id: 3,
                isSortable: true,
                label: 'amount',
                component: (item) => (
                  <span>
                    {(item.amountNatureType === AmountNatureType.FixedAmount.key &&
                      item.installmentAmountOrRate) ||
                      (item.amountNatureType === AmountNatureType.PercentageOfBasePrice.key &&
                        `${item.installmentAmountOrRate} % ${t(
                          `${translationPath}of-base-price`
                        )}`) ||
                      (item.amountNatureType === AmountNatureType.PercentageOfSellingPrice.key &&
                        `${item.installmentAmountOrRate} % ${t(
                          `${translationPath}of-selling-price`
                        )}`) ||
                      (item.amountNatureType ===
                        AmountNatureType.PercentageOfRemainingBalance.key &&
                        `${item.installmentAmountOrRate} % ${t(
                          `${translationPath}of-remaining-balance`
                        )}`) ||
                      'N/A'}
                  </span>
                ),
              },
              {
                id: 4,
                isSortable: true,
                label: 'due',
                component: (item) => (
                  <span>
                    {(item.frequencyType === FrequencyType.Month.key &&
                      `${t(`${translationPath}after`)} ${item.frequencyValue} ${t(
                        `${translationPath}monthes`
                      )}`) ||
                      (item.frequencyType === FrequencyType.Day.key &&
                        `${t(`${translationPath}after`)} ${item.frequencyValue} ${t(
                          `${translationPath}days`
                        )}`) ||
                      (item.frequencyType === FrequencyType.Date.key &&
                        `${t(`${translationPath}on`)} ${moment(item.frequencyDateValue).format(
                          'YYYY/MM/DD'
                        )}`) ||
                      (item.frequencyType === FrequencyType.Completion.key &&
                        `${t(`${translationPath}completed`)}`) ||
                      (item.frequencyType === FrequencyType.NA && 'N/A') ||
                      'N/A'}
                  </span>
                ),
              },
              {
                id: 1,
                isSortable: true,
                label: 'description',
                component: (item) => <span>{(item.description && item.description) || 'N/A'}</span>,
              },
            ]}
            defaultActions={[
              {
                enum: TableActions.editText.key,
                isDisabled: getIsAllowedPermission(
                  Object.values(UnitsSalesPermissions),
                  loginResponse,
                  UnitsSalesPermissions.EditPaymentPlanForUnit.permissionsId
                ),
              },
              {
                enum: TableActions.deleteText.key,
                isDisabled: getIsAllowedPermission(
                  Object.values(UnitsSalesPermissions),
                  loginResponse,
                  UnitsSalesPermissions.DeletePaymentPlanForUnit.permissionsId
                ),
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
            translationPathFordata={translationPath}
            totalItems={paymentPlans.totalCount}
          />
        </div>
      </div>
      {openDialog && (
        <PaymentPlanManagementDialog
          open={openDialog}
          activeItem={activeItem}
          onSave={() => {
            setOpenDialog(false);
            onPageIndexChanged(0);
          }}
          close={() => setOpenDialog(false)}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {openConfirmDialog && (
        <PaymentPlanDeleteDialog
          isOpen={openConfirmDialog}
          activeItem={activeItem}
          reloadData={() => {
            setOpenConfirmDialog(false);
            onPageIndexChanged(0);
            getAllPaymentTypes();
          }}
          isOpenChanged={() => setOpenConfirmDialog(false)}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};

UnitProfilePaymentPlanComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
