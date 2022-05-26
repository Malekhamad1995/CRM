import { config } from '../config';
import { HttpServices } from '../Helper';

export const EditInvoice = async (invoiceId, body) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Invoice/UpdateInvoice/${invoiceId}`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const GetInvoices = async ({
 pageSize, pageIndex, search, filterBy, orderBy
}) => {
  const queryList = [];
  if (pageSize || pageSize === 0) queryList.push(`pageSize=${pageSize}`);
  if (pageIndex || pageIndex === 0) queryList.push(`pageIndex=${pageIndex + 1}`);
  if (search) queryList.push(`search=${search}`);
  if (filterBy) queryList.push(`filterBy=${filterBy}`);
  if (orderBy) queryList.push(`orderBy=${orderBy}`);
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Invoice/GetInvoices?${queryList.join('&')}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateInvoice = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Invoice/CreateInvoice`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const CreateInvoicesReceipt = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/Invoice/CreateInvoicesReceipt`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const DeleteInvoice = async (id) => {
  const result = await HttpServices.put(
    `${config.server_address}/CrmDfm/Invoice/DeleteInvoice?invoiceId=${id}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetReceiptByInvoiceId = async (invoiceId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Invoice/GetReceiptByInvoiceId/${invoiceId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const GetInvoicesById = async (invoiceId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/Invoice/GetInvoicesById?invoiceId=${invoiceId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
