import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  TabsComponent,
  RadiosGroupComponent,
  CompletedDataComponent,
  PermissionsComponent
} from '../../../../Components';
import { GetParams } from '../../../../Helper';
import { LeadsVerticalTabsData } from '../../Common/OpenFileView/OpenFileUtilities/OpenFileData';
import { LeadsSalesPermissions } from '../../../../Permissions/Sales/LeadsSalesPermissions';

const parentTranslationPath = 'LeadsProfileManagementView';
const translationPath = '';
export const LeadsSalesProfileManagementView = () => {
  const activeItem = useSelector((state) => state.ActiveItemReducer);
  const [activeTab, setActiveTab] = useState(0);
  const localActiveItem = localStorage.getItem('activeItem');
  const [viewType, setViewType] = useState(1);
  // filterBy
  const [, setFilterBy] = useState({
    id: null,
    formType: null,
  });

  useEffect(() => {
    setActiveTab(GetParams('matching') === 'true' ? 1 : 0);
  }, []);

  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  const onViewTypeChangedHandler = (event, newValue) => {
    setViewType(+newValue);
  };
  useEffect(() => {
    setFilterBy({
      formType: GetParams('formType'),
      id: GetParams('id'),
    });
  }, []);

  return (
    <div className='leads-profile-wrapper view-wrapper'>
      <PermissionsComponent
        permissionsList={Object.values(LeadsSalesPermissions)}
        permissionsId={
          LeadsSalesPermissions.ViewMatchingUnits.permissionsId,
          LeadsSalesPermissions.ViewLeadDetails.permissionsId
        }
      >
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
          <CompletedDataComponent
            completedData={
              activeItem && activeItem.progress ?
                activeItem.progress :
                JSON.parse(localActiveItem) && JSON.parse(localActiveItem).progress
            }
          />
        </div>
      </PermissionsComponent>
      <TabsComponent
        data={LeadsVerticalTabsData}
        labelInput='label'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-solid'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
        dynamicComponentProps={{
          viewType,
          parentTranslationPath,
          translationPath,
          setActiveTab,
        }}
      />
    </div>
  );
};
