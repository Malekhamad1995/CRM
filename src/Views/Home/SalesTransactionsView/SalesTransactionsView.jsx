import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import './SalesTransactionsView.scss';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  Inputs, Spinner, Tables, PermissionsComponent, AutocompleteComponent, SelectComponet
} from '../../../Components';
import { TableActions } from '../../../Enums';
import { GlobalHistory, returnPropsByPermissions } from '../../../Helper';
import {
  GetAllSaleTransactions, lookupItemsGet, getProperties, GetAllSaleAgentsServices
} from '../../../Services';
import { SalesTransactionsPermissions } from '../../../Permissions';
import { GlobalOrderFilterActions } from '../../../store/GlobalOrderFilter/GlobalOrderFilterActions';
import { ActiveItemActions } from '../../../store/ActiveItem/ActiveItemActions';

const parentTranslationPath = 'SalesTransactionsView';
const translationPath = '';

export const SalesTransactionsView = () => {
  const searchTimer = useRef(null);
  const { t } = useTranslation(parentTranslationPath);

  const [isLoading, setIsLoading] = useState({
    salesTransactions:false,
    properties:false,
    communitie: false,
    saleAgentsAPI:false
  });
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState(null);

  const [salesTransactions, setSalesTransactions] = useState({
    result: [],
    totalCount: 0,
  });
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const dispatch = useDispatch();
  const [selectedOrderBy, setSelectedOrderBy] = useState({
    filterBy: (orderFilter.salesTransactionsFilter && orderFilter.salesTransactionsFilter.filterBy) || null,
    orderBy: (orderFilter.salesTransactionsFilter && orderFilter.salesTransactionsFilter.orderBy) || null,
  });

  const [properties, setProperties] = useState({ result: [], totalCount: 0 });
  const [communities, setCommunities] = useState({ result: [], totalCount: 0 });
  const [saleAgents, setSaleAgents] = useState({ result: [], totalCount: 0 });

  const [orderBy, setOrderBy] = useState(selectedOrderBy.filterBy ? selectedOrderBy : { filterBy: null, orderBy: null });
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
    unitRefNumber: '',
    propertyId: null,
    communityId: null,
    buyerAgentId: null,
    sellerAgentId: null,
    tanentAgentId: null,
    landLordAgentId: null,
    orderBy: ((orderBy && orderBy.orderBy) || null),
    filterBy: ((orderBy && orderBy.filterBy) || null),

  });

  const tableActionClicked = useCallback(
    (actionEnum, item, focusedRow, event) => {
      event.stopPropagation();
      event.preventDefault();
      if (actionEnum === TableActions.openFile.key) {
        localStorage.setItem('saleTransactionDetailsId', (item.saleTransactionDetailsId));
        dispatch(ActiveItemActions.activeItemRequest(item));
        GlobalHistory.push(
          `/home/sales-transactions/transaction-profile?unitId=${item.unitId}&unitTransactionId=${item.unitTransactionId}`
        );
      }
    },
    []
  );
  const searchHandler = (search) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({ ...item, pageIndex: 0, unitRefNumber: search }));
    }, 700);
    setSearchInput(search);
  };
  const getAllSalesTransactions = useCallback(async () => {
    setIsLoading((loading)=>({...loading , salesTransactions: true}));
    const res = await GetAllSaleTransactions({ ...filter, pageIndex: filter.pageIndex + 1 });
    if (!(res && res.status && res.status !== 200)) {
      setSalesTransactions({
        result: (res && res.result) ,
        totalCount: (res && res.totalCount) ,
      });
    } else {
      setSalesTransactions({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading((loading)=>({...loading , salesTransactions: false}));
  }, [filter, orderBy]);
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex, search: searchInput }));
  };
  const onPageSizeChanged = (pageSize) => {
    setSearchInput('');
    setFilter((item) => ({
      ...item, pageIndex: 0, pageSize, search: ''
    }));
  };
  useEffect(() => {
    getAllSalesTransactions();
  }, [filter, getAllSalesTransactions]);
  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },[]);

  const GetAllowSalesTransactionDetails = (() => {
    if (returnPropsByPermissions(SalesTransactionsPermissions.ViewTransactionsDetails.permissionsId))
      return true;
    if (returnPropsByPermissions(SalesTransactionsPermissions.ViewContactDetails.permissionsId))
      return true;
    if (returnPropsByPermissions(SalesTransactionsPermissions.ViewReferenceDetails.permissionsId))
      return true;
    if (returnPropsByPermissions(SalesTransactionsPermissions.ViewEarning.permissionsId))
      return true;
    if (returnPropsByPermissions(SalesTransactionsPermissions.ViewInvoicesInSalesTransactions.permissionsId))
      return true;
    if (returnPropsByPermissions(SalesTransactionsPermissions.ViewChequeRequestDetails.permissionsId))
      return true;
    if (returnPropsByPermissions(SalesTransactionsPermissions.ViewDecumentInSalesTransactions.permissionsId))
      return true;
    return false;
  });
  const filterByChanged = (value) => {
    setSelectedOrderBy((item) => ({ ...item, filterBy: value }));
  };
  const orderByChanged = (value) => {
    setSelectedOrderBy((item) => ({ ...item, orderBy: value }));
  };
  const orderBySubmitted = (event) => {
    event.preventDefault();
    if (!selectedOrderBy.filterBy || !selectedOrderBy.orderBy) {
      if (orderBy.filterBy || orderBy.orderBy) setOrderBy({});
      return;
    }
    dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        salesTransactionsFilter: {
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

  const getAllProperties = useCallback(async (searchItem) => {
    setIsLoading((loading)=>({...loading , properties: true}));
    const res = await getProperties({ pageSize: 10, pageIndex: 0, search: searchItem || '' });
    if (!(res && res.status && res.status !== 200)) {
      setProperties({
        result: (res && res.result) ,
        totalCount: (res && res.totalCount) ,
      });
    } else {
      setProperties({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading((loading)=>({...loading , properties: false}));
  }, []);

  const getAllCommunitie = useCallback(async (searchItem) => {
    setIsLoading((loading)=>({...loading , communitie: true}));
    const res = await lookupItemsGet({
      pageIndex: 1,
      pageSize: 10,
      lookupTypeId: 19,
      lookupTypeName: 'community',
      searchedItem: searchItem || ''
    });

    if (!(res && res.status && res.status !== 200)) {
      setCommunities({
        result: (res && res.result) ,
        totalCount: (res && res.totalCount) ,
      });
    } else {
      setCommunities({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading((loading)=>({...loading , communitie: false}));
  }, []);

  const getAllSaleAgentsAPI = useCallback(async (searchItem) => {
    setIsLoading((loading)=>({...loading , saleAgentsAPI: true}));
    const res = await GetAllSaleAgentsServices({ pageSize: 10, pageIndex: 0, search: searchItem || '' });
    if (!(res && res.status && res.status !== 200)) {
      setSaleAgents({
        result: (res && res.result) ,
        totalCount: (res && res.totalCount) ,
      });
    } else {
      setSaleAgents({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading((loading)=>({...loading , saleAgentsAPI: false}));
  }, []);

  useEffect(() => {
    getAllCommunitie();
    getAllProperties();
    getAllSaleAgentsAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sortBy)
    setFilter((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);

  return (
    <div className='view-wrapper'>
      <Spinner isActive={isLoading.salesTransactions} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section' />
            <div className='section autocomplete-section'>
              <div className='d-flex-column px-2 w-100 p-relative'>
                <PermissionsComponent
                  permissionsList={Object.values(SalesTransactionsPermissions)}
                  permissionsId={SalesTransactionsPermissions.ViewAndSearchInMainAccountsSalesTransactionsPage.permissionsId}
                >
                  <div className='d-flex-column w-100'>
                    <Inputs
                      idRef='salesTransactionsSearchRef'
                      value={searchInput}
                      beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                      onInputChanged={(e) => {
                        searchHandler(e.target.value);
                      }}
                      inputPlaceholder={t(`${translationPath}seacrh_ref_No`)}
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                    />
                  </div>
                  <div className='d-inline-flex pl-5-reversed agentSection filterSalesTransactions'>
                    <div className='containerTwoAutoComplete'>
                      <div className='agentSection1'>
                        <AutocompleteComponent
                          idRef='propertyIdRef'
                          isLoading={isLoading.properties}
                          multiple={false}
                          data={(properties && properties.result) || []}
                          displayLabel={(option) => (option && option.property && (`${option.property.property_name}`)) || ''}
                          withoutSearchButton
                          inputPlaceholder={t(`${translationPath}property`)}
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          onChange={(event, newValue) => {
                            setFilter((item) => ({ ...item, propertyId: (newValue && newValue.propertyId) || null, pageIndex: 0 }));
                          }}
                          onInputKeyUp={(e) => {
                            const { value } = e.target;
                            if (searchTimer.current) clearTimeout(searchTimer.current);
                            searchTimer.current = setTimeout(() => {
                              getAllProperties(value);
                            }, 700);
                          }}
                        />

                      </div>
                      <div className='agentSection1'>
                        <AutocompleteComponent
                          idRef='communityRef'
                          multiple={false}
                          isLoading={isLoading.communitie}
                          data={communities && communities.result}
                          displayLabel={(option) => (option && option.lookupItemName) || ''}
                          withoutSearchButton
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          inputPlaceholder={t(`${translationPath}community`)}
                          onChange={(event, newValue) => {
                            setFilter((item) => ({ ...item, communityId: (newValue && newValue.lookupItemId) || null, pageIndex: 0 }));
                          }}
                          onInputKeyUp={(e) => {
                            const { value } = e.target;
                            if (searchTimer.current) clearTimeout(searchTimer.current);
                            searchTimer.current = setTimeout(() => {
                              getAllCommunitie(value);
                            }, 700);
                          }}
                        />
                      </div>
                    </div>
                    <div className='containerTwoAutoComplete'>
                      <div className='agentSection1'>
                        <AutocompleteComponent
                          idRef='buyerAgentIdRef'
                          multiple={false}
                          isLoading={isLoading.saleAgentsAPI}
                          withoutSearchButton
                          data={(saleAgents && saleAgents.result) || []}
                          chipsLabel={(option) => (option && option.agentName) || ''}
                          displayLabel={(option) => (option && option.agentName) || ''}
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          // withoutSearchButton
                          inputPlaceholder={t(`${translationPath}buyer-agent`)}
                          onChange={(event, newValue) => {
                            setFilter((item) => ({ ...item, buyerAgentId: (newValue && newValue.agentId) || null, pageIndex: 0 }));
                          }}
                          onInputKeyUp={(e) => {
                            const { value } = e.target;
                            if (searchTimer.current) clearTimeout(searchTimer.current);
                            searchTimer.current = setTimeout(() => {
                              getAllSaleAgentsAPI(value);
                            }, 700);
                          }}
                        />

                      </div>
                      <div className='agentSection1'>
                        <AutocompleteComponent
                          idRef='sellerAgentToRef'
                          multiple={false}
                          isLoading={isLoading.saleAgentsAPI}
                          inputPlaceholder={t(`${translationPath}seller-agent`)}
                          data={(saleAgents && saleAgents.result) || []}
                          chipsLabel={(option) => (option && option.agentName) || ''}
                          displayLabel={(option) => (option && option.agentName) || ''}
                          withoutSearchButton
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          onChange={(event, newValue) => {
                            setFilter((item) => ({ ...item, sellerAgentId: (newValue && newValue.agentId) || null, pageIndex: 0 }));
                          }}
                          onInputKeyUp={(e) => {
                            const { value } = e.target;
                            if (searchTimer.current) clearTimeout(searchTimer.current);
                            searchTimer.current = setTimeout(() => {
                              getAllSaleAgentsAPI(value);
                            }, 700);
                          }}
                        />

                      </div>
                    </div>

                  </div>

                </PermissionsComponent>
              </div>
            </div>
          </div>
          <PermissionsComponent
            permissionsList={Object.values(SalesTransactionsPermissions)}
            permissionsId={SalesTransactionsPermissions.ViewAndSearchInMainAccountsSalesTransactionsPage.permissionsId}
          >
            <div className='d-flex px-2'>
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
                      { id: 'TransactionEntryDate', filterBy: 'transaction-date' },
                    ]}
                    value={selectedOrderBy.filterBy}
                    wrapperClasses='mb-3'
                    isRequired
                    onSelectChanged={filterByChanged}
                    emptyItem={{
                      value: null,
                      text: 'select-filter-by',
                      isDisabled: false,
                    }}
                    valueInput='id'
                    textInput='filterBy'
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
                    emptyItem={{
                      value: null,
                      text: 'select-sort-by',
                      isDisabled: false,
                    }}
                    value={selectedOrderBy.orderBy}
                    onSelectChanged={orderByChanged}
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
                    <span>
                      {t(`${translationPath}apply`)}
                    </span>
                  </ButtonBase>
                </div>
              </span>
            </div>
          </PermissionsComponent>
        </div>

        <div className='w-100 px-3'>
          <PermissionsComponent
            permissionsList={Object.values(SalesTransactionsPermissions)}
            permissionsId={SalesTransactionsPermissions.ViewAndSearchInMainAccountsSalesTransactionsPage.permissionsId}
          >
            <Tables
              data={salesTransactions.result}
              headerData={[
                {
                  id: 1,
                  label: 'ref-no',
                  input: 'unitReferenceNo',
                },
                {
                  id: 2,
                  label: 'property',
                  input: 'propertyName',
                },
                {
                  id: 3,
                  label: 'community',
                  input: 'communityName',
                },
                {
                  id: 4,
                  label: 'unit-no',
                  input: 'unitNumber',
                },
                {
                  id: 5,
                  label: 'buyer',
                  component: (item) => (
                    <span>
                      {item.buyersNames &&
                        item.buyersNames.map((element, index) => (
                          <span key={`buyersNamesRef${index + 1}`}>
                            {`${element}${(index < item.buyersNames.length - 1 && ', ') || ''
                              }`}
                          </span>
                        ))}
                    </span>
                  ),
                },
                {
                  id: 6,
                  label: 'buyer-agent',
                  input: 'buyerAgent',
                },
                {
                  id: 7,
                  label: 'seller',
                  input: 'sellerName',
                },
                {
                  id: 8,
                  label: 'seller-agent',
                  input: 'sellerAgent',
                },
                {
                  id: 9,
                  isSortable: true,
                  label: 'selling-price',
                  input: 'sellingPrice',
                },
                {
                  id: 10,
                  isSortable: true,
                  label: 'transaction-date',
                  input: 'transactionEntryDate',
                  isDate: true,
                },
                {
                  id:11,
                  label:"transaction-id",
                  input:"unitTransactionId"
                }
              ]}
              defaultActions={GetAllowSalesTransactionDetails() ? [
                {
                  enum: TableActions.openFile.key,
                },
              ] : []}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              actionsOptions={{
                onActionClicked: tableActionClicked,
              }}
              itemsPerPage={filter.pageSize}
              activePage={filter.pageIndex}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              totalItems={salesTransactions.totalCount}
              setSortBy={setSortBy}
            />
          </PermissionsComponent>
        </div>
      </div>
    </div>
  );
};
