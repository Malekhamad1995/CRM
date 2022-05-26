import { config } from '../../config/config';
import { HttpServices } from '../../Helper';

const GetAllBranches = async () => {
    const result = await HttpServices.get(`${config.server_address}/Identity/Branch/GetAllBranches`)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};
const CreateBranch = async (body) => {
    const result = await HttpServices.post(`${config.server_address}/Identity/Branch/CreateBranch`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const SetBranchAsActiveOrInactive = async ({ branchId }) => {
    const result = await HttpServices.put(`${config.server_address}/Identity/Branch/SetBranchAsActiveOrInactive?branchId=${branchId}`)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

const UpdateBranch = async ({ branchId, body }) => {
    const result = await HttpServices.put(`${config.server_address}/Identity/Branch/UpdateBranch?branchId=${branchId}`, body)
    .then((data) => data)
    .catch((error) => error.response);
  return result;
};

export {
  GetAllBranches,
  CreateBranch,
  SetBranchAsActiveOrInactive,
  UpdateBranch
};
