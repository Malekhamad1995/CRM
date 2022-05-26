import { config } from '../config';
import { HttpServices } from '../Helper';

export const GetAllApplicationServices = async ({ pageSize, pageIndex }) => {
  const result = await HttpServices.get(
    `${config.server_address}/PreSale/ApplicationService/GetAllApplicationService/${
      pageIndex + 1
    }/${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
