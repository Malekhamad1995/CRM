import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TabsComponent } from '../Controls';
import { HistoryComponentTabs } from './TabsData/HistoryComponentTabs';
import { DialogComponent } from '../DialogComponent/DialogComponent';

const parentTranslationPath = 'HistoryView';
const translationPath = '';

export const HistoryTabsComponent = ({ isOpen, isOpenChanged }) => {
  const pathName = window.location.pathname.split('/home/')[1].split('/')[1];
  const [activeTab, setActiveTab] = useState(0);
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };

  return (
    <DialogComponent
      titleText='history'
      maxWidth='lg'
      dialogContent={(
        <div className='d-flex-column-center'>
          <TabsComponent
            wrapperClasses='w-100'
            data={
              pathName.includes('unit') ?
                HistoryComponentTabs :
                HistoryComponentTabs.filter((item) => item.label !== 'transaction-history')
            }
            labelInput='label'
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            themeClasses='theme-solid'
            currentTab={activeTab}
            onTabChanged={onTabChanged}
            dynamicComponentProps={{
              parentTranslationPath,
              translationPath,
            }}
          />
        </div>
      )}
      isOpen={isOpen}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

HistoryTabsComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
};
