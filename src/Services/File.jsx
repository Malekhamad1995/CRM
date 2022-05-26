import { HttpServices } from '../Helper';
import { config } from '../config/config';

const uploadFile = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/FileManager/File/Upload`, body)
    .then((data) => data)
    .catch((error) => {
      return undefined;
    });
  return result;
};

const ImportFile = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/FileManager/File/Import`, body)
    .then((data) => data)
    .catch((error) => {
      return undefined;
    });
  return result;
};

const GetMyImportProcess = async (pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/FileManager/File/GetMyImportProcess/${pageIndex}/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => {
      return undefined;
    });
  return result;
};

export { uploadFile, ImportFile, GetMyImportProcess };
