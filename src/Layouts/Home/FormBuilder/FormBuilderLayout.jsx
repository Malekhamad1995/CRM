import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { FormBuilderRoutes } from '../../../routes';


export const FormBuilderLayout = () => (
  <>
    <div className="content-wrapper">
      <SwitchRoute routes={FormBuilderRoutes} />
    </div>
    </>
)
