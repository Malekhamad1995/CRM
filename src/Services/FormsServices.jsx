import { config } from '../config/config';
import { HttpServices } from '../Helper';

const formGet = async (payload) =>
  // const { token } = payload;
  //   await base('get', 'v1/forms', token, null);
  ({});
const formPost = async (payload) =>
  // const { token, body } = payload;
  //   await base('post', 'v1/forms', token, body);
  ({});
const formByIdPut = async (payload) =>
  // const { body, token } = payload;
  //   await base('put', 'v1/forms', token, body);
  ({})
  ;
// const formByIdGet = async (payload) => {
//     const { formname, token } = payload;
//     return await base('get', `v1/forms/${formname}`, token, null);
// }
const formByIdGet = async (payload) => {
  const { formname } = payload;
  const result = await HttpServices.get(`${config.server_address}/FormBuilder/Forms/${formname}`);
  if (result.formsId) {
    const mappedResult = [
      {
        form_id: result.formsId,
        form_name: result.formsName,
        form_content: result.formsContent,
      },
    ];
    return mappedResult;
  }
  return undefined;
};

const GetAllSearchableFormFieldsByFormId = async (formId) => {
  const result = await HttpServices.get(
    `${config.server_address}/FormBuilder/FormField/GetAllSearchableFormFieldsByFormId?formId=${formId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAllFormFieldsByFormId = async (formId) => {
  const result = await HttpServices.get(
    `${config.server_address}/FormBuilder/FormField/GetAllFormFieldsByFormId?formId=${formId}`
  ).then((data) => data).catch(() => undefined);
  return result;
};

export {
  GetAllSearchableFormFieldsByFormId,
  formGet,
  formPost,
  formByIdPut,
  formByIdGet,
  GetAllFormFieldsByFormId,
};
