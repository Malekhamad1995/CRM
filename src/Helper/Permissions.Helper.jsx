export const getIsAllowedPermission = (
  permissionsList = [],
  loginResponse,
  permissionsId,
  allowEmptyRoles
) => {
  if (permissionsList && permissionsList.length === 0) return true;
  const list =
    (allowEmptyRoles && permissionsList.length === 0) ||
    (permissionsId &&
      ((Array.isArray(permissionsId) &&
        permissionsList.filter((item) => permissionsId.includes(item.permissionsId))) ||
        permissionsList.filter((item) => item.permissionsId === permissionsId))) ||
    permissionsList ||
    [];


  for (let i = 0; i < list.length; i++) {
    if (
      loginResponse && loginResponse.permissions && loginResponse.permissions.findIndex(
        (f) => f.permissionsId === list[i].permissionsId
      ) !== -1
    )
      return true;
  }

};
