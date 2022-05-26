import React, { useCallback, useEffect, useState } from 'react';
import {
 Dialog, DialogActions, DialogContent, DialogTitle
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Spinner } from '../../../../../../Components';
import { RotationCriteriaDialogFooter } from '../RotationCriteriaDialog/RotationCriteriaDialogFooter';
import { GetAllAgentsServices } from '../../../../../../Services/AgentsServices';
import { RotationDetalisCardsComponent } from '../../AgentsRotationCriteriaUtilities/RotationDetalisCardsComponent/RotationDetalisCardsComponent';
import { SelectedAgentsView } from './Sections/SelectedAgentsView';
import { AgentInfoRentRelatedComponent } from '../../../../UnitsView/UnitsStatusManagementView/Sections/UnitRentRelatedStatusesSections/AgentInfoRentRelatedComponent/AgentInfoRentRelatedComponent';
import { AssignNewAgent } from '../../AgentsRotationCriteriaUtilities/AssignAgentsView/AssignNewAgentView';
import {
  AssignAgentToRotationScheme,
  GetAllAgentByRotationSchemeServices,
} from '../../../../../../Services/RotaionSchemaService/RotationSchemaService';

export const AssignAgentRotationCriteriaDialog = ({
  open,
  close,
  parentTranslationPath,
  translationPath,
  onSave,
  rotationCriteriaId,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);
  const [isLoading, setIsLoading] = useState(false);
  const [agants, setAgents] = useState([]);
  const [notActiveAgants, setnotActiveAgantss] = useState([]);
  const [selectedagants, Setselectedagants] = useState([]);
  const [active, SetActive] = useState(null);
  const [dropBox, setDropBox] = useState(false);
  const [drag, setDrag] = useState(false);
  const [searchAgent, setSearchAgent] = useState('');
  const GetAllAgent = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllAgentsServices({ pageSize: 0, pageIndex: 0, search: searchAgent });
    setIsLoading(false);
    setAgents((res && res.result) || []);
  });

  const selectedAgent = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllAgentByRotationSchemeServices({
      id: rotationCriteriaId,
      pageSize: 0,
      pageIndex: 0,
    });
    setIsLoading(false);
    Setselectedagants((res && res.result) || []);
  });

  const AssignAgentToRotaionSchema = useCallback(async (item) => {
    setIsLoading(true);
    const body = { agents: [...selectedagants, item] };
    const res = await AssignAgentToRotationScheme(rotationCriteriaId, body);
    setIsLoading(false);
    selectedAgent();
  });
  useEffect(() => {
    if (rotationCriteriaId) selectedAgent(rotationCriteriaId);
  }, [rotationCriteriaId]);

  useEffect(() => {
    GetAllAgent();
  }, [searchAgent]);

  const ondrag = (item) => {
    AssignAgentToRotaionSchema(item);
    setDrag(false);
  };
  useEffect(() => {
    if (agants && selectedagants) {
      const list = [];
      agants.map((item) =>
        (selectedagants.findIndex((w) => w.agentId === item.agentId) === -1 ? list.push(item) : true));
      setnotActiveAgantss(list);
    }
  }, [agants, selectedagants]);
  return (
    <>
      <Spinner isActive={isLoading} />
      <Dialog
        maxWidth='lg'
        fullWidth
        open={open}
        onClose={() => {
          close();
        }}
      >
        <form noValidate>
          <DialogTitle id='alert-dialog-slide-title'>
            {t(`${translationPath}Manage-Agent`)}
            <hr className='title-line' />
          </DialogTitle>
          <DialogContent>
            <div className='rotationCriteriaManage view-wrapper dragDrop'>
              <div className='px-5 rotation-criteria-assign-view-wrapper mt-4'>
                <div className='agent-section-wrapper'>
                  {agants && (
                    <AssignNewAgent
                      search={searchAgent}
                      setSearch={setSearchAgent}
                      setDropBox={setDropBox}
                      SetActive={SetActive}
                      agants={notActiveAgants}
                      onClick={async (item) => {
                        await AssignAgentToRotaionSchema(item);
                      }}
                    />
                  )}
                </div>
                {/* <span className='section-seperator mdi mdi-arrow-collapse-right c-gray' /> */}
                <div className='agent-section-wrapper'>
                  <SelectedAgentsView
                    active={active}
                    agants={selectedagants}
                    ondrag={ondrag}
                    setDropBox={setDropBox}
                    dropBox={dropBox}
                  />
                </div>
              </div>
            </div>
          </DialogContent>

          <DialogActions>
            <RotationCriteriaDialogFooter
              close={close}
              onSave={() => {
                onSave();
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
