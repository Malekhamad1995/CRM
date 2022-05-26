import React, {
  useCallback, useEffect, useReducer, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { DialogManagementSectionOneComponent } from './DialogManagementComponent/DialogManagementSectionOneComponent';
import { DialogManagementSecondSectionComponent } from './DialogManagementComponent/DialogManagementSecondSectionComponent';
import {
  CreateActivityTypes,
  UpdateActivityTypes,
} from '../../../../../Services/ActivitiesTypesServices';
import { showError, showSuccess } from '../../../../../Helper';
import { Spinner } from '../../../../../Components';
import { DisabledFiledValidation } from './DisabledFiledValidation';

export const DialogManagementViewComponent = ({
  parentTranslationPath,
  translationPath,
  onCancelClicked,
  edit,
  Data,
  activeItem,
  setReloading,
  setSearchedItem
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [IsLoading, setIsLoading] = useState(false);
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return {
      ...action.value,
    };
  }, []);

  const [TypePrerequisites, setTypePrerequisites] = useState({
    AssignToTemplat: '',
    SuperAdminTemplat: '',
    lineManagerTemplat: '',
    CreatedFromNotificationByTemplat: '',
  });
  const [SuperAdminnNOT, setSuperAdminnNOT] = useState([]);
  const [SuperAdminData, setSuperAdminData] = useState([]);
  const [lineManagerTemplatData, setlineManagerTemplatData] = useState([]);
  const [lineManagerNOT, setlineManagerNOT] = useState([]);
  const [CreatedFromNotificationByData, setCreatedFromNotificationByData] = useState([]);
  const [CreatedFromNotificationByNOT, setCreatedFromNotificationByNOT] = useState([]);
  const [AssigntoNOT, setAssigntoNOT] = useState([]);
  const [AssigntoData, setAssigntoData] = useState([]);

  const [state, setState] = useReducer(reducer, {
    activityTypeName: '',
    leadStageId: undefined,
    categoryId: undefined,
    description: '',
    activityRate: undefined,
    withDateTime: false,
    withReminder: false,
    followUpRequired: false,
    isForMobile:false,
    expiredPeriod: 0,
    relatedTo: [],
    createActivityTypeRoles: [],
    assignedToActivityTypeRoles: [],
    activityTypeTemplateRecipientTypes: [],
    activityTypeActivityTypePrerequisites: [],
  });

  const [stateNotification, setStateNotification] = useReducer(reducer, {
    CreatedFromNotificationByComponent: [],
    NotificationSuperAdminComponent: [],
    lineManagerNotificationTemplateComponent: [],
    CreatedFromNotificationByTemplatComponent: [],
  });
  useEffect(() => {
    const filteredPeople = Object.values(TypePrerequisites).filter((item) => (item.templateId !== undefined && item.templateId !== ''));
    setState({
      id: 'activityTypeTemplateRecipientTypes',
      value: filteredPeople,
    });
  }, [TypePrerequisites]);

  const saveHandler = async () => {
    setIsLoading(true);
      const res =
      (edit && edit && (await UpdateActivityTypes(activeItem.activityTypeId, state))) ||
      (await CreateActivityTypes(state));

    setIsLoading(false);
    if (!(res && res.status && res.status !== 200)) {
      if (activeItem && activeItem.activityTypeId) {
        showSuccess(t`${translationPath}activity-Type-updated-successfully`);
       // GetAllActivityTypesAPI();
       setReloading(true);
        onCancelClicked();
      } else {
        showSuccess(t`${translationPath}activity-Type-created-successfully`);
        setReloading(true);
        onCancelClicked();
      }
    } else if (edit) showError(t(`${translationPath}activity-Type-update-failed`));
    else showError(t`${translationPath}activity-Type-create-failed`);
  };

  useEffect(() => {
    if (edit) {
      setState({
        id: 'edit',
        value: {
          activityTypeName: Data && Data.activityTypeName,
          leadStageId: Data && Data.leadStageId,
          categoryId: Data && Data.categoryId,
          description: Data && Data.description,
          activityRate: Data && Data.activityRate,
          withDateTime: Data && Data.withDateTime,
          withReminder: Data && Data.withReminder,
          followUpRequired: Data && Data.followUpRequired,
          isForMobile: Data && Data.isForMobile,
          expiredPeriod: Data && Data.expiredPeriod,
          relatedTo: Data && Data.relatedTo,
          createActivityTypeRoles: Data && Data.createActivityTypeRoles,
          assignedToActivityTypeRoles: Data && Data.assignedToActivityTypeRoles,
          activityTypeTemplateRecipientTypes: Data && Data.activityTypeTemplateRecipientTypes,
          activities: Data && Data.activities,
          activityTypeActivityTypePrerequisites: Data && Data.activityTypeActivityTypePrerequisites,
        },
      });
    }
  }, [Data, edit]);

  return (
    <>
      <div className='DialogManagementViewComponent-wrapper'>
        <Spinner isActive={IsLoading} />
        <div className='w-100 px-2'>
          <DialogManagementSectionOneComponent
            state={state}
            setState={setState}
            translationPath={translationPath}
            TypePrerequisites={TypePrerequisites}
            setTypePrerequisites={setTypePrerequisites}
            Data={Data}
            setSuperAdminnNOT={setSuperAdminnNOT}
            setSuperAdminData={setSuperAdminData}
            stateNotification={stateNotification}
            lineManagerNOT={lineManagerNOT}
            CreatedFromNotificationByNOT={CreatedFromNotificationByNOT}
            setlineManagerTemplatData={setlineManagerTemplatData}
            setlineManagerNOT={setlineManagerNOT}
            setStateNotification={setStateNotification}
            setCreatedFromNotificationByData={setCreatedFromNotificationByData}
            setCreatedFromNotificationByNOT={setCreatedFromNotificationByNOT}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
        <div className='w-100 px-2'>
          <DialogManagementSecondSectionComponent
            state={state}
            setState={setState}
            stateNotification={stateNotification}
            setStateNotification={setStateNotification}
            Data={Data} 
            TypePrerequisites={TypePrerequisites}
            setSuperAdminnNOT={setSuperAdminnNOT}
            SuperAdminnNOT={SuperAdminnNOT}
            SuperAdminData={SuperAdminData}
            setSuperAdminData={setSuperAdminData}
            setTypePrerequisites={setTypePrerequisites}
            setAssigntoNOT={setAssigntoNOT}
            AssigntoNOT={AssigntoNOT}
            setAssigntoData={setAssigntoData}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
      </div>
      <div className='MuiDialogActions-root dialog-footer-wrapper  MuiDialogActions-spacing'>
        <div className='save-cancel-wrapper d-flex-v-center-h-end flex-wrap p-2'>
          <div className='cancel-wrapper d-inline-flex-center'>
            <Button
              className='MuiButtonBase-root MuiButton-root MuiButton-text cancel-btn-wrapper btns theme-transparent c-primary'
              onClick={onCancelClicked}
            >
              <span className='MuiButton-label'>
                <span>{t('Shared:cancel')}</span>
              </span>
              <span className='MuiTouchRipple-root' />
            </Button>
          </div>
          <div className='save-wrapper d-inline-flex-center'>
            <Button
              onClick={saveHandler}
              disabled={DisabledFiledValidation(state, stateNotification, TypePrerequisites,
                SuperAdminnNOT,
SuperAdminData,
lineManagerTemplatData,
lineManagerNOT,
CreatedFromNotificationByData,
CreatedFromNotificationByNOT,
AssigntoNOT,
AssigntoData)}
              className='MuiButtonBase-root MuiButton-root MuiButton-text save-btn-wrapper btns theme-solid bg-primary'
            >
              <span className='MuiButton-label'>
                <span>{t('Shared:save')}</span>
              </span>
              <span className='MuiTouchRipple-root' />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

DialogManagementViewComponent.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  activeItem: PropTypes.instanceOf(Object).isRequired,
  Data: PropTypes.instanceOf(Object).isRequired,
  edit: PropTypes.bool.isRequired,
  onCancelClicked: PropTypes.func.isRequired,
  GetAllActivityTypesAPI: PropTypes.func.isRequired,
  setSearchedItem: PropTypes.func.isRequired,
  setReloading: PropTypes.func,
};
DialogManagementViewComponent.defaultProps =
{
  setReloading: () => { },

};
