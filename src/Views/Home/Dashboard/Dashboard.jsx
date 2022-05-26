import React, { useState } from 'react';
import { TabsComponent } from '../../../Components';
import { DashboardTabs } from './DashboardTabs/DashboardTabs';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  return (
    <div>
      <TabsComponent
        data={DashboardTabs}
        labelInput='label'
        themeClasses='theme-solid'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
        dynamicComponentProps={{
          setActiveTab,
          dynamicComponentProps: Object.values(DashboardTabs).find(
            (element) => element.index === activeTab
          ),
        }}
      />
    </div>
  );
};
