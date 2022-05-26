import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { BranchesRoutes } from '../../../routes/HomeRoutes/BranchesRoutes';

export const BranchesLayout = () => (
  <SwitchRoute routes={BranchesRoutes} />
);
