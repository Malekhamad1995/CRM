import { UnitsOperationTypeEnum } from './UnitsOperationTypeEnum';

export const UnitsFilterStatusEnum = {
  sale: {
    Available: {
      key: 1,
      value: 'Available',
      title: 'available',
      showInSelect: true,
      classes: 'c-success-light',
    },
    Reserved: {
      key: 2,
      value: 'ReservedSale',
      title: 'reserved',
      showInSelect: true,
      effectedOperationType: UnitsOperationTypeEnum.rent.key,
      classes: 'c-primary',
    },
    sale: {
      key: 3,
      value: 'Sale',
      title: 'sold',
      showInSelect: true,
      effectedOperationType: UnitsOperationTypeEnum.rent.key,
      classes: 'c-primary',
    },
    Draft: {
      key: 10,
      value: 'Draft',
      title: 'draft',
      classes: 'c-black-light',
      showInSelect: true,
    },
  },
  lease: {
    Available: {
      key: 1,
      value: 'Available',
      title: 'available',
      showInSelect: true,
      classes: 'c-success-light',
    },
    Reserved: {
      key: 2,
      value: 'ReservedLeased',
      title: 'reserved',
      showInSelect: true,
      effectedOperationType: UnitsOperationTypeEnum.rent.key,
      classes: 'c-primary',
    },
    Leased: {
      key: 3,
      value: 'Leased',
      title: 'leased',
      showInSelect: true,
      effectedOperationType: UnitsOperationTypeEnum.rent.key,
      classes: 'c-primary',
    },
    Draft: {
      key: 10,
      value: 'Draft',
      title: 'draft',
      classes: 'c-black-light',
      showInSelect: true,
    },
  },
};
