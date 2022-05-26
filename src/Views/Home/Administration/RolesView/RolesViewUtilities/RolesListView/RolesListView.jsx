import React, {
  useEffect, useRef, useState, useCallback
} from 'react';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { orderBy } from 'lodash';
import {
  Spinner,
  Tables,
  NoDataFoundComponent,
  NoSearchResultComponent,
  Inputs,
  PaginationComponent,
  PermissionsComponent
} from '../../../../../../Components';
import { bottomBoxComponentUpdate, GlobalHistory } from '../../../../../../Helper';
import { useTitle } from '../../../../../../Hooks';
import { TableActions } from '../../../../../../Enums';
import { DeleteRoleDialog } from '../RolesDialogs/DeleteRoleDialog';
import { GetAllRoles } from '../../../../../../Services/roleServices';
import { RolesPermissions } from '../../../../../../Permissions';
import { getIsAllowedPermission } from '../../../../../../Helper/Permissions.Helper';

export const RolesListView = () => {
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const { t } = useTranslation(['RolesView', 'Shared']);
  const searchTimer = useRef(null);
  const [rolesResponse, setRolesResponse] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [deletedName, setDeletedName] = React.useState('');
  const [deletedId, setDeletedId] = React.useState(0);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [isFirstLoad, setisFirstLoad] = React.useState(true);
  const [sortBy, setSortBy] = React.useState(null);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
    filterBy: null,
    orderBy: null
  });

  useTitle(t('Shared:SideMenuView.Administration.Roles'));

  const GetMyRoles = useCallback(async () => {
    setLoading(true);
    if (getIsAllowedPermission(
      Object.values(RolesPermissions),
      loginResponse,
      RolesPermissions.ViewRoles.permissionsId
    )) {
      const res = await GetAllRoles(filter.pageIndex + 1, filter.pageSize, filter.search, filter.filterBy, filter.orderBy);
      if (!(res && res.data && res.data.ErrorId) && res) setRolesResponse(res);
      else setRolesResponse({ result: [], totalCount: 0 });
      if (res && res.totalCount === 0) setisFirstLoad(false);
    }
    setLoading(false);
  }, [filter, loginResponse]);
  useEffect(() => {
    GetMyRoles();
  }, [GetMyRoles, filter]);

  const searchHandler = (e) => {
    const { value } = e.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((items) => ({ ...items, pageIndex: 0, search: value }));
    }, 700);
  };

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={(rolesResponse && rolesResponse.totalCount) || 0}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
    );
  });

  useEffect(() => {
    if (sortBy)
    setFilter((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);

  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );

  const tableActionClicked = useCallback((actionEnum, item, focusedRow, event) => {
    event.stopPropagation();
    event.preventDefault();
    if (actionEnum === TableActions.view.key) GlobalHistory.push(`./Details?id=${item.rolesId}`);
    else if (actionEnum === TableActions.edit.key)
      GlobalHistory.push(`./role-management?id=${item.rolesId}&roleName=${item.rolesName}`);
    else if (actionEnum === TableActions.delete.key) {
      setDeletedId(item.rolesId);
      setDeletedName(item.rolesName);
      setDeleteDialog(true);
    }
  }, []);
  return (
    <div className='view-wrapper'>
      <Spinner isActive={loading} />
      <div className='header-section'>
        <div className='filter-section px-2'>
          <div className='section'>
            <PermissionsComponent
              permissionsList={Object.values(RolesPermissions)}
              permissionsId={RolesPermissions.AddRoles.permissionsId}
            >
              <Button
                onClick={() => GlobalHistory.push('/home/Roles/role-management')}
                className='btns theme-solid bg-primary'
              >
                {t('RolesView:RolesListView.AddNewRole')}
              </Button>
            </PermissionsComponent>
          </div>
          <PermissionsComponent
            permissionsList={Object.values(RolesPermissions)}
            permissionsId={RolesPermissions.ViewRoles.permissionsId}
          >
            <div className='section px-2'>
              <div className='d-flex-column p-relative'>
                <Inputs
                  idRef='usersSearchRef'
                  variant='outlined'
                  fieldClasses='inputs theme-solid'
                  label={t('RolesView:RolesListView.SearchRoles')}
                  beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                  onKeyUp={searchHandler}
                />
              </div>
            </div>
          </PermissionsComponent>
        </div>
      </div>
      <PermissionsComponent
        permissionsList={Object.values(RolesPermissions)}
        permissionsId={RolesPermissions.ViewRoles.permissionsId}
      >
        {' '}
        <NoDataFoundComponent />

      </PermissionsComponent>
      <PermissionsComponent
        permissionsList={Object.values(RolesPermissions)}
        permissionsId={RolesPermissions.ViewRoles.permissionsId}
      >
        {rolesResponse && rolesResponse.totalCount === 0 && !isFirstLoad ? (
          <NoSearchResultComponent />
        ) : (
          rolesResponse && (
            <div className='w-100 px-3'>
              <Tables
                data={rolesResponse.result || []}
                headerData={[
                  {
                    id: 1,
                    label: 'RolesView:RolesListView.RolesId2',
                    component: (item, index) => <span>{index + 1}</span>,
                  },
                  {
                    id: 2,
                    isSortable: true,
                    label: 'RolesView:RolesListView.RolesName',
                    input: 'rolesName',
                    isDate: false,
                  },
                ]}
                defaultActions={[
                  {
                    enum: TableActions.edit.key,
                    isDisabled: !getIsAllowedPermission(
                      Object.values(RolesPermissions),
                      loginResponse,
                      RolesPermissions.EditViewRolesRecord.permissionsId
                    ),
                    externalComponent: null,
                  },
                  {
                    enum: TableActions.delete.key,
                    isDisabled: !getIsAllowedPermission(
                      Object.values(RolesPermissions),
                      loginResponse,
                      RolesPermissions.DeleteRoles.permissionsId
                    ),
                    externalComponent: null,
                  },
                ]}
                onPageIndexChanged={onPageIndexChanged}
                onPageSizeChanged={onPageSizeChanged}
                actionsOptions={{
                  onActionClicked: tableActionClicked,
                }}
                itemsPerPage={filter.pageSize}
                activePage={filter.pageIndex}
                totalItems={rolesResponse && rolesResponse.totalCount ? rolesResponse.totalCount : 0}
                setSortBy={setSortBy}
              />
            </div>
          )
        )}
      </PermissionsComponent>
      <DeleteRoleDialog
        open={deleteDialog}
        close={() => setDeleteDialog(false)}
        deletedId={deletedId}
        name={deletedName}
        reloadData={() => setFilter((items) => ({ ...items, pageIndex: 0 }))}
      />
    </div>
  );
};
