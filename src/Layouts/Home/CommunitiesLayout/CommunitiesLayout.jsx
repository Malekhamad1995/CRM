import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { CommunitiesRoutes } from '../../../routes';

export const CommunitiesLayout = () => (
  <>
    <SwitchRoute routes={CommunitiesRoutes} />
  </>
);
