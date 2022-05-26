import React, {
  useState, useRef, useEffect, useCallback
} from 'react';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Inputs, NoSearchResultComponent, Spinner, Tables, PermissionsComponent
} from '../../../Components';
import { useTitle } from '../../../Hooks';
import { TableActions } from '../../../Enums';
import { GetAllPortfolio } from '../../../Services';
import { PortfolioManagementDialog } from './PortfolioViewUtilities';
import { GlobalHistory } from '../../../Helper';
import { ActiveItemActions } from '../../../store/ActiveItem/ActiveItemActions';
import { PortfolioPermissions } from '../../../Permissions/PropertyManagement/Portfolio.Permissions';

const parentTranslationPath = 'PortfolioView';
const translationPath = '';

export const PortfolioView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedItem, setSearchedItem] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [portfolios, setPortfolios] = useState({
    result: [],
    totalCount: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [isFirstLoad, setisFirstLoad] = React.useState(true);
  const searchTimer = useRef(null);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    search: '',
    filterBy: null,
    orderBy: null
  });

  useTitle(t(`${translationPath}portfolio`));

  const getAllActivities = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllPortfolio(filter);
    if (res && res.totalCount === 0) setisFirstLoad(false);
    if (!(res && res.status && res.status !== 200)) {
      setPortfolios({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setPortfolios({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);

  useEffect(() => {
    getAllActivities();
  }, [getAllActivities]);

  const searchHandler = (value) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({ ...item, search: value }));
    }, 700);
  };
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const tableActionClicked = useCallback(
    (actionEnum, item, focusedRow, event) => {
      event.stopPropagation();
      event.preventDefault();
      dispatch(
        ActiveItemActions.activeItemRequest(item)
      );
      if (actionEnum === TableActions.openFile.key) {
        GlobalHistory.push(
          `/home/portfolio/open-file?id=${item.portfolioId}&isActive=${item.isActive}`
        );
      }
    },
    [dispatch]
  );

  const addNewHandler = () => {
    setOpenDialog(true);
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
                permissionsList={Object.values(PortfolioPermissions)}
                permissionsId={PortfolioPermissions.CreatePortfolio.permissionsId}
              >
                <ButtonBase className='btns theme-solid px-3' onClick={addNewHandler}>
                  <span className='mdi mdi-plus' />
                  {t(`${translationPath}add-new-portfolio`)}
                </ButtonBase>
              </PermissionsComponent>
            </div>
            <div className='section px-2'>
              <PermissionsComponent
                permissionsList={Object.values(PortfolioPermissions)}
                permissionsId={PortfolioPermissions.ViewandsearchinPropertyManagementPortfolio.permissionsId}
              >
                <Inputs
                  value={searchedItem}
                  onKeyUp={(e) => searchHandler(e.target.value)}
                  idRef='activitiesSearchRef'
                  label={t(`${translationPath}search-portfolios`)}
                  onInputChanged={(e) => setSearchedItem(e.target.value)}
                  inputPlaceholder={t(`${translationPath}search-portfolios`)}
                  beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                />
              </PermissionsComponent>
            </div>
          </div>
        </div>
        <PermissionsComponent
          permissionsList={Object.values(PortfolioPermissions)}
          permissionsId={PortfolioPermissions.ViewandsearchinPropertyManagementPortfolio.permissionsId}
        >
          <div className='w-100 px-3'>
            {portfolios && portfolios.totalCount === 0 && !isFirstLoad ? (
              <NoSearchResultComponent />
            ) : (

              <Tables
                data={portfolios.result}
                headerData={[
                    {
                      id: 1,
                      label: 'last-updated',
                      input: 'updateOn',
                      isDate: true,
                      isSortable: true,
                    },
                    {
                      id: 2,
                      isSortable: true,
                      label: 'ref-no',
                      input: 'ref-no',
                      component: (item) => (
                        <span>{(item.portfolioId) || 'N/A'}</span>
                      ),
                    },
                    {
                      id: 3,
                      isSortable: true,
                      label: 'portfolio-name',
                      input: 'portfolio-name',
                      component: (item) => (
                        <span>{(item.portfolioName) || 'N/A'}</span>
                      ),
                    },
                    {
                      id: 4,
                      isSortable: true,
                      label: 'property-manager',
                      input: 'property-manager',
                      component: (item) => (
                        <span>{(item.propertyManagerName) || 'N/A'}</span>
                      ),
                    },
                    {
                      id: 6,
                      isSortable: true,
                      label: 'contact-person',
                      input: 'contact-person',
                      component: (item) => (
                        <span>{(item.contactPersonName) || 'N/A'}</span>
                      ),
                    },
                    {
                      id: 7,
                      isSortable: true,
                      label: 'email',
                      input: 'email',
                      component: (item) => <span>{(item.email) || 'N/A'}</span>,
                    },
                    {
                      id: 8,
                      isSortable: true,
                      label: 'phone',
                      input: 'phone',
                      component: (item) => <span>{(item.phone) || 'N/A'}</span>,
                    },
                    {
                      id: 9,
                      isSortable: true,
                      label: 'created-date',
                      input: 'createdOn',
                      isDate: true,
                    },
                    {
                      id: 10,
                      isSortable: true,
                      label: 'created-by',
                      input: 'created-by',
                      component: (item) => <span>{(item.createdBy) || 'N/A'}</span>,
                    },
                    {
                      id: 11,
                      isSortable: true,
                      label: 'last-activity-date',
                      input: 'activityUpdateOn',
                      isDate: true,
                    },
                    {
                      id: 12,
                      isSortable: true,
                      label: 'last-activity-by',
                      input: 'activityUpdateBy',
                      component: (item) => (
                        <span>{(item.activityUpdateBy) || 'N/A'}</span>
                      ),
                    },
                  ]}
                defaultActions={[
                    {
                      enum: TableActions.openFile.key,
                    },
                  ]}
                setSortBy={setSortBy}
                onPageIndexChanged={onPageIndexChanged}
                onPageSizeChanged={onPageSizeChanged}
                actionsOptions={{
                    onActionClicked: tableActionClicked,
                  }}
                itemsPerPage={filter.pageSize}
                activePage={filter.pageIndex}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                totalItems={portfolios.totalCount}
              />

            )}
          </div>
        </PermissionsComponent>
      </div>
      {openDialog && (
        <PortfolioManagementDialog
          open={openDialog}
          onSave={() => {
            getAllActivities();
            setOpenDialog(false);
            onPageIndexChanged(0);
          }}
          close={() => {
            setOpenDialog(false);
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};
