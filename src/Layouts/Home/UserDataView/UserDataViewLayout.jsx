import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { UserDataViewRoutes } from '../../../routes/HomeRoutes/UserDataViewRoutes';

export const UserDataViewLayout = () => (
  <>
    <div className="content-wrapper">
      <SwitchRoute routes={UserDataViewRoutes} />
    </div>
  </>
);
