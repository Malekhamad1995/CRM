import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { TabsComponent } from '../../../../Components';
import { GetParams } from '../../../../Helper';
import { SalesTransactionsProfileTabsData } from './SalesTransactionsProfileTabs';

const parentTranslationPath = 'SalesTransactionsProfileView';
const translationPath = '';
export const SalesTransactionsProfile = () => {
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
    <div className='sales-transactions-profile-wrapper view-wrapper'>
      <TabsComponent
        data={SalesTransactionsProfileTabsData}
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

// SalesTransactionsProfileView.propTypes = {};
