import React, { useEffect, useState } from 'react';
import { TabsComponent } from '../../../../Components';
import { GetParams } from '../../../../Helper';
import { IncidentsViewTabsData } from '../TabsData';
import { IncidentsDocumentsView } from './Sections';
import { IncidentsReferenceComponent } from './Sections/IncidentsReferenceComponent/IncidentsReferenceComponent';

const parentTranslationPath = 'IncidentsView';
const translationPath = '';
export const IncidentsManagementView = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeview, setactiveview] = useState(0);
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };

  useEffect(() => {
    if (+GetParams('id') !== 0 || null || undefined) setactiveview(1);
    else setactiveview(0);
  }, []);

  return (
    <div className='work-orders-management-wrapper view-wrapper'>
      {activeview === 1 && (
        <TabsComponent
          data={IncidentsViewTabsData}
          labelInput='label'
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          themeClasses='theme-solid'
          currentTab={activeTab}
          onTabChanged={onTabChanged}
        />
      )}
      {activeTab === 0 && (
        <IncidentsReferenceComponent
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {activeTab === 1 && (
        <IncidentsDocumentsView
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};
