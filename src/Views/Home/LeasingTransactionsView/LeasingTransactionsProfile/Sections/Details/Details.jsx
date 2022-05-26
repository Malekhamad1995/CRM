import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TabsComponent } from '../../../../../../Components';
import { LeasingTransactionsDetailsTabs } from '../../LeasingTransactionsProfileTabs';

export const Details = ({
  unitId,
  unitTransactionId,
  parentTranslationPath,
  translationPath,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  return (
    <div className='leasing-transactions-details-wrapper childs-wrapper'>
      <TabsComponent
        data={LeasingTransactionsDetailsTabs}
        labelInput='label'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-curved'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
        dynamicComponentProps={{
          unitId,
          unitTransactionId,
          parentTranslationPath,
          translationPath,
        }}
      />
    </div>
  );
};

Details.propTypes = {
  unitId: PropTypes.number,
  unitTransactionId: PropTypes.number,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
Details.defaultProps = {
  unitId: null,
  unitTransactionId: null,
};
