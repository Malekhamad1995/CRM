import { MainDashboard } from "../MainDashboard/MainDashboard";
import { PowerBiEnum } from "../../../../Enums";

export const DashboardTabs = [
  {
    index: 0,
    label: "Dashboard:sales",
    component: MainDashboard,
    config: {
      reportId: PowerBiEnum.salesToken.reportid,
      groupId: PowerBiEnum.salesToken.groupid,
      Url: PowerBiEnum.salesToken.url,
    },
  },
  {
    index: 1,
    label: "Dashboard:lease",
    component: MainDashboard,
    config: {
      reportId: PowerBiEnum.leasingToken.reportid,
      groupId: PowerBiEnum.leasingToken.groupid,
      Url: PowerBiEnum.leasingToken.url,
    },
  },
  {
    index: 2,
    label: "Dashboard:call-center",
    component: MainDashboard,
    config: {
      reportId: PowerBiEnum.callCenter.reportid,
      groupId: PowerBiEnum.callCenter.groupid,
      Url: PowerBiEnum.callCenter.url,
    },
  },
  {
    index: 3,
    label: "Dashboard:marketing",
    component: MainDashboard,
    config: {
      reportId: PowerBiEnum.marketing.reportid,
      groupId: PowerBiEnum.marketing.groupid,
      Url: PowerBiEnum.marketing.url,
    },
  },
  {
    index: 4,
    label: "Dashboard:PSI-Daily",
    component: MainDashboard,
    config: {
      reportId: PowerBiEnum.psidaily.reportid,
      groupId: PowerBiEnum.psidaily.groupid,
      Url: PowerBiEnum.psidaily.url,
    },
  },
  {
    index: 5,
    label: "Dashboard:saleslistingmanager",
    component: MainDashboard,
    config: {
      reportId: PowerBiEnum.saleslistingmanager.reportid,
      groupId: PowerBiEnum.saleslistingmanager.groupid,
      Url: PowerBiEnum.saleslistingmanager.url,
    },
  },
  {
    index: 6,
    label: "Dashboard:leaselistingmanager",
    component: MainDashboard,
    config: {
      reportId: PowerBiEnum.leaselistingmanager.reportid,
      groupId: PowerBiEnum.leaselistingmanager.groupid,
      Url: PowerBiEnum.leaselistingmanager.url,
    },
  },
  {
    index: 7,
    label: "Dashboard:accounts",
    component: MainDashboard,
    config: {
      reportId: PowerBiEnum.accounts.reportid,
      groupId: PowerBiEnum.accounts.groupid,
      Url: PowerBiEnum.accounts.url,
    },
  },
];
