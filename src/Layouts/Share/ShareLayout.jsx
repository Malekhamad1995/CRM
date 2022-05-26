import React from 'react';
import { SwitchRoute } from '../../Components/Route/SwitchRoute';
import { ShareRoutes } from '../../routes/ShareRoutes/ShareRoutes';

const ShareLayout = () => (
  <div className='share-layout-wrapper'>
    <SwitchRoute routes={ShareRoutes} />
  </div>
);

export { ShareLayout };
