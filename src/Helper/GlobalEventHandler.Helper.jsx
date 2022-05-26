import { Log } from './Middleware.Helper';

export const InitGlobalEventHandler = () => {
  window.onerror = (msg, url, lineNo, columnNo, error) => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // window.location = '/home/ErrorPage';
    } else window.location = '/home/ErrorPage';

    const message = [
      `Message: ${msg}`,
      `URL: ${url}`,
      `Line: ${lineNo}`,
      `Column: ${columnNo}`,
      `Error object: ${JSON.stringify(error)}`,
    ].join(' - ');

    Log(message);
  };
};
