import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { ContactsRoutesPropertyManagement } from '../../../routes';

export const ContactsPropertyManagementLayout = () => (
  <SwitchRoute routes={ContactsRoutesPropertyManagement} />
);
