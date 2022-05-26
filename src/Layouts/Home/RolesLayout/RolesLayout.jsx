import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { RolesRoutes } from '../../../routes';

function RolesLayout() {
  return (
    <>
      <SwitchRoute routes={RolesRoutes} />
    </>
  );
}

export { RolesLayout };
