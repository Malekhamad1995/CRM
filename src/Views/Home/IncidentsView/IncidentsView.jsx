import React, {
  useState, useRef, useEffect, useCallback
} from 'react';
import { useDispatch } from 'react-redux';
import { Button, ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  DialogComponent, Inputs, PaginationComponent, Spinner, Tables, PermissionsComponent
} from '../../../Components';
import { useTitle } from '../../../Hooks';
import { TableActions } from '../../../Enums';
import { DeleteIncident, GetAllIncidents } from '../../../Services';
import {
  bottomBoxComponentUpdate, GlobalHistory, showSuccess, returnPropsByPermissions, returnPropsByPermissions2
} from '../../../Helper';
import { IncidentsPermissions } from '../../../Permissions/PropertyManagement/Incidents.Permissions';

import { ActiveItemActions } from '../../../store/ActiveItem/ActiveItemActions';

const parentTranslationPath = 'IncidentsView';
const translationPath = '';

export const IncidentsView = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedItem, setSearchedItem] = useState('');
  const [activeItem, setActiveItem] = useState('');
  const [openDialogDlete, setOpenDialogDlete] = useState(false);
  const [Incidents, setIncidents] = useState({
    result: [],
    totalCount: 0,
  });
  const [sortBy, setSortBy] = useState(null);
  const searchTimer = useRef(null);
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
    filterBy: null,
    orderBy: null,
  });

  useTitle(t(`${translationPath}Incidents`));

  const GetAllIncidentsAPi = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllIncidents(filter);
    if (!(res && res.status && res.status !== 200)) {
      setIncidents({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setIncidents({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);

  useEffect(() => {
    GetAllIncidentsAPi();
  }, [GetAllIncidentsAPi, filter]);

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
      GlobalHistory.push(`/home/Incidents/edit?id=${item.incidentId}`);
    else if (actionEnum === TableActions.deleteText.key) {
      setActiveItem(item);
      setOpenDialogDlete(true);
    }
  }, []);

  const reloadData = useCallback(() => {
    GetAllIncidentsAPi();
  }, [GetAllIncidentsAPi]);

  const DleteIncident = useCallback(async () => {
    setIsLoading(true);
    await DeleteIncident(activeItem.incidentId);
    setOpenDialogDlete(false);
    showSuccess(t(`${translationPath}SuccessDeleteIncident`));
    setIsLoading(false);
    reloadData();
  }, [activeItem.incidentId, reloadData, t]);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={Incidents.totalCount}
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
    if (returnPropsByPermissions2(IncidentsPermissions.EditIncidents.permissionsId, IncidentsPermissions.DeleteIncidents.permissionsId)) {
      list.push(
        { enum: TableActions.editText.key },
        {
          enum: TableActions.deleteText.key
        }
      );
      return list;
    }
    if (returnPropsByPermissions(IncidentsPermissions.EditIncidents.permissionsId)) {
      list.push(
        { enum: TableActions.editText.key },
      );
      return list;
    }
    if (returnPropsByPermissions(IncidentsPermissions.DeleteIncidents.permissionsId)) {
      list.push(
        { enum: TableActions.delete.key },
      );
      return list;
    }
    return list;
  };

  useEffect(() => {
    if (sortBy)
    setFilter((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);

  return (
    <div className='view-wrapper activities-view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section px-2'>
            <div className='section'>
              <PermissionsComponent
                permissionsList={Object.values(IncidentsPermissions)}
                permissionsId={IncidentsPermissions.CreateIncidents.permissionsId}
              >
                <ButtonBase
                  className='btns theme-solid px-3'
                  onClick={() => {
                    GlobalHistory.push('/home/Incidents/add');
                  }}
                >
                  <span className='mdi mdi-plus' />
                  {t(`${translationPath}add-new`)}
                </ButtonBase>
              </PermissionsComponent>
            </div>
            <PermissionsComponent
              permissionsList={Object.values(IncidentsPermissions)}
              permissionsId={IncidentsPermissions.ViewandsearchinPropertyManagementIncidents.permissionsId}
            >
              <div className='section px-2'>
                <Inputs
                  value={searchedItem}
                  onKeyUp={searchHandler}
                  idRef='activitiesSearchRef'
                  label={t(`${translationPath}search-Incidents`)}
                  onInputChanged={(e) => setSearchedItem(e.target.value)}
                  inputPlaceholder={t(`${translationPath}search-Incidents-description`)}
                  beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                />
              </div>
            </PermissionsComponent>
          </div>
        </div>
        <PermissionsComponent
          permissionsList={Object.values(IncidentsPermissions)}
          permissionsId={IncidentsPermissions.ViewandsearchinPropertyManagementIncidents.permissionsId}
        >
          <div className='w-100 px-3'>
            <Tables
              data={Incidents.result || []}
              headerData={[
                  {
                    id: 1,
                    input: 'portfolioName',
                    label: t(`${translationPath}Portfolio`),
                    component: (item) => (
                      <span className='c-primary'>{item.portfolioName || 'N/A'}</span>
                    ),
                  },
                  {
                    id: 2,
                    isSortable: true,
                    label: t(`${translationPath}title`),
                    input: 'title',
                    component: (item) => <span>{(item.title) || 'N/A'}</span>,
                  },
                  {
                    id: 3,
                    isSortable: true,
                    label: t(`${translationPath}occurredOn`),
                    input: 'occurredOn',
                    isDate: true,
                  },
                  {
                    id: 4,
                    isSortable: true,
                    input: 'reportedBy',
                    label: t(`${translationPath}reportedBy`),
                    component: (item) => <span>{item.reportedBy || 'N/A'}</span>,
                  },
                ]}
              defaultActions={getTableActionsByPermissions()}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              actionsOptions={{
                  onActionClicked: tableActionClicked,
                }}
              setSortBy={setSortBy}
              itemsPerPage={filter.pageSize}
              activePage={filter.pageIndex}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              totalItems={Incidents.totalCount}
            />

          </div>
        </PermissionsComponent>
        <DialogComponent
          isOpen={openDialogDlete}
          onCloseClicked={() => setOpenDialogDlete(false)}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          titleText='incidentdelte'
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   DleteIncident(activeItem);
          // }}
          maxWidth='sm'
          dialogContent={(
            <div>
              <span>
                {`${t(`${translationPath}AreYousherdelteincident`)}  ` +
                `(${activeItem.portfolioName})` +
                '  ' +
                '?'}
              </span>
              <div className='d-flex-v-center-h-end flex-wrap mt-3'>
                <Button
                  className='MuiButtonBase-root MuiButton-root MuiButton-text MuiButtonBase-root btns theme-transparent mb-2'
                  type='button'
                  onClick={() => {
                        setOpenDialogDlete(false);
                      }}
                >
                  <span className='MuiButton-label'>
                    <span className='mx-2'>
                      {t(`${translationPath}cancel`)}
                    </span>

                    <span className='MuiTouchRipple-root' />
                  </span>
                  <span className='MuiTouchRipple-root' />
                </Button>
                <Button
                  className='MuiButtonBase-root btns theme-solid mb-2'
                  type='button'
                  onClick={(e) => {
                        e.preventDefault();
                        DleteIncident(activeItem);
                      }}
                >
                  <span className='MuiButton-label'>
                    <span className='mx-2'>
                      {t(`${translationPath}confirm`)}
                    </span>
                  </span>
                  <span className='MuiTouchRipple-root' />
                </Button>
              </div>

            </div>
          )}
        />
      </div>
    </div>
  );
};
