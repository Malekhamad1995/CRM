/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Tables, NoSearchResultComponent, PaginationComponent } from '../../../../../../Components';
import { TableActions } from '../../../../../../Enums';
import { bottomBoxComponentUpdate } from '../../../../../../Helper';
import DeleteDialog from '../BusinessGroupsDialogs/DeleteDialog';
import { getIsAllowedPermission } from '../../../../../../Helper/Permissions.Helper';
import { BusinessGroupsPermissions } from '../../../../../../Permissions';

const ListViewGroups = (props) => {
  const loginResponse = useSelector((state) => state.login.loginResponse);
  const [deletedName, setDeletedName] = React.useState('');
  const [deletedId, setDeletedId] = React.useState(0);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const defaultFilter = {
    pageSize: props.rowsPerPage,
    pageIndex: props.page,
  };
  const [filter, setFilter] = useState(defaultFilter);

  const handlePageChange = async (e, newPage) => {
    props.setPage(newPage);
    props.reloadData(newPage + 1, props.rowsPerPage);
  };
  const handlePageRowChange = async (e) => {
    props.setRowsPerPage(parseInt(e.target.value, 10));
    props.setPage(0);
    props.reloadData(1, parseInt(e.target.value, 10));
  };

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
    props.setPage(filter.pageIndex);
    props.setRowsPerPage(filter.pageSize);
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
    props.setPage(filter.pageIndex);
    props.setRowsPerPage(filter.pageSize);
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
    <div>
      {props.response && props.response.totalCount === 0 && !props.isFirstLoad ? (
        <NoSearchResultComponent />
      ) : (
        props.response && (
          <div className='mx-3'>
            <Tables
              headerData={[
                {
                  id: 1,
                  isSortable: true,
                  label: 'BusinessGroupsView:ListViewGroups.GroupName',
                  input: 'businessGroupsName',
                  isDate: false,
                },
                {
                  id: 2,
                  isSortable: true,
                  label: 'TeamView:EditTeamDialog.BusinessGroup',
                  input: 'businessGroupsParentName',
                  isDate: false,
                },
              ]}
              data={
                props.response && props.response.result && Array.isArray(props.response.result) ?
                  props.response.result :
                  []
              }
              activePage={props.page}
              totalItems={
                props.response && props.response.totalCount ? props.response.totalCount : 0
              }
              activePageChanged={handlePageChange}
              itemsPerPage={props.rowsPerPage}
              itemsPerPageChanged={handlePageRowChange}
              actionsOptions={{
                actions: [
                  {
                    enum: TableActions.edit.key,
                    isDisabled: !getIsAllowedPermission(
                      Object.values(BusinessGroupsPermissions),
                      loginResponse,
                      BusinessGroupsPermissions.EditRecordCard.permissionsId
                    ),
                    externalComponent: null,
                  },
                  {
                    enum: TableActions.delete.key,
                    isDisabled: !getIsAllowedPermission(
                      Object.values(BusinessGroupsPermissions),
                      loginResponse,
                      BusinessGroupsPermissions.DeleteRecordCard.permissionsId
                    ),
                    externalComponent: null,
                  },
                ],
                classes: '',
                isDisabled: false,
                onActionClicked: (key, item) => {
                  if (key === 'delete') {
                    setDeletedId(item.businessGroupsId);
                    setDeletedName(item.businessGroupsName);
                    setDeleteDialog(true);
                  } else if (key === 'edit') {
                    props.handleSentData(
                      item.businessGroupsName,
                      item.businessGroupsParentName,
                      item.businessGroupsId,
                      true,
                      item.businessGroupsParentId
                    );
                    props.setopenAddDialog();
                  }
                },
              }}
            />
            <DeleteDialog
              open={deleteDialog}
              close={() => setDeleteDialog(false)}
              deletedId={deletedId}
              name={deletedName}
              reloadData={() =>
                props.reloadData(props.page + 1, props.rowsPerPage, props.searchedItem)}
            />
          </div>
        )
      )}
    </div>
  );
};

export default ListViewGroups;
