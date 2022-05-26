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
  GetCommunitiesLookups,
  GetlookupTypeItems,
  lookupItemsGetId
} from '../../../../Services';
import {
  Cities, Country, District, Community, UAECities
} from '../../../../assets/json/StaticLookupsIds.json';
import { CreteDialogdView } from '../LocationSharingUtilities';
import { ActiveItemActions } from '../../../../store/ActiveItem/ActiveItemActions';
import { CommunityPermissions, LocationsPermissions, LookupsPermissions } from '../../../../Permissions';

const parentTranslationPath = 'LocationView';
const translationPath = '';
export const CommunityView = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(parentTranslationPath);
  const searchTimer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    lookupItemId: UAECities,
    pageIndex: 0,
    pageSize: 25,
    lookupParentId: null,
    search: '',
    filteBy: null,
    orderBy: null,
  });

  const [Services, setServices] = useState({});
  const [ServicesCity, setServicesCity] = useState([]);
  const [loadings, setloadings] = useState(false);
  const [DialogOpen, setDialogOpen] = useState(false);
  const [ServicesDistrict, setServicesDistrict] = useState([]);
  const [SearchTYPE, setSearchTYPEfilter] = useState(false);
  const [SearchList, setSearchList] = useState({
    Country: {
      lookupItemId: UAECities,
      lookupItemName: 'United Arab Emirates'
    },
    City: null,
    District: null,
    Community: null,
  });
  const [selected, setSelected] = useState({
    selectedCountry: {
      lookupItemId: UAECities,
      lookupItemName: 'United Arab Emirates'
    },
    selectedCities: [],
    selectedDistrict: []
  });
  const [DetailsCountry, setDetailsCountry] = useState({
    result: [],
    totalCount: 0,
  });
  const [desipeld, setdesipeld] = useState({
    city: false,
    district: true,
  });
  const [sortBy, setSortBy] = useState(null);
  const [tempid, settempid] = useState(null);
  const [tempidcity, settempidcity] = useState(UAECities);
  useTitle(t(`${translationPath}Location`));
  const getAllMyReferrals = useCallback(async () => {
    if (filter.search === '') {
      setIsLoading(true);
      const res = await GetCommunitiesLookups(filter);
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
    }
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

  const loadItem = async () => {
    setIsLoading(true);
    const res = SearchTYPE === false ?
      await GetlookupTypeItems({ ...filter, lookupTypeId: Community }) :
      await
        GetCommunitiesLookups({ ...filter, pageIndex: filter.pageIndex });
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
  };
  const ChangeClicked = () => {
    setDialogOpen(true);
  };

  const lookupGetServices = useCallback(async (TypeId, lookupParent) => {
    setloadings(true);
    const result = await lookupItemsGetId({
      lookupTypeId: TypeId,
      lookupParentId: lookupParent
    });
    setloadings(false);
    if (TypeId === Country) setServices(result);
    else if (TypeId === Cities) setServicesCity(result);
    else setServicesDistrict(result);
  }, []);

  useEffect(() => {
    loadItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    lookupGetServices(Country);
  }, [lookupGetServices]);

  useEffect(() => {
    if (filter.lookupItemId !== null)
      getAllMyReferrals();
  }, [filter, getAllMyReferrals]);

  useEffect(() => {
    lookupGetServices(Cities, selected.selectedCountry.lookupItemId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.selectedCountry.lookupItemId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tableActionClicked = useCallback((item) => {
    dispatch(ActiveItemActions.activeItemRequest(item));
    GlobalHistory.push(`/home/Communitie/edit?id=${((item && item.lookupsId !== undefined) && item.lookupsId) || item.lookupItemId}&lookupItemName=${item.lookupItemName}`);
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
                    {t(`${translationPath}add-new-Community`)}
                  </span>
                </ButtonBase>
              </PermissionsComponent>
            </div>
            <div className='section autocomplete-section'>
              <div className='d-flex-column px-2 w-100 p-relative'>
                <div className='w-100 p-relative'>
                  <PermissionsComponent
                    permissionsList={Object.values(CommunityPermissions)}
                    permissionsId={CommunityPermissions.ViewAllCommunity.permissionsId}
                  >
                    <Inputs
                      idRef='CountrySearchRef'
                      label='filterCommunitiet'
                      beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                      onInputChanged={(e) => {
                        setSearchTYPEfilter(false);
                        searchHandler(e.target.value);
                      }}
                      inputPlaceholder='search-Communitie'
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                    />
                  </PermissionsComponent>
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
                multiple={false}
                data={Services}
                getOptionSelected={(option) => option.lookupItemId === selected.selectedCountry.lookupItemId}
                displayLabel={(option) => option.lookupItemName || ''}
                withoutSearchButton
                isWithError
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  if (newValue === null) {
                    setSearchTYPEfilter(false);
                    // setFilter((item) => ({ ...item, lookupItemId: null }));
                    setServicesCity([]);
                    loadItem();
                    setSelected((item) => ({
                      ...item,
                      selectedCities: {
                        lookupItemId: '',
                        lookupItemName: ''
                      },
                      selectedDistrict: [],
                      selectedCountry: []
                    }));
                    setdesipeld((item) => ({ ...item, city: true, district: true }));
                    settempidcity(null);
                    setSearchList((item) => ({
                      ...item, Country: '', City: '', District: ''
                    }));
                  } else {
                    setSearchTYPEfilter(true);
                    settempidcity((newValue && newValue.lookupItemId));
                    setFilter((item) => ({ ...item, lookupItemId: (newValue && newValue.lookupItemId) }));
                    lookupGetServices(Cities, ((newValue && newValue.lookupItemId) || null));
                    setSearchList((item) => ({ ...item, Country: (newValue && newValue) || null }));
                    setSelected((item) => ({
                      ...item,
                      selectedCountry: {
                        lookupItemId: (newValue && +newValue.lookupItemId) || '',
                        lookupItemName: (newValue && newValue.lookupItemName) || ''
                      }
                    }));
                    setdesipeld((item) => ({ ...item, city: false }));
                  }
                }}
              />
            </div>
            <div className='filter-item '>
              <AutocompleteComponent
                idRef='lookupItemNaodeIdRef'
                inputPlaceholder={t(`${translationPath}cityfilter`)}
                selectedValues={selected.selectedCities || []}
                multiple={false}
                data={ServicesCity || []}
                displayLabel={(option) => option.lookupItemName || ''}
                withoutSearchButton
                isDisabled={desipeld.city}
                isWithError
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  setSearchTYPEfilter(true);
                  if (newValue === null) {
                    setServicesDistrict([]);
                    setSelected((item) => ({
                      ...item,
                      selectedCities: {
                        lookupItemId: '',
                        lookupItemName: ''
                      },
                      selectedDistrict: {
                        lookupItemId: '',
                        lookupItemName: ''
                      }
                    }));
                    setFilter((item) => ({ ...item, lookupItemId: tempidcity }));
                    setdesipeld((item) => ({ ...item, district: true }));
                    setSearchList((item) => ({
                      ...item, City: '', District: ''
                    }));
                  } else {
                    settempid((newValue && newValue.lookupItemId));
                    setFilter((item) => ({ ...item, lookupItemId: (newValue && newValue.lookupItemId) || tempidcity, }));
                    setSelected((item) => ({
                      ...item,
                      selectedDistrict: {
                        lookupItemId: '',
                        lookupItemName: ''
                      }
                    }));
                    lookupGetServices(District, ((newValue && newValue.lookupItemId) || null));
                    setSearchList((item) => ({ ...item, City: (newValue && newValue) || null }));
                    setSelected((item) => ({
                      ...item,
                      selectedCities: {
                        lookupItemId: (newValue && +newValue.lookupItemId) || '',
                        lookupItemName: (newValue && newValue.lookupItemName) || ''
                      }
                    }));
                    setdesipeld((item) => ({ ...item, district: false }));
                  }
                }}
              />
            </div>

            <div className='filter-item '>
              <AutocompleteComponent
                idRef='lfilterDistricteIdRef'
                inputPlaceholder={t(`${translationPath}filterDistrict`)}
                selectedValues={selected.selectedDistrict || []}
                multiple={false}
                data={(ServicesDistrict && ServicesDistrict) || []}
                displayLabel={(option) => option.lookupItemName || ''}
                withoutSearchButton
                isWithError
                isDisabled={desipeld.district}
                isLoading={loadings.paymentModes}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  setSearchTYPEfilter(true);
                  if (newValue === null) {
                    setFilter((item) => ({ ...item, lookupParentId: tempid, }));
                    setSelected((item) => ({
                      ...item,
                      selectedDistrict: {
                        lookupItemId: '',
                        lookupItemName: ''
                      }
                    }));
                    setSearchList((item) => ({
                      ...item, District: ''
                    }));
                  }
                  setFilter((item) => ({ ...item, lookupItemId: (newValue && newValue.lookupItemId) || tempid, }));
                  setSearchList((item) => ({ ...item, District: (newValue && newValue) || null }));
                  setSelected((item) => ({
                    ...item,
                    selectedDistrict: {
                      lookupItemId: (newValue && +newValue.lookupItemId) || '',
                      lookupItemName: (newValue && newValue.lookupItemName) || ''
                    }
                  }));
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
                  label: (`${translationPath}Communitie`),
                  input: 'lookupItemName',
                },
                {
                  id: 2,
                  isSortable: true,
                  input: 'parentLookupItemName',
                  label: (`${translationPath}District`),
                  component: (item) => (
                    <>
                      {((item &&
                        item.parentLookupItemName) || 'N/A')}

                    </>
                  )
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
                  isSortable: true,
                  input: 'createdOn',
                  label: t(`${translationPath}Created`),
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
          titleText={t(`${translationPath}add-new-Community`)}
          maxWidth='sm'
          dialogContent={(
            <>
              <CreteDialogdView
                onCancelClicked={() => setDialogOpen(false)}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                relode={() => getAllMyReferrals()}
                lookupTypesId={Community}
                labelValueis='Communitie-name'
                Type='District'
                autoData={SearchList}
              />
            </>
          )}
        />
      </div>
    </div>
  );
};
