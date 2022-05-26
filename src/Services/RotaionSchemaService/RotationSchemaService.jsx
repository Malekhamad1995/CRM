import { HttpServices } from '../../Helper';
import { config } from '../../config';

export const GetAllRotationSchemeServices = async ({ pageSize, pageIndex, search }) => {
    const result = await HttpServices.get(
        `${config.server_address}/CrmDfm/RotationSchemes/GetAllRotationScheme?pageIndex=${pageIndex + 1
        }&pageSize=${pageSize}&search=${search}`
    )
        .then((data) => data)
        .catch((error) => error.response);
    return result;
};
export const GetAdvanceSearchRotationScheme = async (body) => {
    const result = await HttpServices.post(
        `${config.server_address}/CrmDfm/RotationSchemes/GetAllOrderedRotationScheme`, body
    )
        .then((data) => data)
        .catch((error) => error.response);
    return result;
};

export const CreateRotationSchemeServices = async (body) => {
    const result = await HttpServices.post(
        `${config.server_address}/CrmDfm/RotationSchemes/CreateRotationScheme`, body
    )
        .then((data) => data)
        .catch((error) => error.response);
    return result;
};

export const GetRotationSchemeByIdServices = async (id) => {
    const result = await HttpServices.get(
        `${config.server_address}/CrmDfm/RotationSchemes/GetRotationSchemeById/${id}`
    )
        .then((data) => data)
        .catch((error) => error.response);
    return result;
};

export const GetAllAgentByRotationSchemeServices = async ({ id, pageIndex, pageSize }) => {
    const result = await HttpServices.get(
        `${config.server_address}/CrmDfm/RotationSchemes/GetAllAgentByRotationScheme/${id}?pageIndex=${pageIndex}&pageSize=${pageSize}`
    )
        .then((data) => data)
        .catch((error) => error.response);
    return result;
};

export const RemoveAgentToRotationSchemeServices = async (rotationSchemeId, agentId) => {
    const result = await HttpServices.delete(
        `${config.server_address}/CrmDfm/RotationSchemes/RemoveAgentToRotationScheme/${rotationSchemeId}/${agentId}`
    )
        .then((data) => data)
        .catch((error) => error.response);
    return result;
};

export const AssignAgentToRotationScheme = async (rotationSchemeId, body) => {
    const result = await HttpServices.put(
        `${config.server_address}/CrmDfm/RotationSchemes/AssignAgentToRotationScheme/${rotationSchemeId}`, body
    )
        .then((data) => data)
        .catch((error) => error.response);
    return result;
};

export const AssignListingAgentToRotationScheme = async (rotationSchemeId, body) => {
    const result = await HttpServices.put(
        `${config.server_address}/CrmDfm/RotationSchemes/AssignListingAgentToRotationScheme/${rotationSchemeId}`, body
    )
        .then((data) => data)
        .catch((error) => error.response);
    return result;
};

export const UpdateRotationScheme = async (rotationSchemeId, body) => {
    const result = await HttpServices.put(
        `${config.server_address}/CrmDfm/RotationSchemes/UpdateRotationScheme/${rotationSchemeId}`, body
    )
        .then((data) => data)
        .catch((error) => error.response);
    return result;
};

export const DeleteRotationSchema = async (rotationSchemeId) => {
    const result = await HttpServices.delete(
        `${config.server_address}/CrmDfm/RotationSchemes/DeleteRotationSchema/${rotationSchemeId}`
    )
        .then((data) => data)
        .catch((error) => error.response);
    return result;
};

export const GetAllListingAgentByRotationSchemeServices = async ({ id, pageIndex, pageSize }) => {
    const result = await HttpServices.get(
        `${config.server_address}/CrmDfm/RotationSchemes/GetAllListingAgentByRotationScheme/${id}?pageIndex=${pageIndex}&pageSize=${pageSize}`
    )
        .then((data) => data)
        .catch((error) => error.response);
    return result;
};
export const RemoveListingAgentToRotationScheme = async (rotationSchemeId, listingAgentId) => {
    const result = await HttpServices.delete(
        `${config.server_address}/CrmDfm/RotationSchemes/RemoveListingAgentToRotationScheme/${rotationSchemeId}/${listingAgentId}`

    )
        .then((data) => data)
        .catch((error) => error.response);
    return result;
};
