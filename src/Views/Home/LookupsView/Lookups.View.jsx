import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { lookupTypesPost, lookupTypesPut, lookupTypesGet } from '../../../Services/LookupsServices';
import {
  bottomBoxComponentUpdate, showError, showSuccess, returnPropsByPermissions
} from '../../../Helper';
import { LookupsTypesComponent, LookupsTypesCreateDialog } from '..';
import { useTitle } from '../../../Hooks';
import { PaginationComponent } from '../../../Components/PaginationComponent/PaginationComponent';
import { LookupsPermissions } from '../../../Permissions';

const translationPath = 'LookupItems.';

const Lookups = ({ loginResponse }) => {
  const { t } = useTranslation('LookupsView');
  const [selectedUpdatedType, setSelectedUpdatedType] = useState(() => ({}));
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [response, setResponse] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const initialSearchItem = useRef(localStorage.getItem('initialLookupSearch')||'')
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: initialSearchItem.current,
  });
  const [sortBy, setSortBy] = useState(null);
  const [isEdit, setIsEdit] = React.useState(false);
  useTitle(t('Shared:SideMenuView.Lookups.Lookup'));
  const effectGetLookupsType = useCallback(async (sortByColumnAndOrderBy) => {
    setLoading(true);
    const requestObj = !sortByColumnAndOrderBy ?
     { pageIndex: filter.pageIndex + 1, pageSize: filter.pageSize, searchedItem: filter.search } :
     {
      pageIndex: 1,
      pageSize: filter.pageSize,
      searchedItem: filter.search,
      filterBy: sortByColumnAndOrderBy.filterBy,
      orderBy: sortByColumnAndOrderBy.orderBy
    };

    if (returnPropsByPermissions(LookupsPermissions.ViewAllLookup.permissionsId)) {
      const resp = await lookupTypesGet({ ...requestObj });
      if (resp)
        setResponse(resp);
      else
        setResponse({});
    } else
      setResponse({});
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    effectGetLookupsType();
  }, [effectGetLookupsType, filter]);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };

  const onSearchChanged = (newValue) => {
    setFilter((item) => ({ ...item, pageIndex: 0, search: newValue }));
    localStorage.setItem('initialLookupSearch', newValue);
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({
      ...item,
      pageIndex: 0,
      pageSize,
      search: '',
    }));
  };

  useEffect(() => {
    if (returnPropsByPermissions(LookupsPermissions.ViewAllLookup.permissionsId)) {
      bottomBoxComponentUpdate(
        <PaginationComponent
          pageIndex={filter.pageIndex}
          pageSize={filter.pageSize}
          totalCount={(response && response.totalCount) || 0}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
        />
      );
    }
  });
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );

  useEffect(() => {
    if (openCreateDialog)
      setIsEdit(true);
    else {
      setIsEdit(false);
      setSelectedUpdatedType(null);
    }
    setIsEdit(false);
  }, [openCreateDialog]);

  useEffect(() => {
    if (sortBy !== null)
      effectGetLookupsType(sortBy);
  }, [sortBy]);

  return (
    <div className='view-wrapper'>
      <div className='d-flex-column'>
        <div>
          <Grid container>
            <LookupsTypesComponent
              setIsEdit={setIsEdit}
              setResponse={setResponse}
              setLoading={setLoading}
              onSearchChanged={onSearchChanged}
              page={filter.pageIndex}
              rowsPerPage={filter.pageSize}
              response={response}
              loading={loading}
              filtersearch={filter.search}
              setOpenEditDialog={setOpenCreateDialog}
              setSelectedUpdatedType={setSelectedUpdatedType}
              loginResponse={loginResponse}
              setSortBy={setSortBy}
            />
          </Grid>
          <LookupsTypesCreateDialog
            isEdit={isEdit}
            open={openCreateDialog}
            setOpen={setOpenCreateDialog}
            item={selectedUpdatedType}
            onSave={async (e) => {
              await lookupTypesPut(e.lookupTypeId, e);
              effectGetLookupsType(filter.pageIndex, filter.pageSize, filter.search);
              showSuccess(t(`${translationPath}NotificationLookupadd`));
            }}
            onCreate={async (e) => {
              const result = await lookupTypesPost(e);
              if (!(result && result.status && result.status !== 200)) {
                effectGetLookupsType(filter.pageIndex, filter.pageSize, filter.search);
                showSuccess(t(`${translationPath}NotificationLookupadd`));
              } else showError(t(`${translationPath}NotificationLookupaddErorr`));
            }}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const {
    login: { loginResponse },
  } = state;
  return {
    loginResponse,
  };
};
const view = connect(mapStateToProps)(Lookups);

export { view as Lookups };
Lookups.propTypes = {
  loginResponse: PropTypes.shape(undefined),
};
Lookups.defaultProps = {
  loginResponse: null,
};
