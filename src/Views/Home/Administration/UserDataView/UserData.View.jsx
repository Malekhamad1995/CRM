import React, { useEffect, useRef } from 'react';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  Tables,
  NoDataFoundComponent,
  NoSearchResultComponent,
  Inputs,
} from '../../../../Components';
import { TableActions } from '../../../../Enums';
import { GlobalHistory } from '../../../../Helper';
import { GetViews } from '../../../../Services/UsersDataViewingServices';
import { DeleteDialog } from './UserDataViewUtilities';
import { useTitle } from '../../../../Hooks';

const UserDataView = () => {
  const { t } = useTranslation(['UserDataView', 'Shared']);
  const [, setLoading] = React.useState(false);
  const [viewsResponse, setViewsResponse] = React.useState({});
  const [searchedItem, setSearchedItem] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [viewName, setViewName] = React.useState('');
  const [deletedId, setDeletedId] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [isFirstLoad, setisFirstLoad] = React.useState(true);
  const searchTimer = useRef(null);

  useTitle(t('Shared:SideMenuView.Administration.UsersDataViewing'));

  // eslint-disable-next-line no-shadow
  const GetMyViews = async (pageIndex, PageSize, searchedItem) => {
    setLoading(true);
    const res = await GetViews(pageIndex, PageSize, searchedItem);
    setViewsResponse(res);
    if (res && res.totalCount === 0) setisFirstLoad(false);
    setLoading(false);
  };
  useEffect(() => {
    GetMyViews(page + 1, rowsPerPage, '');
    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
    await GetMyViews(newPage + 1, rowsPerPage, searchedItem);
  };

  const handlePageRowChange = async (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
    await GetMyViews(1, parseInt(e.target.value, 10), searchedItem);
  };

  const handleDeleteDialog = (row) => {
    setOpenDeleteDialog(true);
    setViewName(row.viewName);
    setDeletedId(row.viewId);
  };
  const searchHandler = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setViewsResponse();
      GetMyViews(page + 1, rowsPerPage, searchedItem);
    }, 700);
  };
  return (
    <>
      <div className='view-wrapper'>
        <div className='header-section'>
          <div className='filter-section px-2'>
            <div className='section'>
              <Button
                className='btns theme-solid bg-primary'
                onClick={() => GlobalHistory.push('Add')}
              >
                {t('AddView')}
              </Button>
            </div>
            <div className='section px-2'>
              <Inputs
                idRef='usersSearchRef'
                variant='outlined'
                onInputChanged={(e) => setSearchedItem(e.target.value)}
                fieldClasses='inputs theme-solid'
                value={searchedItem}
                label={t('Search')}
                beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                onKeyUp={searchHandler}
              />
            </div>
          </div>
        </div>
      </div>
      <NoDataFoundComponent />
      {viewsResponse && viewsResponse.totalCount === 0 && !isFirstLoad ? (
        <NoSearchResultComponent />
      ) : (
        viewsResponse && (
          <div className='mx-3'>
            <Tables
              headerData={[
                {
                  id: 1,
                  isSortable: true,
                  label: 'ViewName',
                  input: 'viewName',
                  isDate: false,
                },
              ]}
              data={
                viewsResponse && viewsResponse.result && Array.isArray(viewsResponse.result) ?
                  viewsResponse.result :
                  []
              }
              activePage={page}
              totalItems={viewsResponse && viewsResponse.totalCount ? viewsResponse.totalCount : 0}
              activePageChanged={handlePageChange}
              itemsPerPage={rowsPerPage}
              itemsPerPageChanged={handlePageRowChange}
              actionsOptions={{
                actions: [
                  {
                    enum: TableActions.view.key,
                    isDiabled: false,
                    externalComponent: null,
                  },
                  {
                    enum: TableActions.edit.key,
                    isDiabled: false,
                    externalComponent: null,
                  },
                  {
                    enum: TableActions.delete.key,
                    isDiabled: false,
                    externalComponent: null,
                  },
                ],
                classes: '',
                isDisabled: false,
                onActionClicked: (key, item) => {
                  if (key === 'delete') handleDeleteDialog(item);
                  else if (key === 'edit') GlobalHistory.push(`Edit?id=${item.viewId}`);
                  else if (key === 'view') GlobalHistory.push(`View?id=${item.viewId}`);
                },
              }}
            />
          </div>
        )
      )}

      <DeleteDialog
        deletedId={deletedId}
        name={viewName}
        open={openDeleteDialog}
        close={() => setOpenDeleteDialog(false)}
        reloadData={() => GetMyViews(page + 1, rowsPerPage, searchedItem)}
      />
    </>
  );
};

export { UserDataView };
