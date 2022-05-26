export const returnPropsByPermissions = (permissionsId) => {
    const userPermissionsList = JSON.parse(localStorage.getItem('session')).permissions;
    const checkIsHavePermission = userPermissionsList.some((p) => p.permissionsId === permissionsId);

    return checkIsHavePermission;
};

export const returnPropsByPermissions2 = (permissionsId, permissionsId2) => {
    const userPermissionsList = JSON.parse(localStorage.getItem('session')).permissions;
    const checkIsHavePermission1 = userPermissionsList.some((p) => p.permissionsId === permissionsId);
    const checkIsHavePermission2 = userPermissionsList.some((p) => p.permissionsId === permissionsId2);

    return checkIsHavePermission1 && checkIsHavePermission2;
};
