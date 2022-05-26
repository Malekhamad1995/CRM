import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { CountryRoutes } from '../../../routes';

export const CountryLayout = () => (
  <>
    <SwitchRoute routes={CountryRoutes} />
  </>
);
