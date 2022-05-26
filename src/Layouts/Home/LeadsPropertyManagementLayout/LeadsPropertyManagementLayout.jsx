import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { LeadsPropertyManagmentRoutes } from '../../../routes';

export const LeadsPropertyManagementLayout = () => (
  <SwitchRoute routes={LeadsPropertyManagmentRoutes} />
);
