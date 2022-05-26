import React from 'react';
import { UnitsOperationTypeEnum } from '../../../../../Enums';
import { GlobalTranslate } from '../../../../../Helper';

export const UnitsLeaseTableHeaderData = [
  {
    id: 1,
    label: 'name',
    input: 'name',
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
  },
  {
    id: 2,
    label: 'type',
    input: 'unitType',
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
  },
  {
    id: 4,
    label: 'creation',
    input: 'creationDate',
    fieldKey: 'createdOn',
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
    isDate: true,
  },
  {
    id: 5,
    label: 'progress',
    input: 'progressWithPercentage',
    textInputType: 'number',
    fieldKey: 'data_completed',
    textInputMax: 100,
    textInputMin: 0,
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
  },
  {
    id: 6,
    label: 'status',
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
    component: (item) => (
      <span>
        {(item.unit &&
          item.unit.operation_type &&
          item.unit.operation_type.lookupItemId &&
          item.unit.operation_type.lookupItemId === UnitsOperationTypeEnum.rent.key &&
          GlobalTranslate.t('Shared:actions-buttons.rent')) ||
          GlobalTranslate.t('Shared:actions-buttons.sale')}
      </span>
    ),
  },
  {
    id: 7,
    label: 'price',
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
    component: (item) => <span>{item.price}</span>,
  },
  {
    id: 8,
    label: 'id',
    fieldKey: 'unitId',
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
    component: (item) => <span>{item.id}</span>,
  },
  // {
  //   id: 9,
  //   label: 'lead-owner',
  //   fieldKey: 'owner',
  //   isDefaultFilterColumn: true,
  //   component: (item) => (
  //     <span>
  //       {(item.details && item.details.map((el) => el.title === 'lead-owner' && (el.value)))}

  //     </span>
  //   ),
  // },
  {
    id: 10,
    label: 'furnished',
    fieldKey: 'furnished',
    isDefaultFilterColumn: true,
    component: (item) => (
      <span>
        {(item.details && item.details.map((el) => el.title === 'furnished' && el.value)) || (
          <span />
        )}
      </span>
    ),
  },
  // {
  //   id: 11,
  //   label: 'listing-agent',
  //   fieldKey: 'listing_agent',
  //   isDefaultFilterColumn: true,
  //   component: (item) => (
  //     <span>
  //       {(item.details && item.details.map((el) => el.title === 'listing-agent' && el.value)) || (
  //         <span />
  //       )}
  //     </span>
  //   ),
  // },
];
