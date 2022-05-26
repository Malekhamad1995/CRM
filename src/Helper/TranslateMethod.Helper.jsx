/* eslint-disable max-len */
import i18next from 'i18next';
// Start Layouts Common (Shared)
import moment from 'moment-timezone/moment-timezone-utils';
import SharedEn from '../Layouts/Common/I18n/en.json';
import SharedAr from '../Layouts/Common/I18n/ar.json';
// End Layouts Common (Shared)
// Start Home Views
import BusinessGroupsViewEn from '../Views/Home/Administration/BusinessGroupsView/I18n/en.json';
import BusinessGroupsViewAr from '../Views/Home/Administration/BusinessGroupsView/I18n/ar.json';
import UserDataViewEn from '../Views/Home/Administration/UserDataView/I18n/en.json';
import UserDataViewAr from '../Views/Home/Administration/UserDataView/I18n/ar.json';
import UsersViewEn from '../Views/Home/Administration/UsersView/I18n/en.json';
import UsersViewAr from '../Views/Home/Administration/UsersView/I18n/ar.json';
import BranchViewEn from '../Views/Home/Administration/BranchesView/I18n/en.json';
import BranchViewAr from '../Views/Home/Administration/BranchesView/I18n/ar.json';
import RolesViewEn from '../Views/Home/Administration/RolesView/I18n/en.json';
import RolesViewAr from '../Views/Home/Administration/RolesView/I18n/ar.json';
import TeamViewEn from '../Views/Home/Administration/TeamView/I18n/en.json';
import TeamViewAr from '../Views/Home/Administration/TeamView/I18n/ar.json';
import HeaderViewEn from '../Views/Home/Common/HeaderView/I18n/en.json';
import HeaderViewAr from '../Views/Home/Common/HeaderView/I18n/ar.json';
import ImportDetailsViewEn from '../Views/Home/Common/ImportDetailsView/I18n/en.json';
import ImportDetailsViewAr from '../Views/Home/Common/ImportDetailsView/I18n/ar.json';
import OpenFileViewEn from '../Views/Home/Common/OpenFileView/I18n/en.json';
import OpenFileViewAr from '../Views/Home/Common/OpenFileView/I18n/ar.json';
import ContactsViewEn from '../Views/Home/ContactsView/I18n/en.json';
import ContactsViewAr from '../Views/Home/ContactsView/I18n/ar.json';
import ContactProfileManagementViewEn from '../Views/Home/ContactsView/ContactProfileManagementView/I18n/en.json';
import ContactProfileManagementViewAr from '../Views/Home/ContactsView/ContactProfileManagementView/I18n/ar.json';
import PropertiesProfileManagementViewEn from '../Views/Home/PropertiesView/PropertiesProfileManagementView/I18n/en.json';
import PropertiesProfileManagementViewAr from '../Views/Home/PropertiesView/PropertiesProfileManagementView/I18n/ar.json';
import UnitsProfileManagementViewEn from '../Views/Home/UnitsView/UnitsProfileManagementView/I18n/en.json';
import UnitsProfileManagementViewAr from '../Views/Home/UnitsView/UnitsProfileManagementView/I18n/ar.json';
import LeadsProfileManagementViewEn from '../Views/Home/LeadsView/LeadsProfileManagementView/I18n/en.json';
import LeadsProfileManagementViewAr from '../Views/Home/LeadsView/LeadsProfileManagementView/I18n/ar.json';
import FormBuilderEn from '../Views/Home/FormBuilder/I18n/en.json';
import FormBuilderAr from '../Views/Home/FormBuilder/I18n/ar.json';
import LeadsViewEn from '../Views/Home/LeadsView/I18n/en.json';
import LeadsViewAr from '../Views/Home/LeadsView/I18n/ar.json';
import LookupsViewEn from '../Views/Home/LookupsView/I18n/en.json';
import LookupsViewAr from '../Views/Home/LookupsView/I18n/ar.json';
import PropertiesViewEn from '../Views/Home/PropertiesView/I18n/en.json';
import PropertiesViewAr from '../Views/Home/PropertiesView/I18n/ar.json';
import UnitsViewEn from '../Views/Home/UnitsView/I18n/en.json';
import UnitsViewAr from '../Views/Home/UnitsView/I18n/ar.json';
import UnitsStatusManagementViewEn from '../Views/Home/UnitsView/UnitsStatusManagementView/I18n/en.json';
import UnitsStatusManagementViewAr from '../Views/Home/UnitsView/UnitsStatusManagementView/I18n/ar.json';
import WorkOrdersViewEn from '../Views/Home/WorkOrdersView/I18n/en.json';
import WorkOrdersViewAr from '../Views/Home/WorkOrdersView/I18n/ar.json';
import WorkOrdersManagementViewEn from '../Views/Home/WorkOrdersView/WorkOrdersManagementView/I18n/en.json';
import WorkOrdersManagementViewAr from '../Views/Home/WorkOrdersView/WorkOrdersManagementView/I18n/ar.json';
import IncidentsViewAr from '../Views/Home/IncidentsView/I18n/ar.json';
import IncidentsViewEn from '../Views/Home/IncidentsView/I18n/en.json';
import RolesManagementViewAr from '../Views/Home/Administration/RolesView/RolesManagement/I18n/ar.json';
import RolesManagementViewEn from '../Views/Home/Administration/RolesView/RolesManagement/I18n/en.json';
// End Home Views
// Start Account Views
import LoginViewEn from '../Views/Account/LoginView/I18n/en.json';
import LoginViewAr from '../Views/Account/LoginView/I18n/ar.json';
// End Account Views
// Start DFM Views
import DataFilesEn from '../Views/dfmAddEditAndDelete/I18n/en.json';
import DataFilesAr from '../Views/dfmAddEditAndDelete/I18n/ar.json';
// End DFM Views
// Start Form Builder Views
import FormBuilderViewEn from '../Views/FormBuilder/I18n/en.json';
import FormBuilderViewAr from '../Views/FormBuilder/I18n/ar.json';
// End Form Builder Views
// Start Activities Views
import ActivitiesViewEn from '../Views/Home/ActivitiesView/I18n/en.json';
import ActivitiesViewAr from '../Views/Home/ActivitiesView/I18n/ar.json';
// End Activities Views
// Start Porfolio Views
import PortfolioViewEn from '../Views/Home/PortfolioView/I18n/en.json';
import PortfolioViewAr from '../Views/Home/PortfolioView/I18n/ar.json';
// End Porfolio Views
// Start History component Views
import HistoryEn from '../Components/HistoryComponent/I18n/en.json';
import HistoryAr from '../Components/HistoryComponent/I18n/ar.json';
// End History component Views
// Start Operating costs Views
import OperatingCostsEn from '../Views/Home/OperatingCosts/I18n/en.json';
import OperatingCostsAr from '../Views/Home/OperatingCosts/I18n/ar.json';
// End Operating costs Views

// Start Assets Views
import AssetsViewEn from '../Views/Home/AssetsView/I18n/en.json';
import AssetsViewAr from '../Views/Home/AssetsView/I18n/ar.json';
// End Assets Views
// Start Accounts Views
import SalesTransactionsViewEn from '../Views/Home/SalesTransactionsView/I18n/en.json';
import SalesTransactionsViewAr from '../Views/Home/SalesTransactionsView/I18n/ar.json';
import SalesTransactionsProfileViewEn from '../Views/Home/SalesTransactionsView/SalesTransactionsProfile/I18n/en.json';
import SalesTransactionsProfileViewAr from '../Views/Home/SalesTransactionsView/SalesTransactionsProfile/I18n/ar.json';
import LeasingTransactionsProfileViewEn from '../Views/Home/LeasingTransactionsView/LeasingTransactionsProfile/I18n/en.json';
import LeasingTransactionsProfileViewAr from '../Views/Home/LeasingTransactionsView/LeasingTransactionsProfile/I18n/ar.json';
import LeasingTransactionsViewEn from '../Views/Home/LeasingTransactionsView/I18n/en.json';
import LeasingTransactionsViewAr from '../Views/Home/LeasingTransactionsView/I18n/ar.json';
import InvoicesViewEn from '../Views/Home/InvoicesView/I18n/en.json';
import InvoicesViewAr from '../Views/Home/InvoicesView/I18n/ar.json';
// Start Accounts Views
// Start Maintenance Contracts View
import MaintenanceContractsEn from '../Views/Home/MaintenanceContractsView/I18n/en.json';
import MaintenanceContractsAr from '../Views/Home/MaintenanceContractsView/I18n/ar.json';
// End Maintenance Contracts View
// Start Bulk Assign View
import BulkAssignEn from '../Views/Home/UnitsBulkAssignView/I18n/en.json';
import BulkAssignAr from '../Views/Home/UnitsBulkAssignView/I18n/ar.json';
// End Bulk Assign View
// Start Templates View
import TemplatesViewEn from '../Views/Home/TemplatesView/I18n/en.json';
import TemplatesViewAr from '../Views/Home/TemplatesView/I18n/ar.json';
// End Templates View
// Start Bulk Assign View
import MonthlyCalendarViewEn from '../Views/Home/MonthlyCalendarView/I18n/en.json';
import MonthlyCalendarViewAr from '../Views/Home/MonthlyCalendarView/I18n/ar.json';
// End Bulk Assign View

// Start My Lead View
import MyLeadViewEn from '../Views/Home/MyLeadsView/I18n/en.json';
import MyLeadViewAr from '../Views/Home/MyLeadsView/I18n/ar.json';
// End My Lead View
// Start My Referrals View
import MyReferralsEn from '../Views/Home/MyReferralsView/I18n/en.json';
import MyReferralsAr from '../Views/Home/MyReferralsView/I18n/ar.json';
// End My Referrals View
// Start My Referrals View
import SalesAvailabilityEn from '../Views/Home/SalesAvailabilityView/I18n/en.json';
import SalesAvailabilityAr from '../Views/Home/SalesAvailabilityView/I18n/ar.json';
// End My Referrals View
// Start My Referrals View
import LeasingAvailabilityEn from '../Views/Home/LeasingAvailabilityView/I18n/en.json';
import LeasingAvailabilityAr from '../Views/Home/LeasingAvailabilityView/I18n/ar.json';
// End My Referrals View

// Start Units Dialogs Management View
import UnitsDialogsManagementViewEn from '../Views/Home/UnitsView/UnitsAddDialogsView/UnitsDialogsManagementView/I18n/en.json';
import UnitsDialogsManagementViewAr from '../Views/Home/UnitsView/UnitsAddDialogsView/UnitsDialogsManagementView/I18n/ar.json';
// End Units Dialogs Management View
// Start Images Gallery Views
import ImagesGalleryGroupEn from '../Views/Home/ImagesGallery/I18n/en.json';
import ImagesGalleryGroupAr from '../Views/Home/ImagesGallery/I18n/ar.json';
// End Images Gallery Views

import QaActivityEn from '../Views/Home/QAView/I18n/en.json';
import QaActivityAr from '../Views/Home/QAView/I18n/ar.json';

// Start Contacts Info Public Views
import ContactsInfoPublicEn from '../Views/Home/ContactsView/ContactsInfoPublic/I18n/en.json';
import ContactsInfoPublicAr from '../Views/Home/ContactsView/ContactsInfoPublic/I18n/ar.json';
// End  Contacts Info Public Views

// Start Agents Views
import AgentsEn from '../Views/Home/AgentsView/I18n/en.json';
import AgentsAr from '../Views/Home/AgentsView/I18n/ar.json';
// End  Agents Views

// Start ActivitiesType Views
import ActivitiesTypeEn from '../Views/Home/ActivitiesTypeView/ActivitiesTypeManagementView/I18n/en.json';
import ActivitiesTypeAr from '../Views/Home/ActivitiesTypeView/ActivitiesTypeManagementView/I18n/ar.json';

import ReportsEn from '../Views/Home/ReportsView/I18n/en.json';
import ReportsAr from '../Views/Home/ReportsView/I18n/ar.json';

// End  ActivitiesType Views

// Start Country Views
import LocationEn from '../Views/Home/LocationViews/LocationSharingUtilities/I18n/en.json';
import LocationAr from '../Views/Home/LocationViews/LocationSharingUtilities/I18n/ar.json';
// End   Country Views
// Start Country Views
import DashboardEn from '../Views/Home/Dashboard/I18n/en.json';
import DashboardAr from '../Views/Home/Dashboard/I18n/ar.json';
// End   Country Views
import { GlobalRerender } from './Middleware.Helper';
import { config } from '../config';

export function localizationInit() {
  i18next.init({
    interpolation: { escapeValue: false }, // React already does escaping
    fallbackLng: ['en', 'ar'],
    lng: 'en', // language to use
    resources: {
      en: {
        QAActivitiesView: QaActivityEn,
        Shared: SharedEn,
        BusinessGroupsView: BusinessGroupsViewEn,
        TeamView: TeamViewEn,
        UserDataView: UserDataViewEn,
        UsersView: UsersViewEn,
        BranchView: BranchViewEn,
        RolesView: RolesViewEn,
        HeaderView: HeaderViewEn,
        ImportDetailsView: ImportDetailsViewEn,
        OpenFileView: OpenFileViewEn,
        ContactsView: ContactsViewEn,
        FormBuilder: FormBuilderEn,
        LeadsView: LeadsViewEn,
        LookupsView: LookupsViewEn,
        PropertiesView: PropertiesViewEn,
        UnitsView: UnitsViewEn,
        LoginView: LoginViewEn,
        DataFiles: DataFilesEn,
        FormBuilderView: FormBuilderViewEn,
        ContactProfileManagementView: ContactProfileManagementViewEn,
        PropertiesProfileManagementView: PropertiesProfileManagementViewEn,
        UnitsProfileManagementView: UnitsProfileManagementViewEn,
        LeadsProfileManagementView: LeadsProfileManagementViewEn,
        UnitsStatusManagementView: UnitsStatusManagementViewEn,
        ActivitiesView: ActivitiesViewEn,
        PortfolioView: PortfolioViewEn,
        HistoryView: HistoryEn,
        WorkOrdersView: WorkOrdersViewEn,
        WorkOrdersManagementView: WorkOrdersManagementViewEn,
        IncidentsView: IncidentsViewEn,
        OperatingCostsView: OperatingCostsEn,
        AssetsView: AssetsViewEn,
        MaintenanceContracts: MaintenanceContractsEn,
        SalesTransactionsView: SalesTransactionsViewEn,
        SalesTransactionsProfileView: SalesTransactionsProfileViewEn,
        LeasingTransactionsProfileView: LeasingTransactionsProfileViewEn,
        LeasingTransactionsView: LeasingTransactionsViewEn,
        InvoicesView: InvoicesViewEn,
        BulkAssign: BulkAssignEn,
        MonthlyCalendarView: MonthlyCalendarViewEn,
        MyLeadView: MyLeadViewEn,
        MyReferralsView: MyReferralsEn,
        SalesAvailabilityView: SalesAvailabilityEn,
        LeasingAvailabilityView: LeasingAvailabilityEn,
        TemplatesView: TemplatesViewEn,
        UnitsDialogsManagementView: UnitsDialogsManagementViewEn,
        ImagesGalleryGroup: ImagesGalleryGroupEn,
        RolesManagementView: RolesManagementViewEn,
        ContactsInfoPublic: ContactsInfoPublicEn,
        Agents: AgentsEn,
        ActivitiesType: ActivitiesTypeEn,
        Reports: ReportsEn,
        LocationView: LocationEn,
        Dashboard :  DashboardEn
      },
      ar: {
        QAActivitiesView: QaActivityAr,
        Shared: SharedAr,
        BusinessGroupsView: BusinessGroupsViewAr,
        TeamView: TeamViewAr,
        UserDataView: UserDataViewAr,
        UsersView: UsersViewAr,
        BranchView: BranchViewAr,
        RolesView: RolesViewAr,
        HeaderView: HeaderViewAr,
        ImportDetailsView: ImportDetailsViewAr,
        OpenFileView: OpenFileViewAr,
        ContactsView: ContactsViewAr,
        FormBuilder: FormBuilderAr,
        LeadsView: LeadsViewAr,
        LookupsView: LookupsViewAr,
        PropertiesView: PropertiesViewAr,
        UnitsView: UnitsViewAr,
        LoginView: LoginViewAr,
        DataFiles: DataFilesAr,
        FormBuilderView: FormBuilderViewAr,
        ContactProfileManagementView: ContactProfileManagementViewAr,
        PropertiesProfileManagementView: PropertiesProfileManagementViewAr,
        UnitsProfileManagementView: UnitsProfileManagementViewAr,
        LeadsProfileManagementView: LeadsProfileManagementViewAr,
        UnitsStatusManagementView: UnitsStatusManagementViewAr,
        ActivitiesView: ActivitiesViewAr,
        PortfolioView: PortfolioViewAr,
        HistoryView: HistoryAr,
        WorkOrdersView: WorkOrdersViewAr,
        WorkOrdersManagementView: WorkOrdersManagementViewAr,
        IncidentsView: IncidentsViewAr,
        OperatingCostsView: OperatingCostsAr,
        AssetsView: AssetsViewAr,
        MaintenanceContracts: MaintenanceContractsAr,
        SalesTransactionsView: SalesTransactionsViewAr,
        SalesTransactionsProfileView: SalesTransactionsProfileViewAr,
        LeasingTransactionsProfileView: LeasingTransactionsProfileViewAr,
        LeasingTransactionsView: LeasingTransactionsViewAr,
        InvoicesView: InvoicesViewAr,
        BulkAssign: BulkAssignAr,
        MonthlyCalendarView: MonthlyCalendarViewAr,
        MyLeadView: MyLeadViewAr,
        MyReferralsView: MyReferralsAr,
        SalesAvailabilityView: SalesAvailabilityAr,
        LeasingAvailabilityView: LeasingAvailabilityAr,
        TemplatesView: TemplatesViewAr,
        UnitsDialogsManagementView: UnitsDialogsManagementViewAr,
        ImagesGalleryGroup: ImagesGalleryGroupAr,
        RolesManagementView: RolesManagementViewAr,
        ContactsInfoPublic: ContactsInfoPublicAr,
        Agents: AgentsAr,
        ActivitiesType: ActivitiesTypeAr,
        Reports: ReportsAr,
        LocationView: LocationAr,
        Dashboard :  DashboardAr
      },
    },
  });

  if (localStorage.getItem('localization')) {
    moment.tz.setDefault(config.timeZone);
    i18next.changeLanguage(JSON.parse(localStorage.getItem('localization')).currentLanguage);
    const isRtl = JSON.parse(localStorage.getItem('localization')).currentLanguage === 'ar';
    if (isRtl) {
      const direction =
        JSON.parse(localStorage.getItem('localization')).currentLanguage === 'ar' ? 'rtl' : '';
      document.body.setAttribute('class', direction);
      document.body.setAttribute('dir', direction);
      document.documentElement.lang = JSON.parse(
        localStorage.getItem('localization')
      ).currentLanguage;
    }
  } else {
    localStorage.setItem('localization', JSON.stringify({ currentLanguage: 'en', isRtl: false }));
    i18next.changeLanguage('en');
  }
}

export const languageChange = (currentLanguage) => {
  const isRtl = currentLanguage === 'ar';
  const direction = currentLanguage === 'ar' ? 'rtl' : '';
  localStorage.setItem('localization', JSON.stringify({ currentLanguage, isRtl }));
  document.body.setAttribute('class', direction);
  document.body.setAttribute('dir', direction);
  document.documentElement.lang = currentLanguage;
  i18next.changeLanguage(currentLanguage);
  GlobalRerender();
};
localizationInit();
