import {
  ContactTypeEnum,
  UnitsOperationTypeEnum,
  UnitsStatusEnum,
} from '../../../../Enums';
import { GlobalTranslate } from '../../../../Helper';

export const UnitMapper = (item) => {
  const { unit } = item;
  const operationType =
    (unit.operation_type && unit.operation_type.lookupItemId) || null;
  const untiStatusIndex = Object.keys(UnitsStatusEnum).findIndex(
    (element) => element === unit.status
  );
  const unitStatus =
    (untiStatusIndex !== -1 &&
      Object.values(UnitsStatusEnum)[untiStatusIndex]) ||
    null;
  const views =
    (unit.view &&
      ((Array.isArray(unit.view) &&
        unit.view.map(
          (element, index) =>
            `${element.lookupItemName}${
              (index < unit.view.length - 1 && ',') || ''
            } `
        )) ||
        (typeof unit.view === 'object' && unit.view.lookupItemName) ||
        'N/A')) ||
    'N/A';
  return {
    availableCommunity: (item.community && item.community) || 'N/A',
    availableCity: (item.city && item.city) || 'N/A',
    primaryView:
    (unit.primary_view &&
      ((Array.isArray(unit.primary_view) &&
        unit.primary_view.map(
          (element, index) =>
            `${element.lookupItemName}${
              (index < unit.primary_view.length - 1 && ',') || ''
            } `
        )) ||
        (typeof unit.primary_view === 'object' && unit.primary_view.lookupItemName) ||
        'N/A')) ||
    'N/A',
    virtualTour:
      (unit.external_url &&
        unit.external_url['Unit Virtual Tour'] &&
        unit.external_url['Unit Virtual Tour'][0]) ||
      null,
    rowVersion: item.rowVersion,
    allunitImages: item.unitImage,
    refNo: (unit.unit_ref_no && unit.unit_ref_no) || 'N/A',
    id: item.unitId,
    imagePath: unit.unit_images && unit.unit_images['Card Cover Image'],
    name: `${(unit.unit_type && unit.unit_type.lookupItemName) || ''} ${
      unit.property_name ? unit.property_name.name || unit.property_name : ''
    } ${unit.unit_number || ''}`,
    propertyName:
      (unit.property_name && unit.property_name.name) ||
      unit.property_name ||
      '',
    creationDate: item.createdOn,
    updateDate: item.updateOn,
    financeValue: unit.finance_value,
    matchingLeads: (unit.matching_leads && unit.matching_leads) || [],
    matchingLeadsNumber: (unit.matching_leads && unit.matching_leads.length) || 0,
    type: ContactTypeEnum.corporate.value,
    unitTypeId: unit.unit_type_id,
    unitTransactionId: item.unitTransactionId,
    unitType:
      unit.unit_type && unit.unit_type !== '[object Object]' ?
        unit.unit_type.lookupItemName ||
          (typeof unit.unit_type !== 'object' && unit.unit_type) ||
          '' :
        '',
    progress:
      typeof unit.data_completed === 'string' &&
      unit.data_completed.includes('%') ?
        +unit.data_completed.substr(0, unit.data_completed.length - 1) :
        +unit.data_completed,
    progressWithPercentage:
      typeof unit.data_completed !== 'string' ?
        `${unit.data_completed}%` :
        unit.data_completed,
    operationType,
    unitOperationType:
      operationType === UnitsOperationTypeEnum.rent.key ||
      operationType === UnitsOperationTypeEnum.rentAndSale.key ?
        GlobalTranslate.t('Shared:actions-buttons.rent') :
        GlobalTranslate.t('Shared:actions-buttons.sale'),
    unitStatus,
    unitModel: unit.unit_model || 'N/A',
    unitName: (unit.property_name && unit.property_name.name) || 'N/A',
    unitBedrooms: (unit.bedrooms && unit.bedrooms) || 'N/A',
    unitRefNo: unit.unit_ref_no || 'N/A',
    listingAgent: unit.listing_agent ? unit.listing_agent.name : 'N/A',
    plotArea: unit.plot_area_sqft ? unit.plot_area_sqft : 'N/A',
    builtupArea: unit.builtup_area_sqft ? unit.builtup_area_sqft : 'N/A',
    servicesCharge: unit.services_charge ? unit.services_charge : 'N/A',
    price:
      operationType === UnitsOperationTypeEnum.rent.key ||
      operationType === UnitsOperationTypeEnum.rentAndSale.key ?
        (unit.rent_price_fees && unit.rent_price_fees.rentPerYear) || 'N/A' :
        (unit.selling_price_agency_fee &&
            unit.selling_price_agency_fee.salePrice) ||
          'N/A',
    rentPerYear:
      (unit.rent_price_fees && unit.rent_price_fees.rentPerYear) || 'N/A',
    ownerName:
    (unit.owner &&
      ((Array.isArray(unit.owner) &&
        unit.owner.map(
          (element, index) =>
            `${element.name}${
              (index < unit.owner.length - 1 && ',') || ''
            } `
        )) ||
        (typeof unit.owner === 'object' && unit.owner.name) ||
        'N/A')) ||
    'N/A',
    // unit.owner ? unit.owner.map((el) => `${el.name}, `) : 'N/A',
    unitItem: unit,
    views,
    portfolio: (unit.portfolio_id && unit.portfolio_id) || null,
    mangeType: (unit.mangeType && unit.mangeType) || null,
    flatContent: [
      {
        iconClasses: 'mdi mdi-bed-outline',
        title: null,
        value: unit.bedrooms ? unit.bedrooms : GlobalTranslate.t('Shared:any'),
      },
      {
        iconClasses: 'mdi mdi-shower',
        title: null,
        value: unit.bathrooms ? unit.bathrooms : GlobalTranslate.t('Shared:any'),
      },
      {
        iconClasses: 'mdi mdi-ruler-square',
        title: 'sqf',
        value: unit.builtup_area_sqft ? unit.builtup_area_sqft : 'N/A',
      },
      // {
      //   iconClasses: 'mdi mdi-car-outline',
      //   title: 'sqf',
      //   value: unit.total_area_size_sqft ? unit.total_area_size_sqft : 'N/A',
      // },
      {
        iconClasses: 'mdi mdi-broom',
        title: '',
        value: unit.maid_rooms ? unit.maid_rooms : 'N/A',
      },
    ],
    details: [
      {
        iconClasses: 'mdi mdi-point-of-sale',
        title: 'owner-name',
        value:
        (unit.owner &&
          ((Array.isArray(unit.owner) &&
            unit.owner.map(
              (element, index) =>
                `${element.name}${
                  (index < unit.owner.length - 1 && ',') || ''
                } `
            )) ||
            (typeof unit.owner === 'object' && unit.owner.name) ||
            'N/A')) ||
        'N/A',
        // unit.owner ? unit.owner.map((el) => `${el.name}, `) : 'N/A',
      },
      {
        iconClasses: 'mdi mdi-domain',
        title: 'unit-type',
        value:
          unit.unit_type && unit.unit_type !== '[object Object]' ?
            unit.unit_type.lookupItemName ||
              (typeof unit.unit_type !== 'object' && unit.unit_type) ||
              'N/A' :
            'N/A',
      },
      {
        iconClasses: 'mdi mdi-point-of-sale',
        title: 'furnished',
        value: unit.furnished ? unit.furnished : 'N/A',
      },
      {
        iconClasses: 'mdi mdi-point-of-sale',
        title: 'listing-agent',
        value: unit.listing_agent ? unit.listing_agent.name : 'N/A',
      },
      {
        iconClasses: 'mdi mdi-window-open-variant',
        title: 'views',
        value:
          (unit && unit.primary_view && unit.primary_view.length > 0 ? unit.primary_view.map((el, index) => `${el.lookupItemName}${unit.primary_view.length - 1 !== index ? ' , ' : ' '}`) : 'N/A')
      },
      {
        iconClasses: 'mdi mdi-point-of-sale',
        title: 'unit-model',
        value: unit.unit_model ? unit.unit_model : 'N/A',
      },
      {
        iconClasses: 'mdi mdi-point-of-sale',
        title: 'sale-type',
        value: unit.sale_type ?
          unit.sale_type.lookupItemName || unit.sale_type :
          'N/A',
      },
      {
        iconClasses: 'mdi mdi-point-of-sale',
        title: 'floor-number',
        value: unit.floor_number ? unit.floor_number : 'N/A',
      },
      {
        iconClasses: 'mdi mdi-point-of-sale',
        title: 'rating',
        value: unit.rating ? unit.rating : 'N/A',
      },

      {
        iconClasses: 'mdi mdi-point-of-sale',
        title:
          operationType === UnitsOperationTypeEnum.sale.key ||
          operationType === UnitsOperationTypeEnum.rentAndSale.key ?
            'sale-roi' :
            'rent-roi',
        value:
          operationType === UnitsOperationTypeEnum.sale.key ||
          operationType === UnitsOperationTypeEnum.rentAndSale.key ?
            (unit.sale_roi && unit.sale_roi) || 'N/A' :
            (unit.rent_roi && unit.rent_roi) || 'N/A' || 'N/A',
      },
      {
        iconClasses: 'mdi mdi-window-open-variant',
        title: 'lead-owner',
        value:
          (unit && unit.lead_owner ? unit.lead_owner.name : 'N/A')

      },
    ],
    ...unit,
  };
};
