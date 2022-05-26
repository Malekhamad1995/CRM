import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { InvoicesRoutes } from '../../../routes';

export const InvoicesLayout = () => <SwitchRoute routes={InvoicesRoutes} />;
