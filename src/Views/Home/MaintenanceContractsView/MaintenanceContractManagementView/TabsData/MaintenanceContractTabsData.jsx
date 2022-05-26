import { AddMaintenanContractView } from '../AddMaintenanContractView';
import {
    MaintenanceContractActivitiesComponent,
  MaintenanceContractDocumentsComponent,
  MaintenanceContractWorkOrderComponent,
} from '../Sections';

export const MaintenanceContractTabsData = [
  { label: 'contract-details', component: AddMaintenanContractView },
  { label: 'work-order', component: MaintenanceContractWorkOrderComponent },
  { label: 'documents', component: MaintenanceContractDocumentsComponent },
  { label: 'activities', component: MaintenanceContractActivitiesComponent },
];
