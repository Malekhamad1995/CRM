import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { DashboardRoutes } from '../../../routes';

export const DashboardLayout = () => (
  <>
    <SwitchRoute routes={DashboardRoutes} />
  </>
);