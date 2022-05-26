import axios from 'axios';
import base from './base';
import { config } from '../config/config';
import { HttpServices } from '../Helper';
// return contacts cards (extended)
const contactsGet = async (payload) => {
  const { pageNumber, pageSize } = payload;
  return await base('get', 'v1/contacts/types', { pageNumber, pageSize });
};
// return contacts cards (extended)
const GetContacts = async ({
 pageSize, pageIndex, search, classificationId , isAdvance 
}) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0)
    queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`search=${search}`);
  if (classificationId) queryList.push(`classificationId=${classificationId}`);

  if (isAdvance === false) queryList.push(`isAdvance=${isAdvance}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Contacts/ViewContact?${queryList.join(
      '&'
    )}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetContactByEmail = async ({
  pageSize, pageIndex, search
 }) => {
   const queryList = [];
   if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
   if (pageIndex || pageIndex === 0)
     queryList.push(`pageIndex=${pageIndex + 1}`);
   if (search) queryList.push(`search=${search}`);
   const result = await HttpServices.get(
     `${config.server_address}/CrmDfm/Contacts/ViewEmailContact?${queryList.join(
       '&'
     )}`
   )
     .then((data) => data)
     .catch((error) => error.response);
   return result;
 };

const GetCorporateContacts = async ({
 pageSize, pageIndex, search, classificationId
}) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0)
    queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`search=${search}`);
  if (classificationId) queryList.push(`classificationId=${classificationId}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Contacts/ViewCorporate?${queryList.join(
      '&'
    )}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAdvanceSearchContacts = async ({ pageSize, pageIndex }, body) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0)
    queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Contacts/AdvanceSearch?${queryList.join(
      '&'
    )}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetDuplicatedContactByContactId = async (
  pageIndex,
  pageSize,
  contactsId
) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Contacts/GetDuplicatedContactByContactId/${contactsId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllAssociatedContact = async (contactId, { pageSize, pageIndex }) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0)
    queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Contacts/GetAllAssociatedContact/${contactId}?${queryList.join(
      '&'
    )}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
// To Get Specific Card
const contactsDetailsGet = async ({ id }) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Contacts/GetContactById/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const contactsDetailsFieldsGet = async (payload) => {
  const { token, id } = payload;
  return await base('get', `v1/contacts/view/${id}`, token, null);
};
const contactsFieldsGet = async (payload) => {
  const { searchableValue } = payload;
  return await base('get', `v1/contacts/fields/${searchableValue}`, '', null);
};
const contactsDetailsPut = async ({ id, body }) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Contacts/${id}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const contactsPost = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Contacts`,
    body
  )
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};

const MergeContact = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Contacts/MergeContact`,
    body
  )
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};

const contactsPut = async (payload) => {
  const { body, token } = payload;
  return await base('put', 'v1/contacts/', token, body);
};
const contactsSearchGet = async (payload) => {
  const { pageNumber, pageSize } = payload;
  const body = { contact: payload.contact };
  //
  // const options = {
  //     method: 'post',
  //     headers: {
  //         'content-type': 'application/json'
  //     },
  //     url: `http://${config.server_address}/v1/contacts/search/criteria?market=US&pageNumber=${pageNumber}&pageSize=${pageSize}`,
  //     data: body
  // };
  try {
    const result = await axios.post(
      `${config.server_address}/api/v1/contacts/search/criteria?market=US&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      { ...body }
    );
    return result;
  } catch (e) {
    return { contacts: [], totalCount: 0 };
  }
};

const contactUnitsOrPropertiesGet = async (payload) => {
  const { contactId, token } = payload;
  return await base(
    'get',
    `v1/contacts/unitOrProperty/${contactId}`,
    token,
    null
  );
};
const contactOwnerUnitsOrPropertiesGet = async (payload) => {
  const { contactId, token } = payload;
  return await base(
    'get',
    `v1/contacts/ownerUnitOrProperty/${contactId}`,
    token,
    null
  );
};

const contactFileGet = async (payload) => {
  const { contactId, token } = payload;
  return await base('get', `v1/contacts/file/${contactId}`, token, null);
};
const mergeContactPut = async (payload) => {
  const { token, id, body } = payload;
  return await base('put', `v1/contacts/mergeContacts/${id}`, token, body.data);
};
const archivecontactsPut = async (ContactId) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Contacts/ArchiveContact/${ContactId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetContactDocumentByContactId = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Contacts/GetContactDocumentByContactId/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllAccessUserTypeByContactId = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Contacts/GetAllAccessUserTypeByContactId/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const QuickAddContact = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Contacts/QuickAddContact`,
    body
  )
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};

const SendBulkSmsPost = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Contacts/SendBulkSms`,
    body
  )
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};
const CreateContactDocument = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Contacts/CreateContactDocument`,
    body
  )
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};
const SendCorrespondingEmailPost = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Template/SendCorrespondingEmail`,
    body
  )
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};

const GetAllContactsByClassificationIds = async ({
  pageSize, pageIndex, search, classificationIds
 }) => {
   const queryList = [];
   if (pageSize || pageSize === 0) queryList.push(`pageSize=${25}`);
   if (pageIndex || pageIndex === 0)
     queryList.push(`pageIndex=${pageIndex + 1}`);
   if (search) queryList.push(`search=${search}`);
   if (classificationIds) {
    classificationIds.forEach((element) => {
      queryList.push(`classificationIds=${element}`);
     });
   }
   const result = await HttpServices.get(
     `${config.server_address}/CrmDfm/Contacts/GetAllContactsByClassificationIds?${queryList.join(
       '&'
     )}`
   )
     .then((data) => data)
     .catch((error) => error.response);
   return result;
 };
export {
  CreateContactDocument,
  GetContacts,
  GetAdvanceSearchContacts,
  GetAllAssociatedContact,
  contactsGet,
  contactsDetailsGet,
  contactsFieldsGet,
  contactsDetailsFieldsGet,
  contactsDetailsPut,
  contactsPost,
  contactsPut,
  contactsSearchGet,
  contactUnitsOrPropertiesGet,
  contactOwnerUnitsOrPropertiesGet,
  contactFileGet,
  mergeContactPut,
  archivecontactsPut,
  MergeContact,
  SendBulkSmsPost,
  GetContactDocumentByContactId,
  GetAllAccessUserTypeByContactId,
  QuickAddContact,
  SendCorrespondingEmailPost,
  GetCorporateContacts,
  GetAllContactsByClassificationIds,
  GetContactByEmail

};
