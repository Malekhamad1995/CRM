import { config } from '../config/config';
import { HttpServices } from '../Helper';

export const ApiKey = 'AIzaSyATDejBolK5_ky6DD8E5vZ2nAvgfj2d3QE';

const GetLocationByAddress = async (address) => {
  const result = await HttpServices.get(
    `${config.server_address}/Lookups/Map/GetLocationByAddress/${address}`
  )
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};


export { GetLocationByAddress };
