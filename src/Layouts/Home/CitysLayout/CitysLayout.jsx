import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { CitiesRoutes } from '../../../routes';

export const CitysLayout = () => (
  <>
    <SwitchRoute routes={CitiesRoutes} />
  </>
);
