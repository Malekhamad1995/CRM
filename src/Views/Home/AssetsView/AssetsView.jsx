import React, {
  useState, useRef, useEffect, useCallback
} from 'react';
import { useDispatch } from 'react-redux';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  DialogComponent, Inputs, PaginationComponent, Spinner, Tables, PermissionsComponent
} from '../../../Components';
import { useTitle } from '../../../Hooks';
import { AssetsTypeEnum, TableActions } from '../../../Enums';
import { DeleteAsset, GetAllAssets } from '../../../Services';
import {
  bottomBoxComponentUpdate, GlobalHistory, showError, showSuccess, returnPropsByPermissions2, returnPropsByPermissions
} from '../../../Helper';
import { AssetsPermissions } from '../../../Permissions/PropertyManagement/Assets.Permissions';
import { ActiveItemActions } from '../../../store/ActiveItem/ActiveItemActions';

const parentTranslationPath = 'AssetsView';
const translationPath = '';

export const AssetsView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [searchedItem, setSearchedItem] = useState('');
  const [activeItem, setActiveItem] = useState('');
  const [openDialogDlete, setOpenDialogDlete] = useState(false);
  const [sortBy, setSortBy] = useState(null);

  const [assets, setAssets] = useState({
    result: [],
    totalCount: 0,
  });
  const searchTimer = useRef(null);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
    filterBy: null,
    orderBy: null
  });

  useTitle(t(`${translationPath}assets`));
  const getAllAssets = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllAssets({ ...filter });
    if (!(res && res.status && res.status !== 200)) {
      setAssets({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setAssets({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);

  useEffect(() => {
    getAllAssets();
  }, [getAllAssets, filter]);

  useEffect(() => {
    if (sortBy)
    setFilter((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);

  const searchHandler = (event) => {
    const { value } = event.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({ ...item, pageIndex: 0, search: value }));
    }, 700);
  };
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const tableActionClicked = useCallback((actionEnum, item) => {
    dispatch(ActiveItemActions.activeItemRequest(item));
    if (actionEnum === TableActions.editText.key)
      GlobalHistory.push(`/home/assets/edit?id=${item.assetId}`);
    else if (actionEnum === TableActions.deleteText.key) {
      setActiveItem(item);
      setOpenDialogDlete(true);
    }
  }, []);

  const reloadData = useCallback(() => {
    getAllAssets();
  }, [getAllAssets]);

  const deleteAssets = useCallback(async () => {
    setIsLoading(true);
    const res = await DeleteAsset(activeItem.assetId);
    if (!(res && res.status && res.status !== 200))
      showSuccess(t(`${translationPath}asset-deleted-successfully`));
    else showError(t(`${translationPath}asset-deleted-failed`));
    setOpenDialogDlete(false);
    setIsLoading(false);
    reloadData();
  }, [activeItem, reloadData, t]);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={assets.totalCount}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
    );
  });
  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  const getTableActionsByPermissions = () => {
    const list = [];
    if (returnPropsByPermissions2(AssetsPermissions.EditAssets.permissionsId, AssetsPermissions.DeleteAssets.permissionsId)) {
      list.push(
        {
          enum: TableActions.editText.key,
          isDisabled: false,
          externalComponent: null,
        },
        {
          enum: TableActions.deleteText.key,
          isDisabled: false,
          externalComponent: null,
        },
      );
      return list;
    }
    if (returnPropsByPermissions(AssetsPermissions.EditAssets.permissionsId)) {
      list.push(
        {
          enum: TableActions.editText.key,
          isDisabled: false,
          externalComponent: null,
        },
      );
      return list;
    }
    if (returnPropsByPermissions(AssetsPermissions.DeleteAssets.permissionsId)) {
      list.push(
        {
          enum: TableActions.deleteText.key,
          isDisabled: false,
          externalComponent: null,
        },
      );
      return list;
    }
    return list;
  };

  return (
    <div className='view-wrapper activities-view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section px-2'>
            <div className='section'>
              <PermissionsComponent
                permissionsList={Object.values(AssetsPermissions)}
                permissionsId={AssetsPermissions.CreateAssets.permissionsId}
              >
                <ButtonBase
                  className='btns theme-solid px-3'
                  onClick={() => {
                    GlobalHistory.push('/home/assets/add');
                  }}
                >
                  <span className='mdi mdi-plus' />
                  {t(`${translationPath}add-new`)}
                </ButtonBase>
              </PermissionsComponent>
            </div>
            <div className='section px-2'>
              <PermissionsComponent
                permissionsList={Object.values(AssetsPermissions)}
                permissionsId={AssetsPermissions.ViewandsearchinPropertyManagementAssets.permissionsId}
              >
                <Inputs
                  value={searchedItem}
                  onKeyUp={searchHandler}
                  idRef='activitiesSearchRef'
                  label={t(`${translationPath}search-assets`)}
                  onInputChanged={(e) => setSearchedItem(e.target.value)}
                  inputPlaceholder={t(`${translationPath}search-assets-description`)}
                  beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                />
              </PermissionsComponent>
            </div>
          </div>
        </div>
        <PermissionsComponent
          permissionsList={Object.values(AssetsPermissions)}
          permissionsId={AssetsPermissions.ViewandsearchinPropertyManagementAssets.permissionsId}
        >
          <div className='w-100 px-3'>
            <Tables
              data={assets.result || []}
              headerData={[
                  {
                    id: 1,
                    isSortable: true,
                    label: t(`${translationPath}portfolio`),
                    input: 'portfolioName',
                    // component: (item) => (
                    //   <span className='c-primary'>{item.portfolioName || 'N/A'}</span>
                    // ),
                  },
                  {
                    id: 2,
                    isSortable: true,
                    label: t(`${translationPath}property`),
                    input: 'propertyName',
                    component: (item) => (
                      <span>{(item.propertyName) || 'N/A'}</span>
                    ),
                  },
                  {
                    id: 3,
                    label: t(`${translationPath}unit`),
                    isSortable: true,
                    input: 'locationUnitName',
                    component: (item) => (
                      <span>{(item.locationUnitName) || 'N/A'}</span>
                    ),
                  },
                  {
                    id: 4,
                    isSortable: true,
                    label: t(`${translationPath}item-name`),
                    input: 'assetItemName',
                    component: (item) => (
                      <span>{(item.assetItemName) || 'N/A'}</span>
                    ),
                  },
                  {
                    id: 5,
                    isSortable: true,
                    label: t(`${translationPath}item-category`),
                    input: 'assetItemCategoryName',
                    component: (item) => (
                      <span>
                        {(item.assetItemCategoryName) || 'N/A'}
                      </span>
                    ),
                  },
                  {
                    id: 6,
                    isSortable: true,
                    label: t(`${translationPath}supplier`),
                    input: 'supplierName',
                    component: (item) => (
                      <span>{(item.supplierName) || 'N/A'}</span>
                    ),
                  },
                  {
                    id: 7,
                    label: t(`${translationPath}asset-type`),
                    component: (item) => (
                      <span>
                        {item.assetType === AssetsTypeEnum[0].key ?
                          AssetsTypeEnum[0].value :
                          AssetsTypeEnum[1].value || 'N/A'}
                      </span>
                    ),
                  },
                  {
                    id: 8,
                    isSortable: true,
                    label: t(`${translationPath}owner`),
                    input: 'assetOwnerName',
                    component: (item) => (
                      <span>{(item.assetOwnerName) || 'N/A'}</span>
                    ),
                  },
                ]}
                // TableActions.editText.key,
              defaultActions={
                  getTableActionsByPermissions()

                }
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              actionsOptions={{
                  onActionClicked: tableActionClicked,
                }}
              itemsPerPage={filter.pageSize}
              activePage={filter.pageIndex}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              totalItems={assets.totalCount}
              setSortBy={setSortBy}
            />
          </div>
        </PermissionsComponent>
        <DialogComponent
          isOpen={openDialogDlete}
          onCancelClicked={() => setOpenDialogDlete(false)}
          translationPath={translationPath}
          saveText='confirm'
          parentTranslationPath={parentTranslationPath}
          titleText='incidentdelte'
          saveClasses='btns theme-solid bg-danger w-100 mx-2 mb-2'
          onSubmit={(e) => {
            e.preventDefault();
            deleteAssets(activeItem);
          }}
          maxWidth='sm'
          dialogContent={(
            <span>
              {`${t(`${translationPath}delete-asset-description`)}  ` +
                `(${activeItem.portfolioName})` +
                '  ' +
                '?'}
            </span>
          )}
        />
      </div>
    </div>
  );
};
