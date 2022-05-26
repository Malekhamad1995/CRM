import React, { useEffect, useState ,useCallback} from 'react';
import { useSelector } from 'react-redux';
import {
  TabsComponent,
  RadiosGroupComponent,
  CompletedDataComponent,
} from '../../../../Components';
import { GetParams } from '../../../../Helper';
import { LeadsVerticalTabsData, LeadsVerticalTabsData2 } from '../../Common/OpenFileView/OpenFileUtilities/OpenFileData';
const parentTranslationPath = 'LeadsProfileManagementView';
const translationPath = '';
export const LeadsProfileManagementView = () => {
  const [pathName, setPathName] = useState('');
  const [list, setList] = useState([]);
  const [isPropertyManagementView, setIsPropertyManagementView] = useState(false);
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
    setIsPropertyManagementView(pathName === 'properties' || pathName === 'properties/property-profile-edit');
  }, [pathName]);
  useEffect(() => {
    if (isPropertyManagementView)
      setList([...LeadsVerticalTabsData2]);
    else
      setList([...LeadsVerticalTabsData]);
  }, [isPropertyManagementView]);
  useEffect(() => {
    setFilterBy({
      formType: GetParams('formType'),
      id: GetParams('id'),
    });
    setPathName(window.location.pathname.split('/home/')[1].split('/view')[0]);
  }, []);

  return (
    <div className='leads-profile-wrapper view-wrapper'>
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
      <div className='m3'>
        <TabsComponent
          data={list}
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
          }}
        />
      </div>

      <div className='tabs-content-wrapper' />
    </div>
  );
};
