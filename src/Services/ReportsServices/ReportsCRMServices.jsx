import { HttpServices } from '../../Helper';
import { config } from '../../config';

export const GetAllCRMReportsServices = async ({ reportModuleId, pageSize, pageIndex }) => {
    const result = await HttpServices.get(
        `${config.server_address}/CrmDfm/Reports/GetAllModuleReports?reportModuleId=${reportModuleId}&pageSize=${pageSize}&pageIndex=${pageIndex}`
    )
        .then((data) => data)
        .catch((error) => undefined);
    return result;
};

export const ExportReportServices = async () => {
    const result = await HttpServices.get(
        `${config.server_address}/CrmDfm/Reports/ExportExcel`
    )
        .then((data) => data)
        .catch((error) => undefined);
    return result;
};
