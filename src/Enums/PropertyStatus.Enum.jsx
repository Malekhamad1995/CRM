import { OffPlan, Completed, PreLaunch } from '../assets/json/StaticLookupsIds.json';

export const PropertyStatusEnum = {
  'Off-Plan': {
    value: 'off-plan',
    class: 'bg-warning',
    id: OffPlan,
  },
  Completed: {
    value: 'completed',
    class: 'bg-success',
    id: Completed,
  },
  'Pre Launch': {
    value: 'Pre-Launch',
    class: 'bg-primary',
    id: PreLaunch,
  },
};
