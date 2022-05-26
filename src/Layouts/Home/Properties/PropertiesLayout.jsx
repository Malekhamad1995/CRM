import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { PropertiesRoutes } from '../../../routes';

export const PropertiesLayout = () => (
  <>
    <SwitchRoute routes={PropertiesRoutes} />
  </>
);
