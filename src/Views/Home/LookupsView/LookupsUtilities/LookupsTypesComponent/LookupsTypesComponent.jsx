import React from 'react';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  Inputs, Spinner, Tables, PermissionsComponent
} from '../../../../../Components';
import { GlobalHistory, returnPropsByPermissions } from '../../../../../Helper';
import { TableActions } from '../../../../../Enums';
import { LookupsDeleteDialog } from '../../..';
import { lookupTypesGet, lookupTypesDelete } from '../../../../../Services';
import './LookupsTypesComponent.scss';
import { LookupsPermissions } from '../../../../../Permissions';

export const LookupsTypesComponent = (props) => {
  const { t } = useTranslation('LookupsView');
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedLookup, setSelectedLookup] = React.useState();
  const [searchedItem, setSearchedItem] = React.useState('');
  const [currentActions, setCurrentActions] = React.useState(() => []);
  let time = setTimeout(() => { }, 300);

  const effectGetLookupsType = async (pageIndex, pageSize, searchedItem) => {
    props.setLoading(true);
    const resp = await lookupTypesGet({ pageIndex, pageSize, searchedItem });
    props.setResponse(resp);
    props.setLoading(false);
  };

  const getActionTableWithPermissions = (item) => {
    // eslint-disable-next-line prefer-const
    let list = [];
    if (returnPropsByPermissions(LookupsPermissions.ViewLookupItem.permissionsId)) {
      list.push({
        enum: TableActions.view.key,
        isDisabled: !returnPropsByPermissions(LookupsPermissions.ViewLookupItem.permissionsId),
        externalComponent: null,
      });
    }
    if ((returnPropsByPermissions(LookupsPermissions.UpdateLookupType.permissionsId))) {
      list.push(
        {
          enum: TableActions.edit.key,
          isDisabled: !item.isEditable || !true,
          externalComponent: null,
        }
      );
    }

    if (returnPropsByPermissions(LookupsPermissions.Delete.permissionsId)) {
      list.push({
        enum: TableActions.delete.key,
        isDisabled: !item.isEditable || !true,
        externalComponent: null,
      });
    }
    return list;
  };

  const focusedRowChanged = (activeRow) => {
    const item = props.response.result[activeRow];
    if (!item) return;
    setCurrentActions(getActionTableWithPermissions(item));
  };

  const handleDelet = async (e) => {
    props.setLoading(true);
    await lookupTypesDelete(e.lookupTypeId);
    await effectGetLookupsType(props.page, props.rowsPerPage, props.filtersearch);
    props.setLoading(false);
  };

  React.useEffect(()=>{
   setSearchedItem(props.filtersearch)
  },[])

  return (
    <div className='lookups-types-component view-wrapper'>
      <Spinner isActive={props.loading} />
      <div className='header-section'>
        <div className='filter-section px-2'>
          <div className='section'>
            <PermissionsComponent
              permissionsList={Object.values(LookupsPermissions)}
              permissionsId={LookupsPermissions.AddNew.permissionsId}
            >
              <Button
                className='btns theme-solid bg-primary mx-2'
                onClick={() => {
                  props.setIsEdit(false);
                  props.setOpenEditDialog(true);
                }}
              >
                <span className='mdi mdi-plus' />
                {t('AddType')}
              </Button>
            </PermissionsComponent>
          </div>
          <div className='section px-2'>
            <PermissionsComponent
              permissionsList={Object.values(LookupsPermissions)}
              permissionsId={LookupsPermissions.ViewAllLookup.permissionsId}
            >
              <Inputs
                idRef='searchLookupsTypsRef'
                parentTranslationPath='LookupsView'
                beforeIconClasses='mdi mdi-magnify'
                value={searchedItem}
                onInputChanged={(e) => setSearchedItem(e.target.value)}
                onKeyUp={(event) => {
                  const { value } = event.target;
                  time = setTimeout(() => {
                    props.onSearchChanged(value);
                  }, 700);
                }}
                onKeyDown={() => {
                  clearTimeout(time);
                }}
                label={t('Search')}
                inputPlaceholder='search-lookups-types'
              />
            </PermissionsComponent>
          </div>
        </div>
      </div>
      <div className='px-3'>
        <PermissionsComponent
          permissionsList={Object.values(LookupsPermissions)}
          permissionsId={LookupsPermissions.ViewAllLookup.permissionsId}
        >
          <Tables
            headerData={[
              {
                id: 1,
                isSortable: true,
                label: 'LookupName',
                input: 'lookupTypeName',
                isDate: false,
              },
              {
                id: 2,
                isSortable: true,
                label: 'Description',
                input: 'lookupTypeDescription',
                isDate: false,
              },
            ]}
            setSortBy={props.setSortBy}
            data={props.response && props.response.result ? props.response.result : []}
            activePage={props.page}
            totalItems={props.response && props.response.totalCount ? props.response.totalCount : 0}
            focusedRowChanged={focusedRowChanged}
            itemsPerPage={props.rowsPerPage}
            actionsOptions={{
              actions: currentActions,
              classes: '',
              onActionClicked: (key, item) => {
                if (key === TableActions.view.key) {
                  GlobalHistory.push(
                    `/home/lookups/lookup-item?id=${item.lookupTypeId}&name=${item.lookupTypeName}&isEdit=${item.isEditable}`
                  );
                }
                if (key === TableActions.edit.key) {
                  props.setIsEdit(true);
                  props.setOpenEditDialog(true);
                  props.setSelectedUpdatedType(item);
                }
                if (key === TableActions.delete.key) {
                  setOpenDeleteDialog(true);
                  setSelectedLookup(item);
                }
              },
            }}
          />
        </PermissionsComponent>
        {selectedLookup && (
          <LookupsDeleteDialog
            onCancel={() => { }}
            open={openDeleteDialog}
            setOpen={setOpenDeleteDialog}
            name={selectedLookup.lookupTypeName}
            row={selectedLookup}
            onDelete={(e) => {
              handleDelet(e);
            }}
          />
        )}
      </div>
    </div>
  );
};
