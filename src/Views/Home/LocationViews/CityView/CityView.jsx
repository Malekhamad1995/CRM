import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import { ButtonBase } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import {
  AutocompleteComponent,
  DialogComponent,
  Inputs, PaginationComponent, Spinner, Tables, PermissionsComponent
} from '../../../../Components';
import { useTitle } from '../../../../Hooks';
import { bottomBoxComponentUpdate, GlobalHistory } from '../../../../Helper';
import {
  GetlookupTypeItems,
  lookupItemsGet,
  lookupItemsGetId
} from '../../../../Services';
import {
  Country,
  Cities,
  UAECities
} from '../../../../assets/json/StaticLookupsIds.json';
import { ImagesGalleryFilterEnum } from '../../../../Enums';
import { CreteDialogdView } from '../LocationSharingUtilities';
import { ActiveItemActions } from '../../../../store/ActiveItem/ActiveItemActions';
import { LocationsPermissions, LookupsPermissions } from '../../../../Permissions';

const parentTranslationPath = 'LocationView';
const translationPath = '';
export const CityView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  const searchTimer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [DialogOpen, setDialogOpen] = useState(false);
  const [SearchTYPE, setSearchTYPEfilter] = useState(true);
  const [Services, setServices] = useState({});
  const [loadings, setloadings] = useState(false);
  const [sortBy, setSortBy] = useState(null);

  const [filter, setFilter] = useState({
    lookupParentId: UAECities,
    pageIndex: 0,
    pageSize: 25,
    search: '',
    filterBy: null,
    orderBy: null
  });
  const [DetailsCountry, setDetailsCountry] = useState({
    result: [],
    totalCount: 0,
  });
  const [SearchList, setSearchList] = useState({
    Country: null,
    City: null,
    District: null,
    Community: null,
  });
  const [selected, setSelected] = useState({
    selectedCountry: {
      lookupItemId: UAECities,
      lookupItemName: 'United Arab Emirates'
    },
    selectedCities: []
  });
  useTitle(t(`${translationPath}Location`));
  const getAllMyReferrals = useCallback(async () => {
    setIsLoading(true);
    const res = SearchTYPE === false ? await GetlookupTypeItems({ ...filter, lookupTypeId: Cities }) :
      await lookupItemsGet({ ...filter, lookupTypeName: ImagesGalleryFilterEnum.City.lookupType, pageIndex: filter.pageIndex + 1 });
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
  }, [SearchTYPE, filter]);
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

  const lookupGetServices = useCallback(async () => {
    setloadings(true);
    const result = await lookupItemsGetId({
      lookupTypeId: Country,
    });
    setloadings(false);
    setServices(result);
  }, []);
  useEffect(() => {
    lookupGetServices();
  }, [lookupGetServices]);

  const ChangeClicked = () => {
    setDialogOpen(true);
  };
  useEffect(() => {
    getAllMyReferrals();
  }, [filter, getAllMyReferrals]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableActionClicked = useCallback((item) => {
    dispatch(ActiveItemActions.activeItemRequest(item));
    GlobalHistory.push(`/home/city/edit?id=${item.lookupItemId}&lookupItemName=${item.lookupItemName}`);
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
            <div className='section px-1'>
              <PermissionsComponent
                permissionsList={Object.values(LookupsPermissions)}
                permissionsId={LookupsPermissions.AddNew.permissionsId}
              >
                <ButtonBase
                  onClick={ChangeClicked}
                  className='btns theme-solid bg-primary'
                >
                  <span className='mdi mdi-plus' />
                  <span className='px-1'>
                    {t(`${translationPath}add-new-city`)}
                  </span>
                </ButtonBase>
              </PermissionsComponent>
            </div>
            <div className='section autocomplete-section'>
              <div className='d-flex-column px-2 w-100 p-relative'>
                <div className='w-100 p-relative'>

                  <Inputs
                    idRef='CountrySearchRef'
                    label='filtercitynAME'
                    beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                    onInputChanged={(e) => {
                      setSearchTYPEfilter(false);
                      searchHandler(e.target.value);
                    }}
                    inputPlaceholder='search-city'
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                  />
                </div>
              </div>
            </div>
          </div>
          <form
            className='images-gallery-filter-wrapper shared-wrapper px-2'
          >

            <span className='title-text'>{t(`${translationPath}filter`)}</span>
            <div className='filter-item '>

              <AutocompleteComponent
                idRef='lookupItemNameModeIdRef'
                inputPlaceholder={t(`${translationPath}city-filter`)}
                multiple={false}
                data={Services}
                selectedValues={selected.selectedCountry || []}
                getOptionSelected={(option) => option.lookupItemId === selected.selectedCountry.lookupItemId}
                displayLabel={(option) => option.lookupItemName || ''}
                withoutSearchButton
                isWithError
                isLoading={loadings.paymentModes}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  setSearchList((item) => ({ ...item, Country: (newValue && newValue) || null }));
                  setSearchTYPEfilter(true);
                  setSelected((item) => ({
                    ...item,
                    selectedCountry: {
                      lookupItemId: (newValue && +newValue.lookupItemId) || '',
                      lookupItemName: (newValue && newValue.lookupItemName) || ''
                    }
                  }));
                  setFilter((item) => ({ ...item, lookupParentId: (newValue && newValue.lookupItemId) || null, }));
                }}
              />
            </div>
          </form>
        </div>
        <div>
          <div className='w-100 px-2  '>
            <Tables
              data={DetailsCountry.result || []}
              headerData={[
                {
                  id: 1,
                  isSortable: true,
                  label: (`${translationPath}city`),
                  input: 'lookupItemName',
                },
                {
                  id: 2,
                  isSortable: true,
                  label: (`${translationPath}country`),
                  input: 'parentLookupItemName',
                  component: (item) => (
                    <>
                      {(item &&
                        item.parentLookupItemName
                      ) ||
                        'N/A'}
                    </>
                  ),
                },
                {
                  id: 3,
                  label: (`${translationPath}Creator`),
                  component: (item) => (
                    <>
                      {((item && item.createdByName) || 'N/A')}

                    </>
                  )
                },
                {
                  id: 4,
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
                  id: 5,
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
              setSortBy={setSortBy}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              totalItems={(DetailsCountry && DetailsCountry.retotalCountsult) || 0}
              defaultActions={[]}
              itemsPerPage={filter.pageSize}
              activePage={filter.pageIndex}
            />
          </div>
        </div>
        <DialogComponent
          isOpen={DialogOpen}
          onCloseClicked={() => setDialogOpen(false)}
          titleText={t(`${translationPath}add-new-city`)}
          maxWidth='sm'
          dialogContent={(
            <>
              <CreteDialogdView
                onCancelClicked={() => setDialogOpen(false)}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                relode={() => getAllMyReferrals()}
                lookupTypesId={Cities}
                Type='Counrty'
                labelValueis='city-name'
                autoData={SearchList}
              />
            </>
          )}
        />
      </div>
    </div>
  );
};
