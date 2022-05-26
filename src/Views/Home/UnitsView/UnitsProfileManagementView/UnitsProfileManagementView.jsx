import { ButtonBase } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  TabsComponent,
  RadiosGroupComponent,
  Spinner,
  CompletedDataComponent,
} from '../../../../Components';
import { ActionsEnum, UnitsOperationTypeEnum } from '../../../../Enums';
import { GetParams, GlobalHistory, sideMenuComponentUpdate } from '../../../../Helper';
import { unitDetailsGet } from '../../../../Services';
import { UnitsVerticalTabsData } from '../../Common/OpenFileView/OpenFileUtilities/OpenFileData';
import { UnitMapper } from '../UnitMapper';
import { CardDetailsComponent } from '../UnitsUtilities';
import {
  UnitProfileDocumentsComponent,
  UnitProfilePayablesComponent,
  UnitProfileActivitiesComponent,
  UnitProfilePaymentDetailsComponent,
  UnitProfileMarketingComponent,
  UnitProfileMatchingComponent,
  UnitParkingComponent,
} from './Sections';

const parentTranslationPath = 'UnitsProfileManagementView';
const translationPath = '';
export const UnitsProfileManagementView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const activeItem = useSelector((state) => state.ActiveItemReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [unitData, setUnitData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [viewType, setViewType] = useState(1);
  const [operationTypeId, setOperationTypeId] = useState(null);
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
    setOperationTypeId(+GetParams('operationType'));
  }, []);
  const detailedCardSideActionClicked = useCallback(
    (actionEnum, activeData) => async (event) => {
      event.stopPropagation();
      if (actionEnum === ActionsEnum.reportEdit.key) {
        GlobalHistory.push(
          `/home/units/edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
        );
      } else if (actionEnum === ActionsEnum.folder.key) {
        GlobalHistory.push(
          `/home/units/unit-profile-edit?formType=${activeData.unitTypeId}&id=${activeData.id}`
        );
        // setSelectedDetailsUnitItem(activeData);
        // setOpenFileIsOpen(true);
      }
    },
    []
  );
  const getUnitById = useCallback(async () => {
    setIsLoading(true);
    const res = await unitDetailsGet({ id: +filterBy.id });
    const unitDatails = UnitMapper(res);
    localStorage.setItem('unitModelRelatedData', JSON.stringify(unitDatails));

    if (!(res && res.status && res.status !== 200)) setUnitData(unitDatails);
    else setUnitData(null);
    setIsLoading(false);
  }, [filterBy.id]);
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
    if (filterBy.id) getUnitById();
  }, [filterBy, getUnitById]);
  return (
    <div className='units-profile-wrapper view-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='d-flex-v-center-h-between flex-wrap'>
        <div className='d-inline-flex'>
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
        </div>
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
          <ButtonBase className='btns c-black-light' disabled>
            <span className='mdi mdi-share-outline px-1' />
            <span className='px-1'>{t(`${translationPath}share`)}</span>
          </ButtonBase>
          <CompletedDataComponent completedData={activeItem && activeItem.progress} />
        </div>
      </div>
      <TabsComponent
        data={
          UnitsOperationTypeEnum.rent.key === operationTypeId ?
            UnitsVerticalTabsData.rent :
            UnitsVerticalTabsData.sale
        }
        labelInput='label'
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        themeClasses='theme-solid'
        dynamicComponentProps={{
          viewType,
          activeItem,
          unitId: filterBy.id,
          parentTranslationPath,
          translationPath,
        }}
        currentTab={activeTab}
        onTabChanged={onTabChanged}
      />
      {UnitsOperationTypeEnum.rent.key === operationTypeId ? (
        <div className='tabs-content-wrapper'>
          {activeTab === 1 && (
            <UnitProfilePayablesComponent
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {activeTab === 7 && (
            <UnitProfileActivitiesComponent
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {activeTab === 8 && (
            <UnitProfilePaymentDetailsComponent
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {activeTab === 9 && (
            <UnitProfileMarketingComponent
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {' '}
          {activeTab === 12 && (
            <UnitParkingComponent
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {activeTab === 20 && (
            <UnitProfileMatchingComponent
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
        </div>
      ) : (
        <div className='tabs-content-wrapper'>
          {activeTab === 4 && (
            <UnitProfileDocumentsComponent
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {activeTab === 20 && (
            <UnitProfileMatchingComponent
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
        </div>
      )}
    </div>
  );
};
