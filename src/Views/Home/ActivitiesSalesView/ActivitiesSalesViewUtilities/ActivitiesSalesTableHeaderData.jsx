import React from 'react';
import { SwitchComponent } from '../../../../Components';

export const ActivitiesSalesTableHeaderData = [
  {
    id: 1,
    label: 'activity-Date',
    isDate: true,
    input: 'activityDate',
    fieldKey: 'createdByName',
    isDefaultFilterColumn: true,
  },
  {
    id: 2,
    label: 'created-By',
    input: 'createdByName',
    fieldKey: 'createdByName',
    isDefaultFilterColumn: true,

  },
  {
    id: 3,
    label: 'created-Date',
    isDate: true,
    input: 'createdOn',
    fieldKey: 'createdOn',
    isDefaultFilterColumn: true,
  },
  {
    id: 4,
    label: 'assign-to',
    fieldKey: 'agentName',
    isDefaultFilterColumn: true,
    component: (item) => (
      <span>
        {item.agentName}
      </span>
    ),

  },
  {
    id: 5,
    label: 'related-to',
    fieldKey: 'related-to',
    isDefaultFilterColumn: true,
    component: (item) => (
      <span className='c-primary'>
        {(item.relatedLeadNumberId && 'lead') ||
          (item.relatedMaintenanceContractId &&
            'MaintenanceContract') ||
          (item.relatedUnitNumberId && 'unit') ||
          (item.relatedPortfolioName && 'Portfolio') ||
          (item.relatedWorkOrderRefNumber && 'WorkOrder') ||
          (item.relatedUnitPropertyName && 'Property') ||
          (item.relatedPortfolioId && 'Portfolio') ||
          (item.relatedWorkOrderId && 'WorkOrder') ||
          'N/A'}
      </span>
    ),
  }, {
    id: 6,
    label: 'Related-to-Id',
    fieldKey: 'Related-to-Id',
    isDefaultFilterColumn: true,
    component: (item) => (
      <span className='c-primary'>
        {(item.relatedLeadNumberId) ||
          (item.relatedMaintenanceContractId) ||
          (item.relatedWorkOrderRefNumber) ||
          (item.relatedPortfolioName) ||
          (item.relatedUnitNumberId) ||
          (item.relatedUnitNumber) ||
          (item.relatedUnitPropertyName) ||
          (item.relatedPortfolioId) ||
          (item.relatedWorkOrderId) ||
          'N/A'}
      </span>
    ),
  }, {
    id: 7,
    label: 'related-to-number',
    fieldKey: 'related-to-number',
    isDefaultFilterColumn: true,
    component: (item) => (
      <span className='c-primary'>
        {(item.relatedLeadNumberId && item.contactName) ||
          (item.relatedMaintenanceContractId && item.relatedMaintenanceContractId) ||
          (item.relatedWorkOrderRefNumber && item.relatedWorkOrderRefNumber) ||
          (item.relatedPortfolioName && item.relatedPortfolioName) ||
          (item.relatedUnitNumberId && item.relatedUnitNumber) ||
          (item.relatedUnitNumber && item.relatedUnitNumber) ||
          (item.relatedUnitPropertyName && item.relatedUnitNumber) ||
          (item.relatedPortfolioId && item.relatedPortfolioName) ||
          (item.relatedWorkOrderId && item.relatedWorkOrderRefNumber) ||
          'N/A'}
      </span>
    ),
  },
  {
    id: 9,
    label: 'stage',
    component: (item) => (
      <span>
        {item.activityType.leadStageName || 'not-contacted'}
      </span>
    ),
  },
  {
    id: 10,
    label: 'category',
    input: 'activityType.categoryName',
  },
  {
    id: 11,
    label: 'activity-type',
    input: 'activityType.activityTypeName',
  },
  {
    id: 12,
    label: 'status',
    input: 'isOpen',
    isDefaultFilterColumn: true,
    cellClasses: 'py-0',
    component: (item, index) => (
      <SwitchComponent
        idRef={`isOpenRef${index + 1}`}
        isChecked={item.isOpen}
        labelClasses='px-0'
        themeClass='theme-line'
        labelValue={(item.isOpen && 'open') || 'closed'}
      />
    ),
  },
  {
    id: 13,
    label: 'comments',
    input: 'comments',
    isDefaultFilterColumn: true,
  },
];
