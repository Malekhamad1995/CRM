import React, { useCallback, useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { useSelector } from 'react-redux';
import { PrivateRoute } from './PrivateRoute';
import { NotFoundLayout } from '../../Layouts/NotFoundLayout/NotFoundLayout';

export const SwitchRoute = ({ routes }) => {
  const [route, setRoute] = useState(null);
  const loginResponse = useSelector((state) => state.login.loginResponse);
  useEffect(() => {

  }, [route]);
  useEffect(() => {
    const defaltRout = routes.find((f) => f.default === true);
    setRoute({ ...defaltRout });

    if (getIsAllowed(defaltRout.roles))
      setRoute({ ...defaltRout });
     else {
      const rArray = routes.sort((a, b) => a.id - b.id);
      for (let i = 0; i < rArray.length; i++) {
        if (getIsAllowed(rArray[i].roles) ||
          rArray[i].roles.length === 0 ||
          rArray[i].roles === null ||
          rArray[i].roles === undefined) {
          setRoute(rArray[i]);
          return;
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  const getIsAllowed = useCallback(
    (roles) =>
    (roles.length === 0 ||
      roles.some(
        (permission) =>
          loginResponse &&
          loginResponse.permissions &&
          loginResponse.permissions.findIndex(
            (item) => item.permissionsId === permission.permissionsId
          ) !== -1
      )),
    [loginResponse]
  );
  return (
    <>
      {route && (
      <Switch>
        {routes.map((value, key) => {
          if (!value.isRoute) return null;
          if (value.roles && Array.isArray(value.roles) && value.authorize && getIsAllowed(value.roles)) {
            return (
              <PrivateRoute
                path={value.layout + value.path}
                component={value.component}
                key={`privateRoute${key + 1}`}
                addRoute={value.addRoute}
                isExact={value.isExact}
              />
            );
          }
          if (!value.authorize) {
            return (
              <Route
                path={value.layout + value.path}
                component={value.component}
                key={`publicRoute${key + 1}`}
              />
            );
          }
          if ((!value.roles || !Array.isArray(value.roles) || value.roles.length === 0) && value.authorize) {
            return (
              <PrivateRoute
                path={value.layout + value.path}
                component={value.component}
                key={`privateRoute${key + 1}`}
                addRoute={value.addRoute}
                isExact={value.isExact}
              />
            );
          }

          return null;
          // return (
          // <Route
          //   path={value.layout + value.path}
          //   component={value.component}
          //   key={`publicRoute${key + 1}`}
          // />;
          // <Redirect exact from={route.layout} to={route.layout + route.path} />
          // );
        })}
        <Redirect exact from={route.layout} to={route.layout + route.path} />
        <Route path='*' component={NotFoundLayout} />
      </Switch>
)}
    </>
);
};
SwitchRoute.propTypes = {
  routes: PropTypes.instanceOf(Array).isRequired,
};
