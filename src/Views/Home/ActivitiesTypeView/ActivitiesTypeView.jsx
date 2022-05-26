import React, {
  useEffect, useRef, useState, useCallback
} from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@material-ui/core';
import {
  DialogComponent,
  Inputs, PermissionsComponent, AutocompleteComponent
} from '../../../Components';
import { useTitle } from '../../../Hooks';
import { ActivityTypePermissions } from '../../../Permissions';
import { ActivitiesTypeTabelView } from './ActivitiesTypeTabelView/ActivitiesTypeTabel.View';
import {
  GetlookupTypeItems,
} from '../../../Services';
import { DialogManagementViewComponent } from './ActivitiesTypeManagementView/DialogManagementViewComponent/DialogManagementViewComponent';

const parentTranslationPath = 'ActivitiesType';
const translationPath = '';

export const ActivitiesTypeView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [openDialog, setOpenDialog] = useState(false);
  const searchTimer = useRef(null);
  useTitle(t(`${translationPath}ActivitiesTypeView`));
  const [search, setSearch] = useState('');
  const [reloading, setReloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [timer, setTimer] = useState(null);

  const [category, setCategory] = useState({
    result: [],
    totalCount: 0,
  });

  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
    search: '',
    categoryId: null,
  });

  const [searchedItem, setSearchedItem] = useState('');
  const searchHandler = (event) => {
    const { value } = event.target;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(value);
      setSearchedItem(value);
      setFilter((item) => ({ ...item, search: value || '' }));
    }, 700);
  };

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  const getAllCategories = useCallback(async (searchByName) => {
    setIsLoading(true);
    const res = await GetlookupTypeItems({
      pageIndex: 0, pageSize: 99999, lookupTypeId: 1201, search: searchByName || ''
    });
    if (!(res && res.status && res.status !== 200)) {
      setCategory({
        result: ((res && res.result) || []),
        totalCount: ((res && res.totalCount) || 0)
      });
    } else {
      setCategory({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      getAllCategories();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className='ActivitiesType-View view-wrapper'>
      <div className='w-100 px-2'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section'>
              <PermissionsComponent
                permissionsList={Object.values(ActivityTypePermissions)}
                permissionsId={ActivityTypePermissions.AddNewActivityType.permissionsId}
              >
                <ButtonBase
                  className='btns theme-solid px-3 mx-3'
                  onClick={() => {
                    setOpenDialog(true);
                    setReloading(true);
                  }}
                >
                  <span className='mdi mdi-plus' />
                  <span>{t(`${translationPath}Add-New-Activity`)}</span>
                </ButtonBase>
              </PermissionsComponent>
            </div>
            <div className='section autocomplete-section'>
              <div className='d-flex-column px-2 w-100 p-relative'>
                <div className='w-100 p-relative'>
                  <PermissionsComponent
                    permissionsList={Object.values(ActivityTypePermissions)}
                    permissionsId={ActivityTypePermissions.ViewActivityTypes.permissionsId}
                  >
                    <Inputs
                      value={searchedItem}
                      // onKeyUp={searchHandler}
                      idRef='maintenanceContractsRef'
                      label={t(`${translationPath}Search-Type-Activity`)}
                      // onInputChanged={(e) => {
                      //   setSearchedItem(e.target.value);
                      //   setFilter((item) => ({ ...item, search: (e && e.target && e.target.value) || null }));
                      //  }}
                      inputPlaceholder={t(`${translationPath}Type-here-to-Search`)}
                      beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                      onInputChanged={(e) => setSearchedItem(e.target.value)}
                      onKeyUp={() => {
                        setTimer(
                          setTimeout(() => {
                            setFilter((f) => ({ ...f, search: searchedItem }));
                          }, 700)
                        );
                      }}
                      onKeyDown={() => {
                        if (timer != null) clearTimeout(timer);
                      }}
                    />
                  </PermissionsComponent>
                </div>
                <div className='d-inline-flex pl-5-reversed filterSection'>
                  <div className='section'>
                    <div className='section'>
                      <AutocompleteComponent
                        idRef='categoryRef'
                        multiple={false}
                        data={category.result || []}
                        chipsLabel={(option) => option.lookupItemName || ''}
                        displayLabel={(option) => option.lookupItemName || ''}
                        withoutSearchButton
                        isLoading={isLoading}
                        inputPlaceholder={t(`${translationPath}category`)}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        onChange={(event, newValue) => {
                          setCategoryId((newValue && newValue.lookupItemId) || null);
                          setFilter((item) => ({ ...item, categoryId: (newValue && newValue.lookupItemId) || null }));
                        }}
                        onInputKeyUp={(e) => {
                          const { value } = e.target;
                          if (searchTimer.current) clearTimeout(searchTimer.current);
                          searchTimer.current = setTimeout(() => {
                            getAllCategories(value);
                          }, 700);
                        }}
                      />

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <PermissionsComponent
          permissionsList={Object.values(ActivityTypePermissions)}
          permissionsId={ActivityTypePermissions.ViewActivityTypes.permissionsId}
        >
          <ActivitiesTypeTabelView
            // search={search}
            // categoryId={categoryId}
            filter={filter}
            setFilter={setFilter}
            reloading={reloading}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            setSearchedItem={setSearchedItem}

          />
        </PermissionsComponent>
      </div>
      <DialogComponent
        isOpen={openDialog}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        titleText='Add-New-Activity'
        onCloseClicked={() => {
          if (search !== '')
            setSearch('');
          if (searchedItem !== '')
            setSearchedItem('');
          setReloading(false);
          setOpenDialog(false);
        }}
        titleClasses='DialogComponent-ActivitiesType'
        wrapperClasses='wrapperClasses-ActivitiesType'
        maxWidth='md'
        dialogContent={(
          <>
            <DialogManagementViewComponent
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onCancelClicked={() => {
                setSearch('');
                setSearchedItem('');
                setReloading(false);
                setOpenDialog(false);
                setFilter((item) => ({ ...item, search: '' }));
              }}
              setReloading={setReloading}
            />
          </>
        )}
      />
    </div>
  );
};
