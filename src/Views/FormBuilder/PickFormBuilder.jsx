/* eslint-disable no-unused-vars */
import React, { useEffect, useCallback, useState } from 'react';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  Inputs, Spinner, ViewTypes, PermissionsComponent, TabsComponent
} from '../../Components';
import { ViewTypesEnum } from '../../Enums';
import { FormBuilderGridView } from './FormBuilderGridView/FormBuilderGridView';
import { FormBuilderListView } from './FormBuilderListView/FormBuilderListView';
import { GetForms } from '../../Services/formbuilder/getForms';
// import { useTitle } from '../../Hooks';
import { FormBuilderPermissions } from '../../Permissions';
import { returnPropsByPermissions } from '../../Helper';

const parentTranslationPath = 'FormBuilderView';
const translationPath = '';

const PickFormBuilder = ({ loginResponse }) => {
  const { t } = useTranslation(parentTranslationPath);

  const [loading, setLoading] = React.useState(false);
  const [filter, setFilter] = React.useState({
    pageSize: 25,
    pageIndex: 0,
    searchedItem: '',
  });
  const [activeTab, setActiveTab] = useState(0);

  const [formsResponse, setFormsResponse] = React.useState({
    result: [],
    totalCount: 0
  });
  const [activeActionType, setActiveActionType] = React.useState(ViewTypesEnum.cards.key);

  const GetMyForms = useCallback(async () => {
    setLoading(true);
    if (returnPropsByPermissions(FormBuilderPermissions.ViewFormBuilder.permissionsId)) {
      const res = await GetForms(filter);
      if (!(res && res.status && res.status !== 200)) {
        if (activeTab === 0) {
          setFormsResponse({
            result: (res.result.length > 0 && res.result.filter((item) => !(item.formsName.includes('report') || item.formsName.includes('Report')))) || [],
            totalCount: res.totalCount || 0
          });
        } else {
          setFormsResponse({
            result: (res.result.length > 0 && res.result.filter((item) => (item.formsName.includes('report') || item.formsName.includes('Report')))) || [],
            totalCount: res.totalCount || 0
          });
        }
      }
    } else
      setFormsResponse({ result: [], totalCount: 0 });
    setLoading(false);
  }, [filter, activeTab]);
  useEffect(() => {
    GetMyForms();
  }, [GetMyForms, filter.searchedItem]);
  const onTypeChanged = useCallback(
    (activeType) => {
      setActiveActionType(activeType);
    },
    [setActiveActionType]
  );

  const handleAddForm = () => { };

  const searchHandler = (event) => {
    const { value } = event.target;
    setFilter((item) => ({ ...item, searchedItem: value }));
  };
  const onPageIndexChanged = (pageIndex) => {
    setFilter((item) => ({ ...item, pageIndex }));
  };
  const onPageSizeChanged = (pageSize) => {
    setFilter((item) => ({ ...item, pageIndex: 0, pageSize }));
  };
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };

  return (
    <div className='view-wrapper'>
      <Spinner isActive={loading} />
      <div className='header-section'>
        <div className='filter-section px-2'>
          <div className='section'>
            <Button className='btns theme-solid bg-primary' onClick={handleAddForm}>
              {t('AddForm')}
            </Button>
          </div>

          <div className='section px-2'>
            <PermissionsComponent
              permissionsList={Object.values(FormBuilderPermissions)}
              permissionsId={FormBuilderPermissions.ViewFormBuilder.permissionsId}
            >
              <Inputs
                idRef='usersSearchRef'
                variant='outlined'
                onInputChanged={searchHandler}
                fieldClasses='inputs theme-solid'
                value={filter.searchedItem}
                label={t('SearchForm')}
                beforeIconClasses='mdi mdi-magnify mdi-24px c-gray-primary'
              // onKeyUp={searchHandler}
              />

              <ViewTypes
                onTypeChanged={onTypeChanged}
                activeTypes={[ViewTypesEnum.tableView.key, ViewTypesEnum.cards.key]}
                className='mb-3'
              />
            </PermissionsComponent>
          </div>
        </div>
      </div>
      <PermissionsComponent
        permissionsList={Object.values(FormBuilderPermissions)}
        permissionsId={FormBuilderPermissions.ViewFormBuilder.permissionsId}
      >
        <div className='w-100 px-3 mt-3 mb-3'>
          <TabsComponent
            data={[{ label: 'forms' }, { label: 'reports' }]}
            labelInput='label'
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            themeClasses='theme-solid'
            currentTab={activeTab}
            onTabChanged={onTabChanged}
          />
        </div>
        {(
          activeActionType === ViewTypesEnum.tableView.key) ? (
            <FormBuilderListView
              formsResponse={formsResponse}
              page={filter.pageIndex}
              setPage={onPageIndexChanged}
              rowsPerPage={filter.pageSize}
              setRowsPerPage={onPageSizeChanged}
              reloadData={() => GetMyForms()}
              loginResponse={loginResponse}
            />
        ) : (
          <FormBuilderGridView
            formsResponse={formsResponse}
            reloadData={() => GetMyForms()}
            loginResponse={loginResponse}
          />
        )}
      </PermissionsComponent>
    </div>
  );
};
const mapStateToProps = (state) => {
  const {
    login: { loginResponse },
  } = state;
  return {
    loginResponse,
  };
};

const view = connect(mapStateToProps)(PickFormBuilder);
export { view as PickFormBuilder };
