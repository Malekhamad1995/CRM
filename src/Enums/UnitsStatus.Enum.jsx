import { UnitsOperationTypeEnum } from './UnitsOperationTypeEnum';

export const UnitsStatusEnum = {
  Available: {
    key: 1,
    value: 'available',
    showInSelect: true,
    classes: 'c-success-light',
    saleCategory: {
      key: 21424,
      value: 'sale-available',
    },
    leaseCategory: {
      key: 21428,
      value: 'leased-available',
    },
  },
  ReservedLeased: {
    key: 2,
    value: 'reserved-for-lease',
    showInSelect: true,
    effectedOperationType: UnitsOperationTypeEnum.rent.key,
    classes: 'c-primary',
    category: {
      key: 21429,
      value: 'leased-reserved',
    },
  },
  Leased: {
    key: 3,
    value: 'leased',
    showInSelect: true,
    effectedOperationType: UnitsOperationTypeEnum.rent.key,
    classes: 'c-primary',
    category: {
      key: 21430,
      value: 'leased-leased',
    },
  },
  LeasedByThirdParty: {
    key: 4,
    value: 'leased-by-third-party',
    showInSelect: true,
    effectedOperationType: UnitsOperationTypeEnum.rent.key,
    classes: 'c-primary',
  },
  ReservedSale: {
    key: 5,
    value: 'reserved-for-sale',
    showInSelect: true,
    effectedOperationType: UnitsOperationTypeEnum.sale.key,
    classes: 'c-primary',
    category: {
      key: 21425,
      value: 'sale-reserved',
    },
  },
  Sale: {
    key: 6,
    value: 'sale',
    showInSelect: true,
    effectedOperationType: UnitsOperationTypeEnum.sale.key,
    classes: 'c-primary',
    category: {
      key: 21426,
      value: 'sale-sold',
    },
  },
  SaleByThirdParty: {
    key: 7,
    value: 'sale-by-third-party',
    effectedOperationType: UnitsOperationTypeEnum.sale.key,
    classes: 'c-primary',
  },
  Blocked: { key: 8, value: 'blocked', classes: 'c-black-light' },
  Upcoming: { key: 9, value: 'upcoming', classes: 'c-warning-light' },
  Draft: {
    key: 10,
    value: 'draft',
    classes: 'c-black-light',
    showInSelect: true,
    saleCategory: {
      key: 21423,
      value: 'sale-draft',
    },
    leaseCategory: {
      key: 21427,
      value: 'leased-draft',
    },
  },
};
