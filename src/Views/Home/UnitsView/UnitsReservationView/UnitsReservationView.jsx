import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import Joi from 'joi';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@material-ui/core';
import { UnitMapper } from '../UnitMapper';
import { ActionsEnum } from '../../../../Enums';
import {
  unitDetailsGet,
  // GetLatestSaleOrReservedSaleTransactionByUnitId,
  // GetLatestLeaseOrReservedLeaseTransactionByUnitId,
  GetReservedUnitTransactionDataForLeaseByUnitId,
  GetLastSaleTransByUnitId,
  GetReservedUnitTransactionDataForSaleByUnitId,
  GetLastLeaseTransByUnitId,
} from '../../../../Services';
import { Spinner, TabsComponent } from '../../../../Components';
import { CardDetailsComponent } from '../../ContactsView';
import { UnitTenantComponent } from './Sections/UnitTenantComponent';
import { UnitRemindersCoponent } from './Sections/UnitRemindersCoponent';
import { UnitInvoicePaymentDue } from './Sections/UnitInvoicePaymentDue';
import {
  GetParams,
  GlobalHistory,
  sideMenuComponentUpdate,
  showinfo,
} from '../../../../Helper';
import { UnitReservationTabsData } from '../../Common/OpenFileView/OpenFileUtilities/OpenFileData';
import {
  AgentInfoRentRelatedComponent,
  DetailsRentRelatedComponent,
} from '../UnitsStatusManagementView/Sections';

const parentTranslationPath = 'UnitsView';
const translationPath = '';

export const UnitsReservationView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const pathName = window.location.pathname
    .split('/home/')[1]
    .split('/view')[0]
    .split('/')[0];
  const [unitData, setUnitData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [unitTransactionId, setUnitTransactionId] = useState(null);
  // const [reservedData, setReservedData] = useState({});
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);
  const [selected, setSelected] = useReducer(reducer, {
    agent: null,
    referral: null,
    reservationType: null,
    transactedBy: null,
    externalAgency: null,
    rentFreePeriod: null,
    tableContacts: [],
    invoices: [],
    user: null,
    leasingType: null,
    periodOfStay: null,
  });
  const [state, setState] = useReducer(reducer, {});
  const schema = Joi.object()
    .options({
      abortEarly: false,
      allowUnknown: true,
    })
    .validate(state);
  const [activeTab, setActiveTab] = useState(0);
  const [filterBy] = useState({
    id: +GetParams('id'),
    formType: null,
  });
  const getReservedUnitTransactionDataByUnitId = useCallback(async () => {
    setIsLoading(true);
    const res =
      (pathName === 'units-lease' &&
        (await GetLastLeaseTransByUnitId(filterBy.id))) ||
      (await GetLastSaleTransByUnitId(filterBy.id));
    if (res && res.unitId) {
      setState({
        id: 'edit',
        value: (pathName === 'units-lease' && {
          ...res.leaseTransactionDetails,
          note: res.note,
          invoicesIds: res.invoicesIds,
          contacts: res.unitTransactionContacts,
        }) || {
          ...res.saleTransactionDetails,
          note: res.note,
          invoicesIds: res.invoicesIds,
          contacts: res.unitTransactionContacts,
        },
      });
    }
    setIsLoading(false);
  }, [filterBy.id, pathName]);
  const onStateChangedHandler = (newValue) => {
    setState(newValue);
  };
  const onSelectedChangedHandler = (newValue) => {
    setSelected(newValue);
  };

  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };

  useEffect(() => {
    setActiveTab(GetParams('matching') === 'true' ? 20 : 0);
  }, []);

  const detailedCardSideActionClicked = useCallback(
    (actionEnum, activeData) => async (event) => {
      event.stopPropagation();
      if (actionEnum === ActionsEnum.reportEdit.key) {
        GlobalHistory.push(
          `/home/units-sales/edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
        );
      } else if (actionEnum === ActionsEnum.folder.key) {
        GlobalHistory.push(
          `/home/units-sales/unit-profile-edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
        );
      }
    },
    []
  );

  // const getAllReservedSaleData = useCallback(async () => {
  //   setIsLoading(true);
  //   const res = await GetLatestSaleOrReservedSaleTransactionByUnitId(+GetParams('id'));
  //   setReservedData(res);
  //   setState(res);
  //   setIsLoading(false);
  // }, []);

  // const getAllReservedLeasedData = useCallback(async () => {
  //   setIsLoading(true);
  //   const res = await GetLatestLeaseOrReservedLeaseTransactionByUnitId(+GetParams('id'));
  //   setReservedData(res);
  //   setIsLoading(false);
  // }, []);

  // useEffect(() => {
  //   if (GetParams('id')) {
  //     if (pathName === 'units-lease') getAllReservedLeasedData();
  //     else getAllReservedSaleData();
  //   }
  // }, [getAllReservedLeasedData, getAllReservedSaleData, pathName]);

  const getUnitById = useCallback(async () => {
    const res = await unitDetailsGet({ id: +filterBy.id });
    if (!(res && res.status && res.status !== 200)) {
      const unitMap = UnitMapper(res);
      setUnitData(unitMap);
      setUnitTransactionId((res && res.unitTransactionId) || undefined);
    } else setUnitData(null);
  }, [filterBy.id]);
  useEffect(() => {
    if (unitData !== null) {
      sideMenuComponentUpdate(
        <CardDetailsComponent
          activeData={unitData}
          from={2}
          cardDetailsActionClicked={detailedCardSideActionClicked}
          parentTranslationPath='UnitsView'
          translationPath={translationPath}
        />
      );
    } else sideMenuComponentUpdate(null);
  }, [unitData, detailedCardSideActionClicked]);
  useEffect(() => {
    if (filterBy.id) getReservedUnitTransactionDataByUnitId();
  }, [filterBy.id, getReservedUnitTransactionDataByUnitId]);
  useEffect(() => {
    if (filterBy.id) getUnitById();
  }, [filterBy, getUnitById]);

  // useEffect(() => {
  //   const localUnitTransactionId = GetParams('unitTransactionId');
  //   if (localUnitTransactionId) setUnitTransactionId(+localUnitTransactionId);
  // }, []);
  const textArea = useRef(null);

  const copyTextToClipboard = (itemId) => {
    const context = textArea.current;
    if (itemId && context) {
      context.value = itemId;
      context.select();
      document.execCommand('copy');
      showinfo(`${t('Shared:Copy-id-successfully')}  (${itemId})`);
    } else
      showinfo(`${t('Shared:Copy-id-successfully')}  (${itemId})`);
  };

  return (
    <div className='units-profile-wrapper view-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='unitTransactionId'>
        <span>
          {t(`${translationPath}transaction-id`)}
          {' '}
          {unitTransactionId}
        </span>
        <textarea
          className='textArea-id'
          readOnly
          aria-disabled
          value={unitTransactionId}
          ref={textArea}
        />

        <Tooltip title={t(`${translationPath}copy`)} placement='top'>
          <span
            className='mdi mdi-content-copy'
            id='copyIcon'
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              copyTextToClipboard(unitTransactionId);
            }}
          />
        </Tooltip>
      </div>
      <TabsComponent
        data={
          pathName === 'units-sales' ?
            UnitReservationTabsData.sale :
            UnitReservationTabsData.rent
        }
        labelInput='label'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-solid'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
        dynamicComponentProps={{
          unitId: filterBy.id,
          state,
          selected,
          schema,
          onStateChanged: onStateChangedHandler,
          onSelectedChanged: onSelectedChangedHandler,
          unitTransactionId,
          parentTranslationPath,
          translationPath,
        }}
      />
      {pathName !== 'units-sales' && (
        <div className='tabs-content-wrapper'>
          {activeTab === 0 && (
            <UnitTenantComponent
              unitId={filterBy.id}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {activeTab === 1 && (
            <DetailsRentRelatedComponent
              schema
              isReadOnly
              isSubmitted
              // state={state}
              unitData={unitData}
              selected={selected}
              translationPath={translationPath}
              onStateChanged={onStateChangedHandler}
              onSelectedChanged={onSelectedChangedHandler}
              parentTranslationPath={parentTranslationPath}
              unitTransactionId={unitTransactionId}
            />
          )}
          {activeTab === 2 && (
            <UnitInvoicePaymentDue
              unitTransactionId={unitTransactionId}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {activeTab === 3 && (
            <AgentInfoRentRelatedComponent
              state={state}
              selected={selected}
              schema={schema}
              unitTransactionId={unitTransactionId}
              onStateChanged={onStateChangedHandler}
              onSelectedChanged={onSelectedChangedHandler}
              isReadOnly
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {activeTab === 4 && (
            <UnitRemindersCoponent
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
        </div>
      )}
    </div>
  );
};
