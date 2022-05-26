import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { CRMReportsRoutes } from '../../../routes/HomeRoutes/CRMReportsRoutes';

export const ReportsCRMLayout = () => (
  <SwitchRoute routes={CRMReportsRoutes} />
);
