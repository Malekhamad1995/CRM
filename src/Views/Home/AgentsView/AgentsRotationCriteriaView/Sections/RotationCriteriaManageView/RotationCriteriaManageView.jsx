import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import { RotationDetalisCardsComponent } from '../../AgentsRotationCriteriaUtilities/RotationDetalisCardsComponent/RotationDetalisCardsComponent';
import {
  GetParams,
  bottomBoxComponentUpdate,
  GlobalHistory,
  returnPropsByPermissions,
  returnPropsByPermissions2
} from '../../../../../../Helper';
import {
  GetRotationSchemeByIdServices,
} from '../../../../../../Services/RotaionSchemaService/RotationSchemaService';
import {
  TabsComponent,
} from '../../../../../../Components';
import { SaleAndLeaseAgentsAndListing } from './Sections';
import { RotationSchemaPermissions } from '../../../../../../Permissions';

export const RotationCriteriaManageView = () => {
  const parentTranslationPath = 'Agents';
  const translationPath = '';
  const { t } = useTranslation(parentTranslationPath);
  const [rotationCriteriaId, setRotationCriteriaId] = useState(null);
  const [rotationCriteria, setRotationCriteria] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [agentOrListing, setAgentOrListing] = useState('');
  const [manageList, setManageList] = useState([]);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setRotationCriteriaId(+GetParams('id'));
  }, []);

  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };
  const getTabMenuPermissions = () => {
    if (returnPropsByPermissions2(RotationSchemaPermissions.SalesLeaseAgents.permissionsId,
      RotationSchemaPermissions.ListingAgents.permissionsId)) {
      setHasPermissions(true);
      setManageList([{ label: 'sales_lease_agents', type: 0 }, { label: 'listingAgents', type: 1 }]);
      return;
    }
    if (returnPropsByPermissions(RotationSchemaPermissions.SalesLeaseAgents.permissionsId)) {
      setAgentOrListing('SalesLeaseAgents');
      setManageList([{ label: 'sales_lease_agents', type: 0 }]);
    } else if (returnPropsByPermissions(RotationSchemaPermissions.ListingAgents.permissionsId)) {
      setAgentOrListing('ListingAgents');
      setManageList([{ label: 'listingAgents', type: 1 }]);
    }
  };

  const GetRotationSchemeById = useCallback(async () => {
    setLoader(true);
    const res = await GetRotationSchemeByIdServices(rotationCriteriaId);
    setRotationCriteria(res || null);
    setLoader(false);
  }, [rotationCriteriaId]);

  useEffect(() => {
    bottomBoxComponentUpdate(
      <div className='d-flex-v-center-h-end flex-wrap'>
        <ButtonBase
          className='btns theme-transparent mb-2'
          onClick={() => {
            GlobalHistory.goBack();
          }}
        >
          <span>{t('Shared:back')}</span>
        </ButtonBase>
      </div>
    );
  }, [rotationCriteriaId, t]);

  useEffect(
    () => () => {
      bottomBoxComponentUpdate(null);
    },
    []
  );
  useEffect(() => {
    if (rotationCriteriaId)
      GetRotationSchemeById(rotationCriteriaId);
    getTabMenuPermissions();
  }, [GetRotationSchemeById, rotationCriteriaId]);
  return (
    <div className='rotationCriteriaManage view-wrapper'>
      <div className='w-100 px-3 mt-3'>
        <TabsComponent
          data={manageList || []}
          labelInput='label'
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          themeClasses='theme-solid'
          currentTab={activeTab}
          onTabChanged={onTabChanged}
          dynamicComponentProps={{
            parentTranslationPath,
            translationPath,
            rotationCriteriaId
          }}
        />
      </div>

      <div className='px-5 rotation-criteria-assign-view-wrapper mt-3'>
        <div className='agent-section-wrapper'>
          <div className='rotation-details'>
            <div className='mb-2'>
              <span className='title-text'>{t(`${translationPath}rotation-criteria-detalis`)}</span>
            </div>
            <RotationDetalisCardsComponent
              loading={loader}
              rotationCriteria={rotationCriteria}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
          </div>
        </div>
        <span className='section-seperator mdi mdi-arrow-collapse-right c-gray arrow' />

        {((hasPermissions === true && activeTab === 0) || agentOrListing === 'SalesLeaseAgents')
          && (
            <SaleAndLeaseAgentsAndListing
              type={0}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              rotationCriteriaId={rotationCriteriaId}
            />
          )}
        {((hasPermissions === true && activeTab === 1) || agentOrListing === 'ListingAgents') && (
          <SaleAndLeaseAgentsAndListing
            type={1}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            rotationCriteriaId={rotationCriteriaId}
          />
        )}
      </div>
    </div>
  );
};
