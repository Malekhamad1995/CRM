import React from 'react';

import PropTypes from 'prop-types';
import {
  ActivityCategoryComponent,
  RatingComponent,
  RelatedToComponent,
  CreatedByComponent,
  AssignNotificationByComponent,
  PrerequisiteActivitiesComponent,
  NotificationSuperAdminComponent,
  AssignNotificationTemplateComponent,
  NotificationTemplateSuperAdminComponent,
} from '../DialogManagementConrtolComponent';

export const DialogManagementSecondSectionComponent = ({
  parentTranslationPath,
  translationPath,
  setState,
  state,
  Data,
  stateNotification,
  setStateNotification,
  setTypePrerequisites,
  TypePrerequisites,
  setSuperAdminnNOT,
  SuperAdminnNOT,
  setSuperAdminData,
  valueDisabled,
  setAssigntoNOT,
  SuperAdminData,
  AssigntoNOT,
  setAssigntoData
}) => (
  <div className='DialogManagementViewComponent-wrapper'>
    <div className='w-100 px-2'>
      <div className='w-100 px-2'>
        <div className='format-wraper'>
          <ActivityCategoryComponent
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            state={state}
            Data={Data}
            setState={(item) =>
              setState({
                id: 'categoryId',
                value: item,
              })}
          />
        </div>
        <div className='format-wraper'>
          <RatingComponent
            translationPath={translationPath}
            state={state}
            Data={Data}
            parentTranslationPath={parentTranslationPath}
            setState={(item) =>
              setState({
                id: 'activityRate',
                value: item,
              })}
          />
        </div>
        <div className='format-wraper'>
          <RelatedToComponent
            translationPath={translationPath}
            state={state}
            Data={Data}
            parentTranslationPath={parentTranslationPath}
            setState={(item) =>
              setState({
                id: 'relatedTo',
                value: item,
              })}
          />
        </div>
        <div className='format-wraper'>
          <CreatedByComponent
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            state={state}
            Data={Data}
            setState={(item) =>
              setState({
                id: 'createActivityTypeRoles',
                value: item,
              })}
          />
        </div>
        <div className='format-wraper'>
          <PrerequisiteActivitiesComponent
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            state={state}
            Data={Data}
            setState={(item) =>
              setState({
                id: 'activityTypeActivityTypePrerequisites',
                value: item,
              })}
          />
        </div>
        <div className='format-wraper'>
          <AssignNotificationByComponent
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            state={state}
            setAssigntoNOT={setAssigntoNOT}
            Data={Data}
            setState={(item) =>
              setState({
                id: 'activityTypeTemplateRecipientTypes',
                value: item,
              })}
            stateNotification={stateNotification}
            setStateNotification={(item) =>
                setStateNotification({
                  id: 'CreatedFromNotificationByComponent',
                  value: item,
                })}
          />
        </div>
        <div className='format-wraper'>
          <AssignNotificationTemplateComponent
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            TypePrerequisites={TypePrerequisites}
            setTypePrerequisites={setTypePrerequisites}
            Data={Data}
            state={state}
            AssigntoNOT={AssigntoNOT}
            setAssigntoData={setAssigntoData}
            stateNotification={stateNotification}
            setState={(item) =>
              setState({
                id: 'activityTypeTemplateRecipientTypes',
                value: item,
              })}
          />
        </div>
        <div className='format-wraper'>
          <NotificationSuperAdminComponent
            translationPath={translationPath}
            Data={Data}
            parentTranslationPath={parentTranslationPath}
            state={state}
            valueDisabled={valueDisabled}
            setSuperAdminnNOT={setSuperAdminnNOT}
            stateNotification={stateNotification}
            setStateNotification={(item) =>
                setStateNotification({
                  id: 'NotificationSuperAdminComponent',
                  value: item,
                })}
          />
        </div>
        <div className='format-wraper'>
          <NotificationTemplateSuperAdminComponent
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            state={state}
            Data={Data}
            SuperAdminnNOT={SuperAdminnNOT}
            TypePrerequisites={TypePrerequisites}
            setSuperAdminData={setSuperAdminData}
            SuperAdminData={SuperAdminData}
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
  </div>
);
DialogManagementSecondSectionComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
  setStateNotification: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired,
  stateNotification: PropTypes.string.isRequired,
};
