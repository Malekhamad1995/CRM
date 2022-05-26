import React, { useEffect, useCallback, useRef } from 'react';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  ViewTypes, Spinner, NoDataFoundComponent, Inputs, PermissionsComponent
} from '../../../../Components';
import { ViewTypesEnum } from '../../../../Enums';
import AddDialog from './BusinessGroupsUtilities/BusinessGroupsDialogs/AddDialog';
import { GetBusinessGroups } from '../../../../Services/BusinessGroupsServices';
import { useTitle } from '../../../../Hooks';
import TreeViewGroups from './BusinessGroupsUtilities/BusinessGroupsTreeView/BusinessGroupsTreeView';
import ListViewGroups from './BusinessGroupsUtilities/BusinessGroupsListView/BusinessGroupsListView';
import { BusinessGroupsPermissions } from '../../../../Permissions';
import { getIsAllowedPermission } from '../../../../Helper/Permissions.Helper';

const ViewGroups = () => {
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const { t } = useTranslation(['BusinessGroupsView', 'Shared']);
  const [loading, setLoading] = React.useState(false);
  const [editGroup, setEditGroup] = React.useState(false);
  const [groupName, setGroupName] = React.useState('');
  const [groupId, setGroupId] = React.useState('');
  const [groupParent, setGroupParent] = React.useState('');
  const [groupParentId, setGroupParentId] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [response, setResponse] = React.useState({});
  const [searchNode, setSearchNode] = React.useState([]);
  const [searchedItem, setSearchedItem] = React.useState('');
  const [treeGroup, setTreeGroup] = React.useState(false);
  const [treeSearch, setTreeSearch] = React.useState(true);
  const [openAddDialog, setopenAddDialog] = React.useState(false);
  const [activeActionType, setActiveActionType] = React.useState(ViewTypesEnum.cards.key);
  const [isFirstLoad, setisFirstLoad] = React.useState(true);
  const searchTimer = useRef(null);
  useTitle(t('Shared:SideMenuView.Administration.BusinessGroups'));

  const GetMyGroups = useCallback(async (pageIndex, PageSize) => {
    setLoading(true);
    if (getIsAllowedPermission(
      Object.values(BusinessGroupsPermissions),
      loginResponse,
      BusinessGroupsPermissions.OpenBusinessGroupsTree.permissionsId
    )) {
      const res = await GetBusinessGroups(pageIndex, PageSize, '');
      setResponse(res);
      if (res && res.totalCount === 0) setisFirstLoad(false);
    }

    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    GetMyGroups(1, 50);
  }, [GetMyGroups]);

  const handleSentData = (name, parent, id, edit, parentId) => {
    setGroupName(name);
    setGroupParent(parent);
    setGroupId(id);
    setEditGroup(edit);
    setGroupParentId(parentId);
  };
  const handleGroupsSearch = (e) => {
    // eslint-disable-next-line no-unused-expressions
    response &&
      response.result &&
      searchNode &&
      setSearchNode(
        response.result.filter((el) =>
          el.businessGroupsName.toUpperCase().includes(e.target.value.toUpperCase()))
      );
    setSearchedItem(e.target.value);
    if (e.target.value === '') setSearchNode([]);
  };
  const handleAddGroup = () => {
    setopenAddDialog(true);
    setTreeGroup(!treeGroup);
    setGroupParent('');
    setGroupId('');
    setGroupName('');
    setGroupParentId('');
  };
  const onTypeChanged = useCallback(
    (activeType) => {
      setActiveActionType(activeType);
      if (activeType === 'cards') {
        setSearchedItem('');
        GetMyGroups(1, 50, '');
        setTreeGroup(true);
        setTreeSearch(true);
      }
      if (activeType === 'tableView') {
        setSearchedItem('');
        GetMyGroups(page + 1, rowsPerPage, '');
        setTreeGroup(false);
        setTreeSearch(false);
      }
    },
    [GetMyGroups, page, rowsPerPage]
  );
  const searchHandler = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (!treeSearch) {
        setResponse();
        GetMyGroups(page + 1, rowsPerPage, searchedItem);
      }
    }, 700);
  };

  return (
    <div className='view-wrapper'>
      <Spinner isActive={loading} />
      <div className='header-section'>
        <div className='filter-section px-2'>
          <div className='section'>
            <PermissionsComponent
              permissionsList={Object.values(BusinessGroupsPermissions)}
              permissionsId={BusinessGroupsPermissions.AddRecordCard.permissionsId}
            >
              <Button className='btns theme-solid bg-primary' onClick={handleAddGroup}>
                <span className='mdi mdi-plus' />
                {t('AddGroup')}
              </Button>
            </PermissionsComponent>
          </div>
          <div className='section px-2'>
            <PermissionsComponent
              permissionsList={Object.values(BusinessGroupsPermissions)}
              permissionsId={BusinessGroupsPermissions.OpenBusinessGroupsTree.permissionsId}
            >
              <Inputs
                idRef='usersSearchRef'
                variant='outlined'
                value={searchedItem}
                onInputChanged={handleGroupsSearch}
                fieldClasses='inputs theme-solid'
                label={t('SearchGroup')}
                beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                onKeyUp={searchHandler}
              />
            </PermissionsComponent>
            <PermissionsComponent
              permissionsList={Object.values(BusinessGroupsPermissions)}
              permissionsId={BusinessGroupsPermissions.OpenBusinessGroupsTree.permissionsId}
            >
              <ViewTypes
                onTypeChanged={onTypeChanged}
                activeTypes={[ViewTypesEnum.tableView.key, ViewTypesEnum.cards.key]}
                className='mb-3'
              />
            </PermissionsComponent>
          </div>
        </div>
      </div>
      <PermissionsComponent
        permissionsList={Object.values(BusinessGroupsPermissions)}
        permissionsId={BusinessGroupsPermissions.OpenBusinessGroupsTree.permissionsId}
      >
        <NoDataFoundComponent />
      </PermissionsComponent>
      <PermissionsComponent
        permissionsList={Object.values(BusinessGroupsPermissions)}
        permissionsId={BusinessGroupsPermissions.OpenBusinessGroupsTree.permissionsId}
      >
        {activeActionType === ViewTypesEnum.tableView.key ? (
          <ListViewGroups
            handleSentData={handleSentData}
            setopenAddDialog={() => setopenAddDialog(true)}
            page={page}
            isFirstLoad={isFirstLoad}
            setPage={(x) => setPage(x)}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={(x) => setRowsPerPage(x)}
            response={response}
            searchedItem={searchedItem}
            reloadData={(pageValue, rowsPerPageValue) =>
              GetMyGroups(pageValue, rowsPerPageValue, searchedItem)}
          />
        ) : (
          <div className='bussines-groups-wrapper'>
            <TreeViewGroups
              searchNode={searchNode}
              page={page}
              setPage={(x) => setPage(x)}
              rowsPerPage={rowsPerPage}
              searchedItem={searchedItem}
              setRowsPerPage={(x) => setRowsPerPage(x)}
              handleSentData={handleSentData}
              setopenAddDialog={() => setopenAddDialog(true)}
              response={response}
              setTreeGroup={(x) => setTreeGroup(x)}
              reloadData={() => GetMyGroups(1, 50, searchedItem)}
            />
          </div>
        )}
      </PermissionsComponent>
      <AddDialog
        setGroupId={(x) => setGroupId(x)}
        setGroupParentId={(x) => setGroupParentId(x)}
        groupParentId={groupParentId}
        groupId={groupId}
        response={response}
        setGroupName={(x) => setGroupName(x)}
        setGroupParent={(x) => setGroupParent(x)}
        groupName={groupName}
        groupParent={groupParent}
        isEdit={editGroup}
        setIsEdit={(x) => setEditGroup(x)}
        isTree={treeGroup}
        setTreeGroup={(x) => setTreeGroup(x)}
        open={openAddDialog}
        close={() => setopenAddDialog(false)}
        treeReload={() => GetMyGroups(1, 50, searchedItem)}
        reloadData={() => GetMyGroups(page + 1, rowsPerPage, searchedItem)}
      />
    </div>
  );
};

export default ViewGroups;
