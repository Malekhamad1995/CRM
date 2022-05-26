import React, {
  useCallback, useEffect, useRef, useState, useReducer
} from 'react';
import { ButtonBase } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Inputs, Spinner, PermissionsComponent, SelectComponet
} from '../../../Components';
import { InvoiceViewTable } from './InvoicesViewUtilities';
import { useTitle } from '../../../Hooks';
import { GetInvoices } from '../../../Services';
import { InvoicesManagementDialog } from './InvoicesViewUtilities/Dialogs/InvoicesManagementDialog';
import { InvoicesPermissions } from '../../../Permissions/Accounts/Invoices.Permissions';
import { GlobalOrderFilterActions } from '../../../store/GlobalOrderFilter/GlobalOrderFilterActions';

const parentTranslationPath = 'InvoicesView';
const translationPath = '';
export const InvoicesView = () => {
  const [totalAmountPaid, setTotalAmountPaid] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const { t } = useTranslation(parentTranslationPath);
  const searchTimer = useRef(null);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const defaultState = {
    bankId: null,
    branch: null,
    remarks: null,
    draftNo: null,
    chequeNo: null,
    netAmount: null,
    invoicesIds: [],
    bondDetails: null,
    creditCardNo: null,
    paymentModeId: null,
    bankTransferNo: null,
    receiptContactTypeId: null,
    date: '2021-03-07T12:01:27.369Z',
  };
  const [state, setState] = useReducer(reducer, defaultState);
  const defaultSelected = {
    bankId: null,
    invoicesIds: [],
    paymentModeId: null,
    receiptContactTypeId: null,
  };
  const onStateChanged = (valueId, newValue) => {
    setState({ id: valueId, value: newValue });
  };
  const totalAmount = totalAmountPaid.reduce((a, b) => a + b, 0);
  useEffect(() => {
    onStateChanged('netAmount', totalAmount);
  }, [totalAmount, state.invoicesIds]);
  const [selected, setSelected] = useReducer(reducer, defaultSelected);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const orderFilter = useSelector((select) => select.GlobalOrderFilterReducer);
  const dispatch = useDispatch();
  const [selectedOrderBy, setSelectedOrderBy] = useState({
    filterBy: (orderFilter.invoicesFilter && orderFilter.invoicesFilter.filterBy) || null,
    orderBy: (orderFilter.invoicesFilter && orderFilter.invoicesFilter.orderBy) || null,
  });
  const [orderBy, setOrderBy] = useState(selectedOrderBy.filterBy ? selectedOrderBy : { filterBy: null, orderBy: null });

  const [filter, setFilter] = useState({
    pageIndex: 0,
    pageSize: 25,
    search: '',
    orderBy: ((orderBy && orderBy.orderBy) || null),
    filterBy: ((orderBy && orderBy.filterBy) || null),
  });

  const onFilterChange = (value) => {
    setFilter(value);
  };
  const [invoices, setInvoices] = useState({
    result: [],
    totalCount: 0,
  });
  useTitle(t(`${translationPath}invoices`));
  const searchHandler = (value) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilter((item) => ({ ...item, pageIndex: 0, search: value }));
    }, 700);
  };

  const getAllInvoices = useCallback(async () => {
    setIsLoading(true);

      const res = await GetInvoices(filter);
    if (!(res && res.status && res.status !== 200)) {
      setInvoices({
        result: (res && res.result) || [],
        totalCount: (res && res.totalCount) || 0,
      });
    } else {
      setInvoices({
        result: [],
        totalCount: 0,
      });
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, orderBy]);
  useEffect(() => {
    getAllInvoices();
  }, [filter, getAllInvoices]);

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    []
  );

  const onSelectedChanged = (valueId, newValue) => {
    setSelected({ id: valueId, value: newValue });
  };
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

      setSortBy({
      filterBy: selectedOrderBy.filterBy,
      orderBy: selectedOrderBy.orderBy,
    });

    dispatch(
      GlobalOrderFilterActions.globalOrderFilterRequest({
        ...orderFilter,
        invoicesFilter: {
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

  useEffect(() => {
      if (sortBy)
    setFilter((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);

  return (
    <div className='px-3 view-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section'>
            <div className='section'>
              <PermissionsComponent
                permissionsList={Object.values(InvoicesPermissions)}
                permissionsId={InvoicesPermissions.AddNewReceipt.permissionsId}
              >
                <ButtonBase className='btns theme-solid px-3' onClick={() => setOpenDialog(true)}>
                  <span className='mdi mdi-plus' />
                  {t(`${translationPath}add-new-receipt`)}
                </ButtonBase>
              </PermissionsComponent>

            </div>
            <div className='section autocomplete-section'>
              <div className='d-flex-column px-2 w-100 p-relative'>
                <PermissionsComponent
                  permissionsList={Object.values(InvoicesPermissions)}
                  permissionsId={InvoicesPermissions.ViewAndSearchInMainAccountsInvoicesPage.permissionsId}
                >
                  <div className='d-flex-column w-100'>
                    <Inputs
                      idRef='invoicesSearchRef'
                      label='filter'
                      beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
                      onInputChanged={(e) => searchHandler(e.target.value)}
                      inputPlaceholder='search-invoices'
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                    />
                  </div>
                </PermissionsComponent>
              </div>
            </div>
          </div>
          <PermissionsComponent
            permissionsList={Object.values(InvoicesPermissions)}
            permissionsId={InvoicesPermissions.ViewAndSearchInMainAccountsInvoicesPage.permissionsId}
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
                      { id: 'DueOn', filterBy: 'transaction-date' },
                    ]}
                    /* data={[
                       { id: 'transaction-date', filterBy: 'transaction-date' },
                     ]} */
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
            permissionsList={Object.values(InvoicesPermissions)}
            permissionsId={InvoicesPermissions.ViewAndSearchInMainAccountsInvoicesPage.permissionsId}
          >
            <InvoiceViewTable
              t={t}
              state={state}
              filter={filter}
              selected={selected}
              invoices={invoices}
              setOpenDialog={setOpenDialog}
              onStateChanged={onStateChanged}
              onFilterChange={onFilterChange}
              totalAmountPaid={totalAmountPaid}
              translationPath={translationPath}
              onSelectedChanged={onSelectedChanged}
              setTotalAmountPaid={setTotalAmountPaid}
              setState={setState}
              setSelected={setSelected}
              defaultState={defaultState}
              defaultSelected={defaultSelected}
              setSortBy={setSortBy}
             // isWithCheckboxColumn

            />
          </PermissionsComponent>
        </div>

      </div>
      {openDialog && (
        <InvoicesManagementDialog
          state={state}
          open={openDialog}
          selected={selected}
          onSave={() => {
            setOpenDialog(false);
            setState({ id: 'edit', value: defaultState });
            setSelected({ id: 'edit', value: defaultSelected });
            setTotalAmountPaid([]);
          }}
          close={() => {
            setOpenDialog(false);
            setState({ id: 'edit', value: defaultState });
            setSelected({ id: 'edit', value: defaultSelected });
            setTotalAmountPaid([]);
          }}
          onStateChanged={onStateChanged}
          translationPath={translationPath}
          onSelectedChanged={onSelectedChanged}
          setTotalAmountPaid={setTotalAmountPaid}
          parentTranslationPath={parentTranslationPath}
        />
      )}

    </div>
  );
};
