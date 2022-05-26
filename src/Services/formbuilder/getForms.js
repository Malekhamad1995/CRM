import axios from 'axios';
import { config } from '../../config/config';

const GetForms = async ({ pageIndex, pageSize, searchedItem }) => {
  try {
  const result = await axios.get(
    `${config.server_address}/FormBuilder/Forms/${pageIndex + 1}/${pageSize}?search=${searchedItem}`
  );
    return result;
  } catch (e) {
    if (e.response && e.response.data)
      throw e.response.data;
     else
      throw e;
  }
};

export { GetForms };
