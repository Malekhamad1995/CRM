import React from 'react';

export const PropertiesTableHeaderData = [
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
    input: 'propertyType',
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
  },
  {
    id: 4,
    label: 'created',
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
    isDefaultFilterColumn: true,
    fieldKey: 'data_completed',
    textInputMax: 100,
    textInputMin: 0,
    isHiddenFilter: true,
  },
  {
    id: 6,
    label: 'property-owner',
    isDefaultFilterColumn: true,
    fieldKey: 'property_owner',
    component: (item) =>
      (item.details && item.details.map((el) => el.title === 'property-owner' && el.value)) || (
        <span />
      ),
  },
  {
    id: 7,
    label: 'city',
    isDefaultFilterColumn: true,
    fieldKey: 'city',
    component: (item) =>
      (item.details && item.details.map((el) => el.title === 'city' && el.value)) || <span />,
  },
  {
    id: 8,
    label: 'community',
    isDefaultFilterColumn: true,
    fieldKey: 'community',
    component: (item) =>
      (item.details && item.details.map((el) => el.title === 'community' && el.value)) || <span />,
  },
  {
    id: 9,
    label: 'property-usage',
    isDefaultFilterColumn: true,
    fieldKey: 'property_usage',
    component: (item) =>
      (item.details && item.details.map((el) => el.title === 'property-usage' && el.value)) || (
        <span />
      ),
  },
];
