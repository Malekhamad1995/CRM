import React from 'react';
import { SwitchRoute } from '../../Components/Route/SwitchRoute';
import { AccountRoutes } from '../../routes/AccountRoutes/AccountRoutes';

const AccountLayout = () => (
  <div className='account-layout-wrapper'>
    <SwitchRoute routes={AccountRoutes} />
  </div>
  );

export { AccountLayout };
