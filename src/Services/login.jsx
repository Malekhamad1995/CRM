import { config } from '../config/config';
import { HttpServices } from '../Helper';

const login = async (payload) => {
  const { body } = payload;

  try {
    body.organizationId = config.OrganizationsId;
    body.applicationId = config.applicationId;

    const result = await HttpServices.post(
      `${config.server_address}/Identity/Account/ApplicationLogin`,
      body,
        con
    );
    return result;
  } catch (e) {
    if (e.response && e.response.data) throw e.response.data;
    else throw e;
  }
};

export { login };
