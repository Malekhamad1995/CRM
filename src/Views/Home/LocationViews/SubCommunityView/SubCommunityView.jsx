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
  GetSubCommunitiesLookups,
  lookupItemsGetId
} from '../../../../Services';
import {
  Cities, Country, District, Community, SubCommunity, UAECities
} from '../../../../assets/json/StaticLookupsIds.json';
import { CreteDialogdView } from '../LocationSharingUtilities';
import { ActiveItemActions } from '../../../../store/ActiveItem/ActiveItemActions';
import { LocationsPermissions, LookupsPermissions } from '../../../../Permissions';

const parentTranslationPath = 'LocationView';
const translationPath = '';
export const SubCommunityView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [sortBy, setSortBy] = useState(null);
  const dispatch = useDispatch();
  const searchTimer = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [Services, setServices] = useState({});
  const [ServicesCity, setServicesCity] = useState([]);
  const [loadings, setloadings] = useState(false);
  const [SearchTYPE, setSearchTYPEfilter] = useState(false);
  const [ServicesDistrict, setServicesDistrict] = useState([]);
  const [ServicesCommunity, setServicesCommunity] = useState([]);
  const [filter, setFilter] = useState({
    // lookupTypeName: ImagesGalleryFilterEnum.District.lookupType,
    lookupItemId: UAECities,
    pageIndex: 0,
    pageSize: 25,
    lookupParentId: null,
    search: '',
    filterBy: null,
    orderBy: null
  });

  const [selected, setSelected] = useState({
    selectedCountry: {
      lookupItemId: UAECities,
      lookupItemName: 'United Arab Emirates'
    },
    selectedCities: [],
    selectedCommunities: [],
    selectedDistrict: []
  });
  const [DetailsCountry, setDetailsCountry] = useState({
    result: [],
    totalCount: 0,
  });
  const [SearchList, setSearchList] = useState({
    Country: {
      lookupItemId: UAECities,
      lookupItemName: 'United Arab Emirates'
    },
    City: null,
    District: null,
    Community: null,
  });

  const [desipeld, setdesipeld] = useState({
    city: false,
    district: true,
    Communities: true,
  });

  const [TempCity, setTempCity] = useState(null);
  const [TempCommunities, setTempCommunities] = useState(null);
  const [TempDistrict, setTempDistrict] = useState(null);
  const [DialogOpen, setDialogOpen] = useState(false);
  useTitle(t(`${translationPath}Location`));
  const getAllMyReferrals = useCallback(async () => {
    setIsLoading(true);

    const res = SearchTYPE === false ?
      await GetlookupTypeItems({ ...filter, lookupTypeId: SubCommunity }) :
      await
        GetSubCommunitiesLookups({ ...filter, pageIndex: filter.pageIndex }); // lookupTypeName: ImagesGalleryFilterEnum.City.lookupType,

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

  const lookupGetServices = useCallback(async (TypeId, lookupParent) => {
    setloadings(true);
    const result = await lookupItemsGetId({
      lookupTypeId: TypeId,
      lookupParentId: lookupParent
    });
    setloadings(false);
    if (TypeId === Country) setServices(result);
    else if (TypeId === Cities) setServicesCity(result);
    else if (TypeId === District) setServicesDistrict(result);
    else setServicesCommunity(result);
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

  const tableActionClicked = useCallback((item) => {
    dispatch(ActiveItemActions.activeItemRequest(item));
    GlobalHistory.push(`/home/SubCommunitie/edit?id=${((item && item.lookupsId !== undefined) && item.lookupsId) || item.lookupItemId}&lookupItemName=${item.lookupItemName}`);
  });
  const ChangeClicked = () => {
    setDialogOpen(true);
  };
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
    <div className='my-leads-wrapper view-wrapper  SubCommunityView-wrapper'>
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
                    {t(`${translationPath}add-new-SubCommunity`)}
                  </span>
                </ButtonBase>
              </PermissionsComponent>
            </div>
            <div className='section autocomplete-section'>
              <div className='d-flex-column px-2 w-100 p-relative'>
                <div className='w-100 p-relative'>

                  <Inputs
                    idRef='CountrySearchRef'
                    label='filter-sub-Communitiet'
                    beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                    onInputChanged={(e) => {
                      setSearchTYPEfilter(false);
                      searchHandler(e.target.value);
                    }}
                    inputPlaceholder='search-sub-Communitie'
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
                multiple={false}
                data={Services}
                getOptionSelected={(option) => option.lookupItemId === selected.selectedCountry.lookupItemId}
                displayLabel={(option) => option.lookupItemName || ''}
                withoutSearchButton
                isWithError
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  setSearchTYPEfilter(true);
                  if (newValue === null) {
                    setServicesCity([]);
                    setServicesDistrict([]);
                    setServicesCommunity([]);
                    setSelected((item) => ({
                      ...item,
                      selectedCities: {
                        lookupItemId: '',
                        lookupItemName: ''
                      },
                      selectedCountry: {
                        lookupItemId: '',
                        lookupItemName: ''
                      },
                      selectedDistrict: {
                        lookupItemId: '',
                        lookupItemName: ''
                      },
                      selectedCommunities: {
                        lookupItemId: '',
                        lookupItemName: ''
                      }
                    }));
                    setdesipeld((item) => ({
                      ...item, district: true, Communities: true, city: true
                    }));
                    setSearchTYPEfilter(false);
                    setSearchList((item) => ({
                      ...item, Country: '', City: '', District: '', Community: ''
                    }));
                  } else {
                    setFilter((item) => ({ ...item, lookupItemId: (newValue && newValue.lookupItemId) }));
                    lookupGetServices(Cities, ((newValue && newValue.lookupItemId) || null));
                    setTempCity((newValue && newValue.lookupItemId));
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
                getOptionSelected={(option) => option.lookupItemId === selected.selectedCities.lookupItemId}
                withoutSearchButton
                isWithError
                isDisabled={desipeld.city}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  setSearchTYPEfilter(true);
                  if (newValue === null) {
                    setServicesDistrict([]);
                    setServicesCommunity([]);
                    setSelected((item) => ({
                      ...item,
                      selectedCities: {
                        lookupItemId: '',
                        lookupItemName: ''
                      },
                      selectedDistrict: {
                        lookupItemId: '',
                        lookupItemName: ''
                      },
                      selectedCommunities: {
                        lookupItemId: '',
                        lookupItemName: ''
                      }
                    }));
                    setdesipeld((item) => ({ ...item, district: true, Communities: true }));
                    setFilter((item) => ({ ...item, lookupItemId: TempCity }));
                    lookupGetServices(Cities, TempCity || null);
                    setSearchList((item) => ({
                      ...item, District: '', City: '', Community: ''
                    }));
                  } else {
                    setTempDistrict((newValue && newValue.lookupItemId));
                    setFilter((item) => ({ ...item, lookupItemId: (newValue && newValue.lookupItemId) }));
                    lookupGetServices(District, ((newValue && newValue.lookupItemId) || null));
                    setSearchList((item) => ({ ...item, City: (newValue && newValue) || null }));
                    setdesipeld((item) => ({ ...item, district: false }));
                    setSelected((item) => ({
                      ...item,
                      selectedCities: {
                        lookupItemId: (newValue && +newValue.lookupItemId) || '',
                        lookupItemName: (newValue && newValue.lookupItemName) || ''
                      }
                    }));
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
                data={ServicesDistrict || []}
                displayLabel={(option) => option.lookupItemName || ''}
                withoutSearchButton
                getOptionSelected={(option) => option.lookupItemId === selected.selectedDistrict.lookupItemId}
                isWithError
                isDisabled={desipeld.district}
                isLoading={loadings.paymentModes}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  setSearchTYPEfilter(true);
                  if (newValue === null) {
                    setServicesCommunity([]);
                    setSelected((item) => ({
                      ...item,
                      selectedDistrict: {
                        lookupItemId: '',
                        lookupItemName: ''
                      },
                      selectedCommunities: {
                        lookupItemId: '',
                        lookupItemName: ''
                      }
                    }));
                    setdesipeld((item) => ({ ...item, Communities: true }));
                    setFilter((item) => ({ ...item, lookupItemId: TempDistrict }));
                    lookupGetServices(District, TempDistrict || null);
                    setSearchList((item) => ({
                      ...item, Community: '', District: ''
                    }));
                  } else {
                    setFilter((item) => ({ ...item, lookupItemId: (newValue && newValue.lookupItemId) || null }));
                    lookupGetServices(Community, ((newValue && newValue.lookupItemId) || null));
                    setTempCommunities(newValue && newValue.lookupItemId);
                    setSearchList((item) => ({ ...item, District: (newValue && newValue) || null }));
                    setSelected((item) => ({
                      ...item,
                      selectedDistrict: {
                        lookupItemId: (newValue && +newValue.lookupItemId) || '',
                        lookupItemName: (newValue && newValue.lookupItemName) || ''
                      }
                    }));
                    setSelected((item) => ({
                      ...item,
                      selectedCommunities: {
                        lookupItemId: '',
                        lookupItemName: ''
                      }
                    }));
                    setdesipeld((item) => ({ ...item, Communities: false }));
                  }
                }}
              />
            </div>
            <div className='filter-item '>
              <AutocompleteComponent
                idRef='lfilterCommunitiesIdRef'
                inputPlaceholder={t(`${translationPath}filterCommunities`)}
                selectedValues={selected.selectedCommunities || []}
                multiple={false}
                data={ServicesCommunity || []}
                displayLabel={(option) => option.lookupItemName || ''}
                withoutSearchButton
                isWithError
                isDisabled={desipeld.Communities}
                isLoading={loadings.paymentModes}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onChange={(event, newValue) => {
                  setSearchTYPEfilter(true);
                  if (newValue === null) {
                    setFilter((item) => ({ ...item, lookupItemId: TempCommunities }));
                    lookupGetServices(Community, TempCommunities || null);
                    setSelected((item) => ({
                      ...item,
                      selectedCommunities: {
                        lookupItemId: '',
                        lookupItemName: ''
                      }
                    }));
                    setSearchList((item) => ({
                      ...item, Community: ''
                    }));
                  } else {
                    setFilter((item) => ({ ...item, lookupItemId: (newValue && newValue.lookupItemId) || null, }));
                    setSearchList((item) => ({ ...item, Community: (newValue && newValue) || null }));
                    setSelected((item) => ({
                      ...item,
                      selectedCommunities: {
                        lookupItemId: (newValue && +newValue.lookupItemId) || '',
                        lookupItemName: (newValue && newValue.lookupItemName) || ''
                      }
                    }));
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
                  label: (`${translationPath}SubCommunitie`),
                  input: 'lookupItemName',
                }, {

                  id: 2,
                  label: (`${translationPath}Communitie`),
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
      </div>
      <DialogComponent
        isOpen={DialogOpen}
        onCloseClicked={() => setDialogOpen(false)}
        titleText={t(`${translationPath}add-new-SubCommunity`)}
        maxWidth='sm'
        dialogContent={(
          <>
            <CreteDialogdView
              onCancelClicked={() => setDialogOpen(false)}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              relode={() => getAllMyReferrals()}
              lookupTypesId={SubCommunity}
              Type='Community'
              autoData={SearchList}
              labelValueis='SubCommunitie-name'
            />
          </>
        )}
      />
    </div>
  );
};
