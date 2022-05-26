/* eslint-disable no-shadow */
import React, { useEffect, useRef } from 'react';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import AddTeamDialog from './TeamUtilties/TeamDialog/AddTeamDialog';
import {
  Spinner, ViewTypes, NoDataFoundComponent, Inputs, PermissionsComponent
} from '../../../../Components';
import { ViewTypesEnum } from '../../../../Enums';
import ListTeam from './TeamUtilties/ViewListTeam/ListTeamView';
import { TreeTeamView } from './TeamUtilties/ViewTreeTeam/TreeTeamView';
import { GetTeam, GetallBusinessGroups } from '../../../../Services/Team';
import { useTitle } from '../../../../Hooks';
import { TeamPermissions } from '../../../../Permissions';
import { getIsAllowedPermission } from '../../../../Helper/Permissions.Helper';

const TeamView = () => {
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const { t } = useTranslation(['TeamView', 'Shared']);
  const [loading, setLoading] = React.useState(false);
  const [editGroup, setEditGroup] = React.useState(false);
  const [groupName, setGroupName] = React.useState('');
  const [groupId, setGroupId] = React.useState('');
  const [groupParent, setGroupParent] = React.useState('');
  const [groupParentId, setGroupParentId] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [, setResponse] = React.useState({});
  const [responseGroups, setResponseGroups] = React.useState({});
  const [searchedItem, setSearchedItem] = React.useState('');
  const [layoutview, setLayoutview] = React.useState(ViewTypesEnum.cards.key);
  const [treeGroup, setTreeGroup] = React.useState(false);
  const [openAddDialog, setopenAddDialog] = React.useState(false);
  const [searchNode, setSearchNode] = React.useState([]);
  const [, setopenUserDialog] = React.useState(false);
  const [Response, SetResponse] = React.useState({});
  const [UserData, SetUserData] = React.useState({});
  const [teamId, setTeamId] = React.useState();
  const [isTreeSearch, setIsTreeSearch] = React.useState(true);
  const [isFirstLoad, setisFirstLoad] = React.useState(true);
  const searchTimer = useRef(null);

  useTitle(t('Shared:SideMenuView.Administration.Team'));

  const GetMyTeam = async (pageValue, rowsPerPageValue, searchItem) => {
    setLoading(true);
    if (getIsAllowedPermission(
      Object.values(TeamPermissions),
      loginResponse,
      TeamPermissions.ViewTeam.permissionsId
    )) {
      const res = await GetTeam(pageValue + 1, rowsPerPageValue, searchItem);
      SetResponse(res);
      if (res && res.totalCount === 0) setisFirstLoad(false);
    }

    setLoading(false);
  };
  const handleTeamsSearch = async (e) => {
    await GetMyTeam(0, 10, e);
    setSearchNode(
      Response.result.filter((el) => el.teamsName.toUpperCase().includes(e.toUpperCase()))
    );
    if (searchedItem === '') setSearchNode('');
  };

  const GetMyGroups = async () => {
    setLoading(true);
    const res = await GetallBusinessGroups();
    setResponseGroups(res);
    setLoading(false);
  };
  useEffect(() => {
    GetMyGroups();
  }, [setResponseGroups]);

  useEffect(() => {
    GetMyTeam(page, rowsPerPage, searchedItem);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchedItem, setResponse]);

  useEffect(() => {
    if (Response) SetUserData(Response);
  }, [Response]);

  const handleSentData = (groupName, groupParent, groupId, editGroup, groupParentId, teamId) => {
    setGroupName(groupName);
    setGroupParent(groupParent);
    setGroupId(groupId);
    setEditGroup(editGroup);
    setGroupParentId(groupParentId);
    setTeamId(teamId);
  };
  const searchHandler = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (isTreeSearch) handleTeamsSearch(searchedItem);
      else {
        setResponse();
        GetMyTeam(page, rowsPerPage, searchedItem);
      }
    }, 700);
  };
  return (
    <>
      <div className='view-wrapper'>
        <Spinner isActive={loading} />
        <div className='header-section'>
          <div className='filter-section px-2'>
            <div className='section'>
              <PermissionsComponent
                permissionsList={Object.values(TeamPermissions)}
                permissionsId={TeamPermissions.AddRecordCard.permissionsId}
              >

                <Button
                  className='btns theme-solid bg-primary'
                  onClick={() => {
                    setopenAddDialog(true);
                    setTreeGroup(false);
                    setGroupParent('');
                    setGroupId('');
                    setGroupName('');
                    setGroupParentId('');
                  }}
                >
                  <span className='mdi mdi-plus' />
                  {t('AddTeamDialog.AddTeam')}
                </Button>
              </PermissionsComponent>
            </div>
            <div className='section px-2'>
              <PermissionsComponent
                permissionsList={Object.values(TeamPermissions)}
                permissionsId={TeamPermissions.ViewTeam.permissionsId}
              >
                <Inputs
                  idRef='usersSearchRef'
                  variant='outlined'
                  onInputChanged={(e) => setSearchedItem(e.target.value)}
                  fieldClasses='inputs theme-solid'
                  value={searchedItem}
                  label={t('SearchTeam')}
                  beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                  onKeyUp={searchHandler}
                />
              </PermissionsComponent>
              <PermissionsComponent
                permissionsList={Object.values(TeamPermissions)}
                permissionsId={TeamPermissions.ViewTeam.permissionsId}
              >
                <ViewTypes
                  activeTypes={[ViewTypesEnum.tableView.key, ViewTypesEnum.cards.key]}
                  onTypeChanged={(type) => {
                    if (type === 'cards') {
                      setIsTreeSearch(true);
                      setLayoutview('grid');
                      setTreeGroup(true);
                      setSearchNode([]);
                      setSearchedItem('');
                    } else {
                      setIsTreeSearch(false);
                      setLayoutview('list');
                      setTreeGroup(false);
                      setSearchNode([]);
                      setSearchedItem('');
                      GetMyTeam(0, 10, '');
                    }
                  }}
                  className='mb-3'
                />
              </PermissionsComponent>
            </div>
          </div>
        </div>
        <PermissionsComponent
          permissionsList={Object.values(TeamPermissions)}
          permissionsId={TeamPermissions.ViewTeam.permissionsId}
        >
          <NoDataFoundComponent />
        </PermissionsComponent>
        <PermissionsComponent
          permissionsList={Object.values(TeamPermissions)}
          permissionsId={TeamPermissions.ViewTeam.permissionsId}
        >
          {layoutview === 'list' ? (
            <ListTeam
              handleSentData={handleSentData}
              setopenAddDialog={() => setopenAddDialog(true)}
              page={page}
              isFirstLoad={isFirstLoad}
              setPage={(x) => setPage(x)}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={(x) => setRowsPerPage(x)}
              response={UserData}
              searchedItem={searchedItem}
              reopen={() => setopenUserDialog(true)}
              reloadData={async (pageValue, rowsPerPageValue) => {
                await GetMyTeam(pageValue, rowsPerPageValue, searchedItem);
              }}
            />
          ) : (
            <div className='bussines-groups-wrapper'>
              <TreeTeamView
                searchNode={searchNode}
                page={page}
                setPage={(x) => setPage(x)}
                rowsPerPage={rowsPerPage}
                searchedItem={searchedItem}
                setRowsPerPage={(x) => setRowsPerPage(x)}
                handleSentData={handleSentData}
                setopenAddDialog={() => setopenAddDialog(true)}
                close={() => setopenAddDialog(false)}
                response={responseGroups}
                setTreeGroup={(x) => setTreeGroup(x)}
                reloadData={() => GetMyGroups()}
                isEdit={editGroup}
                setIsEdit={(x) => setEditGroup(x)}
              />
            </div>
          )}
        </PermissionsComponent>
        <AddTeamDialog
          teamId={teamId}
          setGroupParentId={(x) => setGroupParentId(x)}
          groupParentId={groupParentId}
          groupId={groupId}
          response={UserData}
          setGroupName={(x) => setGroupName(x)}
          setGroupParent={(x) => setGroupParent(x)}
          groupName={groupName}
          groupParent={groupParent}
          isEdit={editGroup}
          setIsEdit={(x) => setEditGroup(x)}
          isTree={treeGroup}
          setTreeGroup={(x) => setTreeGroup(x)}
          open={openAddDialog}
          setopenAddDialog={() => setopenAddDialog(true)}
          close={() => setopenAddDialog(false)}
          reloadData={() => {
            GetMyTeam(page, rowsPerPage, searchedItem);
          }}
          reloadDatalist={() => GetMyGroups()}
        />
      </div>
    </>
  );
};
export default TeamView;
