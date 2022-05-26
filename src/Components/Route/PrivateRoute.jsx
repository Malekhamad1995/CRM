import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({
  component: Component,
  login = '/account/login',
  addRoute,
  isExact,
  ...rest
}) => (
  <Route
    {...rest}
    exact={isExact}
    render={(props) =>
      (localStorage.getItem('session') ? (
        <Component {...props} addRoute={addRoute} />
      ) : (
        <Redirect to={login} />
      ))}
  />
);
