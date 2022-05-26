import { ContactTypeEnum, LeadsPriorityEnum, LeadsTypesEnum } from '../../../../../Enums';
import { GlobalTranslate } from '../../../../../Helper';

const translationPath = '';
export const LeadsMapper = (item, res, t) => {
  const { lead } = item;
  return {
    myLeadcommunity: (item.communityName && item.communityName) || 'N/A',
    myLeadproperty: (item.propertyName && item.propertyName) || 'N/A',
    unitType: lead.propertyunit_type && lead.propertyunit_type.map((e) => e.lookupItemName) || ['N/A'],
    numberOfActivities: item.numberOfActivities,
    leadClass: (lead.leadClass && lead.leadClass) || 'N/A',
    id: item.leadId,
    lastActivityTypeName: item.lastActivityTypeName,
    unitType: item.unitType,
    activityCreatedBy: item.activityCreatedBy,
    lastActivityComment: item.lastActivityComment,
    leadTypeId: lead.lead_type_id,
    imagePath: null,
    leadAssignedDate: item.leadAssignedDate || 'N/A',
    creationDate: item.createdOn,
    name: `${(lead.contact_name && lead.contact_name.name) || 'N/A'}`,
    matchingUnits: (lead.matching_units && lead.matching_units) || [],
    matchingUnitsNumber: (lead.matching_units && lead.matching_units.length) || 0,
    updateDate: item.updateOn,
    ownerUnitType: item.ownerUnitType,
    type: ContactTypeEnum.man.value,
    leadType:
      (lead.lead_type_id === 1 &&
        ((LeadsTypesEnum.Owner && LeadsTypesEnum.Owner.value) || 'N/A')) ||
      (lead.lead_type_id === 2 &&
        ((LeadsTypesEnum.Seeker && LeadsTypesEnum.Seeker.value) || 'N/A')) ||
      'N/A',
    rating:
      (lead.rating &&
        lead.rating.lookupItemName &&
        LeadsPriorityEnum[lead.rating.lookupItemName]) ||
      '',
    progress:
      typeof lead.data_completed === 'string' && lead.data_completed.includes('%') ?
        +lead.data_completed.substr(0, lead.data_completed.length - 1) :
        +lead.data_completed,
    progressWithPercentage:
      typeof lead.data_completed !== 'string' ? `${lead.data_completed}%` : lead.data_completed,
    // price: '$2.200',
    status: (lead.status && lead.status.lookupItemName) || 'N/A',
    bathrooms: lead.bathrooms ?
    lead.bathrooms.map(
        (element, index) => `${element}${(index < lead.bathrooms.length - 1 && ',') || ''} `
      ) :
    'N/A',
    bedrooms: lead.bedrooms ?
    lead.bedrooms.map(
        (element, index) => `${element}${(index < lead.bedrooms.length - 1 && ',') || ''} `
      ) :
    'N/A',
    fittingAndFixtures: lead.fitting_and_fixtures && lead.fitting_and_fixtures.map(
      (e) => e.lookupItemName
    ).length > 1 ? lead.fitting_and_fixtures && lead.fitting_and_fixtures.map(
      (e) => e.lookupItemName
    ).join(' , ') : lead.fitting_and_fixtures && lead.fitting_and_fixtures.map(
      (e) => e.lookupItemName
    )[0] || 'N/A',

    sizeSqft: lead.size_sqft && lead.size_sqft.join(' * ') || 'N/A',

    totalBudget: lead.budget && lead.budget.join(' - ') || 'N/A',

    views: lead.view && lead.view.map((e) => e.lookupItemName) || 'N/A',
    developerName: lead.developer && lead.developer.map((e) => e.name) || 'N/A',
    subcommunity: lead.sub_community || 'N/A',
    closeReason: lead.close_reason || 'N/A',
    flatContent: lead.lead_type_id === 2 && [
      {
        iconClasses: 'mdi mdi-cash-multiple',
        title: 'budget',
        value: lead.budget ?
          lead.budget.map(
              (element, index) => `${element}${(index < lead.budget.length - 1 && ',') || ''} `
            ) :
          'N/A',
      },

      {
        iconClasses: 'mdi mdi-bed',
        title: 'bedrooms',
        value: lead && lead.bedrooms && lead.bedrooms.length === 0 ? GlobalTranslate.t('Shared:any') : ((lead.bedrooms &&
        lead.bedrooms.map(
          (element, index) =>
            `${element}${(index < lead.bedrooms.length - 1 && ',') || ''} `
        )) ||
        GlobalTranslate.t('Shared:any')),
      },
      {
        iconClasses: 'mdi mdi-shower',
        title: null,
        value: lead && lead.bathrooms && lead.bathrooms.length === 0 ? GlobalTranslate.t('Shared:any') : (lead.bathrooms &&
        lead.bathrooms.map(
          (element, index) =>
            `${element}${(index < lead.bathrooms.length - 1 && ',') || ''} `
        )) ||
       GlobalTranslate.t('Shared:any'),

      },
      {
        iconClasses: 'mdi mdi-ruler-square',
        title: 'sqf',
        value: lead.size_sqft ?
          lead.size_sqft.map(
              (element, index) => `${element}${(index < lead.size_sqft.length - 1 && ',') || ''} `
            ) :
          'N/A',
      },
    ],
    details: [
      {
        iconClasses: 'mdi mdi-account-circle',
        title: 'lead-id',
        value: item.leadId ? item.leadId : 'N/A',
      },
      {
        iconClasses: 'mdi mdi-account-box',
        title: 'contact-name',
        value: lead.contact_name ? lead.contact_name.name : 'N/A',
      },
      {
        iconClasses: 'mdi mdi-clipboard-account-outline',
        title: 'lead-type',
        value:
          lead.lead_type_id === 1 ? t(`${translationPath}owner`) : t(`${translationPath}seeker`),
      },
      {
        iconClasses: 'mdi mdi-account-box',
        title: 'city',
        value: lead.city ? lead.city.lookupItemName : 'N/A',
      },
      {
        iconClasses: 'mdi mdi-account-box',
        title: 'unit-type',
        value: lead.propertyunit_type && lead.propertyunit_type.map ?
          lead.propertyunit_type.map((el) => el.lookupItemName) :
          'N/A',
      },
      {
        iconClasses: 'mdi mdi-account-box',
        title: 'community',
        value: lead.community ? lead.community.lookupItemName : 'N/A',
      },
      {
        iconClasses: 'mdi mdi-account-circle',
        title: 'property-name',
        value: (item.propertyName && item.propertyName) || 'N/A',
      },
      {
        iconClasses: 'mdi mdi-shower',
        title: 'bathrooms',
        value: lead.bathrooms ?
          lead.bathrooms.map(
              (element, index) => `${element}${(index < lead.bathrooms.length - 1 && ',') || ''} `
            ) :
          'N/A',
      },
      {
        iconClasses: 'mdi mdi-account-circle',
        title: 'min-price-range',
        value: lead.budget ? lead.budget[0] : 'N/A',
      },
      {
        iconClasses: 'mdi mdi-account-circle',
        title: 'max-price-range',
        value: lead.budget ? lead.budget[1] : 'N/A',
      },
      {
        iconClasses: 'mdi mdi-account-circle',
        title: 'referredto',
        value: lead.referredto ? lead.referredto.name : 'N/A',
      },
      {
        iconClasses: 'mdi mdi-account-circle',
        title: 'status',
        value: lead.status ? lead.status.lookupItemName : 'N/A',
      },
      {
        iconClasses: 'mdi mdi-account-circle',
        title: 'stage',
        value: lead.lead_stage ? lead.lead_stage.lookupItemName : 'N/A',
      },
      {
        iconClasses: 'mdi mdi-table-furniture',
        title: 'equipments-and-fixtures',
        value:
          (lead.fitting_and_fixtures &&
            lead.fitting_and_fixtures.map(
              (element, index) =>
                `${element.lookupItemName}${
                  (index < lead.fitting_and_fixtures.length - 1 && ',') || ''
                } `
            )) ||
          'N/A',
      },
      {
        iconClasses: 'mdi mdi-window-open-variant',
        title: 'views',
        value:
          (lead.view &&
            ((Array.isArray(lead.view) &&
              lead.view.map(
                (element, index) =>
                  `${element.lookupItemName}${(index < lead.view.length - 1 && ',') || ''} `
              )) ||
              (typeof lead.view === 'object' && lead.view.lookupItemName) ||
              'N/A')) ||
          'N/A',
      },
      {
        iconClasses: 'mdi mdi-laptop-windows',
        title: 'developers',
        value:
          (lead.developers &&
            lead.developers.map(
              (element, index) =>
                `${element.name}${(index < lead.developers.length - 1 && ',') || ''} `
            )) ||
          'N/A',
      },
    ],
    allDetails: {
      'Main Information': [
        {
          title: 'title',
          value: '',
        },
        {
          title: 'first_name',
          value:
            (lead.contact_name && lead.contact_name.name && lead.contact_name.name.split(' ')[0]) ||
            '',
        },
        {
          title: 'last_name',
          value:
            (lead.contact_name && lead.contact_name.name && lead.contact_name.name.split(' ')[1]) ||
            '',
        },
      ],
    },
    totalCount: (res && res.totalCount) || 0,
    ...lead,
  };
};
