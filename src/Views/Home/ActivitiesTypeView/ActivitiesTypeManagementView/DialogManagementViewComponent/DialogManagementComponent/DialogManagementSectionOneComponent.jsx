import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityNameComponent,
  StageComponent,
  NotificationTemplatelineManagerComponent,
  NotificationTemplateCreatedFromComponent,
  NotificationLineManagerComponent,
  CreatedFromNotificationByComponent,
  ExpiredPeriodComponent,
  AssignedToComponent,
  CheckboxesComponentActivities,
} from '../DialogManagementConrtolComponent';

export const DialogManagementSectionOneComponent = ({
  parentTranslationPath,
  translationPath,
  setState,
  state,
  setStateNotification,
  stateNotification,
  Data,
  lineManagerNOT,
  setTypePrerequisites,
  TypePrerequisites,
  setlineManagerTemplatData,
  CreatedFromNotificationByNOT,
  setlineManagerNOT,
  setCreatedFromNotificationByData,
  setCreatedFromNotificationByNOT
}) => (
  <div className='DialogManagementViewComponent-wrapper'>
    <div className='w-100 px-2'>
      <div className='format-wraper'>
        <ActivityNameComponent
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          state={state}
          setState={(item) =>
            setState({
              id: 'activityTypeName',
              value: item,
            })}
        />
      </div>
      <div className='format-wraper'>
        <StageComponent
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          state={state}
          Data={Data}
          setState={(item) =>
            setState({
              id: 'leadStageId',
              value: item,
            })}
        />
      </div>
      <div className='format-wraper'>
        <CheckboxesComponentActivities
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          state={state}
          setStatewithDateTime={(item) =>
            setState({
              id: 'withDateTime',
              value: item,
            })}
          setStatewithReminder={(item) =>
            setState({
              id: 'withReminder',
              value: item,
            })}
          setStatefollowUpRequired={(item) =>
            setState({
              id: 'followUpRequired',
              value: item,
            })}
          setStateIsForMobile={(item) =>
            setState({
              id: 'isForMobile',
              value: item,
            })}
        />
      </div>
      <div className='format-wraper'>
        <ExpiredPeriodComponent
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          state={state}
          setState={(item) =>
            setState({
              id: 'expiredPeriod',
              value: +item,
            })}
        />
      </div>
      <div className='format-wraper'>
        <AssignedToComponent
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          state={state}
          Data={Data}
          setState={(item) =>
            setState({
              id: 'assignedToActivityTypeRoles',
              value: item,
            })}
        />
      </div>
      <div className='format-wraper'>
        <CreatedFromNotificationByComponent
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          state={state}
          Data={Data}
          stateNotification={stateNotification}
          setCreatedFromNotificationByNOT={setCreatedFromNotificationByNOT}
          setStateNotification={(item) =>
            setStateNotification({
              id: 'CreatedFromNotificationByTemplatComponent',
              value: item,
            })}
        />
      </div>
      <div className='format-wraper'>
        <NotificationTemplateCreatedFromComponent
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          state={state}
          CreatedFromNotificationByNOT={CreatedFromNotificationByNOT}
          Data={Data}
          TypePrerequisites={TypePrerequisites}
          setTypePrerequisites={setTypePrerequisites}
          setCreatedFromNotificationByData={setCreatedFromNotificationByData}
          stateNotification={stateNotification}
          setState={(item) =>
            setState({
              id: 'activityTypeTemplateRecipientTypes',
              value: item,
            })}
        />
      </div>
      <div className='format-wraper'>
        <NotificationLineManagerComponent
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          stateNotification={stateNotification}
          TypePrerequisites={TypePrerequisites}
          setlineManagerNOT={setlineManagerNOT}
          setTypePrerequisites={setTypePrerequisites}
          state={state}
          Data={Data}
          setStateNotification={(item) =>
            setStateNotification({
              id: 'lineManagerNotificationTemplateComponent',
              value: item,
            })}
        />
      </div>
      <div className='format-wraper'>
        <NotificationTemplatelineManagerComponent
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          state={state}
          setlineManagerTemplatData={setlineManagerTemplatData}
          Data={Data}
          lineManagerNOT={lineManagerNOT}
          TypePrerequisites={TypePrerequisites}
          setTypePrerequisites={setTypePrerequisites}
          stateNotification={stateNotification}
          setState={(item) =>
            setState({
              id: 'activityTypeTemplateRecipientTypes',
              value: item,
            })}
        />
      </div>
    </div>
  </div>
);
DialogManagementSectionOneComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setState: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  setTypePrerequisites: PropTypes.func.isRequired,
  TypePrerequisites: PropTypes.string.isRequired,
  setStateNotification: PropTypes.func.isRequired,
};
