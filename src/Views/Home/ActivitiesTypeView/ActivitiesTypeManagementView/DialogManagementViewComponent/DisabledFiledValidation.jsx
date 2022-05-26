
export function DisabledFiledValidation(state, stateNotification, TypePrerequisites,
  SuperAdminnNOT,
  SuperAdminData,
  lineManagerTemplatData,
  lineManagerNOT,
  CreatedFromNotificationByData,
  CreatedFromNotificationByNOT,
  AssigntoNOT,
  AssigntoData) {
  const DisabledValidation = (
    state.activityTypeName === '' ||
    state.categoryId === undefined || state.categoryId === null ||
    state.leadStageId === undefined || state.leadStageId === null ||
    state.relatedTo === undefined ||
    (state.relatedTo.length && state.relatedTo.length) === 0 ||
    state.activityRate === undefined || state.activityRate === '' ||
    state.createActivityTypeRoles === undefined ||
    (state.createActivityTypeRoles && state.createActivityTypeRoles.length) === 0 ||
    (state.assignedToActivityTypeRoles && state.assignedToActivityTypeRoles.length) === 0 ||
    state.assignedToActivityTypeRoles === '' ||
    state.assignedToActivityTypeRoles === undefined ||
    (SuperAdminnNOT.length !== 0 && SuperAdminData.length === 0 ||
      SuperAdminnNOT.length === 0 && SuperAdminData.length !== 0
    ) ||
    (lineManagerNOT.length !== 0 && lineManagerTemplatData.length === 0 ||
      lineManagerNOT.length === 0 && lineManagerTemplatData.length !== 0
    ) ||
    (CreatedFromNotificationByNOT.length !== 0 && CreatedFromNotificationByData.length === 0 ||
      CreatedFromNotificationByNOT.length === 0 && CreatedFromNotificationByData.length !== 0
    ) ||
    (AssigntoNOT.length !== 0 && AssigntoData.length === 0 ||
      AssigntoNOT.length === 0 && AssigntoData.length !== 0
    )

  );
  return (DisabledValidation);
}
