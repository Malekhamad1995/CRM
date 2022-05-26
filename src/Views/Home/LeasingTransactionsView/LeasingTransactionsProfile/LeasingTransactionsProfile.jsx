import React, { useEffect, useState } from 'react';
import { GetParams } from '../../../../Helper';
import { TabsComponent } from '../../../../Components';
import { LeasingTransactionsProfileTabs } from './LeasingTransactionsProfileTabs';

const parentTranslationPath = 'LeasingTransactionsProfileView';
const translationPath = '';
export const LeasingTransactionsProfile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [params, setParams] = useState({
    unitId: null,
    unitTransactionId: null,
  });
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  useEffect(() => {
    const unitId = GetParams('unitId');
    const unitTransactionId = GetParams('unitTransactionId');
    if (unitTransactionId || unitId) {
      setParams({
        unitId: (unitId && +unitId) || null,
        unitTransactionId: (unitTransactionId && +unitTransactionId) || null,
      });
    }
  }, []);
  return (
    <div className='leasing-transactions-profile-wrapper view-wrapper'>
      <TabsComponent
        data={LeasingTransactionsProfileTabs}
        labelInput='label'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-solid'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
        dynamicComponentProps={{
          ...params,
          parentTranslationPath,
          translationPath,
        }}
      />
    </div>
  );
};
