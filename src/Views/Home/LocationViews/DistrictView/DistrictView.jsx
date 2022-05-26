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
  GetDistrictsLookups,
  GetlookupTypeItems,
  lookupItemsGetId
} from '../../../../Services';
import {
  Cities, Country, District, UAECities
} from '../../../../assets/json/StaticLookupsIds.json';
import { CreteDialogdView } from '../LocationSharingUtilities';
import { ActiveItemActions } from '../../../../store/ActiveItem/ActiveItemActions';
import { LocationsPermissions, LookupsPermissions } from '../../../../Permissions';

const parentTranslationPath = 'LocationView';
const translationPath = '';
export const DistrictView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  const searchTimer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [DialogOpen, setDialogOpen] = useState(false);
  const [SearchTYPE, setSearchTYPEfilter] = useState(true);
  const [SearchVAL, setSearchVAL] = useState('');
  const [tempid, settempid] = useState(null);
  const [isdesbaeld, setisdesbaeld] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [SearchList, setSearchList] = useState({
    Country: {
      lookupItemId: UAECities,
      lookupItemName: 'United Arab Emirates'
    },
    City: null,
    District: null,
    Community: null,
  });
  const [filter, setFilter] = useState({
    lookupItemId: UAECities,
    pageIndex: 0,
    pageSize: 25,
    lookupParentId: null,
    search: '',
    filterBy: null,
    orderBy: null
  });

  const [oldSerach, setoldSerach] = useState({
    Country: { lookupItemId: UAECities }
  });
  const [selected, setSelected] = useState({
    selectedCountry: {
      lookupItemId: UAECities,
      lookupItemName: 'United Arab Emirates'
    },
    selectedCities: []
  });
  const [DetailsCountry, setDetailsCountry] = useState({
    result: [],
    totalCount: 0,
  });

  useTitle(t(`${translationPath}Location`));
  const ChangeClicked = () => {
    setDialogOpen(true);
  };
  const getAllMyReferrals = useCallback(async () => {
    setIsLoading(true);
    const res = SearchTYPE === false ?
      await GetlookupTypeItems({ ...filter, lookupTypeId: District }) :
      await
        GetDistrictsLookups({ ...filter, pageIndex: filter.pageIndex });

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

  const [Services, setServices] = useState({});
  const [ServicesCity, setServicesCity] = useState([]);
  const [loadings, setloadings] = useState(false);

  const lookupGetServices = useCallback(async (TypeId, lookupParent) => {
    setloadings(true);
    const result = await lookupItemsGetId({
      lookupTypeId: TypeId,
      lookupParentId: lookupParent
    });
    setloadings(false);
    if (TypeId === Country) setServices(result); else setServicesCity(result);
  }, []);
  useEffect(() => {
    lookupGetServices(Country);
  }, [lookupGetServices]);

  useEffect(() => {
    if (filter.lookupItemId !== null)
      getAllMyReferrals();
  }, [filter, getAllMyReferrals]);

  useEffect(() => {
    lookupGetServices(Cities, selected.selectedCountry.lookupItemId);
  }, [lookupGetServices, selected.selectedCountry.lookupItemId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableActionClicked = useCallback((item) => {
    dispatch(ActiveItemActions.activeItemRequest(item));
    GlobalHistory.push(`/home/District/edit?id=${(item.lookupItemId) || item.lookupsId}&lookupItemName=${item.lookupItemName}`);
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
                    {t(`${translationPath}add-new-District`)}
                  </span>
                </ButtonBase>
              </PermissionsComponent>
            </div>
            <div className='section autocomplete-section'>
              <div className='d-flex-column px-2 w-100 p-relative'>
                <div className='w-100 p-relative'>

                  <Inputs
                    idRef='CountrySearchRef'
                    label='filterDistrict'
                    beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                    value={SearchVAL}
                    onInputChanged={(e) => {
                      setSearchTYPEfilter(false);
                      searchHandler(e.target.value);
                      setSearchVAL(e.target.value);
                      setSelected((item) => ({
                        ...item,
                        selectedCities: {
                          lookupItemId: '',
                          lookupItemName: ''
                        }
                      }));
                    }}
                    inputPlaceholder='search-District'
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
                selectedValues={selected.selectedCountry || []}
                getOptionSelected={(option) => option.lookupItemId === selected.selectedCountry.lookupItemId}
                multiple={false}
                data={Services}
                displayLabel={(option) => option.lookupItemName || ''}
                withoutSearchButton
                isWithError
                isLoading={loadings.paymentModes}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  setisdesbaeld(true);
                  setSearchTYPEfilter(true);
                  if (newValue === null) {
                    setSelected((item) => ({
                      ...item,
                      selectedCountry: {
                        lookupItemId: '',
                        lookupItemName: ''
                      },
                      selectedCities: {
                        lookupItemId: '',
                        lookupItemName: ''
                      }
                    }));
                    setServicesCity([]);
                    setFilter((item) => ({ ...item, lookupParentId: '', }));
                    setSearchTYPEfilter(false);
                    setSearchList((item) => ({ ...item, Country: null, City: null }));
                  } else {
                    setisdesbaeld(false);
                    settempid((newValue && newValue.lookupItemId));
                    setFilter((item) => ({ ...item, lookupItemId: (newValue && newValue.lookupItemId) }));
                    lookupGetServices(Cities, ((newValue && newValue.lookupItemId) || null));
                    setSearchList((item) => ({ ...item, Country: (newValue && newValue) || null }));
                    setoldSerach((item) => ({ ...item, Country: (newValue && newValue) || null }));
                    setSelected((item) => ({
                      ...item,
                      selectedCountry: {
                        lookupItemId: (newValue && +newValue.lookupItemId) || '',
                        lookupItemName: (newValue && newValue.lookupItemName) || ''
                      },
                      selectedCities: {}
                    }));
                  }
                }}
              />
            </div>
            <div className='filter-item '>
              <AutocompleteComponent
                idRef='lookupItemNameModeIdRef'
                // labelValue='payment-mode'
                inputPlaceholder={t(`${translationPath}cityfilter`)}
                selectedValues={selected.selectedCities || []}
                multiple={false}
                data={ServicesCity || []}
                displayLabel={(option) => option.lookupItemName || ''}
                withoutSearchButton
                isWithError
                isDisabled={isdesbaeld}
                isLoading={loadings.paymentModes}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  setSearchTYPEfilter(true);
                  setSearchVAL('');
                  if (newValue === null) {
                    setSearchList((item) => ({ ...item, City: null }));
                    setSearchTYPEfilter(true);
                    setFilter((item) => ({ ...item, lookupItemId: oldSerach.Country && oldSerach.Country.lookupItemId }));
                    setSelected((item) => ({
                      ...item,
                      selectedCities: {
                        lookupItemId: '',
                        lookupItemName: ''
                      }
                    }));
                  } else {
                    setSearchList((item) => ({ ...item, City: (newValue && newValue) || null }));
                    setSelected((item) => ({
                      ...item,
                      selectedCities: {
                        lookupItemId: (newValue && +newValue.lookupItemId) || '',
                        lookupItemName: (newValue && newValue.lookupItemName) || ''
                      }
                    }));
                    setFilter((item) => ({ ...item, lookupItemId: (newValue && newValue.lookupItemId) || tempid, }));
                  }
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
                  label: (`${translationPath}District`),
                  input: 'lookupItemName',
                },
                {
                  id: 2,
                  isSortable: true,
                  label: (`${translationPath}city`),
                  input: 'parentLookupItemName',
                  component: (item) => (
                    <>
                      {((item && item.parentLookupItemName) || 'N/A')}
                    </>
                  )
                },
                {
                  id: 3,
                  label: (`${translationPath}Creator`),
                  component: (item) => (
                    <>
                      {((item &&
                        item.createdByName) || 'N/A')}
                    </>
                  )
                },
                {
                  id: 4,
                  label: t(`${translationPath}Created`),
                  input: 'createdOn',
                  isSortable: true,
                  component: (item) => (
                    <>
                      {(item && item.createdOn && moment(item.createdOn).format('YYYY-MM-DD')) || 'N/A'}
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
          titleText={t(`${translationPath}add-new-District`)}
          maxWidth='sm'
          dialogContent={(
            <>
              <CreteDialogdView
                onCancelClicked={() => setDialogOpen(false)}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                relode={() => getAllMyReferrals()}
                lookupTypesId={District}
                Type='City'
                labelValueis='District-name'
                autoData={SearchList}
              />
            </>
          )}
        />
      </div>
    </div>
  );
};
