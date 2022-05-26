import { GlobalOrderFilterStatus } from './GlobalOrderFilterStatus';

const initialState = localStorage.getItem('GlobalFilter') ?
  JSON.parse(localStorage.getItem('GlobalFilter')) :
  {
    contactsFilter: {
      filterBy: null,
      orderBy: null,
    },
    contactsSalesFilter: {
      filterBy: null,
      orderBy: null,
    },
    contactsLeaseFilter: {
      filterBy: null,
      orderBy: null,
    },
    leadsFilter: {
      filterBy: null,
      orderBy: null,
    },
    leadsLeaseFilter: {
      filterBy: null,
      orderBy: null,
    },
    leadsSaleFilter: {
      filterBy: null,
      orderBy: null,
    },
    unitsFilter: {
      filterBy: null,
      orderBy: null,
    },
    unitsSalesFilter: {
      filterBy: null,
      orderBy: null,
    },
    unitsLeaseFilter: {
      filterBy: null,
      orderBy: null,
    },
    propertiesFilter: {
      filterBy: null,
      orderBy: null,
    },
    propertiesSalesFilter: {
      filterBy: null,
      orderBy: null,
    },
    propertiesLeaseFilter: {
      filterBy: null,
      orderBy: null,
    },

    contactsCrmFilter: {
      filterBy: null,
      orderBy: null,
    },
    propertiesCrmFilter: {
      filterBy: null,
      orderBy: null,
    },
    MyLeadFilter: {
      filterBy: null,
      orderBy: null,
    },
    MyReferralsFilter: {
      filterBy: null,
      orderBy: null,
    },
    SalesAvailabilityFilter: {
      filterBy: null,
      orderBy: null,
    },
    LeaseingAvailabilityFilter: {
      filterBy: null,
      orderBy: null,
    },
    rotationCriteriaFilter: {
      filterBy: null,
      orderBy: null,
    },
    activitesCallCenterFilter: {
      filterBy: null,
      orderBy: null,
    },
    activitesManagementFilter: {
      filterBy: null,
      orderBy: null,
    },
    activitesSaleFilter: {
      filterBy: null,
      orderBy: null,
    },
    activitesLeaseFilter: {
      filterBy: null,
      orderBy: null,
    },
    salesTransactionsFilter: {
      filterBy: null,
      orderBy: null,
    },

    leasingTransactionsFilter: {
      filterBy: null,
      orderBy: null,

    },
    invoicesFilter: {
      filterBy: null,
      orderBy: null,
    },
    qaFilter:{
      filterBy: null,
      orderBy: null,
    }

  };

export const GlobalOrderFilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case GlobalOrderFilterStatus.ERROR:
    case GlobalOrderFilterStatus.REQUEST:
      return state;

    case GlobalOrderFilterStatus.SUCCESS:
      return action.payload;

    case GlobalOrderFilterStatus.RESET:
      return initialState;

    default:
      return state;
  }
};
