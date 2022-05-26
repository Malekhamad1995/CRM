import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getIsAllowedPermission } from '../../Helper';

export const PermissionsComponent = ({
  permissionsList,
  permissionsId,
  allowEmptyRoles,
  children,
}) => {
  const [allowed, setAllowed] = useState(false);
  const loginResponse = useSelector((state) => state.login.loginResponse);
  useEffect(() => {
    setAllowed(
      getIsAllowedPermission(permissionsList, loginResponse, permissionsId, allowEmptyRoles)
    );
  }, [allowEmptyRoles, loginResponse, permissionsId, permissionsList]);
  return (allowed && children) || null;
};

PermissionsComponent.propTypes = {
  permissionsList: PropTypes.instanceOf(Array),
  permissionsId: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(String)]),
  allowEmptyRoles: PropTypes.bool,
};
PermissionsComponent.defaultProps = {
  permissionsList: [],
  permissionsId: undefined,
  allowEmptyRoles: false,
};
