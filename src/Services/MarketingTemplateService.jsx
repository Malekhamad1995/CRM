import { config } from '../config';
import { HttpServices } from '../Helper';

export const GetAllMarketingTemplates = async ({ pageSize, pageIndex }) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/MarketingTemplate/GetAllTemplates?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateMarketingTemplate = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/MarketingTemplate`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateMarketingTemplate = async (templateId, body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/MarketingTemplate/${templateId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
