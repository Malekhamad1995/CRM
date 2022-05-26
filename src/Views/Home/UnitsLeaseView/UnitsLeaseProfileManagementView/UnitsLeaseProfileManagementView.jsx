import { ButtonBase } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  TabsComponent,
  RadiosGroupComponent,
  Spinner,
  CompletedDataComponent,
  SelectComponet, CollapseComponent, PermissionsComponent
} from '../../../../Components';
import { ActionsEnum, UnitsStatusEnum } from '../../../../Enums';
import {
  GetParams, GlobalHistory, sideMenuComponentUpdate, returnPropsByPermissions
} from '../../../../Helper';
import { GetAllTemplatesByCategoriesId, unitDetailsGet } from '../../../../Services';
import { ActiveItemActions } from '../../../../store/ActiveItem/ActiveItemActions';
import { UnitsVerticalTabsData, UnitsVerticalTabsDataUnitsPropertyManagement } from '../../Common/OpenFileView/OpenFileUtilities/OpenFileData';
import { UnitMapper } from '../UnitLeaseMapper';
import { CardDetailsComponent } from '../UnitsLeaseUtilities';
import {
  UnitProfileMatchingComponent,
} from './Sections';
import { UnitPermissions } from '../../../../Permissions';
import { UnitTemplateDialog } from '../../UnitsView/UnitsProfileManagementView/Dialogs';
import { ContactsActionDialogsComponent } from '../../ContactsView/ContactsUtilities/ContactsActionDialogsComponent/ContactsActionDialogsComponent';

const parentTranslationPath = 'UnitsProfileManagementView';
const translationPath = '';
export const UnitsLeaseProfileManagementView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const activeItem = useSelector((state) => state.ActiveItemReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [unitData, setUnitData] = useState(null);
  const dispatch = useDispatch();
  const pathName = window.location.pathname.split('/home/')[1].split('/view')[0];
  const [activeTab, setActiveTab] = useState(0);
  const [viewType, setViewType] = useState(1);
  const [templates, setTemplates] = useState([]);
  const [activeTemplateId, setActiveTemplateId] = useState(-1);
  const [activeTemplateName, setActiveTemplateName] = useState(null);
  const [isOpenTemplateDialog, setIsOpenTemplateDialog] = useState(false);
  const [isOpenContactsActionDialog, setIsOpenContactsActionDialog] = useState(false);
  const [templateFile, setTemplateFile] = useState(null);
  const [dialogEnum, setDialogEnum] = useState(null);
  const [showPopover, setshowPopover] = useState(false);
  const [filter] = useState({
    pageIndex: 0,
    pageSize: 9999,
  });
  const [list, setList] = useState([]);
  const isPropertyManagementView = (pathName === 'units-property-management/unit-profile-edit');

  useEffect(() => {
    if (pathName === 'units-property-management/unit-profile-edit')
      setList([...UnitsVerticalTabsDataUnitsPropertyManagement]);
    else
      setList([...UnitsVerticalTabsData.rent]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [filterBy, setFilterBy] = useState({
    id: null,
    formType: null,
  });
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };

  useEffect(() => {
    setActiveTab(GetParams('matching') === 'true' ? 20 : 0);
  }, []);

  const onViewTypeChangedHandler = (event, newValue) => {
    setViewType(+newValue);
  };
  useEffect(() => {
    setFilterBy({
      formType: GetParams('formType'),
      id: GetParams('id'),
    });
  }, []);
  const detailedCardSideActionClicked = useCallback(
    (actionEnum, activeData) => async (event) => {
      event.stopPropagation();
      dispatch(ActiveItemActions.activeItemRequest(activeData));
      if (actionEnum === ActionsEnum.reportEdit.key) {
        if (pathName === 'units-property-management') {
          GlobalHistory.push(
            `/home/units-property-management/edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        } else if (pathName === 'units-lease') {
          GlobalHistory.push(
            `/home/units-lease/edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        }
      } else if (actionEnum === ActionsEnum.folder.key) {
        if (pathName === 'units-property-management') {
          GlobalHistory.push(
            `/home/units-property-management/unit-profile-edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        } else if (pathName === 'units-lease') {
          GlobalHistory.push(
            `/home/units-lease/unit-profile-edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
          );
        }

        // setSelectedDetailsUnitItem(activeData);
        // setOpenFileIsOpen(true);
      }
    },
    [dispatch, pathName]
  );
  const getUnitById = useCallback(async () => {
    setIsLoading(true);
    const res = await unitDetailsGet({ id: +filterBy.id });
    const unitDatails = UnitMapper(res);
    localStorage.setItem('unitModelRelatedData', JSON.stringify(unitDatails));
    dispatch(ActiveItemActions.activeItemRequest(unitDatails));
    if (!(res && res.status && res.status !== 200)) setUnitData(unitDatails);
    else setUnitData(null);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBy.id]);
  const getAllTemplatesByCategoriesId = useCallback(async () => {
    if (isPropertyManagementView) {
      if (!returnPropsByPermissions(UnitPermissions.ViewUnitTemplates.permissionsId))
        return;
    }
    const res = await GetAllTemplatesByCategoriesId({
      ...filter,
      categoriesIds: Object.values(UnitsStatusEnum)
        .filter(
         (item) => item.value.toLowerCase() === activeItem.lease_status.toLowerCase() && (item.category || item.leaseCategory)
        )
        .map(
          (item) =>
            (item.category && item.category.key) || (item.leaseCategory && item.leaseCategory.key)
        ),
    });
    if (!((res && res.data && res.data.ErrorId) || !res)) setTemplates(res.result || []);
    else setTemplates([]);
  }, [activeItem && activeItem.unitStatus && activeItem.unitStatus.key, filter, isPropertyManagementView]);
  useEffect(() => {
    if (unitData !== null) {
      sideMenuComponentUpdate(
        <CardDetailsComponent
          activeData={unitData}
          from={2}
          cardDetailsActionClicked={detailedCardSideActionClicked}
          parentTranslationPath='UnitsView'
          translationPath={translationPath}
        />
      );
      // sideMenuIsOpenUpdate(true);
    } else sideMenuComponentUpdate(null);
  }, [unitData, detailedCardSideActionClicked]);
  useEffect(() => {
    if (
      activeItem &&
      activeItem.unitStatus &&
      activeItem.unitStatus.key &&
      Object.values(UnitsStatusEnum).filter(
        (item) => item.key === activeItem.unitStatus.key && (item.category || item.leaseCategory)
      ).length > 0
    )
      getAllTemplatesByCategoriesId();
  }, [activeItem, getAllTemplatesByCategoriesId]);
  useEffect(() => {
    if (filterBy.id) getUnitById();
  }, [filterBy, getUnitById]);
  // ViewUnitTemplates
  return (
    <div className='units-profile-wrapper view-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='d-flex-v-center-h-between flex-wrap'>
        <div className='d-inline-flex-v-center flex-wrap'>
          <div className='d-inline-flex-v-center'>
            {isPropertyManagementView && (
              <PermissionsComponent
                permissionsList={Object.values(UnitPermissions)}
                permissionsId={UnitPermissions.ViewUnitTemplates.permissionsId}
              >
                <SelectComponet
                  data={templates}
                  keyLoopBy='templateId'
                  valueInput='templateId'
                  textInput='templateName'
                  value={activeTemplateId}
                  keyValue='actionsbuttons'
                  idRef='contactsActionsRef'
                  onSelectChanged={(value) => {
                    setActiveTemplateId(value);
                    if (value !== -1) {
                      const itemIndex = templates.findIndex((item) => item.templateId === value);
                      if (itemIndex !== -1) setActiveTemplateName(templates[itemIndex].templateName);
                      setIsOpenTemplateDialog(true);
                    }
                  }}
                  themeClass='theme-action-buttons'
                  translationPath={translationPath}
                  translationPathForData={translationPath}
                  wrapperClasses='bg-secondary c-white mx-2'
                  parentTranslationPath={parentTranslationPath}
                  emptyItem={{ value: -1, text: 'template', isHiddenOnOpen: true }}
                />
              </PermissionsComponent>
            )}
            {!isPropertyManagementView && (

              <SelectComponet
                data={templates}
                keyLoopBy='templateId'
                valueInput='templateId'
                textInput='templateName'
                value={activeTemplateId}
                keyValue='actionsbuttons'
                idRef='contactsActionsRef'
                onSelectChanged={(value) => {
                  setActiveTemplateId(value);
                  if (value !== -1) {
                    const itemIndex = templates.findIndex((item) => item.templateId === value);
                    if (itemIndex !== -1) setActiveTemplateName(templates[itemIndex].templateName);
                    setIsOpenTemplateDialog(true);
                  }
                }}
                themeClass='theme-action-buttons'
                translationPath={translationPath}
                translationPathForData={translationPath}
                wrapperClasses='bg-secondary c-white mx-2'
                parentTranslationPath={parentTranslationPath}
                emptyItem={{ value: -1, text: 'template', isHiddenOnOpen: true }}
              />
            )}
            <ButtonBase
              disabled={
                activeItem &&
                activeItem.lease_status &&
                activeItem.lease_status &&
                (activeItem.lease_status.toLowerCase() === 'draft' ||
                  activeItem.lease_status.toLowerCase() === 'available')
              }
              onClick={() =>
                GlobalHistory.push(`/home/units-lease/unit-profile-reservation?id=${activeItem.id}`)}
              className={`body-status btns ${(activeItem.lease_status && activeItem.lease_status === 'Available' && 'c-success-light') || (activeItem.lease_status === 'ReservedLeased' && 'c-primary') || 'bg-warning'
                }  bg-secondary-light px-4`}
            >
              <span className='body-status c-primary'>
                {(activeItem.lease_status &&
                activeItem.lease_status &&
                t(`${translationPath}${activeItem.lease_status}`)) ||
                'N/A'}
              </span>
            </ButtonBase>
          </div>
          {activeTab === 0 && (
            <div className='d-inline-flex-v-center'>
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
                translationPath={translationPath}
                translationPathForData={translationPath}
                parentTranslationPath={parentTranslationPath}
                onSelectedRadioChanged={onViewTypeChangedHandler}
              />
            </div>

          ) }

          {/* <div className='leadOwner'>
            <span>
              {' '}
              {t(`${translationPath}leadOwner`)}
              {' '}
              {' '}
              :
              {' '}

              <span className='leadName'>
                {(activeItem && activeItem.lead_owner ? `${activeItem.lead_owner.name || ''}    ${activeItem.lead_owner.phone ? `(${activeItem.lead_owner.phone})` : ''}` : 'N/A')}
              </span>

            </span>

          </div> */}
        </div>
        <div className='d-inline-flex'>
          <ButtonBase
            disabled={activeItem && activeItem.matchingLeadsNumber === 0}
            className='btns c-black-light'
            onClick={() => setActiveTab(20)}
          >
            <span className={ActionsEnum.matching.icon} />
            <span>{activeItem && activeItem.matchingLeadsNumber}</span>
            <span className='px-1'>{t(`${translationPath}matching`)}</span>
          </ButtonBase>

          <ButtonBase className='btns c-black-light' onClick={() => { setshowPopover(true); }}>
            <span className='mdi mdi-share-outline px-1' />
            <span className='px-1'>{t(`${translationPath}share`)}</span>
            <CollapseComponent
              onClickOutside={() => setshowPopover(false)}
              isOpen={showPopover}
              classes='popover-unit-share'
              top={30}
              component={(
                <div className='unit-model-items-wrapper'>
                  <ButtonBase
                    key='sms'
                    className='btns theme-transparent unit-model-item'
                    onClick={() => { setshowPopover(false); setDialogEnum('smsSolid'); }}
                  >
                    <span>sms</span>
                  </ButtonBase>
                  <ButtonBase
                    key='email'
                    className='btns theme-transparent unit-model-item'
                    onClick={() => { setshowPopover(false); setDialogEnum('emailSolid'); }}
                  >
                    <span>email</span>
                  </ButtonBase>

                </div>
              )}
            />
          </ButtonBase>
          {!isPropertyManagementView && (
            <CompletedDataComponent completedData={activeItem && activeItem.progress} />
          )}

          {isPropertyManagementView && (
            <PermissionsComponent
              permissionsList={Object.values(UnitPermissions)}
              permissionsId={UnitPermissions.ViewUnitHistory.permissionsId}
            >
              <CompletedDataComponent completedData={activeItem && activeItem.progress} />
            </PermissionsComponent>
          )}

        </div>
      </div>
      <TabsComponent
        data={list}
        labelInput='label'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-solid'
        dynamicComponentProps={{
          propertyId: unitData && unitData.property_name.id,
          activeItem,
          viewType,
          unitId: filterBy.id,
          parentTranslationPath,
          translationPath,
        }}
        currentTab={activeTab}
        onTabChanged={onTabChanged}
      />
      <div className='tabs-content-wrapper'>

        {activeTab === 20 && (
          <UnitProfileMatchingComponent
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
      </div>
      {isOpenTemplateDialog && (
        <UnitTemplateDialog
          templateId={activeTemplateId}
          unitId={filterBy.id}
          templateName={activeTemplateName}
          isOpen={isOpenTemplateDialog}
          isOpenChanged={() => {
            setIsOpenTemplateDialog(false);
            setActiveTemplateId(-1);
          }}
          emailClicked={(file) => {
            setTemplateFile(file);
            setIsOpenContactsActionDialog(true);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {isOpenContactsActionDialog && templateFile && (
        <ContactsActionDialogsComponent
          isOpen={isOpenContactsActionDialog}
          unitTemplateFile={templateFile}
          isOpenChanged={() => {
            setIsOpenContactsActionDialog(false);
            setTemplateFile(null);
          }}
          actionEnum='emailSolid'
          item={null}
          translationPath=''
          parentTranslationPath='ContactsView'
        />
      )}

      <ContactsActionDialogsComponent
        isOpenChanged={() => setDialogEnum(null)}
        isOpen={dialogEnum !== null}
        translationPath=''
        parentTranslationPath='ContactsView'
        actionEnum={dialogEnum}
        unitItem={activeItem}
        showlink
      />
    </div>
  );
};
