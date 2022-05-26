import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PropertiesProfileImagesComponentTabsData } from './PropertiesProfileImagesComponentTabsData';
import { PropertiesImage } from './PropertiesImage';
import { TabsComponent } from '../../../../../../Components';
import { Locationimages } from './Locationimages';

export const PropertiesProfileImagesComponent = ({ parentTranslationPath, translationPath }) => {
  const [activeTab, setActiveTab] = useState(0);
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  return (
    <div className='properties-images-tabs mx-2 mt-3'>
      <div>
        <TabsComponent
          data={PropertiesProfileImagesComponentTabsData}
          labelInput='tab'
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          themeClasses='theme-curved'
          currentTab={activeTab}
          onTabChanged={onTabChanged}
        />
      </div>
      {activeTab === 0 && (
        <PropertiesImage
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {activeTab === 1 && (
        <Locationimages
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />

      )}
    </div>
  );
};

PropertiesProfileImagesComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
