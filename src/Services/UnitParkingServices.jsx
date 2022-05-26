import { config } from '../config';
import { HttpServices } from '../Helper';

export const GetAllUnitParking = async ({ pageIndex, pageSize }) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/UnitParking/GetAllUnitParking/?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const DeleteUnitParking = async (unitParkingId) => {
  const result = await HttpServices.delete(
    `${config.server_address}/CrmDfm/UnitParking/${unitParkingId}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export const UnitParkingById = async (unitId, pageIndex, pageSize) => {
  const result = await HttpServices.get(
    `${config.server_address}/CrmDfm/UnitParking/GetUnitParkingByUnitId/${unitId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  )
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const UnitParkingAdd = async (body) => {
  const result = await HttpServices.post(`${config.server_address}/CrmDfm/UnitParking`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
export const unitParkingId = async (unitParkingIds, body) => {
  const result = await HttpServices.put(`${config.server_address}/CrmDfm/UnitParking/UpdateUnitParking/${unitParkingIds}`,
    body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
