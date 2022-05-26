import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  TabsComponent,
  RadiosGroupComponent,
  CompletedDataComponent,
} from '../../../../Components';
import { GetParams } from '../../../../Helper';
import { PropertiesVerticalTabsData, PropertiesVerticalTabsData2 } from '../../Common/OpenFileView/OpenFileUtilities/OpenFileData';

const parentTranslationPath = 'PropertiesProfileManagementView';
const translationPath = '';

export const PropertiesProfileManagementView = () => {
  const activeItem = useSelector((state) => state.ActiveItemReducer);
  const [activeTab, setActiveTab] = useState(0);
  const [viewType, setViewType] = useState(1);
  const [pathName, setPathName] = useState('');
  const [list, setList] = useState([]);
  const [isPropertyManagementView, setIsPropertyManagementView] = useState(false);


  const localActiveItem = localStorage.getItem('activeItem');
  const [filterBy, setFilterBy] = useState({
    id: null,
    formType: null,
  });
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  const onViewTypeChangedHandler = (event, newValue) => {
    setViewType(+newValue);
  };
  useEffect(() => {
    setIsPropertyManagementView(pathName === 'properties' || pathName === 'properties/property-profile-edit');
  }, [pathName]);
  useEffect(() => {
    if (isPropertyManagementView)
      setList([...PropertiesVerticalTabsData2]);
    else
      setList([...PropertiesVerticalTabsData]);
  }, [isPropertyManagementView]);

  useEffect(() => {
    setFilterBy({
      formType: GetParams('formType'),
      id: (GetParams('id') && +GetParams('id')) || null,
    });
    setPathName(window.location.pathname.split('/home/')[1].split('/view')[0]);
  }, []);
  return (
    <div className='properties-profile-wrapper view-wrapper'>
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
          translationPath={translationPath}
          translationPathForData={translationPath}
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
      <TabsComponent
        data={list}
        labelInput='label'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-solid'
        currentTab={activeTab}
        onTabChanged={onTabChanged}
        dynamicComponentProps={{
          propertyId: filterBy.id,
          viewType,
          parentTranslationPath,
          translationPath,
          setActiveTab,
        }}
      />
    </div>
  );
};
