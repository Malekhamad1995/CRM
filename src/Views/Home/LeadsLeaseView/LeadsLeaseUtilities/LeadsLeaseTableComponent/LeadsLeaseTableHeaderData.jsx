export const LeadsLeaseTableHeaderData = [
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
    isHiddenFilter: false,
    fieldKey: 'createdOn',
    isDate: true,
    isDefaultFilterColumn: true,
  },
  {
    id: 5,
    label: 'progress',
    input: 'progressWithPercentage',
    textInputType: 'number',
    textInputMax: 100,
    textInputMin: 0,
    isHiddenFilter: true,
    fieldKey: 'data_completed',
    isDefaultFilterColumn: true,
  },

  {
    id: 6,
    label: 'lastActivityTypeName',
    input: 'lastActivityTypeName',
    fieldKey: 'lastActivityTypeName',
    key: 'lastActivityTypeName',
    isHiddenFilter: false,
    isDate: false,
    isDefaultFilterColumn: true,
  },
  {
    id: 7,
    label: 'activityCreatedBy',
    input: 'activityCreatedBy',
    fieldKey: 'activityCreatedBy',
    key: 'activityCreatedBy',
    isDate: false,
    isHiddenFilter: false,
    isDefaultFilterColumn: true,
  },
  {
    id: 8,
    label: 'Activity Remarks',
    input: 'lastActivityComment',
    isHiddenFilter: true,
    isDefaultFilterColumn: true,
  }, {
    id: 34,
    label: 'lead Assigned Date',
    input: 'leadAssignedDate',
    fieldKey: 'leadAssignedDate',
    isDefaultFilterColumn: false,
    isHiddenFilter: true,
    isDate: true,
  },
];