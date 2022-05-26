import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { UnitsRoutes } from '../../../routes';

export const UnitsLayout = () => (
  <>
    <SwitchRoute routes={UnitsRoutes} />
  </>
);
