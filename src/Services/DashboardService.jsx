import { config } from '../config/config';
import { HttpServices } from '../Helper';

const TokenMicrosoftAccount = async () => {
  try {
    const result = await HttpServices.post(
      `${config.server_address}/CrmDfm/ExternalApis/GetToken`,

    );
    return result;
  } catch (e) {
    return undefined;
  }
};
const TokenReport = async (reportid , groupid) => {
  try {
    const result = await HttpServices.post(
      `${config.server_address}/Identity/Account/GetPowerPiToken?reports=${reportid}&groups=${groupid}`,

    );
    return result;
  } catch (e) {
    return undefined;
  }
};


 const RefreshTokenPbi = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/Identity/Account/RefreshTokenPowerBi`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};



 
export {
  TokenMicrosoftAccount,
  TokenReport,
  RefreshTokenPbi,
};