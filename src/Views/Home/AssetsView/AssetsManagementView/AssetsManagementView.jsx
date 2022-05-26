import React, { useState } from 'react';
import { TabsComponent } from '../../../../Components';
import { AssetsViewTabsData } from '../TabsData/AssetsManagementTabsData';
import { AssetsDocumentsView, AssetsReferenceComponent } from './Sections';

const parentTranslationPath = 'AssetsView';
const translationPath = '';

export const AssetsManagementView = () => {
  const [activeTab, setActiveTab] = useState(0);
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  const pathName = window.location.pathname.split('/home/')[1].split('/')[1];

  return (
    <div className='work-orders-management-wrapper view-wrapper'>
      <TabsComponent
        data={
          pathName === 'add' ?
            AssetsViewTabsData.filter((item) => item.label !== 'images') :
            AssetsViewTabsData
        }
        labelInput='label'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-solid'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
      />
      {activeTab === 0 && (
        <AssetsReferenceComponent
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {activeTab === 1 && pathName === 'edit' && (
        <AssetsDocumentsView
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};
