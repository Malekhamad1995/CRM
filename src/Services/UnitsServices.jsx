import { config } from '../config';
import { HttpServices } from '../Helper';

const getUnits = async ({
  pageSize, pageIndex, search, excludeLeadOwnerInUnits
}) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0)
    queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`search=${search}`);
  if (excludeLeadOwnerInUnits) queryList.push(`excludeLeadOwnerInUnits=${excludeLeadOwnerInUnits}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetAllUnits?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllUnitsForLeadOwner = async ({
  pageSize, pageIndex, search, isSaleUnitType
}) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0)
    queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`search=${search}`);

  queryList.push(`isSaleUnitType=${isSaleUnitType}`);

  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetAllUnitsForLeadOwner?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAdvanceSearchUnits = async ({ pageSize, pageIndex }, body) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0)
    queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Unit/AdvanceSearch?${queryList.join('&')}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAdvanceSearchSaleUnits = async ({ pageSize, pageIndex }, body) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0)
    queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.post(
    `${config.server_address
    }/CrmDfm/Unit/GetAllSaleUnitsAdvanceSearch?${queryList.join('&')}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAdvanceSearchLeaseUnits = async ({ pageSize, pageIndex }, body) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0)
    queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.post(
    `${config.server_address
    }/CrmDfm/Unit/GetAllUnitLeaseAdvanceSearch?${queryList.join('&')}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAdvanceSearchLeaseUnitsPropertyManagement = async (
  { pageSize, pageIndex },
  body
) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0)
    queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.post(
    `${config.server_address
    }/CrmDfm/Unit/GetAllUnitPropertyManagementAdvanceSearch?${queryList.join(
      '&'
    )}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllLeaseTransactions = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Unit/GetAllLeaseTransactions`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllSaleTransactions = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/Unit/GetAllSaleTransactions`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllUnitPaymentPlanByUnitId = async ({
  unitId,
  pageIndex,
  pageSize,
}) => {
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/UnitPaymentPlan/GetAllUnitPaymentPlanByUnitId/${unitId}?pageIndex=${pageIndex + 1
    }&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetLatestSaleOrReservedSaleTransactionByUnitId = async (unitId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetLatestSaleOrReservedSaleTransactionByUnitId/${unitId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetSaleReservationClient = async ({ id, isForAccountTab }) => {
  const queryList = [];
  if (isForAccountTab) queryList.push(`isForAccountTab=${isForAccountTab}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetSaleReservationClient/${id}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetLeaseReservationTenants = async ({ id, isForAccountTab }) => {
  const queryList = [];
  if (isForAccountTab) queryList.push(`isForAccountTab=${isForAccountTab}`);

  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetLeaseReservationTenants/${id}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetSaleUnitTransactionDetails = async (unitTransactionId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetSaleUnitTransactionDetails(/${unitTransactionId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllChequeRequestsUnitTransactionId = async (
  unitTransactionId,
  { pageSize, pageIndex }
) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0)
    queryList.push(`pageIndex=${pageIndex + 1}`);
  if (unitTransactionId) queryList.push(`transactionId=${unitTransactionId}`);
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/GetAllTransactionChequeRequests?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetAllAmountReceivedUnitTransactionId = async (
  unitTransactionId
) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetAllAmountReceivedUnitTransactionId?unitTransactionId=${unitTransactionId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetSaleTransactionDetails = async (unitTransactionId) => {
  const queryList = [];
  if (unitTransactionId) queryList.push(`transactionId=${unitTransactionId}`);
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/account/GetSaleTransactionDetails?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetLeasingTransactionDetails = async (unitTransactionId) => {
  const queryList = [];
  if (unitTransactionId) queryList.push(`transactionId=${unitTransactionId}`);
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/account/GetLeasingTransactionDetails?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetChequeRequestTransactionInfo = async (unitTransactionId) => {
  const queryList = [];
  if (unitTransactionId) queryList.push(`transactionId=${unitTransactionId}`);
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/account/GetChequeRequestTransactionInfo?${queryList.join(
      '&'
    )}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetLeasingChequeRequestTransactionInfo = async (
  unitTransactionId
) => {
  const queryList = [];
  if (unitTransactionId) queryList.push(`transactionId=${unitTransactionId}`);
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/account/GetLeasingChequeRequestTransactionInfo?${queryList.join(
      '&'
    )}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetEarningByUnitTransactionId = async (unitTransactionId) => {
  const queryList = [];
  if (unitTransactionId) queryList.push(`transactionId=${unitTransactionId}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/account/GetEarning?${queryList.join(
      '&'
    )}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetLeasingEarningByUnitTransactionId = async (
  unitTransactionId
) => {
  const queryList = [];
  if (unitTransactionId) queryList.push(`transactionId=${unitTransactionId}`);
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/account/GetLeaseEarning?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetSalesTransactionReferenceDetailsByUnitTransactionId = async (
  unitTransactionId
) => {
  const queryList = [];
  if (unitTransactionId) queryList.push(`transactionId=${unitTransactionId}`);
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/account/GetReferralsForReferenceDetail?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetLeaseTransactionReferenceDetailsByUnitTransactionId = async (
  unitTransactionId
) => {
  const queryList = [];
  if (unitTransactionId) queryList.push(`transactionId=${unitTransactionId}`);
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/account/GetLeasingReferralsForReferenceDetail?${queryList.join(
      '&'
    )}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetUnitTransactionDocuments = async (
  id,
  { pageIndex, pageSize }
) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0)
    queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/PropertyManagementDocument/GetAllDocumentsByUnitTransaction/${id}?${queryList.join(
      '&'
    )}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateUnitTransactionDocument = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/PropertyManagementDocument`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateOrUpdateUnitTransactionReferenceDetail = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Unit/account/CreateOrUpdateUnitTransactionReferenceDetail`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateOrUpdateUnitLeasingTransactionReferenceDetail = async (
  body
) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Unit/account/CreateOrUpdateUnitLeasingTransactionReferenceDetail`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateUnitTransactionDocument = async (documentId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/PropertyManagementDocument/UpdateDocument/${documentId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateUnitTransactionChequeRequest = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Unit/CreateTransactionChequeRequest`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UpdateUnitTransactionChequeRequest = async (
  chequeRequestId,
  body
) => {
  const queryList = [];
  if (chequeRequestId)
    queryList.push(`transChequeRequestId=${chequeRequestId}`);
  const result = await HttpServices.put(
    `${config.server_address
    }/CrmDfm/Unit/UpdateTransactionChequeRequest?${queryList.join('&')}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetLatestLeaseOrReservedLeaseTransactionByUnitId = async (unitId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetLatestLeaseOrReservedLeaseTransactionByUnitId/${unitId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetUnitTransactionsHistory = async (unitId, { pageIndex, pageSize }) => {
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/GetUnitTransactionsHistory/${unitId}?pageIndex=${pageIndex + 1
    }&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const CreateUnitPaymentPlan = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/UnitPaymentPlan/CreateUnitPaymentPlan`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const BulkUpdateUnits = async (body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Unit/BulkUpdateUnits`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const UpdateUnitPaymentPlan = async (unitPaymentPlanId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/UnitPaymentPlan/UpdateUnitPaymentPlan/${unitPaymentPlanId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const DeleteUnitPaymentPlan = async (unitPaymentPlanId) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/UnitPaymentPlan/DeleteUnitPaymentPlan/${unitPaymentPlanId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const DeleteChequeRequest = async (chequeRequestId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/Unit/DeleteChequeRequest/${chequeRequestId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const UpdateUnitReferenceDetails = async (unitId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Unit/UpdateUnitReferenceDetails/${unitId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetUnitReferenceDetailsById = async (unitId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetUnitReferenceDetailsById/${unitId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetUnitPaymentPlanById = async (unitPaymentPlanId) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/UnitPaymentPlan/GetUnitPaymentPlanById/${unitPaymentPlanId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const unitDetailsGet = async ({ id }) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetUnitById/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllUnitLeadOwners = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetAllUnitLeadOwners?unitId=${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetUnitAvailableStatus = async (unitId, type) => {
  const queryList = [];
  if (type) queryList.push(`type=${type}`);
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/GetUnitAvailableStatus/${unitId}/type?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const CanSetUnitAsReservedOrLeasedOrSale = async (unitId, status) => {
  const queryList = [];
  if (unitId) queryList.push(`unitId=${unitId}`);
  if (status) queryList.push(`status=${status}`);

  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/CanSetUnitAsReservedOrLeasedOrSale?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllUnitsSaleByOwnerId = async ({ pageIndex, pageSize }, contactId) => {
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/GetAllUnitsSaleByOwnerId/${contactId}?pageIndex=${pageIndex + 1
    }&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllUnitsLeaseByOwnerId = async ({ pageIndex, pageSize }, ownerId) => {
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/GetAllUnitsLeaseByOwnerId/${ownerId}?pageIndex=${pageIndex + 1
    }&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAllUnitsByOwnerId = async ({ pageIndex, pageSize }, contactId) => {
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/GetAllUnitsByOwnerId/${contactId}?pageIndex=${pageIndex + 1
    }&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllUnitsByOwnerLeadId = async ({ pageIndex, pageSize }, contactId) => {
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/GetAllUnitsByOwnerLeadId/${contactId}?pageIndex=${pageIndex + 1
    }&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAllContactUnitTransactions = async (
  { pageIndex, pageSize },
  contactId
) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0)
    queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/GetAllContactUnitTransactions/${contactId}?${queryList.join(
      '&'
    )}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAllLeadUnitTransactions = async ({ pageIndex, pageSize }, leadId) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0)
    queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/GetAllLeadUnitTransactions/${leadId}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const unitDetailsPut = async ({ id, body }) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Unit/UpdateUnit/${id}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const SetUnitAsAvailableOrDraft = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Unit/SetUnitAsAvailableOrDraft`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const SetUnitAsReserveOrSale = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Unit/SetUnitAsReserveOrSale`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const SetUnitAsReserveOrLease = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Unit/SetUnitAsReserveOrLease`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
// const UpdateUnitStatus = async ({ id, status, body }) => {
//   const result = await HttpServices.put(
//     `${config.server_address}/CrmDfm/Unit/UpdateUnitStatus/${id}/${status}`,
//     body
//   )
//     .then((data) => data)
//     .catch((error) => error.response);
//   return result;
// };
const unitPost = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Unit`,
    body
  )
    .then((response) => response)
    .catch((error) => error.response);
  return result;
};
const GetLatitudeAndLongitudeByUnit = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetUnitMapByUnitId/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
// old version
const unitPut = async (payload) =>
  // const { body, token } = payload;
  // await base('put', 'v1/units/', token, body);
  ({});
const unitFieldsGet = async (payload) =>
  // const { searchableValue } = payload;
  // await base('get', `v1/units/fields/${searchableValue}`, '', null);
  ({});
const unitFilesGet = async (payload) =>
  //  const { unitId, token } = payload;
  // await base('get', `v1/units/files/${unitId}`, token, null);
  ({});
const unitPropertiesGet = async (payload) =>
  // const { propertyId, token } = payload;
  // await base('get', `v1/units/propertyId/${propertyId}`, token, null);
  ({});
const mergeUnitPut = async (payload) =>
  // const { token, id, body } = payload;
  // await base('put', `v1/units/mergeUnits/${id}`, token, body.data);
  ({});
const archiveUnitsPut = async (unitId) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Unit/ArchiveUnit/${unitId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetUnitImage = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetUnitImageByUnitId/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetUnitDocument = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetUnitDocumentByUnitId/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetReservationInvoices = async (unitTransactionId) => {
  // const queryList = [];
  // if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  // if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetReservationInvoices/${unitTransactionId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetLastSaleTransByUnitId = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetLastSaleTransByUnitId/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetLastLeaseTransByUnitId = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetLastLeaseTransByUnitId/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetReservedUnitTransactionDataForSaleByUnitId = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetReservedUnitTransactionDataForSaleByUnitId/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetReservedUnitTransactionDataForLeaseByUnitId = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetReservedUnitTransactionDataForLeaseByUnitId/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetUnitLeaseDetails = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetUnitLeaseDetails/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetUnitSaleDetails = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetUnitSaleDetails/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetUnitOpenHouseById = async (unitOpenHouseId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/UnitOpenHouse/GetUnitOpenHouseById/${unitOpenHouseId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const UpdateUnitSaleDetails = async (body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Unit/UpdateUnitSaleDetails`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllUnitOpenHouses = async (Id, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/UnitOpenHouse/GetAllUnitOpenHousesBUnityId/${Id}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const DeleteOpenHouse = async (unitOpenHouseId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/UnitOpenHouse/${unitOpenHouseId}`
  )
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};

const AddOpenHouse = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/UnitOpenHouse/`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};

const UpdateUnitOpenHouse = async (unitOpenHouseId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/UnitOpenHouse/UpdateUnitOpenHouse/${unitOpenHouseId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const UnitRemark = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/UnitRemark/`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllUnitRemarksByUnitId = async (Id, pageIndex, pageSize, isAgent) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/UnitRemark/GetAllUnitRemarksByUnitId/${Id}?pageIndex=${pageIndex}&pageSize=${pageSize}&isAgent=${isAgent}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const UpdateUnitLeaseDetails = async (body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Unit/UpdateUnitLeaseDetails`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};

const DeleteUnitRemark = async (unitRemarkId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/UnitRemark/${unitRemarkId}`
  )
    .then((data) => data)
    .catch((error) => error.response);

  return result;
};

const UpdateUnitRemark = async (unitRemarkId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/UnitRemark/UpdateUnitRemark/${unitRemarkId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetBuyerSummary = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetBuyerSummary/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllMatchingUnitsByLeadId = async (leadId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetAllMatchingUnitsByLeadId/${leadId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const UpdateBuyerSummary = async (unitId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Unit/UpdateBuyerSummary/${unitId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetShareUnitById = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetShareUnitById/${id}`, { headers: { ApiKey: config.ApiKey } }
  )
    .then((data) => data)
    .catch((error) => undefined);
  return result;
};

const GetLeaseTransactionDetails = async (unitTransactionId) => {
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/account/GetAccountLeaseTransactionDetails?transactionId=${unitTransactionId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetLeaseDetails = async (id) => {
  const result = await HttpServices.get(
    `${config.server_address
    }/CrmDfm/Unit/GetLeaseTransactionDetails/${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const GetAllUnitsByPropertyId = async ({
 propertyId, pageIndex, pageSize, orderBy, filterBy
}) => {
  // eslint-disable-next-line prefer-const
  let queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (orderBy) queryList.push(`orderBy=${orderBy}`);
  if (filterBy) queryList.push(`filterBy=${filterBy}`);

  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Unit/GetAllUnitsByPropertyId/${propertyId}?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const GetAllOwnersByUnitId = async (unitId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/UnitOwner/GetAllOwnersByUnitId?unitId=${unitId}`
  )
    .then((data) => data)
    .catch(((error) => error.response));
  return result;
};
const UnitOwner = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/UnitOwner`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const UpdateUnitOwner = async (query) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/UnitOwner/UpdateUnitOwner?unitId=${query.unitId}&oldOwnerId=${query.oldOwnerId}&newOwnerId=${query.newOwnerId}&IsLeadOwner=${query.isLeadOwner}&IsLeaseLeadOwner=${query.isLeaseLeadOwner}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export {
  GetShareUnitById,
  GetAllUnitsByPropertyId,
  GetAllUnitLeadOwners,
  DeleteChequeRequest,
  GetAllSaleTransactions,
  GetAllLeaseTransactions,
  CanSetUnitAsReservedOrLeasedOrSale,
  GetReservationInvoices,
  UpdateUnitPaymentPlan,
  DeleteUnitPaymentPlan,
  GetUnitPaymentPlanById,
  CreateUnitPaymentPlan,
  GetAllUnitPaymentPlanByUnitId,
  GetLatestSaleOrReservedSaleTransactionByUnitId,
  GetLatestLeaseOrReservedLeaseTransactionByUnitId,
  GetReservedUnitTransactionDataForSaleByUnitId,
  GetReservedUnitTransactionDataForLeaseByUnitId,
  GetAllLeadUnitTransactions,
  GetAllContactUnitTransactions,
  UpdateUnitLeaseDetails,
  GetUnitLeaseDetails,
  GetBuyerSummary,
  UpdateUnitSaleDetails,
  GetUnitSaleDetails,
  GetAllMatchingUnitsByLeadId,
  GetUnitAvailableStatus,
  SetUnitAsReserveOrSale,
  SetUnitAsReserveOrLease,
  SetUnitAsAvailableOrDraft,
  GetAllUnitsByOwnerLeadId,
  GetAllUnitsByOwnerId,
  GetAllUnitsSaleByOwnerId,
  GetAllUnitsLeaseByOwnerId,
  getUnits,
  GetAdvanceSearchUnits,
  unitDetailsGet,
  unitDetailsPut,
  unitPost,
  unitPut,
  unitFieldsGet,
  unitFilesGet,
  unitPropertiesGet,
  mergeUnitPut,
  archiveUnitsPut,
  BulkUpdateUnits,
  GetLatitudeAndLongitudeByUnit,
  GetUnitImage,
  GetUnitDocument,
  GetUnitOpenHouseById,
  GetAllUnitOpenHouses,
  AddOpenHouse,
  DeleteOpenHouse,
  UpdateUnitOpenHouse,
  UnitRemark,
  GetUnitTransactionsHistory,
  GetAllUnitRemarksByUnitId,
  DeleteUnitRemark,
  UpdateUnitRemark,
  UpdateBuyerSummary,
  GetAdvanceSearchSaleUnits,
  GetAdvanceSearchLeaseUnits,
  UpdateUnitReferenceDetails,
  GetUnitReferenceDetailsById,
  GetAdvanceSearchLeaseUnitsPropertyManagement,
  GetLeaseTransactionDetails,
  GetLastSaleTransByUnitId,
  GetLastLeaseTransByUnitId,
  GetLeaseDetails,
  GetAllOwnersByUnitId,
  GetAllUnitsForLeadOwner,
  UnitOwner,
  UpdateUnitOwner
};
