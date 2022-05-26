import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { DistrictsRoutes } from '../../../routes';

export const DistrictsLayout = () => (
  <>
    <SwitchRoute routes={DistrictsRoutes} />
  </>
);
