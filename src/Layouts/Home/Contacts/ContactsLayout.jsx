import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { ContactsRoutes } from '../../../routes';

export const ContactsLayout = () => (
  <>
    <SwitchRoute routes={ContactsRoutes} />
  </>
);
