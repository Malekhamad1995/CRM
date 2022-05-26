import { config } from '../../config';
import { HttpServices } from '../HttpServices/HttpServices';

export const uploadFile = async ({ file }) => {
  const body = new FormData();
  body.append('file', file);

  try {
    const result = await HttpServices.post(
      `${config.server_address}/FileManager/File/Upload`,
      body
    );
    return result;
  } catch (e) {
    if (e.response && e.response) throw e.response;
    else throw e;
  }
};

export const importFile = async (body) => {
  try {
    const result = await HttpServices.post(
      `${config.server_address}/FileManager/File/Import`,
      body
    );
    return result;
  } catch (e) {
    if (e.response && e.response) throw e.response;
    else throw e;
  }
};
export const getImportFileDetailsByID = async (processId, { pageSize, pageIndex }) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  // if (isValid || isValid === false) queryList.push(`isValid=${isValid}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Process/GetAllProcessRecord/${processId}?${queryList.join(
      '&'
    )}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetProcess = async (processId, { pageSize, pageIndex }) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Process/GetProcess/${processId}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const approvedAllValidProcessRecord = async (processId) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Process/ApprovedAllValidProcessRecord/${processId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
