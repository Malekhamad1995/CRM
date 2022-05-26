import { config } from '../../config/config';
import { HttpServices } from '../../Helper';

export const GetAllCompanyFinancesByPropertyId = async (pageIndex, pageSize, propertyId) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/CompanyFinance/GetAllCompanyFinancesByPropertyId/${propertyId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const CreateCompanyFinance = async (body) => {
  const result = await HttpServices.post(
    `${config.server_address}/CrmDfm/CompanyFinance/CreateCompanyFinance`,
    body
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteCompanyFinance = async (companyFinanceId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/CompanyFinance/DeleteCompanyFinance/${companyFinanceId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
