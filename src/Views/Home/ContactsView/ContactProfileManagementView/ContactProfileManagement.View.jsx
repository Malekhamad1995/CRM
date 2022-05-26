import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  TabsComponent,
  RadiosGroupComponent,
  CompletedDataComponent,
} from '../../../../Components';
import { GetParams } from '../../../../Helper';
import { ContactsVerticalTabsData } from '../../Common/OpenFileView/OpenFileUtilities/OpenFileData';
import { MaintenanceCompanyEnum } from '../../../../Enums';

const parentTranslationPath = 'ContactProfileManagementView';
const translationPath = '';
export const ContactProfileManagementView = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [viewType, setViewType] = useState(1);
  const activeItem = useSelector((state) => state.ActiveItemReducer);
  // filterBy
  const [filterBy, setFilterBy] = useState({
    id: null,
    formType: null,
  });
  const showMaintenance =
    activeItem &&
    activeItem.contactClassifications &&
    activeItem.contactClassifications.findIndex(
      (item) => item.lookupItemId === MaintenanceCompanyEnum.id
    ) !== -1;

  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  const onViewTypeChangedHandler = (event, newValue) => {
    setViewType(+newValue);
  };
  useEffect(() => {
    setFilterBy({
      formType: (GetParams('formType') && +GetParams('formType')) || null,
      id: (GetParams('id') && +GetParams('id')) || null,
    });
  }, []);
  return (
    <div className='contact-profile-wrapper view-wrapper'>
      <div className='d-flex'>
        <RadiosGroupComponent
          idRef='viewDataRef'
          data={[
            {
              key: 1,
              value: 'all-data',
            },
            {
              key: 2,
              value: 'missing-data',
            },
          ]}
          value={viewType}
          labelValue='view'
          labelInput='value'
          valueInput='key'
          themeClass='theme-line'
          parentTranslationPath={parentTranslationPath}
          translationPathForData={translationPath}
          translationPath={translationPath}
          onSelectedRadioChanged={onViewTypeChangedHandler}
        />
        <CompletedDataComponent completedData={activeItem && activeItem.progress} />
      </div>
      <TabsComponent
        data={
          showMaintenance ?
            ContactsVerticalTabsData :
            ContactsVerticalTabsData.filter((item) => item.label !== 'maintenance-services')
        }
        labelInput='label'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-solid'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
        dynamicComponentProps={{
          id: filterBy.id,
          viewType,
          parentTranslationPath,
          translationPath,
          setActiveTab,
        }}
      />
    </div>
  );
};
