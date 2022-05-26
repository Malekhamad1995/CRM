import { config } from '../../config/config';
import { HttpServices } from '../../Helper';

const updateform = async (payload, formId) => {
  const result = await HttpServices.put(
    `${config.server_address}/FormBuilder/Forms/${formId}`,
    payload
  )
    .then((data) => data)
    .catch((error) => {
      return undefined;
    });
  return result;
};
export { updateform };
