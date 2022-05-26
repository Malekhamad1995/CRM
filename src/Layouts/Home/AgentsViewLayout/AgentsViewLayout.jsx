import React from 'react';
import { SwitchRoute } from '../../../Components/Route/SwitchRoute';
import { AgentsViewRoutes } from '../../../routes/HomeRoutes/AgentsViewRoutes';

export const AgentsViewLayout = () => <SwitchRoute routes={AgentsViewRoutes} />;
