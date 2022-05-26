import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { SelectComponet, PermissionsComponent } from '../../../../Components';
import excellogo from '../../../../assets/images/defaults/microsoft_office_excel_logo.png';
import { GetAllCRMReportsServices } from '../../../../Services';
import { ReportModuleTypesEnum } from '../../../../Enums';
import { ReportsPermissions } from '../../../../Permissions';

ReportHeaderSectionView.propTypes = {
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  isShowExcelPart: PropTypes.bool,
  setLoadingView: PropTypes.func,
  OnReportChange: PropTypes.func,
  openDialog: PropTypes.func,
  onExportClicked: PropTypes.func,

};

function ReportHeaderSectionView({
  isShowExcelPart, translationPath, parentTranslationPath, setLoadingView, OnReportChange, openDialog, onExportClicked
}) {
  const { t } = useTranslation(parentTranslationPath);
  const [allReports, setAllReport] = useState({ result: [], totalCount: 0 });
  const GetAllReports = useCallback(async () => {
    setLoadingView(true);
    const res = await GetAllCRMReportsServices({
      reportModuleId: ReportModuleTypesEnum.Crm.key,
      pageSize: 100,
      pageIndex: 1
    });

    if (res) {
      const reportHashasPermission = res.result && res.result.length > 0 && res.result.filter((report) => report.hasPermission);
      setAllReport({
        result: reportHashasPermission || [],
        totalCount: reportHashasPermission.length || 0,
      });
    } else {
      setAllReport({
        result: [],
        totalCount: 0,
      });
    }
    setLoadingView(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    GetAllReports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className='header-section'>
      <div className='filter-section mb-2'>
        <div className='section'>
          <PermissionsComponent
            permissionsList={Object.values(ReportsPermissions)}
            permissionsId={ReportsPermissions.GetAllReports.permissionsId}
          >
            <SelectComponet
              wrapperClasses='bg-secondary c-white mx-2'
              themeClass='theme-action-buttons'
              emptyItem={{ value: 0, text: 'select-report-type', isDisabled: false }}
              defaultValue={0}
              data={allReports.result || []}
              idRef='reportsRef'
              valueInput='reportId'
              textInput='reportName'
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onSelectChanged={(event) => {
                const index = allReports.result.findIndex((f) => f.reportId === event);
                OnReportChange(index === -1 ? null : allReports.result[index]);
              }}
            />
          </PermissionsComponent>
          {
            isShowExcelPart && (
              <ButtonBase
                className='btns-icon theme-solid'
                onClick={() => openDialog()}
              >
                <span className='mdi mdi-tune' />
              </ButtonBase>
            )
          }
        </div>
        {isShowExcelPart && (
          <div className='section autocomplete-section export-excel'>
            <div className='d-flex-column px-2 w-100 p-relative'>
              <div className='w-100 p-relative'>
                <PermissionsComponent
                  permissionsList={Object.values(ReportsPermissions)}
                  permissionsId={ReportsPermissions.ExportExcel.permissionsId}
                >
                  <ButtonBase
                    className='MuiButtonBase-root MuiButton-root MuiButton-text table-action-btn btns miw-0'
                    tabIndex='0'
                    type='button'
                    onClick={onExportClicked}
                  >
                    <span className='MuiButton-label'>
                      <div className='excelPhoto'>
                        <img src={excellogo} alt='arrowImage' className='excelImage' />
                      </div>
                      <span className='px-1 info fw-normal'>
                        {t(`${translationPath}export-excel`)}
                      </span>
                    </span>
                    <span className='MuiTouchRipple-root' />
                  </ButtonBase>
                </PermissionsComponent>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportHeaderSectionView;
