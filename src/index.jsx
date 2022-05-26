import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './assets/theme-style/master.scss';
// import { ToastContainer } from 'react-toastify';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { ToastProvider } from 'react-toast-notifications';
import { GlobalExceptionHandler, InitGlobalEventHandler } from './Helper';
import configStore from './store/RootStore';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <I18nextProvider i18n={i18next}>
    <ToastProvider placement='top-right'>
      <Provider store={configStore}>
        <App />
      </Provider>
      {/* <ToastContainer /> */}
    </ToastProvider>
  </I18nextProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
InitGlobalEventHandler();
GlobalExceptionHandler();
