import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import {
  DialogComponent,
  Inputs, PaginationComponent, Spinner, Tables, PermissionsComponent
} from '../../../../Components';
import { useTitle } from '../../../../Hooks';
import { bottomBoxComponentUpdate, GlobalHistory } from '../../../../Helper';
import {
  GetlookupTypeItems,

} from '../../../../Services';
import { CreteDialogdView } from '../LocationSharingUtilities';
import {
  Country,
} from '../../../../assets/json/StaticLookupsIds.json';
import { ActiveItemActions } from '../../../../store/ActiveItem/ActiveItemActions';
import { LookupsPermissions, LocationsPermissions } from '../../../../Permissions';

const parentTranslationPath = 'LocationView';
const translationPath = '';
export const CountryView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  const searchTimer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [DialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState({
    lookupTypeId: Country,
    pageIndex: 0,
    pageSize: 25,
    search: '',
    filterBy: null,
    orderBy: null
  });
  const [sortBy, setSortBy] = useState(null);
  const [DetailsCountry, setDetailsCountry] = useState({
    result: [],
    totalCount: 0,
  });

  // const ChangeClicked = () => {
  //   setDialogOpen(true);
  // };
  useTitle(t(`${translationPath}Location`));
  const getAllMyReferrals = useCallback(async () => {
    setIsLoading(true);
    const res = await GetlookupTypeItems(filter);
    if (!(res && res.status && res.status !== 200)) {
      setDetailsCountry({
        result: ((res && res.result && res.result.filter((item) => item.lookupItemName !== 'Unknown')) || []),
        totalCount: ((res && res.totalCount) || 0)
      });
    } else {
      setDetailsCountry({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  }, [filter]);

  const searchHandler = (search) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({ ...item, pageIndex: 0, search }));
    }, 700);
  };
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  useEffect(() => {
    getAllMyReferrals();
  }, [filter.search, getAllMyReferrals, filter]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableActionClicked = useCallback((item) => {
    dispatch(ActiveItemActions.activeItemRequest(item));
    GlobalHistory.push(`/home/country/edit?id=${item.lookupItemId}&lookupItemName=${item.lookupItemName}`);
  });
  useEffect(() => {
    bottomBoxComponentUpdate(
      <PaginationComponent
        pageIndex={filter.pageIndex}
        pageSize={filter.pageSize}
        totalCount={DetailsCountry.totalCount}
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
    setFilter((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);

  return (
    <div className='my-leads-wrapper view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section px-2'>
              <PermissionsComponent
                permissionsList={Object.values(LookupsPermissions)}
                permissionsId={LookupsPermissions.AddNew.permissionsId}
              >

                {/* <ButtonBase
                  onClick={ChangeClicked}
                  className='btns theme-solid bg-primary'
                >
                  <span className='mdi mdi-plus' />
                  <span className='px-1'>
                    {t(`${translationPath}add-new-Country`)}
                  </span>
                </ButtonBase> */}
              </PermissionsComponent>
            </div>
            <div className='section autocomplete-section'>
              <div className='d-flex-column px-2 w-100 p-relative'>
                <div className='w-100 p-relative'>

                  <Inputs
                    idRef='CountrySearchRef'
                    label='filterCountry'
                    beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                    onInputChanged={(e) => {
                      searchHandler(e.target.value);
                    }}
                    inputPlaceholder='search-Country'
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
        <div>
          <div className='w-100 px-2  '>

            <Tables
              data={DetailsCountry.result || []}
              headerData={[
                {
                  id: 1,
                  isSortable: true,
                  label: (`${translationPath}country`),
                  input: 'lookupItemName',
                },
                {
                  id: 2,
                  label: (`${translationPath}Creator`),
                  input: 'createdByName',
                  component: (item) => (
                    <>
                      {((item &&
                        item.createdByName) || 'N/A')}

                    </>
                  )
                },
                {
                  id: 3,
                  label: t(`${translationPath}Created`),
                  isSortable: true,
                  input: 'createdOn',
                  component: (item) => (
                    <>
                      {(item &&
                        item.createdOn &&
                        moment(item.createdOn).format('YYYY-MM-DD')) ||
                        'N/A'}
                    </>
                  ),
                },

                {
                  id: 4,
                  label: t(`${translationPath}Action`),
                  component: (item) => (
                    <>
                      <PermissionsComponent
                        permissionsList={Object.values(LocationsPermissions)}
                        permissionsId={LocationsPermissions.ViewLocationDetails.permissionsId}
                      >
                        <Button
                          onClick={() => {
                            tableActionClicked(item);
                          }}
                          className='MuiButtonBase-root MuiButton-root MuiButton-text table-action-btn  btns-icon theme-solid bg-secondary'
                        >
                          <span className='MuiButton-label'>
                            <span className='table-action-icon  mdi mdi-lead-pencil' />
                          </span>
                        </Button>
                      </PermissionsComponent>
                    </>
                  ),
                },
              ]}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              totalItems={(DetailsCountry && DetailsCountry.retotalCountsult) || 0}
              defaultActions={[]}
              itemsPerPage={filter.pageSize}
              activePage={filter.pageIndex}
              setSortBy={setSortBy}
            />
          </div>
        </div>
        <DialogComponent
          isOpen={DialogOpen}
          onCloseClicked={() => setDialogOpen(false)}
          titleText={t(`${translationPath}add-counrty`)}
          maxWidth='sm'
          dialogContent={(
            <>
              <CreteDialogdView
                onCancelClicked={() => setDialogOpen(false)}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                relode={() => getAllMyReferrals()}
                lookupTypesId={Country}
                labelValueis='Country-name'
              />
            </>
          )}
        />
      </div>
    </div>
  );
};
