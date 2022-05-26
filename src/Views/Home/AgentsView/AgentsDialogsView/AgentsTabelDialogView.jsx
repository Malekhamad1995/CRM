import { Button, ButtonBase } from '@material-ui/core';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  DialogComponent,
  Inputs,
  RadiosGroupComponent,
  Spinner,
  TabsComponent,
} from '../../../../Components';
import { GetAgentById, UpdateAgentById } from '../../../../Services/AgentsServices';
import { WorkingHoursDialogView } from './WorkingHoursDialogView';
import { showError, showSuccess } from '../../../../Helper';
import { AgentsTabel } from './AgentsTabel';
import { AgentRolesTabel } from './AgentRolesTabel';

const parentTranslationPath = 'Agents';
const translationPath = '';
export const AgentsTabelDialogView = ({ activeItem, onCancelClicked, relode }) => {
  const { t } = useTranslation(parentTranslationPath);
  const defaultState = {
    leadCapacity: '',
    forgivenPeriodInMinutes: '',
    vipForgivenessPeriodInMinutes: '',
    isInRotation: false,
    agentRotationSchedules: [],
  };
  const [state, setState] = useState(defaultState);
  const [isSubmitted, setIsSubmitted] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [response, setresponse] = useState();
  const [res, setres] = useState([]);
  const [itemindex, setitemindex] = useState();
  const getAgentId = useCallback(async (AgentId) => {
    setIsLoading(true);
    const result = await GetAgentById(AgentId);
    if (!(result && result.status && result.status !== 200)) {
      setresponse(result);
      setState((item) => ({
        ...item,
        isInRotation: result && result.isInRotation,
        leadCapacity: result && result.leadCapacity,
        vipForgivenessPeriodInMinutes: result && result.vipForgivenessPeriodInMinutes,
        forgivenPeriodInMinutes: result && result.forgivenPeriodInMinutes,
        agentMobile: result && result.agentMobile,
        agentEmail: result && result.agentEmail,
        agentAgentRoles: result && result.agentAgentRoles,
        agentRotationSchedules: result && result.agentRotationSchedules,
      }));
      setres(result && result.agentRotationSchedules);
    } else setresponse({});

    setIsLoading(false);
  }, []);

  const UpdateAgent = useCallback(async (AgentId, body) => {
    setIsLoading(true);
    const result = await UpdateAgentById(AgentId, body);
    if (!(result && result.status && result.status !== 200))
      showSuccess(t`${translationPath}Agent-updated-successfully`);
    else showError(t`${translationPath}Agent-updated-falid`);
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const OnSaveClicked = () => {
    const list = [];
    if ((state && state.agentRotationSchedules && state.agentRotationSchedules.length > 0)) {
      state.agentRotationSchedules.map((item) => {
        list.push({
          fromDate: item.fromDate,
          toDate: item.toDate,
          fromTime: item.fromTime,
          toTime: item.toTime,
          mediaNameId: null,
          mediaDetailsId: null,
        });
      });
    }

    UpdateAgent(activeItem.agentId, {
      leadCapacity: state.leadCapacity,
      isInRotation: state.isInRotation,
      forgivenPeriodInMinutes: state.forgivenPeriodInMinutes,
      vipForgivenessPeriodInMinutes: state.vipForgivenessPeriodInMinutes,
      agentRotationSchedules: list,
    });
    relode();
    onCancelClicked();
  };

  useEffect(() => {
    getAgentId(activeItem.agentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem.agentId]);
  const [activeTab, setActiveTab] = useState(0);
  const onTabChanged = (e, newTap) => {
    setActiveTab(newTap);
  };

  useEffect(() => {
    setState((item) => ({
      ...item,
      agentRotationSchedules: res,
    }));
  }, [res]);

  useEffect(() => {
    const currentList = res;
    const index =
      currentList &&
      currentList.findIndex((element) => element.agentRotationScheduleId === itemindex);
    if (index !== -1) {
      currentList.splice(index, 1);
      setState((items) => ({
        ...items,
        agentRotationSchedules: currentList,
      }));
    } else if (index === -1) {
      setState((items) => ({
        ...items,
        agentRotationSchedules: currentList,
      }));
    }
  }, [itemindex, res]);

  return (
    <div className='Agents-wrapper view-wrapper'>
      <Spinner isActive={isLoading} isAbsolute />
      <div className='w-100 px-2'>
        <div>
          <div className='seaction-title'>{t(`${translationPath}Agent-info`)}</div>
          <div className='main-title'>
            <div className='px-3'>{(response && response.agentName) || 'N/A'}</div>
            <div className='px-3'>
              <span className='mdi mdi-phone px-1' />
              {(response && response.agentMobile) || 'N/A'}
            </div>
            <div className='px-3'>
              <span className='mdi mdi-email-outline px-1' />
              {(response && response.agentEmail) || 'N/A'}
            </div>
          </div>
          <div className='seaction-title'>{t(`${translationPath}Rotation-info`)}</div>
          <div className='seaction w-100'>
            <div className='input-wraper'>
              <Inputs
                idRef='LeadRef'
                labelValue='Lead-Cap'
                value={state.leadCapacity}
                onInputChanged={(e) => {
                  setState({ ...state, leadCapacity: e.target.value });
                }}
                inputPlaceholder='Lead-Cap'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
              />
            </div>
            <div className='input-wraper'>
              <Inputs
                idRef='templatesSearchRef'
                labelValue='Normal-contacted-expiration-period'
                value={state.forgivenPeriodInMinutes}
                onInputChanged={(e) => {
                  setState({ ...state, forgivenPeriodInMinutes: e.target.value });
                }}
                inputPlaceholder='Normal-contacted-expiration'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
              />
            </div>
            <div className='input-wraper'>
              <Inputs
                idRef='templatesSearchRef'
                inputPlaceholder='VIP-contacted'
                labelValue='VIP-contacted-expiration-period'
                value={state.vipForgivenessPeriodInMinutes}
                onInputChanged={(e) => {
                  setState({ ...state, vipForgivenessPeriodInMinutes: e.target.value });
                }}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
              />
            </div>
            <div className='input-wraper'>
              <RadiosGroupComponent
                data={[
                  { value: true, label: t(`${translationPath}ON`) },
                  { value: false, label: t(`${translationPath}Off`) },
                ]}
                idRef='Actions'
                onSelectedRadioChanged={() =>
                  setState({ ...state, isInRotation: !state.isInRotation })}
                value={state.isInRotation}
                labelValue='In-Rotation'
                name='Active'
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                wrapperClasses='mb-3'
                labelInput='label'
                valueInput='value'
              />
            </div>
          </div>

          <div>
            <TabsComponent
              data={[{ tab: 'Working-Hours' }, { tab: 'AgentRoles' }]}
              labelInput='tab'
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              themeClasses='theme-curved'
              currentTab={activeTab}
              onTabChanged={onTabChanged}
            />
          </div>
          {activeTab === 0 && (
            <div className='m-4'>
              <AgentsTabel
                Data={state && state.agentRotationSchedules}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                Deletedfile={(items) => setitemindex(items.agentRotationScheduleId)}
              />
            </div>
          )}
          {activeTab === 1 && (
            <div className='m-4'>
              <AgentRolesTabel
                Data={state && state.agentAgentRoles}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </div>
          )}
          {(activeTab === 0 && (
            <div className='action-wraper'>
              <ButtonBase
                className='btns-icon theme-solid bg-secondary mt-1 mx-2'
                onClick={() => setOpenDialog(true)}
              >
                <span className='mdi mdi-plus ' />
              </ButtonBase>
              <div>{t(`${translationPath}add-new`)}</div>
            </div>
          )) ||
            ''}
        </div>
        <div className='dialog-footer-wrapper  MuiDialogActions-spacing'>
          <div className='save-cancel-wrapper d-flex-v-center-h-end flex-wrap p-2'>
            <div className='cancel-wrapper d-inline-flex-center'>
              <Button
                onClick={onCancelClicked}
                className='cancel-btn-wrapper btns theme-transparent c-primary'
              >
                <span className='MuiButton-label'>
                  <span>{t(`${translationPath}cancel`)}</span>
                </span>
                <span className='MuiTouchRipple-root' />
              </Button>
            </div>
            <div className='save-wrapper d-inline-flex-center'>
              <Button onClick={OnSaveClicked} className='btns theme-solid w-100 mx-2 mb-2'>
                <span className='MuiButton-label'>
                  <span>{t(`${translationPath}save`)}</span>
                </span>
                <span className='MuiTouchRipple-root' />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <DialogComponent
        isOpen={openDialog}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        titleClasses='DialogComponent-WorkingHoursDialogView'
        wrapperClasses='wrapperClasses-WorkingHoursDialogView'
        titleText='add-new-Working-hours'
        saveClasses='btns theme-solid w-100 mx-2 mb-2'
        onCloseClicked={() => setOpenDialog(false)}
        maxWidth='md'
        dialogContent={(
          <>
            <WorkingHoursDialogView
              isSubmitted={isSubmitted}
              onCancelClicked={() => setOpenDialog(false)}
              onsave={(data, schema) => {
                setIsLoading(true);
                setIsSubmitted(true);
                if (schema && schema.error) {
                  showError(t('Shared:please-fix-all-errors'));
                  return;
                }
                setres((items) => {
                  items.push({
                    agentRotationScheduleId: data.agentRotationScheduleId,
                    fromDate: data.fromDate,
                    toDate: data.toDate,
                    fromTime: moment(data.fromTime).format('HH:mm'),
                    toTime: moment(data.toTime).format('HH:mm'),
                    //  mediaName: data.mediaName,
                    // mediaDetails: data.mediaDetails,
                    mediaNameId: null,
                    mediaDetailsId: null,
                  });
                  return [...items];
                });
                setIsSubmitted(false);
                setIsLoading(false);
                setOpenDialog(false);
              }}
            />
          </>
        )}
      />
    </div>
  );
};

AgentsTabelDialogView.propTypes = {
  activeItem: PropTypes.instanceOf(Object).isRequired,
  onCancelClicked: PropTypes.func.isRequired,
  relode: PropTypes.func.isRequired,
};
