/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import DeleteTeamDialog from '../TeamDialog/DeleteTeamDialog';
import UserDialogTeam from '../TeamDialog/UserDialogTeam';
import {
  Spinner,
  Tables,
  NoDataFoundComponent,
  NoSearchResultComponent,
  PaginationComponent,
} from '../../../../../../Components';
import { Getuserinteam } from '../../../../../../Services/Team';
import { TableActions } from '../../../../../../Enums';
import { bottomBoxComponentUpdate } from '../../../../../../Helper';
import { TeamPermissions } from '../../../../../../Permissions';
import { getIsAllowedPermission } from '../../../../../../Helper/Permissions.Helper';

const ListTeamView = (props) => {
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const [deletedName, setDeletedName] = React.useState('');
  const [deletedId, setDeletedId] = React.useState(0);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [openUserDialog, setopenUserDialog] = React.useState(false);
  const [UserinTeamname, setUserinTeamname] = React.useState();
  const [UserinTeamID, setUserinTeamID] = React.useState();
  const [loading, setloading] = React.useState(false);
  const defaultFilter = {
    pageSize: props.rowsPerPage,
    pageIndex: props.page,
  };
  const [filter, setFilter] = useState(defaultFilter);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handlePageChange = async (e, newPage) => {
    props.setPage(newPage);
    props.reloadData(newPage, props.rowsPerPage);
  };
  const handlePageRowChange = async (e) => {
    props.setRowsPerPage(parseInt(e.target.value, 10));
    props.setPage(0);
    props.reloadData(props.page, parseInt(e.target.value, 10));
  };
  const [userinteam, SetUserinteam] = React.useState({});

  const GetAllUsersInTeam = async (teamsId, pageIndex, pageSize) => {
    setloading(true);
    const DataUser = await Getuserinteam(teamsId, pageIndex, pageSize);
    SetUserinteam(DataUser.data);
    setloading(false);
  };

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
    setPage(filter.pageIndex);
    setRowsPerPage(filter.pageSize);
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
    setPage(filter.pageIndex);
    setRowsPerPage(filter.pageSize);
  };

  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={props.response.totalCount}
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

  return (
    <>
      <Spinner isActive={loading} />
      <Grid container justify='center' alignContent='center'>
        <NoDataFoundComponent />
        {props.response && props.response.totalCount === 0 && !props.isFirstLoad ? (
          <NoSearchResultComponent />
        ) : (
          <Grid item xs={12} className='mx-3'>
            <Tables
              headerData={[
                {
                  id: 1,
                  isSortable: true,
                  label: 'TeamView:Team',
                  input: 'teamsName',
                  isDate: false,
                },
                {
                  id: 2,
                  isSortable: true,
                  label: 'TeamView:EditTeamDialog.BusinessGroup',
                  input: 'businessGroups.businessGroupsName',
                  isDate: false,
                },
              ]}
              data={
                props.response && props.response.result && Array.isArray(props.response.result) ?
                  props.response.result :
                  []
              }
              activePage={page}
              totalItems={
                props.response && props.response.totalCount ? props.response.totalCount : 0
              }
              activePageChanged={handlePageChange}
              itemsPerPage={rowsPerPage}
              itemsPerPageChanged={handlePageRowChange}
              actionsOptions={{
                actions: [
                  {
                    enum: TableActions.account.key,
                    isDiabled: false,
                    externalComponent: null,
                  },
                  {
                    enum: TableActions.edit.key,
                    isDisabled: !getIsAllowedPermission(
                      Object.values(TeamPermissions),
                      loginResponse,
                      TeamPermissions.EditRecordCard.permissionsId
                    ),
                    externalComponent: null,
                  },
                  {
                    enum: TableActions.delete.key,
                    isDisabled: !getIsAllowedPermission(
                      Object.values(TeamPermissions),
                      loginResponse,
                      TeamPermissions.DeleteRecordCard.permissionsId
                    ),
                    externalComponent: null,
                  },
                ],
                classes: '',
                isDisabled: false,
                onActionClicked: (key, item) => {
                  if (key === 'delete') {
                    setDeletedId(item.teamsId);
                    setDeletedName(item.teamsName);
                    setDeleteDialog(true);
                  } else if (key === 'edit') {
                    props.handleSentData(
                      item.teamsName,
                      item.businessGroups.businessGroupsName,
                      item.businessGroupsId,
                      true,
                      item.businessGroupsId,
                      item.teamsId
                    );
                    props.setopenAddDialog();
                  } else if (key === 'account') {
                    setUserinTeamname(item.teamsName);
                    setUserinTeamID(item.teamsId);
                    props.reopen();
                    setopenUserDialog(true);
                    GetAllUsersInTeam(item.teamsId, 1, 100);
                  }
                },
              }}
            />
          </Grid>
        )}
      </Grid>
      <DeleteTeamDialog
        open={deleteDialog}
        close={() => setDeleteDialog(false)}
        deletedId={deletedId}
        name={deletedName}
        reloadData={() => props.reloadData(props.page, props.rowsPerPage, props.searchedItem)}
      />
      <UserDialogTeam
        open={openUserDialog}
        close={() => setopenUserDialog(false)}
        Teamname={UserinTeamname}
        UserTeam={userinteam}
        teamId={UserinTeamID}
        ClearData={() => setUserinTeamID({})}
        reloadData={() => GetAllUsersInTeam(UserinTeamID, 1, 100)}
      />
    </>
  );
};
export default ListTeamView;
