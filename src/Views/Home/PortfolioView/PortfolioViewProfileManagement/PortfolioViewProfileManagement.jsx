import React, { useState } from 'react';
import { TabsComponent } from '../../../../Components';
import { PortfolioVerticalTabsData } from '../../Common/OpenFileView/OpenFileUtilities/OpenFileData';
import { PortfolioDetailsView } from './Sections';
import { PortfolioActivitiesView } from './Sections/ActivitiesViewCompoent/PortfolioActivitiesView';
import { BankAccountView } from './Sections/BankAccountViewCompoent/BankAccountView';
import { LandlordsView } from './Sections/LandlordsViewCompoent/LandlordsView';
import { MaintenaceContractView } from './Sections/MaintenaceContractViewCompoent/MaintenaceContractView';
import { PortfolioDocumentsView } from './Sections/PortfolioDocumentsViewCompoent/PortfolioDocumentsView';
import { UnitsDetailsView } from './Sections/UnitsDetailsViewCompoent/UnitsDetailsView';
import { OperatingCostsViewComponent } from './Sections/OperatingCostsViewComponent/OperatingCostsViewComponent';

const parentTranslationPath = 'PortfolioView';
const translationPath = '';
export const PortfolioViewProfileManagement = () => {
  const [activeTab, setActiveTab] = useState(0);

  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };

  return (
    <div className='contact-profile-wrapper view-wrapper'>
      <TabsComponent
        data={PortfolioVerticalTabsData}
        labelInput='label'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-solid'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
      />
      <div className='tabs-content-wrapper'>
        {activeTab === 0 && (
          <PortfolioDetailsView
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
        {activeTab === 1 && (
          <UnitsDetailsView
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
        {activeTab === 2 && (
          <LandlordsView
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}

        {activeTab === 3 && (
          <MaintenaceContractView
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
        {activeTab === 4 && (
          <BankAccountView
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
        {activeTab === 5 && (
          <PortfolioDocumentsView
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
        {activeTab === 6 && (
          <PortfolioActivitiesView
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
        {activeTab === 7 && (
          <OperatingCostsViewComponent
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
      </div>
    </div>
  );
};
