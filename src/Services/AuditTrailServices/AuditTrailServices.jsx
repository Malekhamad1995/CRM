import { config } from '../../config/config';
import { HttpServices } from '../../Helper';

export const GetAllDFMTransaction = async ({ pageIndex, pageSize }) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/AuditTrail/GetAllDFMTransaction?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllDFMTransactionForContact = async (
  { pageIndex, pageSize },
  contactId
) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/AuditTrail/GetAllDFMTransactionForContact/${contactId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllDFMTransactionForProperty = async (
  pageIndex,
  pageSize,
  propertyId
) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/AuditTrail/GetAllDFMTransactionForProperty/${propertyId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllDFMTransactionForUnit = async (
  { pageIndex, pageSize },
  unitId
) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/AuditTrail/GetAllDFMTransactionForUnit/${unitId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetAllDFMTransactionForLead = async (
  { pageIndex, pageSize },
  leadId
) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/AuditTrail/GetAllDFMTransactionForLead/${leadId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
