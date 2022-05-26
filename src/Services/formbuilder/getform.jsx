import { config } from '../../config/config';
import { HttpServices } from '../../Helper';

const getform = async (formName) => {
  const result = await HttpServices.get(`${config.server_address}/FormBuilder/Forms/${formName}`)
    .then((data) => data)
    .catch((error) => {
      return undefined;
    });
  const mappedResult = [
    {
      form_id: result.formsId,
      form_name: result.formsName,
      form_content: result.formsContent,
    },
  ];
  return mappedResult;
};
export { getform };
