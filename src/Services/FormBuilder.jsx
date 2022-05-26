import { config } from '../config';
import { HttpServices } from '../Helper';

export const GetAllFormFieldTabsByFormId = async ({ formId }) => {
  const queryList = [];
  if (formId) queryList.push(`formId=${formId}`);
  const result = await HttpServices.get(
    `${config.server_address}/FormBuilder/FormField/GetAllFormFieldTabsByFormId?${queryList.join(
      '&'
    )}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
