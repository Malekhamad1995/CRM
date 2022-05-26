import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { LookupsRoutes } from '../../../routes';

export const LookupsLayout = () => {
  return <SwitchRoute routes={LookupsRoutes} />;
};
