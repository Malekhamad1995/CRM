import { HttpServices } from '../../Helper';
import { config } from '../../config/config';

const GetForms = async (pageIndex, pageSize, searchedItem) => {
  const result = await HttpServices.get(
    `${config.server_address}/FormBuilder/Forms/${pageIndex}/${pageSize}?search=${searchedItem}`
  )
    .then((data) => data)
    .catch((error) => {
      return undefined;
    });
  return result;
};

export { GetForms };
