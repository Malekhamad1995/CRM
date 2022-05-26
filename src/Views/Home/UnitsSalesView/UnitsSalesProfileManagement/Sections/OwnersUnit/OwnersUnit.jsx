import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import { Spinner, Tables , PermissionsComponent} from '../../../../../../Components';
import { contactsDetailsGet } from '../../../../../../Services/ContactsServices';
import { GetAllOwnersByUnitId } from '../../../../../../Services/UnitsServices';
import { GetParams, GlobalHistory, returnPropsByPermissions } from '../../../../../../Helper';
import { TableActions } from '../../../../../../Enums';
import { ActiveItemActions } from '../../../../../../store/ActiveItem/ActiveItemActions';
import { ContactsPermissions } from '../../../../../../Permissions';
import { OwnerDetailsDialog } from '../../../../UnitsView/UnitsUtilities/Dialogs/OwnerDetails/OwnerDetailsDialog';
import { AddOwnersDialog } from '../../../../UnitsLeaseView/UnitsLeaseProfileManagementView/Sections/OwnersUnit/AddOwners/AddOwnersDialog';
import { EditOwnersDialog } from '../../../../UnitsLeaseView/UnitsLeaseProfileManagementView/Sections/OwnersUnit/EditOwners/EditOwnersDialog';
import { UnitsSalesPermissions } from '../../../../../../Permissions'; 

export const OwnersUnit = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [currentActions, setCurrentActions] = useState(false);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
  });
  const [isOpenOwnerDetailsDialog, setIsOpenOwnerDetailsDialog] = useState(false);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [ownersList, setOwnersList] = useState([]);
  const [updateresult, setUpdateresult] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  const getAllOwner = useCallback(async (unitId) => {
    setIsLoading(true);
    const res = await GetAllOwnersByUnitId(unitId);
    if (!(res && res.status && res.status !== 200))
      setOwnersList(res);
     else setOwnersList([]);

    setIsLoading(false);
  }, [result, updateresult]);

  const getContactById = useCallback(async (contactId) => {
    setIsLoading(true);
    const res = await contactsDetailsGet({ id: contactId });
    setIsLoading(false);
    if (!(res && res.status && res.status !== 200))
      setOwnerDetails(res);
    else
      setOwnerDetails(null);
  }, []);

  const tableActionClicked = useCallback((actionEnum, item) => {
    if (actionEnum === TableActions.openFile.key) {
      dispatch(ActiveItemActions.activeItemRequest(item));
      GlobalHistory.push(
        `/home/Contacts-CRM/contact-profile-edit?formType=${item.type || 1
        }&id=${item.ownerId}`
      );
    } else if (actionEnum === TableActions.viewDetails.key) {
      {
        getContactById(item.id);
        setIsOpenOwnerDetailsDialog(true);
      }
    } else if (actionEnum === TableActions.editText.key) {
      setActiveItem(item);
      setOpenEditDialog(true);
    } else if (actionEnum === TableActions.deleteText.key)
      setOpenDeleteDialog(true);
  }, []);

  const focusedRowChanged = (activeRow) => {
    const item = ownersList[activeRow];
    if (!item) return;
    setCurrentActions(item.isCurrentOwner);
  };
  const getTableActionsWithPermissions = () => {
    // eslint-disable-next-line prefer-const
    let list = [];
    if (currentActions) {
      if (returnPropsByPermissions(ContactsPermissions.ViewContactInformation.permissionsId)) {
        list.push({
          enum: TableActions.openFile.key,
        });
      }
      if (returnPropsByPermissions(UnitsSalesPermissions.UpdateUnitOwner.permissionsId)) {
        list.push({
          enum: TableActions.editText.key,
        });
      }
      
    } else {
      if (returnPropsByPermissions(ContactsPermissions.ViewContactInformation.permissionsId)) {
        list.push({
          enum: TableActions.openFile.key,
        });
      }
   
    }
    return list;
  };

  useEffect(() => {
    const unitId = GetParams('id');
    getAllOwner(unitId);
  }, [getAllOwner]);

  return (
    <div className='view-wrapper p-3'>
      <div className='childs-wrapper'>
        <div>
          <span className='title-section'>{t('owners')}</span>
        </div>
         <PermissionsComponent
          permissionsList={Object.values(UnitsSalesPermissions)}
          permissionsId={UnitsSalesPermissions.CreateUnitOwner.permissionsId}
        >
        <div className='mt-2'>
          <ButtonBase
            className='btns theme-solid'
            onClick={() => setOpenAddDialog(true)}
          >
            <span className='mdi mdi-plus' />
            <span className='px-1'>{t('add-owner')}</span>
          </ButtonBase>
        </div>
        </PermissionsComponent>
        <Spinner isActive={isLoading} />
        <PermissionsComponent
          permissionsList={Object.values(UnitsSalesPermissions)}
          permissionsId={UnitsSalesPermissions.GetAllOwnersByUnitId.permissionsId}
        >
        <div className='d-flex-column'>
          <div className='px-2 mt-3' />
          <div className='w-100 px-3'>
            {!isLoading && (
              <Tables
                data={ownersList || []}
                headerData={[
                  {
                    id: 1,
                    label: 'owner-id',
                    input: 'ownerId',
                  },
                  {
                    id: 2,
                    label: 'owner-name',
                    input: 'name',
                  },
                  {
                    id: 3,
                    label: 'createdBy',
                    input: 'createdBy',
                  },
                  {
                    id: 4,
                    label: 'createdOn',
                    input: 'createdOn',
                    dateFormat: 'DD/MM/YYYY',
                    isDate: true,
                  },
                  {
                    id: 5,
                    label: 'currentOwner',
                    component:
                      (item) => (
                        <>
                          {item.isCurrentOwner ? 'Yes' : 'No'}
                        </>
                      )
                  },
                ]}
                focusedRowChanged={focusedRowChanged}
                defaultActions={
                  getTableActionsWithPermissions()
                }
                actionsOptions={{
                  onActionClicked: tableActionClicked,
                }}
                onPageIndexChanged={onPageIndexChanged}
                onPageSizeChanged={onPageSizeChanged}
                itemsPerPage={filter.pageSize}
                activePage={filter.pageIndex}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                totalItems={ownersList.length}
              />
            )}
            {openAddDialog && (
              <AddOwnersDialog
                openAddDialog={openAddDialog}
                filter={filter}
                t={t}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                onPageSizeChange={onPageSizeChanged}
                setOpenAddDialog={setOpenAddDialog}
                setFilter={setFilter}
                onPageIndexChanged={onPageIndexChanged}
                setResult={setResult}
              />
            )}
          </div>
          {isOpenOwnerDetailsDialog && (
            <OwnerDetailsDialog
              isOpen={isOpenOwnerDetailsDialog}
              onClose={() => setIsOpenOwnerDetailsDialog(false)}
              ownerDetails={ownerDetails && ownerDetails.contact}
            />
          )}
          {openEditDialog && (
            <EditOwnersDialog
              openEditDialog={openEditDialog}
              filter={filter}
              t={t}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              setOpenEditDialog={setOpenEditDialog}
              setFilter={setFilter}
              activeItem={activeItem}
              setUpdateresult={setUpdateresult}
            />
          )}
        </div>
        </PermissionsComponent>
      </div>
    </div>
  );
};
OwnersUnit.prototype = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
