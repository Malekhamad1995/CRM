import axios from 'axios';
import { config } from '../config/config';

const base = async (method, path, accessToken = '', body, type = true, removeUrlFromPath) => {
  const options = {
    method: method.toUpperCase(),
    responseType: type ? '' : 'blob',
    headers: {
      'content-type': 'application/json',
    },
    url: removeUrlFromPath ? `${config.server_address}/${path}` : `${config.server_address}/api/${path}/?market=${'US'}`,
  };

  if (((body) && (method.toUpperCase() === 'POST')) || (method.toUpperCase() === 'PUT')) options.data = body; else if ((((body) && (method.toUpperCase() === 'GET')) || (method.toUpperCase() === 'DELETE'))) {
    if (body && Object.keys(body).length > 0) {
      const extraParms = new URLSearchParams(body).toString();
      options.url = `${options.url}&${extraParms}`;
    }
  }
  try {
    const results = await axios(options);
    return results;
  } catch (e) {
    return [];
   // if (e.response && e.response.data) { throw e.response.data; } else { throw e; }
  }
};
export default base;
