import { config } from '../../config';
import { HttpServices } from '../../Helper';

export const GetContactServiceOfferByContactId = async (contactId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/ContactServiceOffer/GetContactServiceOfferByContactId/${contactId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const ContactServiceOfferPost = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/ContactServiceOffer`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
