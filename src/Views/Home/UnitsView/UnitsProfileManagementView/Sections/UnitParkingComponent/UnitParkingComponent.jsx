import React, { useState, useEffect, useCallback } from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  DialogComponent,
  PermissionsComponent,
  Spinner,
  Tables,
} from '../../../../../../Components';
import { useTitle } from '../../../../../../Hooks';
import { TableActions } from '../../../../../../Enums';
import { ActivitiesManagementDialog } from './ActivitiesViewUtilities/Dialogs/UnitParkingDialog';
import { getIsAllowedPermission, GetParams, showSuccess } from '../../../../../../Helper';
import { DeleteUnitParking, UnitParkingById } from '../../../../../../Services/UnitParkingServices';
import { UnitPermissions, UnitsSalesPermissions } from '../../../../../../Permissions';
import { UnitsLeasePermissions } from '../../../../../../Permissions/Lease/UnitsLeasePermissions';

export const UnitParkingComponent = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialogDlete, setOpenDialogDlete] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isedit, setisEdit] = useState(false);
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const [Parking, setParking] = useState({
    result: [],
    totalCount: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState({
    id: GetParams('id'),
    pageSize: 25,
    pageIndex: 0,
  });

  const [isPropertyManagementView, setIsPropertyManagementView] = useState(false);

  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];

  useTitle(t(`${translationPath}activities`));

  const GetAllUnitParkingAPI = useCallback(async () => {
    setIsLoading(true);
    const res = await UnitParkingById(filter.id, filter.pageIndex + 1, filter.pageSize);
    if (!(res && res.status && res.status !== 200)) {
      setParking({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setParking({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);

  useEffect(() => {
    GetAllUnitParkingAPI();
  }, [GetAllUnitParkingAPI]);
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const tableActionClicked = useCallback((actionEnum, item, focusedRow, event) => {
    event.stopPropagation();
    event.preventDefault();
    if (actionEnum === TableActions.delete.key) {
      setActiveItem(item);
      setOpenDialogDlete(true);
    } else if (actionEnum === TableActions.editText.key) {
      setActiveItem(item);
      setOpenDialog(true);
      setisEdit(true);
    }
  }, []);

  const addNewHandler = () => {
    setisEdit(false);
    setOpenDialog(true);
  };
  const DleteMaintenanceContract = useCallback(
    async (item) => {
      await DeleteUnitParking(item.unitParkingId);
      showSuccess(t(`${translationPath}SuccessDlete`));
      setOpenDialogDlete(false);
      GetAllUnitParkingAPI();
    },
    [GetAllUnitParkingAPI, t, translationPath]
  );
  useEffect(() => {
    if (pathName === 'units-property-management/unit-profile-edit')
      setIsPropertyManagementView(true);
    else
      setIsPropertyManagementView(false);
  }, [pathName]);
  return (
    <div className='view-wrapper activities-view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='activities-filter-wrapper'>
            <div className='cards-filter-section px-2 mb-2'>
              <div className='section px-2 pt-2'>
                {!isPropertyManagementView && (
                  <PermissionsComponent
                    permissionsList={[...Object.values(UnitsSalesPermissions), ...Object.values(UnitsLeasePermissions)]}
                    permissionsId={[UnitsSalesPermissions.AddParkingForUnit.permissionsId, UnitsLeasePermissions.AddParkingForUnit.permissionsId]}
                  >
                    <ButtonBase className='btns theme-solid px-3' onClick={addNewHandler}>
                      <span className='mdi mdi-plus' />
                      {t(`${translationPath}add-new`)}
                    </ButtonBase>
                  </PermissionsComponent>
                )}
                {isPropertyManagementView && (
                  <PermissionsComponent
                    permissionsList={Object.values(UnitPermissions)}
                    permissionsId={UnitPermissions.AddParkingForUnit.permissionsId}
                  >
                    <ButtonBase className='btns theme-solid' onClick={openDialog}>
                      <span className='mdi mdi-plus' />
                      <span>{t(`${translationPath}AddNew`)}</span>
                    </ButtonBase>
                  </PermissionsComponent>
                )}

              </div>
            </div>
          </div>
        </div>
        <div className='w-100 px-3'>
          <Tables
            data={Parking.result}
            headerData={[
              {
                id: 1,
                label: 'parkingTypeId',
                input: 'parkingTypeId',
              },
              {
                id: 2,
                label: 'parkingTypeName',
                input: 'parkingTypeName',
              },
              {
                id: 3,
                label: 'parkingNumber',
                input: 'parkingNumber',
              },
              {
                id: 4,
                label: 'No-Of-Spaces',
                input: 'numberOfSpaces',
              },

              {
                id: 5,
                label: 'Paid/Unpaid',
                component: (item) => (
                  <span>
                    {(item.isPaid && item.isPaid) === true ?
                      t(`${translationPath}Paid`) :
                      t(`${translationPath}Unpaid`) || 'N/A'}
                  </span>
                ),
              },
              {
                id: 6,
                label: 'Chargesperannum(AED)',
                input: 'annualCharge',
              },
            ]}
            defaultActions={!isPropertyManagementView ? [
              {
                enum: TableActions.editText.key,
                isDisabled: !getIsAllowedPermission(
                  Object.values(UnitsSalesPermissions),
                  loginResponse,
                  UnitsSalesPermissions.EditParkingForUnit.permissionsId
                )
              },
              {
                enum: TableActions.delete.key,
                isDisabled: !getIsAllowedPermission(
                  Object.values(UnitsSalesPermissions),
                  loginResponse,
                  UnitsSalesPermissions.DeleteParkingForUnit.permissionsId
                )
              },
            ] : [{
              enum: TableActions.editText.key,
              isDisabled: !getIsAllowedPermission(
                Object.values(UnitPermissions),
                loginResponse,
                UnitPermissions.EditParkingForUnit.permissionsId
              )
            },
            {
              enum: TableActions.delete.key,
              isDisabled: !getIsAllowedPermission(
                Object.values(UnitPermissions),
                loginResponse,
                UnitPermissions.DeleteParkingForUnit.permissionsId
              )
            }]}
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
            actionsOptions={{
              onActionClicked: tableActionClicked,
            }}
            itemsPerPage={filter.pageSize}
            activePage={filter.pageIndex}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            totalItems={Parking.totalCount}
          />
        </div>
      </div>
      {openDialog && (
        <ActivitiesManagementDialog
          open={openDialog}
          activeItem={activeItem}
          isedit={isedit}
          onSave={() => {
            setOpenDialog(false);
            onPageIndexChanged(0);
          }}
          close={() => setOpenDialog(false)}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      <DialogComponent
        saveClasses='btns theme-solid bg-danger w-100 mx-2 mb-2'
        isOpen={openDialogDlete}
        saveText='confirm'
        saveType='submit'
        onCancelClicked={() => setOpenDialogDlete(false)}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        itemsPerPage={filter.pageSize}
        activePage={filter.pageIndex}
        titleText='UnitParkingComponentDelte'
        onSubmit={(e) => {
          e.preventDefault();
          DleteMaintenanceContract(activeItem);
        }}
        maxWidth='sm'
        dialogContent={(
          <div className='d-flex-column-center'>
            <Spinner isActive={isLoading} />
            <span className='mdi mdi-close-octagon c-danger mdi-48px' />
            <span>
              {' '}
              <span>{t(`${translationPath}delete-Unit-Parking-description`)}</span>
            </span>
          </div>
        )}
      />
    </div>
  );
};

UnitParkingComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
