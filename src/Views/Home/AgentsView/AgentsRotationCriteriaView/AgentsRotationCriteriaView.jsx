import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import ButtonBase from '@material-ui/core/ButtonBase';
import { RotationSchemaTabelView } from './RotationSchemaTabelView/RotationSchemaTabelView';
import { SelectComponet, Inputs, PermissionsComponent } from '../../../../Components';
import { GlobalOrderFilterActions } from '../../../../store/GlobalOrderFilter/GlobalOrderFilterActions';
import { RotationCriteriaDialog } from './Dialogs/RotationCriteriaDialog/RotationCriteriaDialog';
import { GetAdvanceSearchRotationScheme } from '../../../../Services/RotaionSchemaService/RotationSchemaService';
import { useTitle } from '../../../../Hooks';
import { RotationSchemaPermissions } from '../../../../Permissions';

const parentTranslationPath = 'Agents';
const translationPath = '';

export const AgentsRotationCriteriaView = () => {
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  useTitle(t(`${translationPath}rotation-criteria`));

const [selectedOrderBy, setSelectedOrderBy] = useState({
    filterBy: (orderFilter.rotationCriteriaFilter && orderFilter.rotationCriteriaFilter.filterBy) || null,
    orderBy: (orderFilter.rotationCriteriaFilter && orderFilter.rotationCriteriaFilter.orderBy) || null,
  });

  const [sortBy, setSortBy] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [filter, setFilter] = useState({
    filterBy: (selectedOrderBy && selectedOrderBy.filterBy) || null,
    orderBy: (selectedOrderBy && selectedOrderBy.orderBy) || null,
    pageSize: 25,
    pageIndex: 0,
    search: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(null);
  const [response, setResponse] = useState({
    result: [],
    totalCount: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [searchedItem, setSearchedItem] = useState('');

  const GetOrderedRotationScheme = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAdvanceSearchRotationScheme({ ...filter, pageIndex: filter.pageIndex + 1 });
    if (res) {
      setResponse({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setResponse({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);

  const filterByChanged = (value) => {
    setSelectedOrderBy((item) => ({ ...item, filterBy: value }));
  };
  const orderByChanged = (value) => {
    setSelectedOrderBy((item) => ({ ...item, orderBy: value }));
  };

  const orderBySubmitted = (event) => {
    event.preventDefault();
    if (!selectedOrderBy.filterBy || !selectedOrderBy.orderBy)
      return;

    dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        rotationCriteriaFilter: {
          filterBy: selectedOrderBy.filterBy,
          orderBy: selectedOrderBy.orderBy,
        },
      })
    );
    setOrderBy({
      filterBy: selectedOrderBy.filterBy,
      orderBy: selectedOrderBy.orderBy,
    });
  };

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  const reloadData = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };

  useEffect(() => {
    GetOrderedRotationScheme();
  }, [GetOrderedRotationScheme]);

  useEffect(() => {
    if (orderBy)
    setFilter((item) => ({ ...item, filterBy: orderBy.filterBy, orderBy: orderBy.orderBy }));
  }, [orderBy]);

  useEffect(() => {
    if (sortBy)
    setFilter((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);

  return (
    <div className='RotationSchema-wrapper view-wrapper'>
      <div className='w-100 px-2'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section'>
              <PermissionsComponent
                permissionsList={Object.values(RotationSchemaPermissions)}
                permissionsId={RotationSchemaPermissions.CreateNewRotations.permissionsId}
              >
                <ButtonBase
                  className='btns theme-solid'
                  onClick={() => {
                    setOpenDialog(true);
                  }}
                >
                  <span className='mdi mdi-plus' />
                  <span>{t(`${translationPath}new-rotation-criteria`)}</span>
                </ButtonBase>
              </PermissionsComponent>
            </div>
            <div className='section px-2'>
              <PermissionsComponent
                permissionsList={Object.values(RotationSchemaPermissions)}
                permissionsId={RotationSchemaPermissions.ViewAllRotationSchema.permissionsId}
              >
                <Inputs
                  idRef='RotationCriteriaRef'
                  label={t(`${translationPath}rotation-criteria`)}
                  value={searchedItem}
                  onInputChanged={(e) => setSearchedItem(e.target.value)}
                  inputPlaceholder={t(`${translationPath}search-rotation-criteria`)}
                  onKeyUp={() => {
                    setTimer(
                      setTimeout(() => {
                        setFilter((f) => ({ ...f, search: searchedItem }));
                      }, 1000)
                    );
                  }}
                  onKeyDown={() => {
                    if (timer != null) clearTimeout(timer);
                  }}
                  beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                />
              </PermissionsComponent>
            </div>
          </div>
          <div />
        </div>
        <div className='d-flex px-2'>
          <PermissionsComponent
            permissionsList={Object.values(RotationSchemaPermissions)}
            permissionsId={RotationSchemaPermissions.ViewAllRotationSchema.permissionsId}
          >

            <span className='mx-2 mt-1'>{t(`${translationPath}select`)}</span>
            <span className='separator-v s-primary s-reverse s-h-25px mt-1' />
            <span className='px-2 d-flex'>
              <span className='texts-large mt-1'>
                {t(`${translationPath}order-by`)}
                :
              </span>
              <div className='px-2'>
                <SelectComponet
                  idRef='filterByRef'
                  data={[
                    { id: 'CreatedOn', filterBy: 'created-on' },
                    { id: 'UpdateOn', filterBy: 'last-updated' },
                  ]}
                  wrapperClasses='mb-3'
                  isRequired
                  value={selectedOrderBy.filterBy}
                  onSelectChanged={filterByChanged}
                  valueInput='id'
                  textInput='filterBy'
                  emptyItem={{
                    value: null,
                    text: 'select-filter-by',
                    isDisabled: false,
                  }}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  translationPathForData={translationPath}
                />
              </div>
              <div className='px-2'>
                <SelectComponet
                  idRef='orderByRef'
                  data={[
                    { id: 1, orderBy: 'ascending' },
                    { id: 2, orderBy: 'descending' },
                  ]}
                  value={selectedOrderBy.orderBy}
                  onSelectChanged={orderByChanged}
                  emptyItem={{ value: null, text: 'select-sort-by', isDisabled: false }}
                  wrapperClasses='mb-3'
                  isRequired
                  valueInput='id'
                  textInput='orderBy'
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  translationPathForData={translationPath}
                />
              </div>
              <div className='mt-1'>
                <ButtonBase
                  className='btns theme-solid'
                  onClick={orderBySubmitted}
                  disabled={!selectedOrderBy.filterBy || !selectedOrderBy.orderBy}
                >
                  <span>{t(`${translationPath}apply`)}</span>
                </ButtonBase>
              </div>
            </span>
          </PermissionsComponent>
        </div>
        <PermissionsComponent
          permissionsList={Object.values(RotationSchemaPermissions)}
          permissionsId={RotationSchemaPermissions.ViewAllRotationSchema.permissionsId}
        >
          <RotationSchemaTabelView
            parentTranslationPath={parentTranslationPath}
            filter={filter}
            translationPath={translationPath}
            data={response || {}}
            isLoading={isLoading}
            reloadData={reloadData}
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
            setSortBy={setSortBy}
          />
        </PermissionsComponent>
      </div>
      {openDialog && (
        <RotationCriteriaDialog
          open={openDialog}
          close={() => {
            setOpenDialog(false);
          }}
          onSave={() => {
            // setOpenDialog(false);
            // reload data
            reloadData();
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};
