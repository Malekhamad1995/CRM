import React, { useState, useEffect } from 'react';
import { Spinner, SelectComponet } from '../../../Components';
import NoReportSelectionView from './Sections/NoReportSelectionView';
import ReportHeaderSectionView from './Sections/ReportHeaderSectionView';
import ReportFormDialog from "./Sections/ReportFormDialog";
import { HttpServices, ExportReportServices } from "../../../Services";
import { showError, unCamelCase } from "../../../Helper";
import { config } from '../../../config';
import ReportTableView from "./Sections/ReportTableView";
import { useTitle } from '../../../Hooks';
import { useTranslation } from 'react-i18next';

const parentTranslationPath = 'Reports';
const translationPath = '';
export const ReportsView = () => {
    const [activeReport, setActiveReport] = useState(null);
    const { t } = useTranslation(parentTranslationPath);
    useTitle(t(`${translationPath}Reports`));
    const [isLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [reportDto, setReportDto] = useState({});
    const [filter, setFilter] = useState({ pageIndex: 0, pageSize: 25 });
    const [reportSchema, setReportSchema] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [reportTotalCount, setReportTotalCount] = useState(0);
    const [recall, setReCall] = useState(false);

    const onPageIndexChanged = (pageIndex) => {
        setFilter((item) => ({ ...item, pageIndex }));
        setReCall(!recall)
    };
    const onPageSizeChanged = (pageSize) => {
        setFilter((item) => ({ ...item, pageIndex: 1, pageSize }));
        setReCall(!recall);
    };

    const convertFormDtoToDto = (obj) => {
        let dto = {};
        for (const key in obj) {
            if (typeof (obj[key]) === 'object') {
                if (obj[key] && obj[key]["id"]) dto[key] = obj[key]["id"];
                else if (obj[key] && obj[key]["lookupItemId"]) dto[key] = obj[key]["lookupItemId"];
                else dto[key] = obj[key]
            }
            else
                dto[key] = obj[key]
        }
        return dto;
    }

    useEffect(() => {
        autoCallReportAPi();
    }, [recall])

    useEffect(() => {
        if (activeReport !== null) {
            setOpenDialog(true);
        }
        setReportDto({});
        setReportSchema([]);
        setReportData([]);
        setReportTotalCount(0);
        setFilter({ pageIndex: 0, pageSize: 25 })
    }, [activeReport]);

    const autoCallReportAPi = async (pageSize) => {
        if (activeReport === null) return;
        setIsLoading(true);
        reportDto.pageSize = pageSize||filter.pageSize;
        reportDto.pageIndex = filter.pageIndex + 1;
        const Dto = convertFormDtoToDto(reportDto);
        const res = await HttpServices.post(`${config.server_address}${activeReport.endpointName}`, Dto)
            .then((data) => data)
            .catch(() => undefined);
        if (!res) { showError("server Error"); setIsLoading(false); return; };
        if (res.result && res.result.length === 0) { setReportSchema([]); setIsLoading(false); return; }
        const temp = res.result[0];
        setReportData(res.result);
        setReportTotalCount(res.totalCount)
        const list = [];
        let i = 0;
        for (const key in temp) {
            i++;
            list.push({
                id: i,
                label: unCamelCase(key),
                component: (item) => (
                    <div>
                        {(item && item[key]) || ''}
                    </div>
                ),
                isDefaultFilterColumn: true
            }
            );
        }
        setReportSchema(list.slice(0,-1));
        setIsLoading(false)
    }
    const exportDataToCsv = async () => {

        if (activeReport === null) return;
        setIsLoading(true);
        reportDto.pageSize = 10000000;
        reportDto.pageIndex = filter.pageIndex + 1;
        const Dto = convertFormDtoToDto(reportDto);
        const res = await HttpServices.post(`${config.server_address}${activeReport.endpointName}`, Dto)
            .then((data) => data)
            .catch(() => undefined);
        if (!res) { showError("server Error"); setIsLoading(false); return; };
        if (res.result && res.result.length === 0) { setReportSchema([]); setIsLoading(false); return; }
        let reData = (res.result);
   
        setIsLoading(false); 
        let csvContent = "data:text/csv;charset=utf-8,";
        if (reData && reData.length === 0) return;
        const temp =  reData[0];
        const list = [];
        for (const key in temp) {
            csvContent += `${unCamelCase(key)},`
        }
        csvContent += '\r\n';
        reData.map((item) => {
            for (const key in temp) {
                csvContent += `${item[key]},`
            }
            csvContent += '\r\n';
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("target", "_blank");
        link.setAttribute("download", `${activeReport.reportName}.csv`);
        document.body.appendChild(link);
        link.click();
        const ress = await ExportReportServices();
        if (ress) {
            return;
        }
    }
    return (
        <div className=' px-2 view-wrapper reports-view-wrapers'>
            <Spinner isActive={isLoading} isAbsolute />
            <div className='d-flex-column'>
                <ReportHeaderSectionView
                    isShowExcelPart={activeReport !== null}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    setLoadingView={setIsLoading}
                    OnReportChange={setActiveReport}
                    openDialog={() => setOpenDialog(true)}
                    onExportClicked={exportDataToCsv}
                />
                <NoReportSelectionView
                    isShow={activeReport === null}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                />
                <ReportTableView
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    tableData={reportData}
                    tableSchema={reportSchema}
                    totalItems={reportTotalCount}
                    onPageIndexChanged={onPageIndexChanged}
                    onPageSizeChanged={onPageSizeChanged}
                    filter={filter}
                    activeReport = {activeReport!=null? activeReport.reportId:0}
                />
            </div>

            <ReportFormDialog
                isShow={activeReport !== null && openDialog}
                formId={activeReport?.formId}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                reportName={activeReport?.reportName}
                close={() => setOpenDialog(false)}
                onSaveReportDto={setReportDto}
                reportDto={reportDto}
                onSearchClick={async () => { setOpenDialog(false); await autoCallReportAPi(); }}
            />
        </div>
    );
};
