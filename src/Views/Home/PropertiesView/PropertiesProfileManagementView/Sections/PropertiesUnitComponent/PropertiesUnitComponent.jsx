import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Spinner,
  Tables
} from '../../../../../../Components';
import { TableActions } from '../../../../../../Enums';
import { GetParams, GlobalHistory } from '../../../../../../Helper';
import { GetAllUnitsByPropertyId } from '../../../../../../Services';
import { ActiveItemActions } from '../../../../../../store/ActiveItem/ActiveItemActions';

const translationPath = '';
const parentTranslationPath = '';

export const PropertiesUnitComponent = () => {
  const { t } = useTranslation(parentTranslationPath);
  const pathName = window.location.pathname
    .split('/home/')[1]
    .split('/view')[0];
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [sortBy, setSortBy] = useState(null);

  const [filter, setFilter] = useState({
    pageSize: 25,
    pageIndex: 0,
    orderBy: 1,
    filterBy: 'UnitId'
  });

  const GetAllUnitsByPropertyIdAPI = useCallback(async () => {
    setIsLoading(true);

    const result = await GetAllUnitsByPropertyId({
 propertyId: +GetParams('id'), pageIndex: filter.pageIndex, pageSize: filter.pageSize, orderBy: filter.orderBy, filterBy: filter.filterBy
});
    if (!(result && result.status && result.status !== 200))
      setResponse(result);
    else setResponse({});

    setIsLoading(false);
  }, [filter]);

  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const dispatch = useDispatch();

  const tableActionClicked = useCallback(
    (actionEnum, item) => {
      dispatch(ActiveItemActions.activeItemSuccess(item));
      if (actionEnum === TableActions.openFile.key) {
 GlobalHistory.push(
          `/home/units-sales/unit-profile-edit?formType=${
            item && item.unit && item.unit.unit_type_id
          }&id=${item.unitId}`
        );
}
    },

    [dispatch, pathName]
  );

  useEffect(() => {
    GetAllUnitsByPropertyIdAPI();
  }, [GetAllUnitsByPropertyIdAPI]);

  useEffect(() => {
    if (sortBy)
    setFilter((item) => ({ ...item, filterBy: sortBy.filterBy, orderBy: sortBy.orderBy }));
  }, [sortBy]);
  return (
    <div className='associated-Properties-wrapper childs-wrapper'>
      <Spinner isActive={isLoading} />
      <div className='title-section'>Units</div>
      <div className='d-flex-column'>
        <div className='header-section'>
          <div className='filter-section px-2'>
            <div className='section px-2' />
          </div>
        </div>
      </div>
      <div className='w-100 px-3'>
        <Tables
          data={response ? response.result : []}
          headerData={[
              {
                id: 1,
                isSortable: true,
                label: 'Unit Id',
                input: 'UnitId',
                component: (item) => (item.unitId && item.unitId) || <span />,
              },
              {
                id: 2,
                isSortable: true,
                label: 'Unit Type',
                input: 'UnitType',
                component: (item) => item.unitType && (
                <span>
                  {' '}
                  {item.unitType}
                </span>
                  ),
              },
              {
                id: 3,
                isSortable: true,
                label: 'Operation Type',
                input: 'OperationType',
                component: (item) =>
                item && item.operationType && (
                <span>
                  {' '}
                  {item.operationType}
                </span>
                  ),
              },

              {
                id: 4,
                isSortable: true,
                label: 'Owner Name',
                input: 'UnitOwner',
                component: (item) => item && item.unitOwner && (
                <span>
                  {' '}
                  {item.unitOwner}
                </span>
                  ),
              },
              {
                id: 5,
                isSortable: true,
                label: 'Unit Reference no',
                input: 'UnitReferenceNo',
                component: (item) =>
                item && item.unitRefNo && (
                <span>
                  {' '}
                  {item.unitRefNo}
                </span>
                  ),
              },
              {
                id: 6,
                isSortable: true,
                label: 'listing Agent',
                input: 'ListingAgent',
                component: (item) =>
                item && item.listingAgent && (
                <span>
                  {' '}
                  {item.listingAgent}
                </span>
                  ),
              },
              {
                id: 7,
                label: 'Rent Listing Agent',
                input: 'rentListingAgent',
                component: (item) =>
                item && item.rentListingAgent && (
                <span>
                  {' '}
                  {item.rentListingAgent}
                </span>
                  ),
              },
            ]}
          defaultActions={[
              {
                enum: TableActions.openFile.key,
              },
            ]}
          actionsOptions={{
              onActionClicked: tableActionClicked,
            }}
          setSortBy={setSortBy}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
          itemsPerPage={filter.pageSize}
          activePage={filter.pageIndex}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          totalItems={(response && response.totalCount) || 0}
        />
      </div>
    </div>
  );
};
