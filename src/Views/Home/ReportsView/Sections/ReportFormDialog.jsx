import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogActions,
} from '@material-ui/core';
import { ActivityReportDialogFooter } from '../ActivityReportDialog/Sections/ActivityReportDialogFooter';
import ReportFormDialogHeader from './ReportDialogSections/ReportFormDialogHeader';
import ReportFormDialogBody from './ReportDialogSections/ReportFormDialogBody';
import { Spinner } from '../../../../Components';

function ReportFormDialog({
  formId, reportName, isShow, parentTranslationPath, translationPath, close, reportDto, onSaveReportDto, onSearchClick
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [ableContinueReports, setAbleContinueReports] = useState(false);

  useEffect(() => {
    if (!isShow){
      localStorage.removeItem("ReportDateFrom");
      localStorage.removeItem("ReportDateTo");
    }
  }, [isShow]);

  const ableContinueReport = (status) => {
    setAbleContinueReports(status);
    return;
  }
  return (
    <>
      <Dialog
        maxWidth='lg'
        fullWidth
        className='ReportFormDialog-wrapper'
        open={isShow}
        onClose={() => close()}
      >
        <Spinner isActive={isLoading} isAbsolute />
        <ReportFormDialogHeader reportName={reportName} />
        <ReportFormDialogBody
          formId={formId}
          setloadingDialog={setIsLoading}
          onSaveReportDto={onSaveReportDto}
          reportDto={reportDto}
          ableContinueReport={ableContinueReport}
        />

        <DialogActions>
          <ActivityReportDialogFooter
            close={close}
            onSave={() => { onSearchClick(); }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            ableContinueReport={ableContinueReports}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ReportFormDialog;
ReportFormDialog.propTypes = {
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  reportName: PropTypes.string,
  formId: PropTypes.number,
  isShow: PropTypes.bool,
  close: PropTypes.func,
  onSaveReportDto: PropTypes.func,
  onSearchClick: PropTypes.func,
  reportDto: PropTypes.object
};
