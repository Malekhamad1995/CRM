import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import './LeasingTransactionsView.scss';
import moment from 'moment';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  Inputs, Spinner, Tables, PermissionsComponent, AutocompleteComponent, SelectComponet
} from '../../../Components';
import { TableActions } from '../../../Enums';
import { GlobalHistory, returnPropsByPermissions, preventCopy } from '../../../Helper';
import {
  GetAllLeaseTransactions, lookupItemsGet, getProperties, GetAllLeaseAgentsServices
} from '../../../Services';
import { LeasingTransactionsPermissions } from '../../../Permissions';
import { GlobalOrderFilterActions } from '../../../store/GlobalOrderFilter/GlobalOrderFilterActions';
import { ActiveItemActions } from '../../../store/ActiveItem/ActiveItemActions';

const parentTranslationPath = 'LeasingTransactionsView';
const translationPath = '';
export const LeasingTransactions = () => {
  const { t } = useTranslation(parentTranslationPath);
  const searchTimer = useRef(null);
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState({
    leasingTransactions: false,
    properties: false,
    communitie: false,
    leaseAgents: false
  });
  const [properties, setProperties] = useState({ result: [], totalCount: 0 });
  const [communities, setCommunities] = useState({ result: [], totalCount: 0 });
  const [leaseAgents, setLeaseAgents] = useState({ result: [], totalCount: 0 });

  const [leasingTransactions, setLeasingTransactions] = useState({
    result: [],
    totalCount: 0,
  });
  const orderFilter = useSelector((state) => state.GlobalOrderFilterReducer);
  const dispatch = useDispatch();
  const [selectedOrderBy, setSelectedOrderBy] = useState({
    filterBy: (orderFilter.leasingTransactionsFilter && orderFilter.leasingTransactionsFilter.filterBy) || null,
    orderBy: (orderFilter.leasingTransactionsFilter && orderFilter.leasingTransactionsFilter.orderBy) || null,
  });
  const [sortBy, setSortBy] = useState(null);

  const [orderBy, setOrderBy] = useState(selectedOrderBy.filterBy ? selectedOrderBy : { filterBy: null, orderBy: null });
  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
    unitRefNumber: '',
    propertyId: null,
    communityId: null,
    tanentAgentId: null,
    landLordAgentId: null,
    buyerAgentId: null,
    sellerAgentId: null,
    orderBy: ((orderBy && orderBy.orderBy) || null),
    filterBy: ((orderBy && orderBy.filterBy) || null),

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
        leasingTransactionsFilter: {
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

  const tableActionClicked = useCallback(
    (actionEnum, item, focusedRow, event) => {
      event.stopPropagation();
      event.preventDefault();
      localStorage.setItem('leaseTransactionDetailsId', item.leaseTransactionDetailsId);
      if (actionEnum === TableActions.openFile.key) {
        dispatch(ActiveItemActions.activeItemRequest(item));
        GlobalHistory.push(
          `/home/leasing-transactions/transaction-profile?unitId=${item.unitId}&unitTransactionId=${item.unitTransactionId}`
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
  const getAllLeasingTransactions = useCallback(async () => {
    setIsLoading((loading) => ({ ...loading, leasingTransactions: true }));
    const res = await GetAllLeaseTransactions({ ...filter, pageIndex: filter.pageIndex + 1 });
    if (!(res && res.status && res.status !== 200)) {
      setLeasingTransactions({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setLeasingTransactions({
        result: [],
        totalCount: 0,
      });
    }

    setIsLoading((loading) => ({ ...loading, leasingTransactions: false }));
  }, [filter, orderBy]);
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex, search: searchInput }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({
      ...item,
      pageIndex: 0,
      pageSize,
      search: '',
    }));
    setSearchInput('');
  };
  useEffect(() => {
    getAllLeasingTransactions();
  }, [filter, getAllLeasingTransactions]);

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );
  const GetAllow = (() => {
    if (returnPropsByPermissions(LeasingTransactionsPermissions.ViewContactDetails.permissionsId))
      return true;
    if (returnPropsByPermissions(LeasingTransactionsPermissions.ViewChequeRequestDetails.permissionsId))
      return true;
    if (returnPropsByPermissions(LeasingTransactionsPermissions.ViewInvoicesInSalesTransactions.permissionsId))
      return true;
    if (returnPropsByPermissions(LeasingTransactionsPermissions.ViewTransactionsDetails.permissionsId))
      return true;
    if (returnPropsByPermissions(LeasingTransactionsPermissions.ViewEarning.permissionsId))
      return true;
    if (returnPropsByPermissions(LeasingTransactionsPermissions.ViewReferenceDetails.permissionsId))
      return true;
    return false;
  });

  const getAllProperties = useCallback(async (searchItem) => {
    setIsLoading((loading) => ({ ...loading, properties: true }));
    const res = await getProperties({ pageSize: 10, pageIndex: 0, search: searchItem || '' });
    if (!(res && res.status && res.status !== 200)) {
      setProperties({
        result: (res && res.result),
        totalCount: (res && res.totalCount),
      });
    } else {
      setProperties({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading((loading) => ({ ...loading, properties: false }));
  }, []);

  const getAllCommunitie = useCallback(async (searchItem) => {
    setIsLoading((loading) => ({ ...loading, communitie: true }));
    const res = await lookupItemsGet({
      pageIndex: 1,
      pageSize: 10,
      lookupTypeId: 19,
      lookupTypeName: 'community',
      searchedItem: searchItem || ''
    });

    if (!(res && res.status && res.status !== 200)) {
      setCommunities({
        result: (res && res.result),
        totalCount: (res && res.totalCount),
      });
    } else {
      setCommunities({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading((loading) => ({ ...loading, communitie: false }));
  }, []);

  const getAllLeaseAgents = useCallback(async (searchItem) => {
    setIsLoading((loading) => ({ ...loading, leaseAgents: true }));
    const res = await GetAllLeaseAgentsServices({ pageSize: 10, pageIndex: 0, search: searchItem || '' });
    if (!(res && res.status && res.status !== 200)) {
      setLeaseAgents({
        result: (res && res.result),
        totalCount: (res && res.totalCount),
      });
    } else {
      setLeaseAgents({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading((loading) => ({ ...loading, leaseAgents: false }));
  }, []);
  useEffect(() => {
    getAllCommunitie();
    getAllProperties();
    getAllLeaseAgents();
  }, []);

  useEffect(() => {
    if (sortBy)
    setFilter((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);

  return (
    <div className='view-wrapper'>
      <Spinner isActive={isLoading.leasingTransactions} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section' />
            <div className='section autocomplete-section'>
              <div className='d-flex-column px-2 w-100 p-relative'>
                <PermissionsComponent
                  permissionsList={Object.values(LeasingTransactionsPermissions)}
                  permissionsId={LeasingTransactionsPermissions.ViewAndSearchInMainAccountsLeaseTransactionsPage.permissionsId}
                >
                  <div className='d-flex-column w-100'>
                    <Inputs
                      idRef='leasingTransactionsSearchRef'
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
                  <div className='d-inline-flex pl-5-reversed agentSection filterLeasingTransaction'>
                    <div className='twoFieldsOfFilter'>
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
                          isLoading={isLoading.communitie}
                          multiple={false}
                          data={(communities && communities.result) || []}
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
                    <div className='twoFieldsOfFilter'>
                      <div className='agentSection1'>
                        <AutocompleteComponent
                          idRef='tenantAgentIdRef'
                          isLoading={isLoading.leaseAgents}
                          multiple={false}
                          inputPlaceholder={t(`${translationPath}tenantAgent`)}
                          data={(leaseAgents && leaseAgents.result) || []}
                          chipsLabel={(option) => (option && option.agentName) || ''}
                          displayLabel={(option) => (option && option.agentName) || ''}
                          withoutSearchButton
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          onChange={(event, newValue) => {
                            setFilter((item) => ({ ...item, tanentAgentId: (newValue && newValue.agentId) || null, pageIndex: 0 }));
                          }}
                          onInputKeyUp={(e) => {
                            const { value } = e.target;
                            if (searchTimer.current) clearTimeout(searchTimer.current);
                            searchTimer.current = setTimeout(() => {
                              getAllLeaseAgents(value);
                            }, 700);
                          }}
                        />

                      </div>
                      <div className='agentSection1'>
                        <AutocompleteComponent
                          idRef='landLordAgentRef'
                          isLoading={isLoading.leaseAgents}
                          multiple={false}
                          inputPlaceholder={t(`${translationPath}landLordAgent`)}
                          data={(leaseAgents && leaseAgents.result) || []}
                          chipsLabel={(option) => (option && option.agentName) || ''}
                          displayLabel={(option) => (option && option.agentName) || ''}
                          withoutSearchButton
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          onChange={(event, newValue) => {
                            setFilter((item) => ({ ...item, landLordAgentId: (newValue && newValue.agentId) || null, pageIndex: 0 }));
                          }}
                          onInputKeyUp={(e) => {
                            const { value } = e.target;
                            if (searchTimer.current) clearTimeout(searchTimer.current);
                            searchTimer.current = setTimeout(() => {
                              getAllLeaseAgents(value);
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
            permissionsList={Object.values(LeasingTransactionsPermissions)}
            permissionsId={LeasingTransactionsPermissions.ViewAndSearchInMainAccountsLeaseTransactionsPage.permissionsId}
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

        <div className='w-100 px-3' onCopy={preventCopy}>
          <PermissionsComponent
            permissionsList={Object.values(LeasingTransactionsPermissions)}
            permissionsId={LeasingTransactionsPermissions.ViewAndSearchInMainAccountsLeaseTransactionsPage.permissionsId}
          >
            <Tables
              data={leasingTransactions.result}
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
                  label: 'tenant',
                  component: (item) => (
                    <span>
                      {item.tenantNames &&
                        item.tenantNames.map((element, index) => (
                          <span key={`tenantNamesRef${index + 1}`}>
                            {`${element}${(index < item.tenantNames.length - 1 && ', ') || ''
                              }`}
                          </span>
                        ))}
                    </span>
                  ),
                },
                {
                  id: 6,
                  label: 'tenant-agent',
                  input: 'tenantAgent',
                },
                {
                  id: 7,
                  label: 'landlord',
                  input: 'landlordName',
                },
                {
                  id: 8,
                  label: 'landlord-agent',
                  input: 'landlordAgent',
                },
                {
                  id: 9,
                  isSortable: true,
                  label: 'rent/year',
                  input: 'rentPerYear',
                },
                {
                  id: 10,
                  label: 'contract-start-and-end-date',
                  component: (item) =>
                    ((item.startDate || item.endDate) && (
                      <>
                        <span>
                          {(item.startDate &&
                            moment(item.startDate).format('DD-MMM-YYYY')) ||
                            'N/A'}
                        </span>
                        <span className='px-1'>-</span>
                        <span>
                          {(item.endDate &&
                            moment(item.endDate).format('DD-MMM-YYYY')) ||
                            'N/A'}
                        </span>
                      </>
                    )) || <span />,
                },
                {
                  id: 11,
                  isSortable: true,
                  label: 'contract-rent',
                  input: 'contractRent',
                },
                {
                  id: 12,
                  isSortable: true,
                  label: 'transaction-date',
                  input: 'transactionEntryDate',
                  isDate: true,
                },
                {
                  id: 12,
                  isSortable: true,
                  label: 'Transaction ID',
                  input: 'unitTransactionId',
                },
              ]}
              defaultActions={
                GetAllow() ?
                  [{
                    enum: TableActions.openFile.key,
                  }] : [

                  ]
              }
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              actionsOptions={{
                onActionClicked: tableActionClicked,
              }}
              itemsPerPage={filter.pageSize}
              activePage={filter.pageIndex}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              totalItems={leasingTransactions.totalCount}
              setSortBy={setSortBy}
            />
          </PermissionsComponent>
        </div>

      </div>

    </div>
  );
};
