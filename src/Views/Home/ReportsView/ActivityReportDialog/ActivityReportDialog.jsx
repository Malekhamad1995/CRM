
import React, {
  useState, useCallback, useReducer
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  DialogActions, DialogContent, DialogTitle, Dialog
} from '@material-ui/core';
import { ActivityReportDialogContant } from './Sections/ActivityReportDialogContant';
import { ActivityReportDialogFooter } from './Sections/ActivityReportDialogFooter';

export const ActivityReportDialog = ({
  parentTranslationPath,
  translationPath,
  open,
  close,
  onSave,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);

  return (
    <div>
      <Dialog
        maxWidth='lg'
        className='ActivityReportDialog-view-wapper'
        open={open}
        onClose={() => {
          close();
        }}
      >
        <form noValidate>
          <DialogTitle id='alert-dialog-slide-title'>
            <span>
              {t(`${translationPath}reportType`)}
            </span>
          </DialogTitle>
          <DialogContent>
            <ActivityReportDialogContant />
          </DialogContent>
          <DialogActions>
            <ActivityReportDialogFooter
              close={close}
              onSave={() => {
                // saveHandler();
                onSave();
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
