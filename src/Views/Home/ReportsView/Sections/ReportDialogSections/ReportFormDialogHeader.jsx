import React from 'react';
import PropTypes from 'prop-types';
import { DialogTitle } from '@material-ui/core';

ReportFormDialogHeader.propTypes = {
    reportName: PropTypes.string,
};

function ReportFormDialogHeader({ reportName }) {
    return (
      <DialogTitle id='alert-dialog-slide-title'>
        <span>{reportName}</span>
      </DialogTitle>
    );
}

export default ReportFormDialogHeader;
