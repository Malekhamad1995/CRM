import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { SubCommunitiesRoutes } from '../../../routes';

export const SubCommunitiesLayout = () => (
  <>
    <SwitchRoute routes={SubCommunitiesRoutes} />
  </>
);
