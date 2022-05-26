import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { Spinner, TabsComponent } from '../../../../Components';
import {
  ContactsVerticalTabsData,
  PropertiesVerticalTabsData,
  LeadsVerticalTabsData,
  UnitsVerticalTabsData,
} from './OpenFileUtilities/OpenFileData';
import { OpenFileEnum } from '../../../../Enums';
import { formByIdGet } from '../../../../Services';
import {
  OpenFileContactsComponent,
  OpenFilePropertiesComponent,
  OpenFileLeadsUnitsComponent,
  OpenFileLeadsComponent,
  OpenFileUnitsComponent,
  OpenFileContactsUnitComponent,
  OpenFilePropertiesUnitsComponent,
  OpenFileLeadsUnitsPropertiesComponent,
} from './OpenFileUtilities/OpenFileComponents';
import { stepsGenerator } from '../../../../Helper';

import { RepeatedItemDialog } from '../../FormBuilder/Dialogs/RepeatedItemDialog';

const translationPath = '';
export const OpenFileComponent = ({
 activeItem, pageName, onOpenFileClose, onReload
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formContent, setFormContent] = useState(() => []);
  const [formSteps, setFormSteps] = useState(() => []);
  const [othersDialogIsOpen, setOthersDialogIsOpen] = useState(false);
  const [othersDialogObj, setOthersDialogObj] = useState(() => ({}));
  const [formContentResponse, setFormContentResponse] = useState(() => ({}));
  const [isLoading, setIsLoading] = useState(false);
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  const tabsInit = useCallback(() => {
    if (pageName === OpenFileEnum.contacts.key) return ContactsVerticalTabsData;
    if (pageName === OpenFileEnum.properties.key) return PropertiesVerticalTabsData;
    if (pageName === OpenFileEnum.leads.key) return LeadsVerticalTabsData;
    if (pageName === OpenFileEnum.units.key) return UnitsVerticalTabsData;
    return null;
  }, [pageName]);
  const stepsHandler = useCallback(() => {
    const formContentRes = JSON.parse(formContent[0].form_content);
    setFormContentResponse(formContentRes);
    setFormSteps(stepsGenerator(formContentRes));
  }, [formContent]);
  const getForm = useCallback(async () => {
    setIsLoading(true);
    const response = await formByIdGet({
      formname:
        (pageName === OpenFileEnum.properties.key && 'property')
        || (pageName === OpenFileEnum.leads.key
          && activeItem.leadTypeId
          && (activeItem.leadTypeId.toString() === '1' ? 'Owner Lead' : 'Seeker Lead'))
        || (pageName === OpenFileEnum.units.key
          && activeItem.unitTypeId
          && (activeItem.unitTypeId.toString() === '1' ? 'Sale Unit' : 'Rent Unit'))
        || (pageName === OpenFileEnum.contacts.key
          && activeItem.userTypeId
          && (activeItem.userTypeId.toString() === '1' ? 'contacts' : 'company'))
        || pageName,
    });
    if (!(response && response.status && response.status !== 200)) setFormContent(response);
    setIsLoading(false);
  }, [activeItem.leadTypeId, activeItem.unitTypeId, activeItem.userTypeId, pageName]);
  useEffect(() => {
    if (formContent.length > 0) stepsHandler();
    return () => {};
  }, [formContent, stepsHandler]);
  const othersActionValueClicked = useCallback(
    (othersDialog) => async () => {
      await setOthersDialogObj(othersDialog);
      await setOthersDialogIsOpen(true);
    },
    []
  );
  const getBodyComponent = () => {
    if (activeItem && pageName === OpenFileEnum.contacts.key) {
      if (activeTab === 0) {
        return (
          <OpenFileContactsComponent
            activeItem={activeItem}
            formSteps={formSteps}
            othersActionValueClicked={othersActionValueClicked}
            onOpenFileSaved={onReload}
          />
        );
      }
      if (activeTab === 1) return <OpenFileLeadsUnitsComponent activeItem={activeItem} />;
      if (activeTab === 2) return <OpenFileContactsUnitComponent activeItem={activeItem} />;
      return null;
    }
    if (activeItem && pageName === OpenFileEnum.properties.key) {
      if (activeTab === 0) {
        return (
          <OpenFilePropertiesComponent
            activeItem={activeItem}
            formSteps={formSteps}
            othersActionValueClicked={othersActionValueClicked}
            onOpenFileSaved={onReload}
          />
        );
      }
      if (activeTab === 1) return <OpenFilePropertiesUnitsComponent activeItem={activeItem} />;

      return null;
    }
    if (activeItem && pageName === OpenFileEnum.leads.key) {
      if (activeTab === 0) {
        return (
          <OpenFileLeadsComponent
            activeItem={activeItem}
            formSteps={formSteps}
            othersActionValueClicked={othersActionValueClicked}
            onOpenFileSaved={onReload}
          />
        );
      }
      if (activeTab === 1) return <OpenFileLeadsUnitsPropertiesComponent activeItem={activeItem} />;
    }
    if (activeItem && pageName === OpenFileEnum.units.key && activeTab === 0) {
      return (
        <OpenFileUnitsComponent
          activeItem={activeItem}
          formSteps={formSteps}
          othersActionValueClicked={othersActionValueClicked}
          onOpenFileSaved={onReload}
        />
      );
    }
    return null;
  };
  useEffect(() => {
    tabsInit();
    if (activeTab === 0) getForm();
    return () => {};
  }, [activeItem, activeTab, getForm, tabsInit]);
  return (
    <div className="open-file-component component-wrapper p-relative">
      <Spinner isActive={isLoading} isAbsolute />
      <div className="d-flex-column p-relative pt-3 h-100">
        <Button
          className="btns-icon theme-solid p-absolute-tr-10px bg-warning"
          onClick={onOpenFileClose}
        >
          <span className="mdi mdi-close" />
        </Button>
        <TabsComponent
          data={tabsInit()}
          labelInput="label"
          parentTranslationPath="OpenFileView"
          translationPath={translationPath}
          currentTab={activeTab}
          wrapperClasses="mx-5"
          onTabChanged={onTabChanged}
        />
        <div className="body-wrapper">{getBodyComponent()}</div>
      </div>
      {othersDialogObj.data && othersDialogIsOpen && (
        <RepeatedItemDialog
          open={othersDialogIsOpen}
          item={othersDialogObj.data}
          type={othersDialogObj.type}
          initialState={othersDialogObj.others}
          label={othersDialogObj.label}
          closeDialog={() => {
            setOthersDialogIsOpen(false);
          }}
          selectedValues={othersDialogObj.others}
          itemList={formContentResponse[0].data.schema.properties}
        />
      )}
    </div>
  );
};
OpenFileComponent.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  pageName: PropTypes.string.isRequired,
  onOpenFileClose: PropTypes.func.isRequired,
  onReload: PropTypes.func.isRequired,
};
OpenFileComponent.defaultProps = {
  //   translationPath: '',
};
