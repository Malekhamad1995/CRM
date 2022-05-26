/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Inputs, Spinner, Tables } from '../../../../Components';
import { bottomBoxComponentUpdate, GetParams, showSuccess } from '../../../../Helper';
import { TableActions } from '../../../../Enums';
import { LookupsDeleteDialog, LookupsItemCreateDialog } from '../LookupsUtilities';
import {
  lookupItemsDelete,
  lookupItemsPost,
  lookupItemsPut,
  GetlookupTypeItems,
} from '../../../../Services';
import './LookupsItemView.scss';
import { PaginationComponent } from '../../../../Components/PaginationComponent/PaginationComponent';

const LookupsItemView = (props) => {
  const { t } = useTranslation('LookupsView');
  const [hasParent, setHasParent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [openCreateItemDialog, setOpenCreateItemDialog] = React.useState(false);
  const [selectedLookupItem, setSelectedLookupItem] = React.useState();
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [response, setResponse] = React.useState([]);
  const [typeName, setTypeName] = React.useState(null);
  const [typeId, setTypeId] = React.useState(0);
  const [typeEditable, setTypeEditable] = React.useState(false);
  const [searchedItem, setSearchedItem] = React.useState('');
  const [isEdit, setIsEdit] = React.useState(false);
  let time = setTimeout(() => {}, 300);
  const [filter, setFilter] = React.useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
    lookupTypeId: +GetParams('id'),
  });

  const [sortBy, setSortBy] = useState(null);
  const reducer = (state, action) => {
    if (action.reset) {
      setHasParent(false);
      return { lookupTypeId: state.lookupTypeId };
    }
    return { ...state, [action.id]: action.value };
  };
  const [state, setState] = React.useReducer(reducer, props.item ? props.item : {});

  const loadItem = async () => {
    setLoading(true);
    const resp = await GetlookupTypeItems(filter);
    if (!(resp && resp.status && resp.status !== 200)) setResponse(resp);
    else setResponse([]);
    setLoading(false);
  };

  useEffect(() => {
    setTypeName(GetParams('name'));
    setTypeId(GetParams('id'));
    setTypeEditable(GetParams('isEdit') === 'true');
    loadItem();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const onSearchChanged = (newValue) => {
    setFilter((item) => ({ ...item, pageIndex: 0, search: newValue }));
  };

  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={response.totalCount}
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

  useEffect(() => {
    if (sortBy)
    setFilter((item) => ({ ...item,filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);
  return (
    <>
      <div className='lookups-items-view view-wrapper'>
        <Spinner isActive={loading} />
        <div className='header-section'>
          <div className='filter-section px-2'>
            <div className='section'>
              <Button
                className='btns theme-solid bg-primary mx-2'
                disabled={!typeEditable}
                onClick={() => {
                  setIsEdit(false);
                  setOpenCreateItemDialog(true);
                  setSelectedLookupItem('');
                }}
              >
                <span className='mdi mdi-plus' />
                {t('add-item')}
              </Button>
            </div>
            <div className='section px-2'>
              <Inputs
                idRef='searchLookupsRef'
                parentTranslationPath='LookupsView'
                beforeIconClasses='mdi mdi-magnify'
                value={searchedItem}
                onInputChanged={(e) => setSearchedItem(e.target.value)}
                onKeyUp={(event) => {
                  const { value } = event.target;
                  time = setTimeout(() => {
                   onSearchChanged(value);
                  }, 700);
                }}
                onKeyDown={() => {
                  clearTimeout(time);
                }}
                label={t('Search')}
                inputPlaceholder='search-lookups'
              />
            </div>
          </div>
        </div>
        <div className='px-3'>
          <Tables
            headerData={[
              {
                id: 1,
                isSortable: true,
                label: 'LookupsView:LookupItems.LookupName',
                input: 'lookupItemName',
                isDate: false,
              },
              {
                id: 2,
                isSortable: true,
                label: 'LookupsView:LookupItems.LookupParentName',
                input: 'parentLookupItem',
                component:(item)=>(
                  <span>{item.parentLookupItemName}</span>
                ),
                isDate: false,
              },
              {
                id: 3,
                label: 'LookupsView:LookupItems.LookupParentType',
                input: 'parentLookupTypeName',
                isDate: false,
              },
            ]}
            data={response && response.result ? response.result : []}
            activePage={filter.pageIndex}
            totalItems={response && response.totalCount ? response.totalCount : 0}
            itemsPerPage={filter.pageSize}
            actionsOptions={{
              actions: [
                {
                  enum: TableActions.edit.key,
                  isDisabled: !true,
                  externalComponent: null,
                },
                {
                  enum: TableActions.delete.key,
                  isDisabled: !true,
                  externalComponent: null,
                },
              ],
              classes: '',
              isDisabled: GetParams('isEdit') === 'false',
              isReverceDisabled: true,
              actionsIsDisabledInput: 'isEditable',
              onActionClicked: (key, item) => {
                if (key === TableActions.edit.key) {
                  setIsEdit(true);
                  setSelectedLookupItem(item);
                  setOpenCreateItemDialog(true);
                }
                if (key === TableActions.delete.key) {
                  setSelectedLookupItem(item);
                  setOpenDeleteDialog(true);
                }
              },
            }}
            setSortBy={setSortBy}
          />
        </div>
      </div>
      {selectedLookupItem && (
        <LookupsDeleteDialog
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          name={selectedLookupItem.lookupItemName}
          row={selectedLookupItem}
          onCancel={() => props.setState({ reset: true })}
          onDelete={async (e) => {
            setLoading(true);
            await lookupItemsDelete(e.lookupItemId);
            showSuccess(t('Delet'));
            await loadItem(filter.pageIndex + 1, filter.pageSize, typeName, searchedItem);
            setState({ reset: true });
            setLoading(false);
          }}
        />
      )}
      <LookupsItemCreateDialog
        loading={loading}
        isEdit={isEdit}
        hasParent={hasParent}
        setHasParent={setHasParent}
        setState={setState}
        state={state}
        open={openCreateItemDialog}
        setOpen={setOpenCreateItemDialog}
        item={selectedLookupItem}
        selectedType={typeName}
        selectedTypeId={typeId}
        onSave={async (e) => {
          setLoading(true);
          await lookupItemsPut(e.lookupItemId, e);
          await loadItem(filter.pageIndex + 1, filter.pageSize, typeName, searchedItem);
          setLoading(false);
        }}
        onCreate={async (e) => {
          setLoading(true);
          await lookupItemsPost(e);
          await loadItem(filter.pageIndex + 1, filter.pageSize, typeName, searchedItem);
          setLoading(false);
        }}
      />
    </>
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
const view = connect(mapStateToProps)(LookupsItemView);

export { view as LookupsItemView };
