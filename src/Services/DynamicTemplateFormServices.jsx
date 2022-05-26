import { config } from '../config';
import { HttpServices } from '../Helper';

export const DownloadTemplate = async (unitId, templateId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/DynamicTemplateForm/DownloadTemplate/${unitId}/${templateId}`,
    { responseType: 'blob' }
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DownloadHtmlTemplate = async (unitId, templateId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/DynamicTemplateForm/DownloadHtmlTemplate/${unitId}/${templateId}`,
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
