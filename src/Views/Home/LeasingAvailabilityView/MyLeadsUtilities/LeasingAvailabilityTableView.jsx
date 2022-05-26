import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Tables } from '../../../../Components';
import { TableActions } from '../../../../Enums';
import { UntInquiryDialog, VirtualTourDilaog } from '../../SalesAvailabilityView/MyLeadsUtilities';

export const LeasingAvailabilityTableView = ({
  filter,
  myLeads,
  setFilter,
  translationPath,
  parentTranslationPath,
}) => {
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const tableActionClicked = useCallback((actionEnum, item, focusedRow, event) => {
    event.stopPropagation();
    event.preventDefault();
    if (actionEnum === TableActions.virtualTour.key && item.virtualTour) {
      setActiveItem(item);
      setIsVirtualTourOpen(true);
    }
    if (actionEnum === TableActions.addPrimary.key) {
      setActiveItem(item);
      setIsDialogOpen(true);
    }
  }, []);
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  return (
    <div className='w-100 px-3'>
      <Tables
        data={myLeads.result}
        headerData={[
          {
            id: 1,
            isSortable: true,
            label: 'unit-ref-number',
            input: 'refNo',
          },
          {
            id: 3,
            isSortable: true,
            label: 'property-name',
            input: 'unitName',
          },
          {
            id: 4,
            isSortable: true,
            label: 'community',
            input: 'availableCommunity',
          },
          {
            id: 5,
            isSortable: true,
            label: 'city',
            input: 'availableCity',
          },
          {
            id: 6,
            isSortable: true,
            label: 'unit-type',
            input: 'unitType',
          },
          {
            id: 7,
            isSortable: true,
            label: 'unit-model',
            input: 'unitModel',
          },
          {
            id: 8,
            isSortable: true,
            label: 'br',
            input: 'unitBedrooms',
          },
          {
            id: 9,
            isSortable: true,
            label: 'primary-view',
            input: 'primaryView',
          },
          {
            id: 10,
            isSortable: true,
            label: 'anuual-rent',
            input: 'rentPerYear',
          },
          {
            id: 11,
            isSortable: true,
            label: 'listing-price-rating',
            component: (item) => <span>{(item.rating && item.rating) || 'N/A'}</span>,
          },
          {
            id: 12,
            isSortable: true,
            label: 'listing-agent',
            input: 'listingAgent',
          },
          {
            id: 13,
            isSortable: true,
            label: 'plot-area',
            input: 'plotArea',
          },
          {
            id: 14,
            isSortable: true,
            label: 'built-up-area',
            input: 'builtupArea',
          },
          {
            id: 15,
            isSortable: true,
            label: 'service-charge',
            input: 'servicesCharge',
          },
        ]}
        defaultActions={[
          {
            enum: TableActions.addPrimary.key,
          },
          {
            enum: TableActions.virtualTour.key,
          },
        ]}
        actionsOptions={{
          onActionClicked: tableActionClicked,
        }}
        activePage={filter.pageIndex}
        itemsPerPage={filter.pageSize}
        totalItems={myLeads.totalCount}
        translationPath={translationPath}
        onPageSizeChanged={onPageSizeChanged}
        onPageIndexChanged={onPageIndexChanged}
        parentTranslationPath={parentTranslationPath}
      />
      {isVirtualTourOpen && (
        <VirtualTourDilaog
          isOpen={isVirtualTourOpen}
          activeItem={activeItem}
          reloadData={() => {
            setActiveItem(null);
            setIsVirtualTourOpen(false);
          }}
          isOpenChanged={() => {
            setActiveItem(null);
            setIsVirtualTourOpen(false);
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {isDialogOpen && (
        <UntInquiryDialog
          isOpen={isDialogOpen}
          activeItem={activeItem}
          reloadData={() => {
            setIsDialogOpen(false);
          }}
          isOpenChanged={() => {
            setIsDialogOpen(false);
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};
LeasingAvailabilityTableView.propTypes = {
  setFilter: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  filter: PropTypes.instanceOf(Object).isRequired,
  myLeads: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
