import React from 'react';

export const LeadsSalesTableHeaderData = [
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
    input: 'leadClass',
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
  },
  {
    id: 4,
    label: 'creation',
    input: 'creationDate',
    fieldKey: 'createdOn',
    isDefaultFilterColumn: true,
    isHiddenFilter: false,
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
    label: 'lastActivityTypeName',
    input: 'lastActivityTypeName',
    fieldKey: 'lastActivityTypeName',
    isHiddenFilter: false,
    isDefaultFilterColumn: true,
  },
  {
    id: 7,
    label: 'activityCreatedBy',
    input: 'activityCreatedBy',
    fieldKey: 'activityCreatedBy',
    isHiddenFilter: false,
    isDefaultFilterColumn: true,
  },
 {
    id: 34,
    label: 'lead Assigned Date',
    input: 'leadAssignedDate',
    fieldKey: 'leadAssignedDate',
    isDefaultFilterColumn: false,
    isHiddenFilter: true,
    isDate: true,
  },
];
