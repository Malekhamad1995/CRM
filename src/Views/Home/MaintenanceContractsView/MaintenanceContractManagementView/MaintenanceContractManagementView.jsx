import React, { useEffect, useState } from 'react';
import { GetParams } from '../../../../Helper';
import { TabsComponent } from '../../../../Components';
import { MaintenanceContractTabsData } from './TabsData';

const parentTranslationPath = 'MaintenanceContracts';
const translationPath = '';
export const MaintenanceContractManagementView = () => {
  const [id, setId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  useEffect(() => {
    const localId = GetParams('id');
    if (localId) setId(+localId);
  }, []);
  return (
    <div className='maintenance-contract-management-wrapper view-wrapper'>
      <TabsComponent
        data={MaintenanceContractTabsData}
        labelInput='label'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-solid'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
        dynamicComponentProps={{
          maintenanceContractId: id,
        }}
      />
    </div>
  );
};
