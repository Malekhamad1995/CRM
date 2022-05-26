// import { config } from '../config';
import { config } from '../config';
import { HttpServices } from '../Helper';

const GetLeads = async ({
  pageSize, pageIndex, search, leadStatus
}) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`search=${search}`);
  if (leadStatus) queryList.push(`leadStatus=${leadStatus}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Leads/GetAllLeads?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAdvanceSearchLeads = async ({ pageSize, pageIndex }, body) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Leads/AdvanceSearch?${queryList.join('&')}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetMyLeadAdvanceSearch = async ({ pageSize, pageIndex }, body) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/MyLead/GetMyLeadAdvanceSearch?${queryList.join('&')}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAllMReferredLeadAdvanceSearch = async ({ pageSize, pageIndex }, body) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/MyLead/GetAllMReferredLeadAdvanceSearch?${queryList.join(
      '&'
    )}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAllSaleAvailableUnitsAdvanceSearch = async ({ pageSize, pageIndex }, body) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Unit/GetAllSaleAvailableUnitsAdvanceSearch?${queryList.join(
      '&'
    )}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAvailableLeaseUnitsAdvanceSearch = async ({ pageSize, pageIndex }, body) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/MyLead/GetAvailableLeaseUnitsAdvanceSearch?${queryList.join(
      '&'
    )}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetManagedLeadsAdvanceSearch = async ({ pageSize, pageIndex }, body) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Leads/GetManagedLeadsAdvanceSearch?${queryList.join('&')}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAdvanceSearchSaleLeads = async ({ pageSize, pageIndex }, body) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.post(
    `${config.server_address
    }/CrmDfm/Leads/GetAllSellerOrBuyerLeadsAdvanceSearch?${queryList.join('&')}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAdvanceSearchLeaseLeads = async ({ pageSize, pageIndex }, body) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Leads/GetAllTenantOrLandlordLeadAdvanceSearch?${queryList.join(
      '&'
    )}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const leadDetailsGet = async ({ id }) => {
  const result = await HttpServices.get(`${config.server_address}/CrmDfm/Leads/GetLeadById/${id}`)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAllPropertyManagementLeads = async ({ pageSize, pageIndex, search }) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`search=${search}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Leads/GetAllPropertyManagementLeads?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const leadDetailsPut = async ({ id, body }) => {
  const result = await HttpServices.put(`${config.server_address}/CrmDfm/Leads/${id}`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const CloseLead = async (body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Leads/CloseLead`, body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const CreateMyLead = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/MyLead/CreateLead`, body)
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};
const CreateLeadWithReferredToId = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/MyLead/CreateLeadWithReferredToId`, body)
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};
const SharedVirtualTour = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/MyLead/SharedVirtualTour`,
    body
  )
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};
const leadPost = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Leads/`, body)
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};
const CloneLeads = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Leads/CloneLeads`, body)
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};

const MergeLeads = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Leads/MergeLead`, body)
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};

const CloneLead = async (leadId) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Leads/CloneLead/${leadId}`)
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};
const leadContactsGet = async (payload) => {
  // const { contactId, token } = payload;

  // await base('get', `v1/leads/contactId/${contactId}`, token, null);
  const result = {};
  return result;
};
const leadUnitOrPropertyGet = async (payload) => {
  // const { leadId, token } = payload;
  // await base('get', `v1/leads/unitOrProperty/${leadId}`, token, null);
  const result = {};
  return result;
};
const leadByContentIdGet = async (payload) => {
  // const { contactId, token } = payload;
  // await base('get', `v1/leads/contactId/${contactId}`, token, null);
  const resuilt = {};
  return resuilt;
};
const archiveLeadsPut = async (LeadsId) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Leads/ArchiveLead/${LeadsId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllLeadsByContactId = async (
  {
    pageIndex, pageSize, leadStatus, leadClass, referredTo
  },
  contactId
) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (leadStatus) queryList.push(`leadStatus=${leadStatus}`);
  if (leadClass) queryList.push(`leadClass=${leadClass}`);
  if (referredTo) queryList.push(`referredTo=${referredTo}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Leads/GetAllLeadsByContactId/${contactId}?${queryList.join(
      '&'
    )}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAllSaleLeadsByContactId = async ({ pageIndex, pageSize, leadStatus }, contactId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Leads/GetAllSaleLeadsByContactId/${contactId}?leadStatus=${leadStatus}&pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const SendUnitProposalToLeadAPI = async (leadIds, unitIds, ApiKey, templateId, sendKey, serverName) => {
  const queryList = [];
  if (sendKey) queryList.push(`sendKey=${sendKey}`);
  if (serverName) queryList.push(`serverName=${serverName}`);
  if (templateId) queryList.push(`templateId=${templateId}`);
  if (ApiKey) queryList.push(`ApiKey=${ApiKey}`);

  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Template/SendUnitProposalToLead?${queryList.join(
      '&'
    )}`,
    { leadIds, unitIds }
  )
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};

const GetAllLeaseLeadsByContactId = async ({ pageIndex, pageSize, leadStatus }, contactId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Leads/GetAllLeaseLeadsByContactId/${contactId}?leadStatus=${leadStatus}&pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllMatchingLeadsByUnitId = async (unitId, pageIndex, pageSize) => {
  if (pageIndex === 0) pageIndex = 1;
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Leads/GetAllMatchingLeadsByUnitId/${unitId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const CloseListOfLeads = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Leads/CloseListOfLeads`, body)
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};

const GetAllContactLeadsAdvanceSearch = async (leadTab, { pageSize, pageIndex }, body) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (leadTab) queryList.push(`leadTab=${leadTab}`);
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Leads/GetAllContactLeadsAdvanceSearch?${queryList.join(
      '&'
    )}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const ReassignLeads = async (body) => {
  const result = await HttpServices.put(`${config.server_address}/CrmDfm/Leads/UpdateLeadsReferredTo`, body)
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};

export {
  CreateMyLead,
  GetAvailableLeaseUnitsAdvanceSearch,
  GetAllSaleAvailableUnitsAdvanceSearch,
  GetAllMReferredLeadAdvanceSearch,
  GetMyLeadAdvanceSearch,
  GetAllMatchingLeadsByUnitId,
  GetLeads,
  GetAllPropertyManagementLeads,
  CloseLead,
  GetAdvanceSearchLeads,
  leadDetailsGet,
  leadDetailsPut,
  leadPost,
  CloneLeads,
  leadContactsGet,
  leadUnitOrPropertyGet,
  leadByContentIdGet,
  MergeLeads,
  GetManagedLeadsAdvanceSearch,
  GetAllSaleLeadsByContactId,
  GetAllLeaseLeadsByContactId,
  archiveLeadsPut,
  SharedVirtualTour,
  GetAllLeadsByContactId,
  GetAdvanceSearchLeaseLeads,
  CreateLeadWithReferredToId,
  CloneLead,
  GetAdvanceSearchSaleLeads,
  SendUnitProposalToLeadAPI,
  CloseListOfLeads,
  GetAllContactLeadsAdvanceSearch,
  ReassignLeads,
};
